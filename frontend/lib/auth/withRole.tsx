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
import React from "react";
import { Role } from "./roles";

// Mocking useAuth for now. Replace with actual auth hook later.
const useAuth = () => {
    return { role: "STUDENT" as Role };
};

interface WithRoleProps {
    allowedRoles: Role[];
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<WithRoleProps> = ({ allowedRoles, children, fallback = null }) => {
    const { role } = useAuth();

    if (!allowedRoles.includes(role)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
};

export function withRole<P extends object>(
    Component: React.ComponentType<P>,
    allowedRoles: Role[]
) {
    return function WrappedComponent(props: P) {
        const { role } = useAuth();

        if (!allowedRoles.includes(role)) {
            return null; // or a customized access denied component
        }

        return <Component {...props} />;
    };
}
