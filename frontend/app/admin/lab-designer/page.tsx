"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Settings, Save, Eye, ShieldCheck } from "lucide-react";

export default function LabDesigner() {
    const [config, setConfig] = useState({
        id: "new-lab-id",
        title: "Experimental Topology Study",
        subject: "CN",
        type: "experimental",
        baseSimulation: "TokenProtocolsSimulation",
        constraints: {
            maxNodes: 8,
            faultInjectionAllowed: true,
            lockedParameters: ["speed"]
        }
    });

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-gray-500 hover:text-black">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <h1 className="text-xl font-bold text-rose-600">Lab Designer <span className="text-gray-400 font-normal">| Admin Workbench</span></h1>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm"><Eye className="h-4 w-4 mr-2" /> Preview</Button>
                        <Button size="sm"><Save className="h-4 w-4 mr-2" /> Save Config</Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Management Table */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <Plus className="h-4 w-4 text-rose-500" /> Lab Management
                            </h3>
                            <Button size="sm" className="bg-rose-600 hover:bg-rose-700">Add New Practical</Button>
                        </div>
                        <div className="p-0">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-widest border-b">
                                    <tr>
                                        <th className="px-6 py-4">Lab ID</th>
                                        <th className="px-6 py-4">Title</th>
                                        <th className="px-6 py-4">Subject</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {[
                                        { id: "cn-01", title: "OSI vs TCP/IP Models", subject: "Computer Networks" },
                                        { id: "dld-01", title: "Logic Gates & Truth Tables", subject: "Digital Logic Design" },
                                        { id: "oops-01", title: "Class & Object Structure", subject: "OOPS" },
                                    ].map((lab, i) => (
                                        <tr key={i} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-6 py-4 font-mono text-xs text-slate-400">#{lab.id}</td>
                                            <td className="px-6 py-4 font-bold text-slate-700">{lab.title}</td>
                                            <td className="px-6 py-4 text-slate-500">{lab.subject}</td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Edit Content">
                                                    <Settings className="h-4 w-4" />
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete Practical">
                                                    <Plus className="h-4 w-4 rotate-45" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Configuration Editor (Modified) */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            <Settings className="h-4 w-4" /> Lab Content Editor
                        </h3>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Lab Title</label>
                                <input
                                    className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-500 outline-none"
                                    value={config.title}
                                    onChange={(e) => setConfig({ ...config, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Lab ID</label>
                                <input
                                    className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-500 outline-none"
                                    value={config.id}
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Theory Content (Markdown/HTML Support)</label>
                            <textarea
                                className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-500 outline-none h-40 font-mono text-xs"
                                defaultValue={`<div class="theory">\n  <h3>Overview</h3>\n  <p>Theory content for this experiment goes here...</p>\n</div>`}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-2xl">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6 font-mono">Registry Manifest Status</h3>
                        <pre className="text-emerald-400 text-xs font-mono overflow-auto max-h-[300px]">
                            {JSON.stringify(config, null, 2)}
                        </pre>
                        <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/10">
                            <p className="text-[10px] text-slate-400 font-bold mb-2 uppercase">Publishing Info</p>
                            <div className="flex justify-between items-center text-xs">
                                <span>Version Control</span>
                                <span className="text-blue-400">v2.1.0-stable</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100">
                        <p className="text-rose-600 text-xs font-bold uppercase tracking-tight mb-2 flex items-center gap-1">
                            <ShieldCheck className="h-3 w-3" /> Admin Auth Persistence
                        </p>
                        <p className="text-rose-700/70 text-[10px] leading-relaxed">
                            Changes saved here will immediately propagate to the Student Dashboard for the selected subject and role. Content deletion is IRREVERSIBLE.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
