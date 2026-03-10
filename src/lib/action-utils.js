// src/lib/action-utils.js
import { auth } from "@/auth";

/**
 * Standard Wrapper: Ensures the user is logged in.
 * Passes the 'user' object to your database function.
 */
export async function withAuth(actionCallback) {
  const session = await auth();

  if (!session?.user) {
    return { error: "Unauthorized: Please sign in to continue." };
  }

  // Execute your DB logic and pass the user context in
  return actionCallback(session.user);
}

/**
 * Admin Wrapper: Ensures the user is logged in AND has ADMIN role.
 */
export async function withAdmin(actionCallback) {
  const session = await auth();

  if (!session?.user) {
    return { error: "Unauthorized: Please sign in." };
  }

  if (session.user.role !== "ADMIN") {
    return { error: "Forbidden: Administrator privileges required." };
  }

  return actionCallback(session.user);
}
