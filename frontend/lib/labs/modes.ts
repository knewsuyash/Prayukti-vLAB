export type LabMode = "LEARNING" | "EXPERIMENTAL" | "EXAM";

export interface LabContext {
    mode: LabMode;
    isLocked: boolean;
    showTimer: boolean;
    autoEvaluate: boolean;
}

export const LAB_MODES: Record<LabMode, LabContext> = {
    LEARNING: {
        mode: "LEARNING",
        isLocked: false,
        showTimer: false,
        autoEvaluate: false,
    },
    EXPERIMENTAL: {
        mode: "EXPERIMENTAL",
        isLocked: true, // Assessment locked
        showTimer: false,
        autoEvaluate: true,
    },
    EXAM: {
        mode: "EXAM",
        isLocked: true,
        showTimer: true,
        autoEvaluate: true,
    },
};
