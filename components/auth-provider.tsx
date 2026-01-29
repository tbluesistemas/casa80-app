'use client'

import React, { createContext, useContext } from 'react'
import { SessionProvider, useSession } from 'next-auth/react'

type UserRole = 'ADMIN' | 'VIEWER'

interface AuthContextType {
    role: UserRole
    setRole: (role: UserRole) => void // Kept for compatibility, but acts as no-op or refresh
    isLoading: boolean
}

// Internal hook component to extract session data
function AuthData({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}

// We don't necessarily need a context if we just use useSession, 
// but to keep 'useAuth' working exactly as before for child components:
export function AuthProvider({
    children,
    initialRole // We can ignore this or use it as fallback if needed, but session is source of truth
}: {
    children: React.ReactNode
    initialRole?: UserRole
}) {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}

export function useAuth() {
    const { data: session, status } = useSession()

    // Default to VIEWER if not authenticated or loading, 
    // but usually 'status' tells us. 
    // For this app, strict role checks already exist in components.
    const role = (session?.user?.role as UserRole) || 'VIEWER'

    return {
        role,
        setRole: () => { }, // No-op in real auth
        isLoading: status === 'loading'
    }
}
