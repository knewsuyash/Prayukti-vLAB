"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">Prayukti vLAB <span className="text-gray-500 font-normal">| Admin Portal</span></h1>
                    <div className="flex gap-4 items-center">
                        <span className="text-sm font-medium">Administrator</span>
                        <Link href="/">
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">Logout</Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">System Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-l-4 border-l-blue-500">
                        <p className="text-sm text-gray-500 uppercase font-bold">Total Users</p>
                        <p className="text-3xl font-bold mt-2">1,240</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-l-4 border-l-green-500">
                        <p className="text-sm text-gray-500 uppercase font-bold">Active Labs</p>
                        <p className="text-3xl font-bold mt-2">28</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-l-4 border-l-red-500">
                        <p className="text-sm text-gray-500 uppercase font-bold">System Health</p>
                        <p className="text-3xl font-bold mt-2 text-green-600">98%</p>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-bold mb-4">User Management</h3>
                        <Button className="w-full mb-2" variant="secondary">Manage Students</Button>
                        <Button className="w-full" variant="secondary">Manage Faculty</Button>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-bold mb-4">Configuration</h3>
                        <Button className="w-full mb-2" variant="outline">Global Settings</Button>
                        <Button className="w-full" variant="outline">Logs & Audits</Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
