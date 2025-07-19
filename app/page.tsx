'use client';

import { useState, useEffect } from 'react';

interface User {
  id: string;
  email?: string;
  createdAt: string;
}

export default function UserAdminPanel() {
  const [email, setEmail] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/user');
      if (!res.ok) throw new Error('Failed to fetch users');
      const data: User[] = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Error fetching users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Create new user
  const createUser = async () => {
    if (!email.trim()) {
      setError('Please enter a valid email');
      return;
    }
    setError('');
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
      const { user } = await res.json();
      setUsers((prev) => [user, ...prev]);
      setEmail('');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  return (
    <div className="w-full max-w-3xl p-8 bg-background bg-opacity-90 rounded-xl shadow-lg mx-auto mt-12 text-foreground">
      <h1 className="text-center text-4xl font-bold mb-8">User Administrator Panel</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="email"
          placeholder="Enter user email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-grow px-4 py-2 rounded border border-gray-500 bg-transparent text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={createUser}
          className="px-6 py-2 bg-indigo-600 rounded text-white hover:bg-indigo-700 transition"
        >
          Create User
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <table className="w-full border-collapse border border-gray-600 text-sm">
        <thead>
          <tr>
            <th className="border border-gray-600 px-3 py-2 text-left">ID</th>
            <th className="border border-gray-600 px-3 py-2 text-left">Email</th>
            <th className="border border-gray-600 px-3 py-2 text-left">Created At</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center py-4 text-gray-500">
                No users found.
              </td>
            </tr>
          ) : (
            users.map(({ id, email, createdAt }) => (
              <tr key={id}>
                <td className="border border-gray-600 px-3 py-2 break-all">{id}</td>
                <td className="border border-gray-600 px-3 py-2">{email || '-'}</td>
                <td className="border border-gray-600 px-3 py-2">{new Date(createdAt).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
