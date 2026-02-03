import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FlaskConical } from "lucide-react";

// Mock Data for Computer Networks
const practicalData = {
    1: {
        title: "OSI vs TCP/IP Reference Models",
        aim: "To study and compare the OSI (Open Systems Interconnection) reference model and the TCP/IP (Transmission Control Protocol/Internet Protocol) model.",
        theory: `
      <div class="space-y-4">
        <p><strong>The OSI Model</strong> is a conceptual framework that standardizes the functions of a communication system into seven abstraction layers. Developed by ISO in 1984, it provides a universal set of rules for networking.</p>
        <p><strong>The TCP/IP Model</strong> is a more simplified and practical model used for the modern internet. It consists of four layers that map to the OSI model's seven layers.</p>
        <div class="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h4 class="font-bold text-blue-800 mb-2">Key Differences:</h4>
            <ul class="list-disc ml-6 space-y-1">
                <li>OSI is a generic, independent model; TCP/IP is based on standard protocols.</li>
                <li>OSI has 7 layers; TCP/IP has 4 layers.</li>
                <li>OSI provides a clear distinction between services, interfaces, and protocols.</li>
            </ul>
        </div>
      </div>
    `,
        procedure: `
      <ol class="list-decimal ml-6 space-y-2">
        <li>Select the OSI vs TCP/IP simulation from the dashboard.</li>
        <li>Click on each layer of the OSI model to understand its functions and protocols.</li>
        <li>Observe the mapping between OSI layers and TCP/IP layers.</li>
        <li>Trigger the "Packet Flow" animation to see how data moves from the Application layer to the Physical layer.</li>
        <li>Review the comparison table and complete the quiz to verify your understanding.</li>
      </ol>
    `,
    }
};

export default async function PracticalDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const practical = practicalData[Number(id) as keyof typeof practicalData] || practicalData[1];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex items-center gap-4">
                    <Link href="/dashboard/cn" className="text-gray-500 hover:text-black hover:bg-gray-100 p-1 rounded-full transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <span className="text-gray-300">|</span>
                    <h1 className="text-lg font-bold text-gray-800 truncate">{practical.title}</h1>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Content (Theory) */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-white p-6 rounded-lg shadow-sm border">
                        <h2 className="text-xl font-bold text-[#1976d2] mb-4 border-b pb-2">Aim</h2>
                        <p className="text-gray-700">{practical.aim}</p>
                    </section>

                    <section className="bg-white p-6 rounded-lg shadow-sm border">
                        <h2 className="text-xl font-bold text-[#1976d2] mb-4 border-b pb-2">Theory</h2>
                        <div className="text-gray-700 prose max-w-none" dangerouslySetInnerHTML={{ __html: practical.theory }} />
                    </section>

                    <section className="bg-white p-6 rounded-lg shadow-sm border">
                        <h2 className="text-xl font-bold text-[#1976d2] mb-4 border-b pb-2">Procedure</h2>
                        <div className="text-gray-700 prose max-w-none" dangerouslySetInnerHTML={{ __html: practical.procedure }} />
                    </section>
                </div>

                {/* Right Sidebar (Actions) */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-md border border-blue-200">
                        <h3 className="font-bold text-lg mb-2 text-blue-900">Start Learning</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Enter the interactive simulation to visualize the layer architecture and packet flow.
                        </p>
                        <Link href={`/dashboard/cn/${id}/simulation`}>
                            <Button className="w-full bg-[#1976d2] hover:bg-[#1565c0] text-lg font-bold py-6 shadow-lg hover:shadow-xl transition-all">
                                <FlaskConical className="mr-2 h-6 w-6" />
                                Enter Simulation
                            </Button>
                        </Link>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="font-bold text-md mb-4 text-gray-800">Resources</h3>
                        <ul className="space-y-2 text-sm text-[#1976d2]">
                            <li className="cursor-pointer hover:underline">Reference Guide (PDF)</li>
                            <li className="cursor-pointer hover:underline">Animation Lecture</li>
                            <li className="cursor-pointer hover:underline">Self Assessment Quiz</li>
                        </ul>
                    </div>
                </div>

            </main>
        </div>
    );
}
