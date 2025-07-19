"use client";

import { useState } from "react";
import { loginSchema, passkeySchema } from "@/lib/validators";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [passkey, setPasskey] = useState("");
  const [token, setToken] = useState("");
  const [needsPasskey, setNeedsPasskey] = useState(false);
  const [error, setError] = useState("");

  const logEvent = async (action: string, details?: Record<string, any>) => {
    try {
      await fetch("/api/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...details }),
      });
    } catch {
      // silently fail logging errors
    }
  };

  const handleLogin = async () => {
    setError("");
    // Validate email with zod
    const parsed = loginSchema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message || "Invalid email");
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      setToken(data.token);
      setNeedsPasskey(!data.hasPasskey);

      // Log login attempt
      logEvent("login_attempt", { email, success: true });
    } catch {
      setError("Network error");
      logEvent("login_attempt", { email, success: false });
    }
  };

  const handleSetPasskey = async () => {
    setError("");
    // Validate passkey with zod
    const parsed = passkeySchema.safeParse({ passkey });
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message || "Invalid passkey");
      return;
    }

    try {
      const res = await fetch("/api/set-passkey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ passkey }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.error || "Failed to set passkey");
        return;
      }

      alert("Passkey set! You're logged in.");
      setNeedsPasskey(false);

      // Log passkey creation
      logEvent("passkey_created", { email });
    } catch {
      setError("Network error");
      logEvent("passkey_created_failed", { email });
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Login</h2>

      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border mb-4"
        autoComplete="email"
      />

      <button
        onClick={handleLogin}
        className="w-full bg-blue-600 text-white p-2 rounded mb-4"
      >
        Send Login
      </button>

      {needsPasskey && (
        <>
          <input
            type="password"
            placeholder="Create passkey (min 6 chars)"
            value={passkey}
            onChange={(e) => setPasskey(e.target.value)}
            className="w-full p-2 border mb-4"
            autoComplete="new-password"
          />
          <button
            onClick={handleSetPasskey}
            className="w-full bg-green-600 text-white p-2 rounded"
          >
            Set Passkey
          </button>
        </>
      )}

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
