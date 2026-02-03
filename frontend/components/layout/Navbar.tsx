"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, User, ShieldCheck, GraduationCap } from "lucide-react";

export function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <nav className="bg-white border-b sticky top-0 z-50 shadow-sm overflow-visible">
            <div className="container mx-auto px-4 flex justify-between items-center h-20">
                {/* Logo Section */}
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#d32f2f] rounded-xl flex items-center justify-center font-black text-white text-xl shadow-lg shadow-red-100 italic">
                        M
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black text-slate-800 tracking-tighter leading-none">MMMUT</span>
                        <span className="text-[10px] font-bold text-[#f57f17] uppercase tracking-widest leading-none mt-1">Virtual Labs</span>
                    </div>
                </div>

                {/* Main Navigation */}
                <ul className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-600 uppercase tracking-tighter">
                    <li className="hover:text-[#d32f2f] cursor-pointer transition-colors">Home</li>
                    <li className="hover:text-[#d32f2f] cursor-pointer transition-colors">Labs</li>
                    <li className="hover:text-[#d32f2f] cursor-pointer transition-colors">About Us</li>
                    <li className="hover:text-[#d32f2f] cursor-pointer transition-colors">Events</li>
                </ul>

                {/* CTAs */}
                <div className="flex items-center gap-3">
                    <Link href="/login">
                        <button className="hidden sm:flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-[#d32f2f] border-2 border-[#d32f2f] hover:bg-red-50 transition-all">
                            <User className="h-4 w-4" />
                            Student Login
                        </button>
                    </Link>

                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="bg-[#f57f17] text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-[#e65100] shadow-lg shadow-orange-200 transition-all border-b-4 border-orange-800 active:border-b-0 active:translate-y-1"
                        >
                            Other Login
                            <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-4 w-60 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-[60] animate-in fade-in slide-in-from-top-4">
                                <Link
                                    href="/admin/lab-designer"
                                    className="flex items-center gap-4 px-5 py-3 text-sm text-slate-700 hover:bg-orange-50 transition-colors"
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center text-rose-600">
                                        <ShieldCheck className="h-5 w-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold">Admin Portal</span>
                                        <span className="text-[10px] text-slate-400">Lab Designer</span>
                                    </div>
                                </Link>
                                <Link
                                    href="/teacher/analytics"
                                    className="flex items-center gap-4 px-5 py-3 text-sm text-slate-700 hover:bg-orange-50 transition-colors border-t border-slate-50"
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                                        <GraduationCap className="h-5 w-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold">Faculty Portal</span>
                                        <span className="text-[10px] text-slate-400">Student Analytics</span>
                                    </div>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Overlay to close dropdown */}
            {isDropdownOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/10 backdrop-blur-[2px]"
                    onClick={() => setIsDropdownOpen(false)}
                />
            )}
        </nav>
    );
}
