"use client";

import React from 'react';
import { Role, hasPermission } from './roles';

// Mock hook to get current user role - In real app this comes from Context/Session
export const useCurrentUserRole = (): Role => {
    // TODO: Connect to real auth provider
    // For dev/demo, we default to STUDENT
    // You can change this to "TEACHER" or "ADMIN" to test other views
    return "STUDENT";
};

interface WithRoleProps {
    allowedRoles?: Role[];
    requiredPermission?: string;
    fallback?: React.ReactNode;
}

export function withRole<P extends object>(
    Component: React.ComponentType<P>,
    { allowedRoles, requiredPermission, fallback = null }: WithRoleProps
) {
    return function RoleProtectedComponent(props: P) {
        const role = useCurrentUserRole();

        // Check Role
        if (allowedRoles && !allowedRoles.includes(role)) {
            return <>{fallback || <div className="p-4 text-red-500">Access Denied: You do not have the required role ({role}).</div>}</>;
        }

        // Check Permission
        if (requiredPermission && !hasPermission(role, requiredPermission)) {
            return <>{fallback || <div className="p-4 text-red-500">Access Denied: Missing permission '{requiredPermission}'.</div>}</>;
        }

        // Access Granted
        return <Component {...props} />;
    };
}
