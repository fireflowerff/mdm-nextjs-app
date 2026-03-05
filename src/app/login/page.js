// src/app/login/page.js
import { authenticate } from "@/lib/member-actions";
import { signIn } from "@/auth"; // Import the auth helper

export default async function LoginPage({ searchParams }) {
  const sParams = await searchParams;
  const error = sParams?.error;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="p-8 bg-white shadow-md rounded-lg w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          MDM Portal
        </h1>

        {/* 1. Traditional Credentials Form */}
        <form action={authenticate} className="mb-6">
          {error && (
            <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
              Invalid credentials or access denied.
            </div>
          )}
          <input
            name="username"
            placeholder="Username"
            className="w-full border p-2 mb-4 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full border p-2 mb-6 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-bold transition-colors"
          >
            Login with Credentials
          </button>
        </form>

        <div className="relative flex items-center mb-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* 2. Google OAuth Form */}
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/members" });
          }}
        >
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 border border-gray-300 p-2 rounded hover:bg-gray-50 transition-colors font-medium text-gray-700"
          >
            <img
              src="https://authjs.dev/img/providers/google.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Sign in with Google
          </button>
        </form>
      </div>
    </div>
  );
}
