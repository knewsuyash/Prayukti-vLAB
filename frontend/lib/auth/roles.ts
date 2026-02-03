export type Role = "STUDENT" | "TEACHER" | "ADMIN" | "FOREIGN";

export interface Permissions {
    canViewLabs: boolean;
    canRunSimulations: boolean;
    canAttemptAssessments: boolean;
    canViewProgress: boolean;
    canGrade: boolean;
    canConductExams: boolean;
    canManageLabs: boolean;
    canManageUsers: boolean;
    isReadOnly: boolean;
}

export const ROLE_PERMISSIONS: Record<Role, Permissions> = {
    STUDENT: {
        canViewLabs: true,
        canRunSimulations: true,
        canAttemptAssessments: true,
        canViewProgress: true,
        canGrade: false,
        canConductExams: false,
        canManageLabs: false,
        canManageUsers: false,
        isReadOnly: false,
    },
    TEACHER: {
        canViewLabs: true,
        canRunSimulations: true,
        canAttemptAssessments: false,
        canViewProgress: true,
        canGrade: true,
        canConductExams: true,
        canManageLabs: false,
        canManageUsers: false,
        isReadOnly: false,
    },
    ADMIN: {
        canViewLabs: true,
        canRunSimulations: true,
        canAttemptAssessments: true,
        canViewProgress: true,
        canGrade: true,
        canConductExams: true,
        canManageLabs: true,
        canManageUsers: true,
        isReadOnly: false,
    },
    FOREIGN: {
        canViewLabs: true,
        canRunSimulations: true,
        canAttemptAssessments: false,
        canViewProgress: false,
        canGrade: false,
        canConductExams: false,
        canManageLabs: false,
        canManageUsers: false,
        isReadOnly: true,
    },
};
