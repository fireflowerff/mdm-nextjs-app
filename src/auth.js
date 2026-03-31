// src/auth.js
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import pool from "@/lib/db"; // Your PostgreSQL connection pool

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    // 1. Google OAuth Provider
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      // Optional: allow linking if email matches a manual user
      allowDangerousEmailAccountLinking: true,
    }),

    // 2. Traditional Credentials Provider
    Credentials({
      async authorize(credentials) {
        // Inside Credentials authorize function in src/auth.js
        const res = await pool.query(
          "SELECT id, username, email, role, menu_group_id, password_hash FROM users WHERE username = $1 AND status = 'ACTIVE'",
          [credentials.username],
        );
        const user = res.rows[0];

        if (user && credentials.password === user.password_hash) {
          return {
            id: user.id,
            name: user.username,
            role: user.role,
            email: user.email,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    // THE GUARD: Intercept the login before the session is created
    async signIn({ user, account }) {
      if (account.provider === "google") {
        const res = await pool.query(
          "SELECT role FROM users WHERE email = $1 AND status = 'ACTIVE'",
          [user.email],
        );
        // Only allow if they exist in your local MDM user table
        return res.rows.length > 0;
      }
      return true;
    },

    // THE BADGE MAKER: Persist the Role into the JWT token
    async jwt({ token, user }) {
      if (user) {
        // If it's a new Google login, user.role won't exist yet, so we fetch it
        if (!user.role) {
          const res = await pool.query(
            "SELECT role, menu_group_id, last_login FROM users WHERE email = $1",
            [user.email],
          );
          token.role = res.rows[0]?.role;
          token.lastLogin = res.rows[0]?.last_login;
        } else {
          token.role = user.role;
        }
      }
      return token;
    },

    // THE BADGE SCANNER: Make the Role available to the Frontend/UI
    async session({ session, token }) {
      if (token?.role) {
        session.user.role = token.role;
        session.user.lastLogin = token.lastLogin;
        session.user.menu_group_id = token.menu_group_id; // Add this!
      }
      return session;
    },
  },

  events: {
    async signIn({ user }) {
      // Whenever ANYONE logs in (Google or Credentials), update their timestamp
      try {
        await pool.query(
          "UPDATE users SET last_login = NOW() WHERE email = $1 OR username = $2",
          [user.email, user.name],
        );
        console.log(`Login timestamp updated for: ${user.email || user.name}`);
      } catch (error) {
        console.error("Failed to update last_login:", error);
      }
    },
  },
});
