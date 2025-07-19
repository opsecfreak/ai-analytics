// app/layout.tsx
import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'AI Analytics Agent',
  description: 'Predictive user analytics with AI',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white min-h-screen flex items-center justify-center p-4">
        {children}
      </body>
    </html>
  );
}
