// src/app/api/auth/[...nextauth]/route.js
import { handlers } from "@/auth"; // This imports the handlers we defined in src/auth.js

// NextAuth uses these handlers to manage GET (checking session)
// and POST (logging in) requests.
export const { GET, POST } = handlers;
