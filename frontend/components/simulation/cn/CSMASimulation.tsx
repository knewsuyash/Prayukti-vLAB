"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
    Play,
    Pause,
    RotateCcw,
    Activity,
    AlertTriangle,
    CheckCircle2,
    Zap,
    Clock,
    Monitor,
    XCircle
} from "lucide-react";

interface Node {
    id: number;
    state: "idle" | "sensing" | "transmitting" | "collision" | "backoff" | "jamming" | "success";
    backoffCount: number;
    backoffRemaining: number;
    packetProgress: number;
    color: string;
}

interface Stats {
    collisions: number;
    successful: number;
    totalPackets: number;
    throughput: number;
    avgDelay: number;
}

const quizQuestions = [
    {
        question: "What does 'Carrier Sense' mean in CSMA/CD?",
        options: [
            "Detecting physical hardware",
            "Checking if the medium is idle before transmitting",
            "Measuring the signal strength of other nodes",
            "Identifying the source of a packet"
        ],
        answer: 1
    },
    {
        question: "In CSMA/CD, what happens immediately after a collision is detected?",
        options: [
            "The node shuts down",
            "The node increases transmission power",
            "The node sends a jamming signal and stops transmitting",
            "The node ignores the collision and continues"
        ],
        answer: 2
    },
    {
        question: "Which algorithm is used to determine the wait time after a collision?",
        options: [
            "Round Robin",
            "Least Recently Used",
            "Binary Exponential Backoff",
            "Dijkstra's Algorithm"
        ],
        answer: 2
    },
    {
        question: "What is the primary medium access control method for legacy Ethernet?",
        options: [
            "Token Ring",
            "CSMA/CA",
            "CSMA/CD",
            "TDMA"
        ],
        answer: 2
    },
    {
        question: "As the number of nodes increases in a shared CSMA/CD network, what generally happens to throughput?",
        options: [
            "It increases linearly",
            "It decreases due to increased collisions",
            "It remains constant",
            "It doubles"
        ],
        answer: 1
    }
];

export default function CSMASimulation() {
    // Config State
    const [nodeCount, setNodeCount] = useState(4);
    const [packetSize, setPacketSize] = useState(100);
    const [transProb, setTransProb] = useState(0.02);
    const [simSpeed, setSimSpeed] = useState(1); // 1: normal, 2: fast, 0.5: slow

    // Sim State
    const [nodes, setNodes] = useState<Node[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [channelState, setChannelState] = useState<"idle" | "busy" | "collision">("idle");
    const [stats, setStats] = useState<Stats>({
        collisions: 0,
        successful: 0,
        totalPackets: 0,
        throughput: 0,
        avgDelay: 0
    });
    const [time, setTime] = useState(0);
    const [history, setHistory] = useState<{ t: number, throughput: number, collisions: number }[]>([]);

    // UI State
    const [activeTab, setActiveTab] = useState("simulation");
    const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>([null, null, null, null, null]);
    const [quizSubmitted, setQuizSubmitted] = useState(false);

    // Refs for simulation loop
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize nodes
    useEffect(() => {
        const colors = [
            "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500",
            "bg-indigo-500", "bg-rose-500", "bg-amber-500", "bg-cyan-500"
        ];
        const initialNodes: Node[] = Array.from({ length: nodeCount }, (_, i) => ({
            id: i + 1,
            state: "idle",
            backoffCount: 0,
            backoffRemaining: 0,
            packetProgress: 0,
            color: colors[i % colors.length] as string
        }));
        setNodes(initialNodes);
        resetSimulation();
    }, [nodeCount]);

    const resetSimulation = () => {
        setIsRunning(false);
        setTime(0);
        setHistory([]);
        setChannelState("idle");
        setStats({
            collisions: 0,
            successful: 0,
            totalPackets: 0,
            throughput: 0,
            avgDelay: 0
        });
        setNodes(prev => prev.map(n => ({
            ...n,
            state: "idle",
            backoffCount: 0,
            backoffRemaining: 0,
            packetProgress: 0
        })));
    };

    const tick = useCallback(() => {
        setTime(prev => prev + 1);

        setNodes(prevNodes => {
            let nextNodes = [...prevNodes];
            let transmittingCount = nextNodes.filter(n => n.state === "transmitting" || n.state === "jamming").length;

            // Check for new transmissions
            nextNodes = nextNodes.map(node => {
                if (node.state === "idle") {
                    // Randomly decide to transmit
                    if (Math.random() < transProb) {
                        return { ...node, state: "sensing" };
                    }
                }

                if (node.state === "sensing") {
                    // Check if channel is busy
                    if (transmittingCount === 0) {
                        return { ...node, state: "transmitting", packetProgress: 0 };
                    } else {
                        // Channel busy, wait (1-persistent or p-persistent could be implemented here)
                        // For simplicity, stay in sensing
                        return node;
                    }
                }

                if (node.state === "transmitting") {
                    // If others start transmitting while I am, collision!
                    if (transmittingCount > 1) {
                        return { ...node, state: "collision" };
                    }

                    const nextProgress = node.packetProgress + (5 * simSpeed);
                    if (nextProgress >= packetSize) {
                        // Success!
                        return { ...node, state: "success", packetProgress: 100, backoffCount: 0 };
                    }
                    return { ...node, packetProgress: nextProgress };
                }

                if (node.state === "success") {
                    // Update stats once
                    setStats(s => ({
                        ...s,
                        successful: s.successful + 1,
                        totalPackets: s.totalPackets + 1,
                        throughput: (s.successful + 1) / (time + 1) * 100
                    }));
                    // Stay in success state for a brief moment then go to idle
                    return { ...node, state: "idle", packetProgress: 0 };
                }

                if (node.state === "collision") {
                    setStats(s => ({ ...s, collisions: s.collisions + 1 }));
                    return { ...node, state: "jamming", packetProgress: 0 };
                }

                if (node.state === "jamming") {
                    // Jamming signal lasts for a short time
                    return { ...node, state: "backoff", backoffCount: node.backoffCount + 1, backoffRemaining: calculateBackoff(node.backoffCount + 1) };
                }

                if (node.state === "backoff") {
                    if (node.backoffRemaining <= 0) {
                        return { ...node, state: "sensing" };
                    }
                    return { ...node, backoffRemaining: node.backoffRemaining - 1 };
                }

                return node;
            });

            // Update channel visual state
            const currentTransmitting = nextNodes.filter(n => n.state === "transmitting" || n.state === "jamming").length;
            if (currentTransmitting > 1) setChannelState("collision");
            else if (currentTransmitting === 1) setChannelState("busy");
            else setChannelState("idle");

            return nextNodes;
        });

        // Record history every few ticks
        if (time % 20 === 0) {
            setHistory(h => [...h.slice(-20), {
                t: time,
                throughput: stats.throughput,
                collisions: stats.collisions
            }]);
        }
    }, [transProb, simSpeed, packetSize, stats, time]);

    const calculateBackoff = (k: number) => {
        // Binary Exponential Backoff
        const maxK = Math.min(k, 10);
        const slots = Math.pow(2, maxK) - 1;
        return Math.floor(Math.random() * slots) * 10; // 10 ticks per slot
    };

    useEffect(() => {
        if (isRunning) {
            timerRef.current = setInterval(tick, 100 / simSpeed);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isRunning, simSpeed, tick]);

    const handleQuizOption = (qIdx: number, oIdx: number) => {
        if (quizSubmitted) return;
        const newAnswers = [...quizAnswers];
        newAnswers[qIdx] = oIdx;
        setQuizAnswers(newAnswers);
    };

    return (
        <div className="flex flex-col h-full bg-white overflow-y-auto">
            {/* Tabs */}
            <div className="flex border-b sticky top-0 bg-white z-10">
                {["Simulation", "Observation", "Quiz"].map((tab) => (
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

            <div className="p-6 max-w-[1600px] mx-auto w-full">
                {activeTab === "simulation" && (
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        {/* Sidebar Controls */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-slate-50/50 backdrop-blur-sm p-5 rounded-[2rem] border border-slate-200/60 space-y-6 shadow-xl shadow-slate-200/20">
                                <h3 className="font-black text-slate-800 flex items-center gap-2 text-xs uppercase tracking-widest">
                                    <Activity className="h-4 w-4 text-cyan-600" />
                                    Control Panel
                                </h3>

                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Nodes</label>
                                            <span className="text-xs font-bold px-2 py-0.5 bg-cyan-100 text-cyan-700 rounded-full">{nodeCount}</span>
                                        </div>
                                        <Slider
                                            value={[nodeCount]}
                                            min={2}
                                            max={8}
                                            step={1}
                                            onValueChange={(v: number[]) => setNodeCount(v[0]!)}
                                            disabled={isRunning}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Packet Size</label>
                                            <span className="text-xs font-bold px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full">{packetSize}</span>
                                        </div>
                                        <Slider
                                            value={[packetSize]}
                                            min={50}
                                            max={500}
                                            step={10}
                                            onValueChange={(v: number[]) => setPacketSize(v[0]!)}
                                            disabled={isRunning}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Traffic Load</label>
                                            <span className="text-xs font-bold px-2 py-0.5 bg-rose-100 text-rose-700 rounded-full">{(transProb * 100).toFixed(1)}%</span>
                                        </div>
                                        <Slider
                                            value={[transProb * 100]}
                                            min={0.5}
                                            max={10}
                                            step={0.5}
                                            onValueChange={(v: number[]) => setTransProb(v[0]! / 100)}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Simulation Velocity</label>
                                        <div className="flex gap-2 p-1 bg-slate-200/50 rounded-xl">
                                            {[0.5, 1, 2].map(speed => (
                                                <Button
                                                    key={speed}
                                                    variant={simSpeed === speed ? "default" : "ghost"}
                                                    size="sm"
                                                    className={`flex-1 text-[10px] font-bold rounded-lg h-8 ${simSpeed === speed ? "bg-white text-slate-900 shadow-sm hover:bg-white" : "text-slate-500 hover:text-slate-800"}`}
                                                    onClick={() => setSimSpeed(speed)}
                                                >
                                                    {speed === 0.5 ? "Slow" : speed === 1 ? "Norm" : "Fast"}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 space-y-3">
                                    <Button
                                        className={`w-full rounded-2xl h-12 text-sm font-bold shadow-lg transition-all active:scale-95 ${isRunning ? "bg-amber-500 hover:bg-amber-600 shadow-amber-200/50" : "bg-cyan-600 hover:bg-cyan-700 shadow-cyan-200/50"}`}
                                        onClick={() => setIsRunning(!isRunning)}
                                    >
                                        {isRunning ? <Pause className="mr-2 h-4 w-4 fill-current" /> : <Play className="mr-2 h-4 w-4 fill-current" />}
                                        {isRunning ? "Freeze" : "Execute Lab"}
                                    </Button>
                                    <Button variant="ghost" className="w-full rounded-2xl text-slate-400 hover:text-slate-600 hover:bg-slate-100" onClick={resetSimulation}>
                                        <RotateCcw className="mr-2 h-4 w-4" /> Reset
                                    </Button>
                                </div>
                            </div>

                            {/* Dynamic Stats Glaze */}
                            <div className="bg-slate-900 text-white p-6 rounded-[2rem] shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 blur-3xl rounded-full -mr-12 -mt-12 group-hover:bg-cyan-500/20 transition-all duration-500"></div>
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Telemetry</h4>
                                <div className="grid grid-cols-2 gap-y-4">
                                    <div>
                                        <p className="text-[8px] text-emerald-400/70 font-black uppercase">Success</p>
                                        <p className="text-xl font-bold font-mono">{stats.successful}</p>
                                    </div>
                                    <div>
                                        <p className="text-[8px] text-rose-400/70 font-black uppercase">Collisions</p>
                                        <p className="text-xl font-bold font-mono text-rose-400">{stats.collisions}</p>
                                    </div>
                                    <div className="col-span-2 pt-2">
                                        <p className="text-[8px] text-cyan-400/70 font-black uppercase mb-1 text-center">Efficiency Score</p>
                                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-cyan-500 transition-all duration-500" style={{ width: `${Math.min(stats.throughput, 100)}%` }}></div>
                                        </div>
                                        <p className="text-center text-xs font-bold mt-1 text-cyan-400">{stats.throughput.toFixed(2)}%</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Visualizer Area */}
                        <div className="lg:col-span-4 grid grid-cols-1 xl:grid-cols-4 gap-6">
                            <div className="xl:col-span-3 space-y-6">
                                {/* The Shared Medium - Improved Aesthetics */}
                                <div className="bg-slate-950 rounded-[3rem] p-12 min-h-[550px] flex flex-col items-center justify-between relative overflow-hidden shadow-2xl border border-slate-800/80">
                                    {/* Scanline Effect */}
                                    <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>

                                    {/* Grid Background */}
                                    <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(#334155 1px, transparent 0)", backgroundSize: "32px 32px" }}></div>

                                    {/* Top Nodes */}
                                    <div className="flex justify-around w-full z-10">
                                        {nodes.slice(0, Math.ceil(nodeCount / 2)).map(node => (
                                            <NodeComponent key={node.id} node={node} />
                                        ))}
                                    </div>

                                    {/* Shared Bus - Cyber Style */}
                                    <div className="w-full h-2 bg-slate-800/50 rounded-full relative flex items-center">
                                        {/* Bus Glow */}
                                        <div className="absolute inset-0 blur-md bg-cyan-500/10 rounded-full"></div>

                                        {/* Animation of signals */}
                                        {nodes.map(node => (
                                            (node.state === "transmitting" || node.state === "jamming" || node.state === "collision" || node.state === "success") && (
                                                <div
                                                    key={`sig-${node.id}`}
                                                    className={`absolute h-8 transition-all duration-100 blur-[2px] ${node.state === "jamming" ? "bg-amber-400 animate-pulse w-full h-1" :
                                                            node.state === "collision" ? "bg-rose-500 w-full h-1.5 shadow-[0_0_20px_rgba(244,63,94,0.6)]" :
                                                                node.state === "success" ? "bg-emerald-400/40 w-full h-1" :
                                                                    "bg-cyan-400/30 h-1"
                                                        }`}
                                                    style={{
                                                        left: node.id <= Math.ceil(nodeCount / 2) ? `${(node.id - 1) * (100 / Math.ceil(nodeCount / 2)) + 12}%` : `${(node.id - Math.ceil(nodeCount / 2) - 1) * (100 / Math.floor(nodeCount / 2)) + 12}%`,
                                                        width: node.state === "transmitting" ? `${node.packetProgress / packetSize * 30}%` : "100%",
                                                        transition: "width 0.1s linear"
                                                    }}
                                                />
                                            )
                                        ))}

                                        {/* Collision Visual Effect */}
                                        {channelState === "collision" && (
                                            <div className="absolute inset-0 bg-rose-500/10 flex items-center justify-center">
                                                <div className="w-[200px] h-[200px] bg-rose-500/20 blur-[100px] rounded-full animate-pulse"></div>
                                                <Zap className="h-12 w-12 text-rose-500 animate-bounce absolute" />
                                            </div>
                                        )}

                                        {/* Channel State Pulse */}
                                        <div className={`absolute -inset-1 rounded-full border border-slate-700/50 ${channelState === "busy" ? "border-cyan-500/30 animate-pulse" : ""}`}></div>
                                    </div>

                                    {/* Bottom Nodes */}
                                    <div className="flex justify-around w-full z-10">
                                        {nodes.slice(Math.ceil(nodeCount / 2)).map(node => (
                                            <NodeComponent key={node.id} node={node} />
                                        ))}
                                    </div>
                                </div>

                                {/* Modern Legend */}
                                <div className="flex flex-wrap gap-8 justify-center bg-white/50 backdrop-blur-sm p-4 rounded-[2rem] border border-slate-200/60 shadow-sm">
                                    <LegendItem label="Idle" color="bg-slate-700 shadow-slate-200" />
                                    <LegendItem label="Listening" color="bg-cyan-400 shadow-cyan-200 animate-pulse" />
                                    <LegendItem label="Active" color="bg-emerald-400 shadow-emerald-200" />
                                    <LegendItem label="Conflict" color="bg-rose-500 shadow-rose-200 animate-bounce" />
                                    <LegendItem label="Recovery" color="bg-amber-400 shadow-amber-200" />
                                </div>
                            </div>

                            {/* Flowchart Panel - Integrated & Compact */}
                            <div className="xl:col-span-1 h-full min-h-[550px]">
                                <CSMAFlowchart activeState={nodes[0]?.state || "idle"} />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "observation" && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Statistics Table */}
                            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                                <div className="bg-slate-50 p-4 border-b">
                                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                        <Activity className="h-4 w-4" /> Detailed Results
                                    </h3>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between items-center pb-2 border-b">
                                        <span className="text-gray-500 font-medium">Total Samples (Time)</span>
                                        <span className="font-bold">{time}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-2 border-b">
                                        <span className="text-gray-500 font-medium">Successful Transmissions</span>
                                        <span className="font-bold text-green-600">{stats.successful}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-2 border-b">
                                        <span className="text-gray-500 font-medium">Collision Count</span>
                                        <span className="font-bold text-red-600">{stats.collisions}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-2 border-b">
                                        <span className="text-gray-500 font-medium">Network Efficiency</span>
                                        <span className="font-bold">{(stats.throughput).toFixed(2)}%</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-2">
                                        <span className="text-gray-500 font-medium">Current Load</span>
                                        <span className="font-bold">{(transProb * nodeCount * 100).toFixed(0)}%</span>
                                    </div>
                                </div>
                                <div className="p-4 bg-blue-50 text-xs text-blue-700 border-t italic">
                                    * These values are calculated in real-time based on the current simulation configuration.
                                </div>
                            </div>

                            {/* Graphs Placeholder */}
                            <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-6">
                                <h3 className="font-bold text-slate-800">Performance Trends</h3>
                                <div className="h-64 flex items-end gap-1 border-b border-l p-2 relative">
                                    {history.map((h, i) => (
                                        <div
                                            key={i}
                                            className="bg-blue-400 hover:bg-blue-500 transition-all flex-1"
                                            style={{ height: `${h.throughput * 2}%`, minWidth: "4px" }}
                                            title={`Time: ${h.t}, TP: ${h.throughput.toFixed(2)}%`}
                                        ></div>
                                    ))}
                                    {history.length === 0 && (
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm italic">
                                            Start simulation to see data trends
                                        </div>
                                    )}
                                    <div className="absolute top-0 right-0 text-[10px] text-gray-400 uppercase font-bold">Throughput vs Time</div>
                                </div>
                                <div className="h-64 flex items-end gap-1 border-b border-l p-2 relative">
                                    {history.map((h, i) => (
                                        <div
                                            key={i}
                                            className="bg-red-400 hover:bg-red-500 transition-all flex-1"
                                            style={{ height: `${(h.collisions / (stats.collisions + 1)) * 100}%`, minWidth: "4px" }}
                                            title={`Time: ${h.t}, Collisions: ${h.collisions}`}
                                        ></div>
                                    ))}
                                    {history.length === 0 && (
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm italic">
                                            Start simulation to see data trends
                                        </div>
                                    )}
                                    <div className="absolute top-0 right-0 text-[10px] text-gray-400 uppercase font-bold">Accumulated Collisions</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "quiz" && (
                    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-2xl text-white shadow-xl">
                            <h3 className="text-2xl font-bold mb-2">CSMA/CD Mastery Quiz</h3>
                            <p className="opacity-90">Validate your understanding of collision detection and backoff logic.</p>
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
                                <Button
                                    onClick={() => setQuizSubmitted(true)}
                                    className="bg-blue-600 hover:bg-blue-700 w-full py-6 text-lg"
                                    disabled={quizAnswers.includes(null)}
                                >
                                    Submit Final Results
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => {
                                        setQuizAnswers([null, null, null, null, null]);
                                        setQuizSubmitted(false);
                                    }}
                                    variant="outline"
                                    className="w-full py-6 text-lg"
                                >
                                    Try Again
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function NodeComponent({ node }: { node: Node }) {
    return (
        <div className="flex flex-col items-center gap-4 transition-all duration-300">
            <div className={`p-4 rounded-2xl shadow-lg border-2 transition-all duration-300 relative ${node.state === "idle" ? "bg-slate-800 border-slate-700" :
                node.state === "sensing" ? "bg-cyan-900 border-cyan-400 animate-pulse" :
                    node.state === "transmitting" ? "bg-green-900 border-green-400" :
                        node.state === "collision" ? "bg-red-900 border-red-400 animate-bounce" :
                            node.state === "jamming" ? "bg-amber-900 border-amber-400 scale-110" :
                                node.state === "success" ? "bg-emerald-900 border-emerald-400 scale-110 shadow-[0_0_20px_rgba(16,185,129,0.5)]" :
                                    "bg-slate-700 border-slate-600 grayscale"
                }`}>
                <Monitor className={`h-8 w-8 ${node.state === "idle" ? "text-slate-500" : "text-white"
                    }`} />

                {/* Backoff Timer Overlay */}
                {node.state === "backoff" && (
                    <div className="absolute inset-0 bg-black/60 rounded-2xl flex flex-col items-center justify-center">
                        <Clock className="h-4 w-4 text-amber-400 mb-1" />
                        <span className="text-[10px] text-white font-bold">{node.backoffRemaining}</span>
                    </div>
                )}

                {/* Status Indicator */}
                <div className={`absolute -top-2 -right-2 h-4 w-4 rounded-full border-2 border-slate-900 ${node.state === "idle" ? "bg-slate-600" :
                    node.state === "sensing" ? "bg-cyan-400" :
                        node.state === "transmitting" ? "bg-green-400" :
                            node.state === "collision" ? "bg-red-500" :
                                node.state === "jamming" ? "bg-amber-400" :
                                    node.state === "success" ? "bg-emerald-400" :
                                        "bg-amber-600"
                    }`}></div>
            </div>

            <div className="flex flex-col items-center">
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-tighter">PC-{node.id}</span>
                <span className={`text-[10px] font-black uppercase ${node.state === "idle" ? "text-slate-600" :
                    node.state === "sensing" ? "text-cyan-400" :
                        node.state === "transmitting" ? "text-green-400" :
                            node.state === "collision" ? "text-red-500" :
                                node.state === "jamming" ? "text-amber-400" :
                                    node.state === "success" ? "text-emerald-400" :
                                        "text-amber-600"
                    }`}>
                    {node.state}
                </span>
            </div>
        </div>
    );
}

function LegendItem({ label, color }: { label: string, color: string }) {
    return (
        <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${color}`}></div>
            <span className="text-xs font-bold text-gray-500 uppercase">{label}</span>
        </div>
    );
}

function CSMAFlowchart({ activeState }: { activeState: string }) {
    const steps = [
        { id: "idle", label: "Assemble Frame", type: "process" },
        { id: "sensing", label: "Sense Carrier", type: "process" },
        { id: "transmitting", label: "Transmit Frame", type: "process" },
        { id: "collision", label: "Collision?", type: "decision" },
        { id: "jamming", label: "Jamming Signal", type: "process" },
        { id: "backoff", label: "Exponential Backoff", type: "process" },
        { id: "success", label: "Success!", type: "terminator" }
    ];

    return (
        <div className="bg-slate-900/40 backdrop-blur-md p-4 rounded-3xl border border-slate-700/50 h-full flex flex-col shadow-2xl overflow-hidden">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <Zap className="h-3 w-3 text-cyan-400" />
                Protocol Pipeline
            </h4>

            <div className="flex-1 flex flex-col items-center justify-between py-2">
                {steps.map((step, idx) => {
                    const isActive = activeState === step.id;
                    const isDecision = step.type === "decision";
                    const isTerminator = step.type === "terminator";

                    return (
                        <React.Fragment key={step.id}>
                            <div className={`
                                w-32 py-1.5 px-2 text-center transition-all duration-500 relative z-10
                                ${isActive ? 'scale-105 shadow-[0_0_15px_rgba(34,211,238,0.4)]' : 'scale-100 opacity-40'}
                                ${isDecision ? 'rotate-45 w-16 h-16 flex items-center justify-center border border-slate-600' :
                                    isTerminator ? 'rounded-full bg-emerald-500/10 border border-emerald-500/50 text-emerald-400' :
                                        'rounded-xl border border-slate-700 bg-slate-800/50'}
                                ${isActive && !isTerminator ? 'border-cyan-400 bg-cyan-400/10 text-cyan-100 font-bold' : ''}
                                ${isActive && isTerminator ? 'bg-emerald-500 text-white font-bold' : ''}
                            `}>
                                <div className={`${isDecision ? '-rotate-45' : ''} text-[9px] leading-tight`}>
                                    {step.label}
                                </div>

                                {isActive && (
                                    <div className="absolute -right-2 -top-1">
                                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
                                    </div>
                                )}
                            </div>

                            {idx < steps.length - 1 && (
                                <div className="h-2 w-px bg-slate-700 relative">
                                    <div className={`absolute inset-0 bg-cyan-400 transition-all duration-500 ${isActive ? 'h-full' : 'h-0'}`}></div>
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>

            <div className="mt-4 p-2 bg-slate-800/30 border border-slate-700/50 rounded-xl text-[8px] text-slate-500 italic text-center">
                Node 1 Execution Context
            </div>
        </div>
    );
}

export { LegendItem, CSMAFlowchart };
