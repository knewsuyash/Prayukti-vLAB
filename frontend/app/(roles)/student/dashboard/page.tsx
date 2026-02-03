"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getLabs, LabManifest } from "@/lib/labs/registry";

export default function Dashboard() {
    const allLabs = getLabs();

    // Group by Subject
    const groupedLabs = allLabs.reduce((acc, lab) => {
        if (!acc[lab.subject]) {
            acc[lab.subject] = [];
        }
        acc[lab.subject].push(lab);
        return acc;
    }, {} as Record<string, LabManifest[]>);

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-[#d32f2f]">Prayukti vLAB <span className="text-gray-500 font-normal">| Student Dashboard</span></h1>
                    <div className="flex gap-4 items-center">
                        <span className="text-sm font-medium">Hello, Student</span>
                        <Link href="/">
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">Logout</Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Subjects</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Object.entries(groupedLabs).map(([subject, labs]) => {
                        const firstLab = labs[0]; // Use first lab metadata for the card representative
                        return (
                            <div key={subject} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 group">
                                <div className={`h-32 flex items-center justify-center ${subject === 'DLD' ? 'bg-orange-100' :
                                    subject === 'OOPS' ? 'bg-blue-100' :
                                        'bg-red-100'
                                    }`}>
                                    <span className="text-4xl">{firstLab?.metadata?.thumbnailUrl || "📚"}</span>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-[#d32f2f] transition-colors">
                                        {subject === 'DLD' ? 'Digital Logic & Design (DLD)' :
                                            subject === 'OOPS' ? 'Object Oriented Programming' :
                                                subject === 'DBMS' ? 'Database Management Systems' : subject}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                        {firstLab?.metadata?.description || "Explore this subject's virtual lab experiments."}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded">Active</span>
                                        {/* Dynamic Linking based on Subject */}
                                        <Link href={subject === 'DBMS' ? '/student/dashboard/dbms' :
                                            subject === 'DLD' ? '/student/dashboard/dld' :
                                                '/subjects/oopj'}>
                                            <Button className={`hover:bg-opacity-90 ${subject === 'DLD' ? 'bg-[#f57f17]' :
                                                subject === 'OOPS' ? 'bg-[#d32f2f]' :
                                                    'bg-[#d32f2f]'
                                                }`}>Enter Lab</Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-800">Recent Circuits</h2>
                <div className="bg-white rounded-lg shadow-sm border p-8 text-center text-gray-500">
                    <p>No saved circuits found. Start by entering a subject lab!</p>
                </div>
            </main>
        </div>
    );
}
