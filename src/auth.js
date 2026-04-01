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
            menu_group_id: user.menu_group_id,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        const res = await pool.query(
          "SELECT role, menu_group_id FROM users WHERE email = $1 AND status = 'ACTIVE'",
          [user.email],
        );
        // Important: Attach the data to the user object so the JWT callback can see it
        if (res.rows.length > 0) {
          user.role = res.rows[0].role;
          user.menu_group_id = res.rows[0].menu_group_id;
          return true;
        }
        return false;
      }
      return true;
    },

    async jwt({ token, user }) {
      // The 'user' object is only available the VERY FIRST time this callback runs after login
      if (user) {
        token.role = user.role;
        token.menu_group_id = user.menu_group_id;

        // If Google didn't have these (backup check)
        if (!token.role || !token.menu_group_id) {
          const res = await pool.query(
            "SELECT role, menu_group_id FROM users WHERE email = $1 OR username = $2",
            [user.email, user.name],
          );
          token.role = res.rows[0]?.role;
          token.menu_group_id = res.rows[0]?.menu_group_id;
        }
      }
      return token;
    },

    async session({ session, token }) {
      // Transfer everything from the Token to the Session
      if (session.user) {
        session.user.role = token.role;
        session.user.menu_group_id = token.menu_group_id;
        session.user.lastLogin = token.lastLogin;
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
