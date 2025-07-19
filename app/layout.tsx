// app/layout.tsx
import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
title: 'AI Analytics Agent',
description: 'Predictive user analytics with AI',
};

export default function RootLayout({ children }: { children: ReactNode }) {
return (


{children}


);
}