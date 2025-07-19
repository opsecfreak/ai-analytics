// app/page.tsx
'use client';

import { useState, useEffect } from 'react';

interface UserInfo {
  id: string;
  email?: string;
}

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  // Fetch list of users from the database
  const fetchUsers = async () => {
    setError('');
    try {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      setUsers(await res.json());
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Create a new user record
  const createUser = async () => {
    setError('');
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('Failed to create user');
      setEmail('');
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Generate a JWT for the given email
  const fetchToken = async () => {
    setError('');
    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('Failed to fetch token');
      const data = await res.json();
      setToken(data.token);
    } catch (err: any) {
      setError(err.message || 'Error');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="w-full max-w-xl bg-background bg-opacity-90 p-6 rounded-xl shadow-lg">
      <h1 className="text-2xl font-semibold mb-4 text-center">AI-ANALYTICS</h1>

      <input
        type="email"
        placeholder="Enter user email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 mb-4 border rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <div className="flex gap-2 mb-4 flex-wrap justify-center">
        <button
          onClick={createUser}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Create User
        </button>
        <button
          onClick={fetchUsers}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          View Users
        </button>
        <button
          onClick={fetchToken}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Generate JWT
        </button>
      </div>

      {token && (
        <div className="mb-4 break-all">
          <strong>JWT:</strong> {token}
        </div>
      )}
      {error && <div className="mb-4 text-red-500">{error}</div>}

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border px-2 py-1 text-sm">{user.id}</td>
              <td className="border px-2 py-1 text-sm">{user.email || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
