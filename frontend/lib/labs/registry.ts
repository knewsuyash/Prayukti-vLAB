import { ComponentType } from 'react';

export type LabSubject = "DBMS" | "CN" | "OOPS" | "DLD";
export type LabType = "learning" | "experimental";
export type LabDifficulty = "easy" | "medium" | "hard";

export interface LabMetadata {
    title: string;
    description: string;
    difficulty: LabDifficulty;
    prerequisites?: string[];
    estimatedTime?: string;
    thumbnailUrl?: string; // Icon or Image path
}

export interface LabManifest {
    id: string; // e.g., "dbms-exp-1"
    subject: LabSubject;
    type: LabType;
    metadata: LabMetadata;
    // We store the path or key to resolve the component dynamically
    // or import it directly if lazy loading isn't strictly required yet.
    // For this v1 registry, we'll map IDs to components in a separate map to keep this serializable if needed.
    componentId: string;
}

const Labs: LabManifest[] = [
    {
        id: "dbms-exp-1",
        subject: "DBMS",
        type: "learning",
        componentId: "BasicOperationsSimulation",
        metadata: {
            title: "Introduction to DBMS",
            description: "Basic DDL/DML Operations (Create, Insert, Select)",
            difficulty: "easy",
            prerequisites: ["None"],
            estimatedTime: "30 min",
            thumbnailUrl: "🗄️"
        }
    },
    {
        id: "dbms-exp-2",
        subject: "DBMS",
        type: "experimental",
        componentId: "DatabaseAppSimulation",
        metadata: {
            title: "Database Application Development",
            description: "Build a Store Management System with Finance & Inventory",
            difficulty: "medium",
            prerequisites: ["Exp 1"],
            estimatedTime: "45 min",
            thumbnailUrl: "🗄️"
        }
    },
    {
        id: "dbms-exp-3",
        subject: "DBMS",
        type: "experimental",
        componentId: "SQLQueriesSimulation",
        metadata: {
            title: "SQL Queries & Operations",
            description: "Advanced SQL: Joins, Subqueries, Triggers, Views",
            difficulty: "hard",
            prerequisites: ["Exp 2"],
            estimatedTime: "60 min",
            thumbnailUrl: "🗄️"
        }
    },
    {
        id: "dbms-exp-4",
        subject: "DBMS",
        type: "learning",
        componentId: "NormalizationSimulation",
        metadata: {
            title: "Normalization",
            description: "Analyze and Decompose schemas (1NF to 5NF)",
            difficulty: "hard",
            prerequisites: ["Relational Model"],
            estimatedTime: "40 min",
            thumbnailUrl: "🗄️"
        }
    },
    {
        id: "dbms-exp-5",
        subject: "DBMS",
        type: "experimental",
        componentId: "HostLanguageSimulation",
        metadata: {
            title: "Host Language Interface",
            description: "Embed SQL in Java/Python/C++ Applications",
            difficulty: "medium",
            prerequisites: ["SQL Basics"],
            estimatedTime: "30 min",
            thumbnailUrl: "🗄️"
        }
    },
    // --- DLD Labs (Placeholder) ---
    {
        id: "dld-exp-1",
        subject: "DLD",
        type: "learning",
        componentId: "LogicGatesSimulation",
        metadata: {
            title: "Digital Logic & Design (DLD)",
            description: "Master the fundamentals of digital electronics, logic gates, and circuit design.",
            difficulty: "medium",
            thumbnailUrl: "⚡"
        }
    },
    // --- OOPJ Labs (Placeholder) ---
    {
        id: "oopj-exp-1",
        subject: "OOPS",
        type: "learning",
        componentId: "JavaBasicsSimulation",
        metadata: {
            title: "Object Oriented Programming in Java",
            description: "Learn Java programming, OOP concepts, exceptions, and collections.",
            difficulty: "medium",
            thumbnailUrl: "☕"
        }
    }
];

export const getLabs = () => Labs;
export const getLabById = (id: string) => Labs.find(l => l.id === id);
export const getLabsBySubject = (subject: LabSubject) => Labs.filter(l => l.subject === subject);
