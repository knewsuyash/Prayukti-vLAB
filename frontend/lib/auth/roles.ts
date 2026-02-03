export type Role = "STUDENT" | "TEACHER" | "ADMIN" | "FOREIGN";

export interface Permission {
    action: string;
    resource: string;
}

export const ROLES: Record<string, Role> = {
    STUDENT: "STUDENT",
    TEACHER: "TEACHER",
    ADMIN: "ADMIN",
    FOREIGN: "FOREIGN",
};

export const PERMISSIONS: Record<Role, string[]> = {
    STUDENT: [
        "lab:view",
        "simulation:run",
        "assessment:attempt",
        "dashboard:view_student",
    ],
    TEACHER: [
        "lab:view",
        "simulation:run",
        "student:view_progress",
        "exam:proctor",
        "dashboard:view_teacher",
    ],
    ADMIN: [
        "lab:manage",
        "user:manage",
        "exam:configure",
        "dashboard:view_admin",
    ],
    FOREIGN: [
        "lab:view_public",
        "event:view",
    ],
};

export function hasPermission(role: Role, action: string): boolean {
    return PERMISSIONS[role]?.includes(action) ?? false;
}
