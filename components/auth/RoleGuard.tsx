'use client'

import { ReactNode } from 'react'
import { UserRole } from '@/lib/types/cms'

interface RoleGuardProps {
    children: ReactNode
    allowedRoles: UserRole[]
    currentUserRole?: UserRole | null
    fallback?: ReactNode
}

/**
 * Client-side component to conditionally render based on user role
 * Use for hiding UI elements from unauthorized users
 */
export function RoleGuard({
    children,
    allowedRoles,
    currentUserRole,
    fallback = null
}: RoleGuardProps) {
    // If no role is provided, hide content
    if (!currentUserRole) {
        return <>{fallback}</>
    }

    // Check if current role is in allowed roles
    const hasAccess = allowedRoles.includes(currentUserRole)

    if (!hasAccess) {
        return <>{fallback}</>
    }

    return <>{children}</>
}
