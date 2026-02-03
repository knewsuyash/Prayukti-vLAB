import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FlaskConical } from "lucide-react";

// Mock Data for OOPs
const practicalData = {
    1: {
        title: "Introduction to Classes and Objects",
        aim: "To understand the basic concepts of classes and objects in Object-Oriented Programming.",
        theory: `
      <div class="space-y-4">
        <p><strong>Class</strong> is a blueprint or template for creating objects. It defines a set of attributes and methods that the created objects will have.</p>
        <p><strong>Object</strong> is an instance of a class. It is a real-world entity that has state and behavior.</p>
        <div class="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <h4 class="font-bold text-purple-800 mb-2">Key Concepts:</h4>
            <ul class="list-disc ml-6 space-y-1">
                <li>Classes provide the structure.</li>
                <li>Objects provide the data.</li>
                <li>Method define the behavior.</li>
            </ul>
        </div>
      </div>
    `,
        procedure: `
      <ol class="list-decimal ml-6 space-y-2">
        <li>Select the Classes and Objects simulation.</li>
        <li>Define a class with properties and methods.</li>
        <li>Instantiate objects using the class.</li>
        <li>Interact with the objects to see how state changes.</li>
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
                    <Link href="/dashboard/oops" className="text-gray-500 hover:text-black hover:bg-gray-100 p-1 rounded-full transition-colors">
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
                        <h2 className="text-xl font-bold text-[#7b1fa2] mb-4 border-b pb-2">Aim</h2>
                        <p className="text-gray-700">{practical.aim}</p>
                    </section>

                    <section className="bg-white p-6 rounded-lg shadow-sm border">
                        <h2 className="text-xl font-bold text-[#7b1fa2] mb-4 border-b pb-2">Theory</h2>
                        <div className="text-gray-700 prose max-w-none" dangerouslySetInnerHTML={{ __html: practical.theory }} />
                    </section>

                    <section className="bg-white p-6 rounded-lg shadow-sm border">
                        <h2 className="text-xl font-bold text-[#7b1fa2] mb-4 border-b pb-2">Procedure</h2>
                        <div className="text-gray-700 prose max-w-none" dangerouslySetInnerHTML={{ __html: practical.procedure }} />
                    </section>
                </div>

                {/* Right Sidebar (Actions) */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-md border border-purple-200">
                        <h3 className="font-bold text-lg mb-2 text-purple-900">Start Learning</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Enter the interactive simulation to build and test your classes.
                        </p>
                        <Link href={`/dashboard/oops/${id}/simulation`}>
                            <Button className="w-full bg-[#7b1fa2] hover:bg-[#6a1b9a] text-lg font-bold py-6 shadow-lg hover:shadow-xl transition-all">
                                <FlaskConical className="mr-2 h-6 w-6" />
                                Enter Simulation
                            </Button>
                        </Link>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="font-bold text-md mb-4 text-gray-800">Resources</h3>
                        <ul className="space-y-2 text-sm text-[#7b1fa2]">
                            <li className="cursor-pointer hover:underline">Reference Guide (PDF)</li>
                            <li className="cursor-pointer hover:underline">Video Lecture</li>
                            <li className="cursor-pointer hover:underline">Self Assessment Quiz</li>
                        </ul>
                    </div>
                </div>

            </main>
        </div>
    );
}
