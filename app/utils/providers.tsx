// app/providers.tsx
'use client'

import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from './authContext';
export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <AuthProvider>
                {children}
            </AuthProvider>
        </SessionProvider>
    );
}