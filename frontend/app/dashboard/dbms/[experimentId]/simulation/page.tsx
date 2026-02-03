"use client";

import { use } from "react";
import BasicOperationsSimulation from "@/components/simulation/dbms/BasicOperationsSimulation";
import ApplicationDevelopmentSimulation from "@/components/simulation/dbms/ApplicationDevelopmentSimulation";
import SQLQueriesSimulation from "@/components/simulation/dbms/SQLQueriesSimulation";
import NormalizationSimulation from "@/components/simulation/dbms/NormalizationSimulation";
import HostLanguageSimulation from "@/components/simulation/dbms/HostLanguageSimulation";

export default function SimulationPage({ params }: { params: Promise<{ experimentId: string }> }) {
    const { experimentId } = use(params);

    if (experimentId === "1") {
        return <BasicOperationsSimulation />;
    }

    if (experimentId === "2") {
        return <ApplicationDevelopmentSimulation />;
    }

    if (experimentId === "3") {
        return <SQLQueriesSimulation />;
    }

    if (experimentId === "4") {
        return <NormalizationSimulation />;
    }
    if (experimentId === "5") {
        return <HostLanguageSimulation />;
    }

    return (
        <div className="flex h-screen items-center justify-center bg-gray-100">
            <div className="text-center">
                <h2 className="text-xl font-bold text-gray-800">Experiment Not Found</h2>
                <p className="text-gray-500">The requested simulation ID {experimentId} does not exist.</p>
            </div>
        </div>
    );
}
