'use client';

import { useState, useEffect } from 'react';

interface User {
  id: string;
  email?: string;
}

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await fetch('/api/user');
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Error fetching users');
    }
  }

  async function createUser() {
    if (!email.trim()) {
      setError('Please enter a valid email');
      return;
    }
    setError('');
    setToken('');
    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || 'Failed to create user');
        return;
      }
      const { user, token } = await res.json();
      setUsers((prev) => [...prev, user]);
      setToken(token);
      setEmail('');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto mt-10 p-6 rounded-xl bg-[var(--background)] bg-opacity-90 shadow-lg">
      <h1 className="text-center text-3xl font-bold mb-6 text-[var(--foreground)]">AI-ANALYTICS</h1>

      <input
        type="email"
        placeholder="Enter user email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full mb-4 px-4 py-2 rounded border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-[var(--background)] text-[var(--foreground)]"
      />

      <button
        onClick={createUser}
        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition"
      >
        Create User
      </button>

      {error && <p className="mt-3 text-red-500">{error}</p>}

      {token && (
        <div className="mt-4 p-3 rounded bg-green-100 text-green-800 break-words dark:bg-green-900 dark:text-green-300">
          <strong>One-Time JWT Token:</strong> {token}
        </div>
      )}

      <table className="w-full mt-8 border-collapse border border-gray-300 dark:border-gray-700 text-[var(--foreground)]">
        <thead>
          <tr>
            <th className="border border-gray-300 dark:border-gray-700 px-3 py-1">ID</th>
            <th className="border border-gray-300 dark:border-gray-700 px-3 py-1">Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map(({ id, email }) => (
            <tr key={id} className="hover:bg-gray-100 dark:hover:bg-gray-800">
              <td className="border border-gray-300 dark:border-gray-700 px-3 py-1 text-sm break-words">{id}</td>
              <td className="border border-gray-300 dark:border-gray-700 px-3 py-1 text-sm">{email || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
