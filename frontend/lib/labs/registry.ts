import React from "react";
import dynamic from "next/dynamic";

export type Subject = "CN" | "OOPS" | "DLD";

export interface LabMetadata {
    id: string;
    title: string;
    subject: Subject;
    difficulty: "Easy" | "Medium" | "Hard";
    prerequisites?: string[];
    description: string;
}

export interface LabEntry extends LabMetadata {
    component: React.ComponentType<any>;
}

// Dynamic imports to optimize bundle size
const OSISimulation = dynamic(() => import("@/components/simulation/cn/OSISimulation"));
const CSMASimulation = dynamic(() => import("@/components/simulation/cn/CSMASimulation"));
const TokenProtocolsSimulation = dynamic(() => import("@/components/simulation/cn/TokenProtocolsSimulation"));
const SlidingWindowSimulation = dynamic(() => import("@/components/simulation/cn/SlidingWindowSimulation"));
const CircuitCanvas = dynamic(() => import("@/components/simulation/dld/CircuitCanvas"));

export const LabRegistry: Record<string, LabEntry> = {
    "osi-model": {
        id: "osi-model",
        title: "OSI vs TCP/IP Reference Models",
        subject: "CN",
        difficulty: "Easy",
        description: "Comparative study of OSI 7-layer and TCP/IP 4-layer models.",
        component: OSISimulation
    },
    "csma-cd": {
        id: "csma-cd",
        title: "CSMA/CD Protocol Study",
        subject: "CN",
        difficulty: "Medium",
        prerequisites: ["osi-model"],
        description: "Interactive simulation of Carrier Sense Multiple Access with Collision Detection.",
        component: CSMASimulation
    },
    "token-protocols": {
        id: "token-protocols",
        title: "Token Bus and Token Ring Protocols",
        subject: "CN",
        difficulty: "Medium",
        description: "Study of deterministic channel access using token passing mechanisms.",
        component: TokenProtocolsSimulation
    },
    "sliding-window": {
        id: "sliding-window",
        title: "Sliding Window Protocols",
        subject: "CN",
        difficulty: "Hard",
        description: "Visualizing Stop & Wait, Go-Back-N, and Selective Repeat flow control.",
        component: SlidingWindowSimulation
    },
    "circuit-canvas": {
        id: "circuit-canvas",
        title: "Digital Circuit Designer",
        subject: "DLD",
        difficulty: "Medium",
        description: "Interactive logic gate simulator and circuit builder.",
        component: CircuitCanvas
    }
};

export const getLabsBySubject = (subject: Subject) => {
    return Object.values(LabRegistry).filter(lab => lab.subject === subject);
};

export const getLabById = (id: string) => {
    return LabRegistry[id];
};
