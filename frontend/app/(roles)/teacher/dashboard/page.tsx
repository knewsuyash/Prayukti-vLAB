"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TeacherDashboard() {
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-[#f57f17]">Prayukti vLAB <span className="text-gray-500 font-normal">| Teacher Dashboard</span></h1>
                    <div className="flex gap-4 items-center">
                        <span className="text-sm font-medium">Hello, Professor</span>
                        <Link href="/">
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">Logout</Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Analytics Section */}
                    <div className="bg-white p-6 rounded-lg shadow-md border hover:border-orange-200 transition-colors">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Class Analytics</h2>
                        <div className="h-40 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                            Chart Placeholder
                        </div>
                        <Button className="mt-4 w-full bg-[#f57f17] hover:bg-orange-700">View Detailed Reports</Button>
                    </div>

                    {/* Manage Labs Section */}
                    <div className="bg-white p-6 rounded-lg shadow-md border hover:border-orange-200 transition-colors">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Manage Labs</h2>
                        <p className="text-gray-600 mb-4">Create, edit, or archive laboratory experiments for your students.</p>
                        <Button variant="outline" className="w-full border-orange-500 text-orange-600 hover:bg-orange-50">Go to Lab Builder</Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
