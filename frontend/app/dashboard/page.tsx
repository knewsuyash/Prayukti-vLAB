"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardDispatcher() {
    const router = useRouter();

    useEffect(() => {
        // In a real app, successful login sets a cookie/token and we decode it here.
        // For this prototype, we check localStorage or default to student for safety,
        // OR better yet, we just redirect to student as default if no role found.

        const userStr = typeof window !== 'undefined' ? localStorage.getItem("user") : null;
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user.role === "TEACHER") {
                    router.push("/teacher/dashboard");
                } else if (user.role === "ADMIN") {
                    router.push("/admin/dashboard");
                } else {
                    router.push("/student/dashboard");
                }
            } catch (e) {
                // fallback
                router.push("/student/dashboard");
            }
        } else {
            // No user, redirect to login
            router.push("/login");
        }
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <p className="text-gray-500">Redirecting to your dashboard...</p>
        </div>
    );
}
