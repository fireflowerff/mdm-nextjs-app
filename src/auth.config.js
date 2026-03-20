// src/auth.config.js
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnLoginPage = nextUrl.pathname.startsWith("/login");
      const isOnMembersPage = nextUrl.pathname.startsWith("/dashboard");

      // 1. If trying to access members and NOT logged in -> Redirect to login
      if (isOnMembersPage && !isLoggedIn) {
        return false;
      }

      // 2. If logged in and sitting on the login page -> Redirect to members
      if (isLoggedIn && isOnLoginPage) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      return true;
    },
  },
  providers: [],
};
