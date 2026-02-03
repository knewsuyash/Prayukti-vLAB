import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';
import { LabManifest } from '@/lib/labs/registry';

// Lazy load simulations to avoid massive initial bundle
const BasicOperationsSimulation = dynamic(() => import('@/components/simulation/dbms/BasicOperationsSimulation'));
const DatabaseAppSimulation = dynamic(() => import('@/components/simulation/dbms/DatabaseAppSimulation'));
const SQLQueriesSimulation = dynamic(() => import('@/components/simulation/dbms/SQLQueriesSimulation'));
const NormalizationSimulation = dynamic(() => import('@/components/simulation/dbms/NormalizationSimulation'));
const HostLanguageSimulation = dynamic(() => import('@/components/simulation/dbms/HostLanguageSimulation'));

const COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
    "BasicOperationsSimulation": BasicOperationsSimulation,
    "DatabaseAppSimulation": DatabaseAppSimulation,
    "SQLQueriesSimulation": SQLQueriesSimulation,
    "NormalizationSimulation": NormalizationSimulation,
    "HostLanguageSimulation": HostLanguageSimulation,
};

interface LabRendererProps {
    lab: LabManifest;
    mode?: "LEARNING" | "EXPERIMENTAL" | "EXAM";
}

export default function LabRenderer({ lab, mode = "LEARNING" }: LabRendererProps) {
    const Component = COMPONENT_MAP[lab.componentId];

    if (!Component) {
        return <div className="p-4 text-red-500">Error: Simulation component not found for {lab.componentId}</div>;
    }

    return (
        <Suspense fallback={<div className="p-8 text-center">Loading Lab...</div>}>
            <Component mode={mode} />
        </Suspense>
    );
}
