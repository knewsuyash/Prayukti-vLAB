import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import OSISimulation from "@/components/simulation/OSISimulation";
import CSMASimulation from "@/components/simulation/CSMASimulation";
import TokenProtocolsSimulation from "@/components/simulation/TokenProtocolsSimulation";
import SlidingWindowSimulation from "@/components/simulation/SlidingWindowSimulation";

export default async function SimulationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const renderSimulation = () => {
        switch (id) {
            case "1":
                return <OSISimulation />;
            case "2":
                return <CSMASimulation />;
            case "3":
                return <TokenProtocolsSimulation />;
            case "4":
                return <SlidingWindowSimulation />;
            default:
                return (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">Simulation not available for this practical yet.</p>
                    </div>
                );
        }
    };

    return (
        <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
            {/* Simulation Header */}
            <header className="bg-white border-b shadow-sm h-14 flex items-center px-4 justify-between shrink-0 z-20">
                <div className="flex items-center gap-4">
                    <Link href={`/dashboard/cn/${id}`} className="text-gray-500 hover:text-black p-1 transition-colors hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="font-bold text-gray-800">
                        CN Simulation Workbench
                        <span className="text-gray-400 text-sm font-normal ml-2">| Practical {id}: {id === "1" ? "OSI vs TCP/IP" : id === "2" ? "CSMA/CD Protocol" : "Simulation"}</span>
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded border border-green-100">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-bold text-green-700 uppercase tracking-tighter">System Ready</span>
                    </div>
                </div>
            </header>

            {/* Main Workbench Area */}
            <main className="flex-1 relative overflow-hidden">
                {renderSimulation()}
            </main>
        </div>
    );
}
