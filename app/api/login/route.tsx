"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [passkey, setPasskey] = useState("");
  const [token, setToken] = useState("");
  const [needsPasskey, setNeedsPasskey] = useState(false);

  const handleLogin = async () => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (res.ok) {
      setToken(data.token);
      setNeedsPasskey(!data.hasPasskey);
    } else {
      alert(data.error);
    }
  };

  const handleSetPasskey = async () => {
    const res = await fetch("/api/set-passkey", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ passkey }),
    });

    if (res.ok) {
      alert("Passkey set! You're logged in.");
      // Optionally redirect to dashboard
    } else {
      const err = await res.json();
      alert(err.error);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <input
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border mb-4"
      />
      <button onClick={handleLogin} className="w-full bg-blue-600 text-white p-2 rounded mb-4">
        Send Login
      </button>

      {needsPasskey && (
        <>
          <input
            placeholder="Create passkey"
            value={passkey}
            type="password"
            onChange={(e) => setPasskey(e.target.value)}
            className="w-full p-2 border mb-4"
          />
          <button onClick={handleSetPasskey} className="w-full bg-green-600 text-white p-2 rounded">
            Set Passkey
          </button>
        </>
      )}
    </div>
  );
}
