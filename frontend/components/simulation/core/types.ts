export interface Node {
    id: number;
    x: number;
    y: number;
    state: string;
    hasToken?: boolean;
    type?: string;
}

export interface Edge {
    from: number;
    to: number;
}

export type LabSubject = "CN" | "OOPS" | "DLD";

export interface SimulationStats {
    throughput: number;
    efficiency: number;
    totalTransmissions: number;
}
