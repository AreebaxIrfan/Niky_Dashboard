"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    setError(null); // Reset error state

    // Simulate a delay for authentication (optional)
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay

    try {
      if (
        email === process.env.NEXT_PUBLIC_ADMIN_EMAIL &&
        password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD
      ) {
        localStorage.setItem("isLoggedIn", "true");
        router.push("/admin"); // Redirect to admin dashboard
      } else {
        setError("Invalid email or password"); // Set error message
      }
    } catch (err) {
      setError("An error occurred. Please try again."); // Handle unexpected errors
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Admin Login</h2>

        {/* Email Input */}
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded"
          value={email}
          required
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded"
          value={password}
          required
        />

        {/* Error Message */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Login Button */}
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded w-full flex justify-center items-center"
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? (
            <div className="flex items-center">
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              wait a moment!...
            </div>
          ) : (
            "Login"
          )}
        </button>
      </form>
    </div>
  );
}