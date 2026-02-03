"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Info, Play, RefreshCw, CheckCircle2, XCircle } from "lucide-react";

interface Layer {
    id: number;
    name: string;
    functions: string[];
    protocols: string[];
    color: string;
    tcpMap?: number;
}

const osiLayers: Layer[] = [
    { id: 7, name: "Application", functions: ["Network Services", "User Interface"], protocols: ["HTTP", "FTP", "SMTP", "DNS"], color: "bg-red-500", tcpMap: 4 },
    { id: 6, name: "Presentation", functions: ["Data Encryption", "Data Compression"], protocols: ["JPEG", "MPEG", "ASCII", "SSL"], color: "bg-orange-500", tcpMap: 4 },
    { id: 5, name: "Session", functions: ["Session Management", "Checkpointing"], protocols: ["NetBIOS", "RPC", "SQL"], color: "bg-yellow-500", tcpMap: 4 },
    { id: 4, name: "Transport", functions: ["End-to-End Connection", "Flow Control"], protocols: ["TCP", "UDP"], color: "bg-green-500", tcpMap: 3 },
    { id: 3, name: "Network", functions: ["Routing", "Logical Addressing"], protocols: ["IP", "ICMP", "ARP", "IGMP"], color: "bg-blue-500", tcpMap: 2 },
    { id: 2, name: "Data Link", functions: ["Framing", "Error Detection"], protocols: ["Ethernet", "PPP", "Switching"], color: "bg-indigo-500", tcpMap: 1 },
    { id: 1, name: "Physical", functions: ["Bit Transmission", "Physical Topology"], protocols: ["Hubs", "RS-232", "Cables"], color: "bg-purple-500", tcpMap: 1 },
];

const tcpLayers: Layer[] = [
    { id: 4, name: "Application", functions: ["User Process", "Network Services"], protocols: ["HTTP", "FTP", "SMTP", "DNS"], color: "bg-red-600" },
    { id: 3, name: "Transport", functions: ["End-to-End Reliability"], protocols: ["TCP", "UDP"], color: "bg-green-600" },
    { id: 2, name: "Internet", functions: ["Routing", "Addressing"], protocols: ["IP", "ICMP"], color: "bg-blue-600" },
    { id: 1, name: "Network Access", functions: ["Hardware Interfacing"], protocols: ["Ethernet", "Wi-Fi"], color: "bg-indigo-600" },
];

const quizQuestions = [
    {
        question: "Which OSI layer is responsible for end-to-end communication and error recovery?",
        options: ["Network Layer", "Transport Layer", "Data Link Layer", "Session Layer"],
        answer: 1, // Transport Layer
    },
    {
        question: "The TCP/IP 'Internet' layer corresponds to which OSI layer?",
        options: ["Data Link Layer", "Network Layer", "Transport Layer", "Physical Layer"],
        answer: 1, // Network Layer
    },
    {
        question: "Which of these protocols works at the Application layer?",
        options: ["IP", "TCP", "HTTP", "ICMP"],
        answer: 2, // HTTP
    },
    {
        question: "In which OSI layer does data encryption and compression happen?",
        options: ["Application", "Presentation", "Session", "Transport"],
        answer: 1, // Presentation
    },
    {
        question: "What is the unit of data at the Data Link layer?",
        options: ["Segment", "Packet", "Frame", "Bit"],
        answer: 2, // Frame
    },
];

export default function OSISimulation() {
    const [selectedLayer, setSelectedLayer] = useState<Layer | null>(null);
    const [animating, setAnimating] = useState(false);
    const [currentAnimLayer, setCurrentAnimLayer] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState("simulation");
    const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>([null, null, null, null, null]);
    const [quizSubmitted, setQuizSubmitted] = useState(false);

    const startAnimation = () => {
        if (animating) return;
        setAnimating(true);
        let current = 7;
        const interval = setInterval(() => {
            setCurrentAnimLayer(current);
            if (current === 1) {
                clearInterval(interval);
                setTimeout(() => {
                    setAnimating(false);
                    setCurrentAnimLayer(null);
                }, 1000);
            }
            current--;
        }, 1000);
    };

    const handleQuizOption = (qIdx: number, oIdx: number) => {
        if (quizSubmitted) return;
        const newAnswers = [...quizAnswers];
        newAnswers[qIdx] = oIdx;
        setQuizAnswers(newAnswers);
    };

    const submitQuiz = () => {
        setQuizSubmitted(true);
    };

    const resetQuiz = () => {
        setQuizAnswers([null, null, null, null, null]);
        setQuizSubmitted(false);
    };

    return (
        <div className="flex flex-col h-full bg-white overflow-y-auto">
            {/* Tabs */}
            <div className="flex border-b sticky top-0 bg-white z-10">
                {["Simulation", "Quiz", "Comparison"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab.toLowerCase())}
                        className={`px-6 py-3 font-medium transition-colors border-b-2 ${activeTab === tab.toLowerCase()
                            ? "border-blue-600 text-blue-600 bg-blue-50"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="p-6">
                {activeTab === "simulation" && (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                        {/* Models View */}
                        <div className="space-y-8">
                            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <div>
                                    <h3 className="font-bold text-gray-800">Visualizer</h3>
                                    <p className="text-xs text-gray-500">Click a layer to see details</p>
                                </div>
                                <Button
                                    onClick={startAnimation}
                                    disabled={animating}
                                    className="bg-blue-600 hover:bg-blue-700 shadow-md"
                                >
                                    {animating ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                                    {animating ? "Animating..." : "Start Packet Flow"}
                                </Button>
                            </div>

                            <div className="flex justify-around items-end gap-4 min-h-[500px]">
                                {/* OSI Model */}
                                <div className="flex flex-col gap-2 w-full max-w-[200px]">
                                    <h4 className="text-center font-bold text-gray-600 mb-2 uppercase text-xs tracking-widest">OSI Model</h4>
                                    {osiLayers.map((layer) => (
                                        <div
                                            key={layer.id}
                                            onClick={() => setSelectedLayer(layer)}
                                            className={`
                                                relative cursor-pointer transition-all duration-300 transform
                                                ${layer.color} text-white font-bold p-3 rounded shadow-sm text-center text-sm
                                                ${selectedLayer?.id === layer.id && selectedLayer?.tcpMap ? "ring-4 ring-blue-300 scale-105 z-10" : "hover:scale-102"}
                                                ${currentAnimLayer === layer.id ? "ring-4 ring-yellow-400 scale-110 shadow-xl z-20" : ""}
                                            `}
                                        >
                                            <span className="absolute left-2 top-2 text-[10px] opacity-70">L{layer.id}</span>
                                            {layer.name}
                                            {currentAnimLayer === layer.id && (
                                                <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-2xl animate-bounce">
                                                    📦
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Arrow / Mapping Indicator (Can be replaced with SVGs for better look) */}
                                <div className="hidden md:flex flex-col justify-center text-gray-300">
                                    <div className="h-full border-l-2 border-dashed border-gray-200"></div>
                                </div>

                                {/* TCP/IP Model */}
                                <div className="flex flex-col gap-0 w-full max-w-[200px]">
                                    <h4 className="text-center font-bold text-gray-600 mb-2 uppercase text-xs tracking-widest">TCP/IP Model</h4>
                                    {tcpLayers.map((layer) => {
                                        // Calculate height based on how many OSI layers map to it
                                        const mappingCount = osiLayers.filter(osi => osi.tcpMap === layer.id).length;
                                        return (
                                            <div
                                                key={layer.id}
                                                className={`
                                                    ${layer.color} text-white font-bold p-3 border-y border-white/20 shadow-sm text-center text-sm flex items-center justify-center
                                                    ${selectedLayer?.tcpMap === layer.id ? "ring-4 ring-blue-300 scale-105 z-10" : ""}
                                                `}
                                                style={{ height: `${mappingCount * 50}px` }}
                                            >
                                                {layer.name}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Details View */}
                        <div className="space-y-6">
                            {selectedLayer ? (
                                <div className="bg-white rounded-2xl border shadow-lg overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className={`${selectedLayer.color} p-6 text-white`}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-2xl font-black uppercase">{selectedLayer.name} Layer</h3>
                                                <p className="opacity-90">OSI Layer {selectedLayer.id}</p>
                                            </div>
                                            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                                <Info className="h-6 w-6" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-8 space-y-8">
                                        <div>
                                            <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                                <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                                                Main Functions
                                            </h4>
                                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {selectedLayer.functions.map((fn, i) => (
                                                    <li key={i} className="bg-gray-50 p-3 rounded-lg text-gray-700 text-sm border border-gray-100 flex items-center gap-2">
                                                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                                                        {fn}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div>
                                            <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                                <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
                                                Example Protocols
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedLayer.protocols.map((proto, i) => (
                                                    <span key={i} className="px-4 py-2 bg-indigo-50 text-indigo-700 font-bold rounded-full text-xs border border-indigo-100 uppercase tracking-wider">
                                                        {proto}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800 leading-relaxed italic">
                                            Mapped to the <strong>{tcpLayers.find(t => t.id === selectedLayer.tcpMap)?.name}</strong> layer in the TCP/IP model.
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                    <div className="bg-blue-100 p-4 rounded-full mb-4">
                                        <Info className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <h3 className="font-bold text-gray-800 text-lg">No Layer Selected</h3>
                                    <p className="text-gray-500 max-w-xs mt-2">
                                        Click on any OSI layer to explore its functions, protocols, and how it maps to the TCP/IP model.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === "quiz" && (
                    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-2xl text-white shadow-xl">
                            <h3 className="text-2xl font-bold mb-2">Knowledge Check</h3>
                            <p className="opacity-90">Test your understanding of the OSI and TCP/IP models.</p>
                        </div>

                        <div className="space-y-6">
                            {quizQuestions.map((q, qIdx) => (
                                <div key={qIdx} className="bg-white p-6 rounded-xl border shadow-sm">
                                    <p className="font-bold text-gray-800 mb-4">{qIdx + 1}. {q.question}</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {q.options.map((option, oIdx) => (
                                            <button
                                                key={oIdx}
                                                onClick={() => handleQuizOption(qIdx, oIdx)}
                                                className={`
                                                    p-4 text-left rounded-lg text-sm transition-all border-2
                                                    ${quizAnswers[qIdx] === oIdx
                                                        ? "border-blue-600 bg-blue-50 text-blue-800 font-medium"
                                                        : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                                                    }
                                                    ${quizSubmitted && oIdx === q.answer ? "border-green-500 bg-green-50 text-green-800" : ""}
                                                    ${quizSubmitted && quizAnswers[qIdx] === oIdx && oIdx !== q.answer ? "border-red-500 bg-red-50 text-red-800" : ""}
                                                `}
                                                disabled={quizSubmitted}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs shrink-0">{String.fromCharCode(65 + oIdx)}</span>
                                                    {option}
                                                    {quizSubmitted && oIdx === q.answer && <CheckCircle2 className="ml-auto h-5 w-5 text-green-500" />}
                                                    {quizSubmitted && quizAnswers[qIdx] === oIdx && oIdx !== q.answer && <XCircle className="ml-auto h-5 w-5 text-red-500" />}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-4 pt-4">
                            {!quizSubmitted ? (
                                <Button onClick={submitQuiz} className="bg-blue-600 hover:bg-blue-700 w-full py-6 text-lg">
                                    Submit Answers
                                </Button>
                            ) : (
                                <Button onClick={resetQuiz} variant="outline" className="w-full py-6 text-lg">
                                    Reset Quiz
                                </Button>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === "comparison" && (
                    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">OSI vs TCP/IP Comparison</h3>
                        <div className="overflow-hidden rounded-2xl border shadow-lg bg-white">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-bold">
                                    <tr>
                                        <th className="px-6 py-4">Feature</th>
                                        <th className="px-6 py-4">OSI Model</th>
                                        <th className="px-6 py-4">TCP/IP Model</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-800">No. of Layers</td>
                                        <td className="px-6 py-4">7 Layers</td>
                                        <td className="px-6 py-4">4 Layers</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-800">Approach</td>
                                        <td className="px-6 py-4">Theoretical / Conceptual</td>
                                        <td className="px-6 py-4">Practical / Protocol-based</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-800">Session/Presentation</td>
                                        <td className="px-6 py-4">Separate layers</td>
                                        <td className="px-6 py-4">Part of Application layer</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-800">Data Link/Physical</td>
                                        <td className="px-6 py-4">Separate layers</td>
                                        <td className="px-6 py-4">Combined as Host-to-Network layer</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-800">Reliability</td>
                                        <td className="px-6 py-4">Less common in real-world networks</td>
                                        <td className="px-6 py-4">The standard for the Internet</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
