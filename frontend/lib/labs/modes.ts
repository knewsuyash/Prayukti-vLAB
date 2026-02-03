export type LabMode = "LEARNING" | "EXPERIMENTAL" | "EXAM";

export const MODES = {
    LEARNING: "LEARNING" as LabMode,
    EXPERIMENTAL: "EXPERIMENTAL" as LabMode,
    EXAM: "EXAM" as LabMode,
};

export interface WithMode {
    mode?: LabMode;
}
