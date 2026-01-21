import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OOPJSubjectPage() {
    return (
        <div className="container mx-auto p-6">
            <header className="mb-8 border-b pb-4">
                <h1 className="text-3xl font-bold text-[#d32f2f]">Object Oriented Programming using Java (OOPJ)</h1>
                <p className="text-gray-600 mt-2">Code: BCS-123 | Semester: 4</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Experiment 1 Card */}
                <div className="border rounded-lg shadow-sm hover:shadow-md transition bg-white p-6">
                    <h2 className="text-xl font-semibold mb-2">Experiment 1: Hello World & Basics</h2>
                    <p className="text-sm text-gray-500 mb-4">
                        Introduction to Java syntax, class structure, and main method.
                    </p>
                    <div className="flex justify-between items-center">
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Beginner</span>
                        <Link href="/subjects/oopj/experiments/experiment-1">
                            <Button className="bg-[#f57f17] hover:bg-[#e65100]">Start Experiment</Button>
                        </Link>
                    </div>
                </div>

                {/* Placeholder for Exp 2 */}
                <div className="border rounded-lg shadow-sm bg-gray-50 p-6 opacity-75">
                    <h2 className="text-xl font-semibold mb-2">Experiment 2: Classes and Objects</h2>
                    <p className="text-sm text-gray-500 mb-4">
                        Understanding encapsulation and object instantiation.
                    </p>
                    <div className="flex justify-between items-center">
                        <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded">Coming Soon</span>
                        <Button disabled variant="outline">Locked</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
