"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import { Loader2 } from "lucide-react";

// Use environment variable for API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [sent, setSent] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Strict Domain Check
        if (!email.endsWith("@mmmut.ac.in")) {
            setError("Access Restricted: Only @mmmut.ac.in emails are allowed.");
            setLoading(false);
            return;
        }

        try {
            // Simulate verification logic for prototype
            // In a real app, this would verify the password or send an OTP
            setSent(true);

        } catch (err: unknown) {
            setError((err as Error).message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                <div className="bg-[#d32f2f] p-8 text-center relative overflow-hidden">
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-white rounded-full -translate-x-10 -translate-y-10"></div>
                        <div className="absolute bottom-0 right-0 w-32 h-32 border-4 border-white rounded-full translate-x-10 translate-y-10"></div>
                    </div>
                    <h1 className="text-white text-3xl font-black tracking-tight relative z-10">Prayukti vLAB</h1>
                    <p className="text-red-100/70 text-xs font-bold uppercase tracking-widest mt-1 relative z-10">Academic Authentication</p>
                </div>

                <div className="p-8">
                    {!sent ? (
                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                                    University Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    placeholder="yourname@mmmut.ac.in"
                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#d32f2f] focus:bg-white rounded-2xl outline-none transition-all text-gray-700 font-medium"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#d32f2f] focus:bg-white rounded-2xl outline-none transition-all text-gray-700 font-medium"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            {error && (
                                <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-[11px] font-bold rounded-xl animate-in fade-in slide-in-from-top-1">
                                    ⚠️ {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#f57f17] hover:bg-[#e65100] text-white font-black py-7 rounded-2xl shadow-lg shadow-orange-200 transition-all active:scale-[0.98]"
                            >
                                {loading ? <Loader2 className="animate-spin h-5 w-5 mx-auto" /> : "VERIFY & ENTER"}
                            </Button>

                            {/* Test Credentials Box */}
                            <div className="mt-8 p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Prototype Access Panel</p>
                                </div>
                                <div className="space-y-2 font-mono text-[9px]">
                                    <div className="flex justify-between items-center group cursor-pointer" onClick={() => { setEmail("admin@mmmut.ac.in"); setPassword("admin123") }}>
                                        <span className="text-slate-400">ADMIN:</span>
                                        <span className="font-bold text-slate-700 bg-white px-2 py-0.5 rounded border">admin@mmmut.ac.in / admin123</span>
                                    </div>
                                    <div className="flex justify-between items-center group cursor-pointer" onClick={() => { setEmail("teacher@mmmut.ac.in"); setPassword("teacher123") }}>
                                        <span className="text-slate-400">TEACHER:</span>
                                        <span className="font-bold text-slate-700 bg-white px-2 py-0.5 rounded border">teacher@mmmut.ac.in / teacher123</span>
                                    </div>
                                    <div className="flex justify-between items-center group cursor-pointer" onClick={() => { setEmail("student@mmmut.ac.in"); setPassword("student123") }}>
                                        <span className="text-slate-400">STUDENT:</span>
                                        <span className="font-bold text-slate-700 bg-white px-2 py-0.5 rounded border">student@mmmut.ac.in / student123</span>
                                    </div>
                                </div>
                                <p className="text-[9px] text-slate-400 italic text-center pt-1 border-t border-slate-100">Click a record above to auto-fill</p>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-2xl">
                                ✓
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">Check your Email</h3>
                            <p className="text-sm text-gray-600">
                                We have sent a magic link/OTP to <strong>{email}</strong>.
                                <br />
                                (For this prototype, clicking &quot;Continue&quot; simulates verification)
                            </p>
                            <Button
                                onClick={() => {
                                    if (typeof window !== 'undefined') {
                                        localStorage.setItem("token", "mock-jwt-token");
                                        localStorage.setItem("user", JSON.stringify({ email }));
                                    }
                                    router.push("/dashboard");
                                }}
                                className="w-full bg-green-600 hover:bg-green-700 text-white"
                            >
                                Continue to API Dashboard (Simulation)
                            </Button>
                        </div>
                    )}
                </div>

                <div className="bg-gray-50 p-4 text-center text-xs text-gray-500">
                    &copy; 2025 MMMUT Gorakhpur
                </div>
            </div>
        </div>
    );
}
