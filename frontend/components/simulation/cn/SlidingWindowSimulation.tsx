"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
    Activity, Play, Pause, RotateCcw, Monitor, Zap,
    ArrowRightLeft, Layers, Send, CheckCircle2, AlertTriangle,
    Clock, RefreshCw, BarChart3, HelpCircle, XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

// --- Types ---
interface Packet {
    id: number;
    seq: number;
    status: "idle" | "in-transit" | "acked" | "lost" | "error";
    type: "data" | "ack";
    progress: number;
    isNack?: boolean;
}

interface ProtocolState {
    senderWindow: number[];
    nextSeqNum: number;
    base: number;
    buffer: Record<number, Packet>;
}

// --- Component ---
export default function SlidingWindowSimulation() {
    // Basic Config
    const [protocol, setProtocol] = useState<"sw" | "gbn" | "sr">("gbn");
    const [windowSize, setWindowSize] = useState(4);
    const [timeout, setTimeoutVal] = useState(3000);
    const [simSpeed, setSimSpeed] = useState(1);
    const [isRunning, setIsRunning] = useState(false);

    // Dynamic State
    const [packets, setPackets] = useState<Packet[]>([]);
    const [senderBase, setSenderBase] = useState(0);
    const [nextSeqToSend, setNextSeqToSend] = useState(0);
    const [receiverExpected, setReceiverExpected] = useState(0);
    const [receivedPackets, setReceivedPackets] = useState<number[]>([]);
    const [log, setLog] = useState<{ msg: string, type: 'info' | 'error' | 'success' }[]>([]);

    // Stats
    const [totalSent, setTotalSent] = useState(0);
    const [retransmissions, setRetransmissions] = useState(0);
    const [activeTab, setActiveTab] = useState<"simulation" | "logic" | "quiz">("simulation");

    // Quiz State
    const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
    const [showResults, setShowResults] = useState(false);

    const timerRef = useRef<Record<number, NodeJS.Timeout>>({});

    // Add to Log
    const addLog = (msg: string, type: 'info' | 'error' | 'success' = 'info') => {
        setLog(prev => [{ msg, type }, ...prev].slice(0, 5));
    };

    // Initialize/Reset
    const reset = useCallback(() => {
        setIsRunning(false);
        setPackets([]);
        setSenderBase(0);
        setNextSeqToSend(0);
        setReceiverExpected(0);
        setReceivedPackets([]);
        setTotalSent(0);
        setRetransmissions(0);
        setLog([{ msg: "Simulation Reset. Ready to start.", type: 'info' }]);
        Object.values(timerRef.current).forEach(clearTimeout);
        timerRef.current = {};
    }, []);

    useEffect(() => {
        reset();
    }, [protocol, windowSize, reset]);

    // Handle Packet Logic
    const sendPacket = useCallback((seq: number) => {
        const newPacket: Packet = {
            id: Date.now() + Math.random(),
            seq,
            status: "in-transit",
            type: "data",
            progress: 0
        };
        setPackets(prev => [...prev, newPacket]);
        setTotalSent(prev => prev + 1);
        addLog(`Sent Packet ${seq}`, 'info');

        // Start Timer
        if (!timerRef.current[seq]) {
            timerRef.current[seq] = setTimeout(() => {
                handleTimeout(seq);
            }, timeout / simSpeed);
        }
    }, [timeout, simSpeed]);

    const handleTimeout = (seq: number) => {
        addLog(`Timeout! Packet ${seq} lost or un-acked.`, 'error');
        setRetransmissions(prev => prev + 1);

        if (protocol === "gbn") {
            // Retransmit all from base
            setNextSeqToSend(senderBase);
            addLog(`GBN: Retransmitting window starting from ${senderBase}`, 'error');
        } else {
            // Stop-and-Wait or Selective Repeat: Retransmit specific packet
            setPackets(prev => prev.map(p =>
                p.seq === seq && p.status === "in-transit" ? { ...p, status: "error" } : p
            ));
            sendPacket(seq);
        }
    };

    // Simulation Tick
    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            // Move packets
            setPackets(prev => {
                const next = prev.map(p => ({
                    ...p,
                    progress: p.progress + (2 * simSpeed)
                }));

                // Handle Arrival at Receiver
                next.forEach(p => {
                    if (p.progress >= 50 && p.status === "in-transit" && p.type === "data") {
                        handleDataArrival(p);
                        p.status = "acked"; // Mark as handled locally
                    }
                    if (p.progress >= 100 && p.status === "in-transit" && p.type === "ack") {
                        handleAckArrival(p);
                        p.status = "acked";
                    }
                });

                return next.filter(p => p.progress < 100);
            });

            // Try to send next packet if window allows
            const currentWindowSize = protocol === "sw" ? 1 : windowSize;
            if (nextSeqToSend < senderBase + currentWindowSize && isRunning) {
                sendPacket(nextSeqToSend);
                setNextSeqToSend(prev => prev + 1);
            }

        }, 50);

        return () => clearInterval(interval);
    }, [isRunning, simSpeed, nextSeqToSend, senderBase, windowSize, protocol, sendPacket]);

    const handleDataArrival = (p: Packet) => {
        if (protocol === "sr") {
            if (!receivedPackets.includes(p.seq)) {
                setReceivedPackets(prev => [...prev, p.seq].sort((a, b) => a - b));
                sendAck(p.seq);
            }
        } else {
            // SW and GBN: Expect sequential
            if (p.seq === receiverExpected) {
                setReceiverExpected(prev => prev + 1);
                setReceivedPackets(prev => [...prev, p.seq]);
                sendAck(p.seq);
                addLog(`Received Packet ${p.seq}. Sending ACK ${p.seq + 1}`, 'success');
            } else {
                addLog(`Out of order! Expected ${receiverExpected}, got ${p.seq}. Discarding.`, 'error');
                // In GBN, sender would re-send last successful ACK
                if (protocol === "gbn" && receiverExpected > 0) {
                    sendAck(receiverExpected - 1);
                }
            }
        }
    };

    const sendAck = (seq: number) => {
        const ackPacket: Packet = {
            id: Date.now() + Math.random(),
            seq: protocol === "sr" ? seq : seq + 1, // GBN/SW usually ack next expected
            status: "in-transit",
            type: "ack",
            progress: 50
        };
        setPackets(prev => [...prev, ackPacket]);
    };

    const handleAckArrival = (p: Packet) => {
        if (protocol === "sr") {
            const seq = p.seq;
            if (timerRef.current[seq]) {
                clearTimeout(timerRef.current[seq]);
                delete timerRef.current[seq];
            }
            if (p.seq === senderBase) {
                setSenderBase(prev => prev + 1);
                addLog(`ACK ${p.seq} received. Sliding Window!`, 'success');
            }
        } else {
            // Cumulative ACK for GBN/SW
            const ackNum = p.seq;
            if (ackNum > senderBase) {
                // Clear timers for all up to ackNum-1
                for (let i = senderBase; i < ackNum; i++) {
                    if (timerRef.current[i]) {
                        clearTimeout(timerRef.current[i]);
                        delete timerRef.current[i];
                    }
                }
                setSenderBase(ackNum);
                addLog(`ACK ${ackNum} received. Base is now ${ackNum}`, 'success');
            }
        }
    };

    const injectError = () => {
        setPackets(prev => {
            const dataPackets = prev.filter(p => p.type === "data" && p.status === "in-transit");
            if (dataPackets.length === 0) return prev;
            const target = dataPackets[Math.floor(Math.random() * dataPackets.length)];
            if (!target) return prev;
            addLog(`INJECTED ERROR: Packet ${target.seq} lost!`, 'error');
            return prev.map(p => p.id === target.id ? { ...p, status: "lost" } : p);
        });
    };

    const quizQuestions = [
        {
            q: "What is the maximum window size for Stop & Wait?",
            options: ["1", "Unlimited", "Sequence Number / 2", "2^n"],
            correct: 0
        },
        {
            q: "In Go-Back-N, if window size is 4 and packet 2 is lost, which packets are retransmitted?",
            options: ["Only 2", "2, 3, 4, 5", "All packets sent so far", "None, GBN doesn't retransmit"],
            correct: 1
        },
        {
            q: "Which protocol uses 'Negative Acknowledgments' (NACKs)?",
            options: ["Stop & Wait", "Go-Back-N", "Selective Repeat", "All of these"],
            correct: 2
        },
        {
            q: "In Selective Repeat, if Seq range is 0-7, what is the max window size?",
            options: ["7", "8", "4", "1"],
            correct: 2
        },
        {
            q: "Cumulative ACKs are primarily used in which protocol?",
            options: ["Stop & Wait", "Go-Back-N", "Selective Repeat", "ALOHA"],
            correct: 1
        }
    ];

    return (
        <div className="flex flex-col h-full bg-[#f0f4f8] overflow-hidden">
            {/* Header Tabs */}
            <div className="flex bg-white border-b px-8 pt-4 gap-12 shadow-sm">
                {["simulation", "logic", "quiz"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`pb-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all border-b-4 ${activeTab === tab
                            ? "border-blue-600 text-blue-700"
                            : "border-transparent text-slate-400 hover:text-slate-600"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-auto p-6">
                {activeTab === "simulation" && (
                    <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
                        {/* Control Panel */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[3rem] border border-white shadow-2xl space-y-10">
                                <div>
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <Layers className="h-4 w-4 text-blue-500" />
                                        Configuration
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 gap-2">
                                            {[
                                                { id: 'sw', label: 'Stop & Wait', color: 'blue' },
                                                { id: 'gbn', label: 'Go-Back-N', color: 'indigo' },
                                                { id: 'sr', label: 'Selective Repeat', color: 'emerald' }
                                            ].map(opt => (
                                                <button
                                                    key={opt.id}
                                                    onClick={() => setProtocol(opt.id as any)}
                                                    className={`p-3 rounded-2xl text-[10px] font-bold text-left transition-all border-2 ${protocol === opt.id
                                                        ? `border-${opt.color}-500 bg-${opt.color}-50 text-${opt.color}-700 shadow-md transform scale-105`
                                                        : "border-slate-100 bg-white text-slate-500 hover:border-slate-300"
                                                        }`}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {protocol !== 'sw' && (
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-black text-slate-400 uppercase">Window Size</span>
                                                <span className="text-xs font-bold text-blue-600">{windowSize}</span>
                                            </div>
                                            <Slider value={[windowSize]} min={2} max={8} step={1} onValueChange={(v) => setWindowSize(v[0]!)} />
                                        </div>
                                    )}

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black text-slate-400 uppercase">Sim Speed</span>
                                            <span className="text-xs font-bold text-blue-600">{simSpeed}x</span>
                                        </div>
                                        <Slider value={[simSpeed * 10]} min={5} max={30} step={5} onValueChange={(v) => setSimSpeed(v[0]! / 10)} />
                                    </div>
                                </div>

                                <div className="pt-4 space-y-3">
                                    <Button
                                        className={`w-full rounded-3xl h-14 text-xs font-black uppercase tracking-widest ${isRunning ? "bg-rose-500 hover:bg-rose-600" : "bg-blue-600 hover:bg-blue-700"} shadow-xl transition-all hover:scale-[1.02]`}
                                        onClick={() => setIsRunning(!isRunning)}
                                    >
                                        {isRunning ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
                                        {isRunning ? "Halt Lab" : "Initiate Lab"}
                                    </Button>
                                    <Button variant="ghost" className="w-full rounded-3xl text-slate-400" onClick={reset}>
                                        <RotateCcw className="mr-2 h-4 w-4" /> Reset System
                                    </Button>
                                </div>
                            </div>

                            {/* Live Stats */}
                            <div className="bg-slate-900 text-white p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[80px] rounded-full -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-all duration-700"></div>
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Real-time Telemetry</h4>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-[8px] text-blue-400/70 font-black uppercase">Efficiency</p>
                                        <p className="text-2xl font-bold font-mono">
                                            {totalSent > 0 ? (Math.max(0, (senderBase / totalSent) * 100)).toFixed(1) : "0.0"}%
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[8px] text-rose-400/70 font-black uppercase">Retries</p>
                                        <p className="text-2xl font-bold font-mono text-rose-400">{retransmissions}</p>
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <div className="flex justify-between text-[8px] text-slate-500 font-black uppercase">
                                            <span>Link Utilization</span>
                                            <span>{Math.min(100, (packets.length * 10)).toFixed(0)}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${Math.min(100, (packets.length * 10))}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Simulation Stage */}
                        <div className="lg:col-span-3 space-y-6 flex flex-col h-full">
                            <div className="bg-white rounded-[3.5rem] p-10 flex-1 border border-slate-200 shadow-inner relative overflow-hidden flex flex-col justify-between">
                                {/* Error Injection Button */}
                                <Button
                                    size="sm"
                                    onClick={injectError}
                                    disabled={!isRunning}
                                    className="absolute top-8 right-8 bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 rounded-2xl text-[9px] font-black uppercase px-4"
                                >
                                    <Zap className="h-3 w-3 mr-1" /> Inject Packet Loss
                                </Button>

                                {/* Sender Area */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-blue-100 rounded-2xl text-blue-600"><Monitor /></div>
                                            <div>
                                                <h4 className="text-xs font-black text-slate-800">Sender Node</h4>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase">Window: {senderBase} - {senderBase + (protocol === "sw" ? 0 : windowSize - 1)}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-1.5">
                                            {Array.from({ length: 15 }).map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`w-6 h-8 flex items-center justify-center rounded-lg text-[10px] font-black transition-all border-2
                                                        ${i >= senderBase && i < senderBase + (protocol === 'sw' ? 1 : windowSize) ? 'bg-blue-600 border-blue-600 text-white shadow-lg' :
                                                            i < senderBase ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-white border-slate-100 text-slate-200'}
                                                        ${i === nextSeqToSend ? 'animate-pulse scale-110 shadow-blue-200' : ''}
                                                    `}
                                                >
                                                    {i}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="h-0.5 w-full bg-slate-100 rounded-full relative">
                                        <div
                                            className="absolute h-full bg-blue-400/30 transition-all duration-500 rounded-full"
                                            style={{
                                                left: `${(senderBase / 15) * 100}%`,
                                                width: `${((protocol === 'sw' ? 1 : windowSize) / 15) * 100}%`
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Transmission Channel */}
                                <div className="h-[300px] w-full relative bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 mx-auto max-w-[90%] overflow-hidden flex items-center">
                                    {/* Central Line */}
                                    <div className="absolute w-full h-px bg-slate-200 top-1/2 -translate-y-1/2"></div>

                                    {/* Packets */}
                                    {packets.map(p => (
                                        <div
                                            key={p.id}
                                            className={`absolute transition-all duration-100 ease-linear flex flex-col items-center gap-2
                                                ${p.status === 'lost' ? 'opacity-0 scale-0 pointer-events-none' : 'opacity-100'}
                                            `}
                                            style={{
                                                left: `${p.type === 'data' ? p.progress * 1.8 + 10 : (100 - p.progress) * 1.8 + 10}%`,
                                                top: p.type === 'data' ? '20%' : '60%',
                                                transform: 'translate(-50%, -50%)'
                                            }}
                                        >
                                            <div className={`
                                                px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg border-2
                                                ${p.type === 'data' ? 'bg-white border-blue-500 text-blue-700' : 'bg-emerald-600 border-emerald-400 text-white'}
                                            `}>
                                                {p.type === 'data' ? <Send className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                                                <span className="text-[10px] font-black">{p.type === 'data' ? `DP-${p.seq}` : `ACK-${p.seq}`}</span>
                                            </div>
                                            {p.status === 'error' && <Zap className="h-4 w-4 text-rose-500 animate-ping" />}
                                        </div>
                                    ))}

                                    {/* Channel Decoration */}
                                    <div className="absolute inset-x-0 bottom-4 flex justify-around opacity-30 select-none pointer-events-none">
                                        <ArrowRightLeft className="text-slate-300 h-12 w-12" />
                                        <ArrowRightLeft className="text-slate-300 h-12 w-12 rotate-180" />
                                    </div>
                                </div>

                                {/* Receiver Area */}
                                <div className="space-y-6">
                                    <div className="h-0.5 w-full bg-slate-100 rounded-full"></div>
                                    <div className="flex items-center justify-between px-4">
                                        <div className="flex gap-1.5">
                                            {Array.from({ length: 15 }).map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`w-6 h-8 flex items-center justify-center rounded-lg text-[10px] font-black transition-all border-2
                                                        ${receivedPackets.includes(i) ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg' :
                                                            i === receiverExpected ? 'bg-white border-orange-400 text-orange-600 animate-pulse' : 'bg-white border-slate-100 text-slate-200'}
                                                    `}
                                                >
                                                    {i}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-3 text-right">
                                            <div>
                                                <h4 className="text-xs font-black text-slate-800">Receiver Node</h4>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase">Expected: {receiverExpected}</p>
                                            </div>
                                            <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600"><Monitor /></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Console Log */}
                            <div className="bg-white rounded-[2rem] p-6 border border-slate-200 h-40 overflow-hidden flex flex-col gap-3">
                                <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Activity className="h-3 w-3 text-slate-400" />
                                    Protocol Log
                                </h5>
                                <div className="space-y-1.5 overflow-y-auto pr-2">
                                    {log.map((entry, i) => (
                                        <div key={i} className={`text-[10px] font-bold flex items-center gap-2 animate-in slide-in-from-left-2 transition-all duration-300 ${entry.type === 'error' ? 'text-rose-600' : entry.type === 'success' ? 'text-emerald-600' : 'text-slate-600'
                                            }`}>
                                            {entry.type === 'error' ? <XCircle className="h-3 w-3" /> : entry.type === 'success' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                                            {entry.msg}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "logic" && (
                    <div className="max-w-4xl mx-auto space-y-12 py-10">
                        <h2 className="text-3xl font-black text-slate-800 text-center">Protocol Decision Logic</h2>
                        <div className="grid grid-cols-1 gap-6">
                            {[
                                {
                                    name: "Stop & Wait ARQ",
                                    logic: "Simple half-duplex. Send 1 packet. Wait for ACK. If timeout, resend 1. Efficiency: Link Utilization Is Low.",
                                    complexity: "Low",
                                    icon: <RefreshCw />,
                                    color: "blue"
                                },
                                {
                                    name: "Go-Back-N (GBN)",
                                    logic: "Full-duplex windowing. Send N packets. Uses Cumulative ACKs. If packet <i>i</i> fails, ALL packets from <i>i</i> to <i>i+window</i> are resent.",
                                    complexity: "Medium",
                                    icon: <RotateCcw />,
                                    color: "indigo"
                                },
                                {
                                    name: "Selective Repeat (SR)",
                                    logic: "Most efficient. Only lost packets are resent. Requires receiver-side buffering and sorting. Uses individual ACKs.",
                                    complexity: "High",
                                    icon: <CheckCircle2 />,
                                    color: "emerald"
                                }
                            ].map((p, i) => (
                                <div key={i} className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-xl flex items-center gap-8">
                                    <div className={`p-6 bg-${p.color}-100 rounded-[2rem] text-${p.color}-600`}>{p.icon}</div>
                                    <div className="flex-1 space-y-2">
                                        <h3 className="font-bold text-xl">{p.name}</h3>
                                        <p className="text-sm text-slate-500" dangerouslySetInnerHTML={{ __html: p.logic }} />
                                        <div className="pt-2">
                                            <span className="text-[10px] font-black uppercase text-slate-400 mr-2">Implementation Complexity:</span>
                                            <span className={`text-[10px] font-black uppercase text-${p.color}-600 px-3 py-1 bg-${p.color}-50 rounded-full`}>{p.complexity}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === "quiz" && (
                    <div className="p-8 max-w-3xl mx-auto">
                        <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-2xl overflow-hidden">
                            <div className="bg-blue-600 p-12 text-white relative">
                                <div className="absolute top-0 right-0 p-10 opacity-20"><HelpCircle size={100} /></div>
                                <h2 className="text-4xl font-black tracking-tighter mb-4 italic">Theory Challenge</h2>
                                <p className="text-blue-100 font-bold opacity-80 uppercase tracking-widest text-xs">Verify your knowledge of Sliding Window mechanisms.</p>
                            </div>

                            <div className="p-12 space-y-12">
                                {quizQuestions.map((q, qIdx) => (
                                    <div key={qIdx} className="space-y-6">
                                        <h4 className="font-bold text-slate-800 flex gap-5">
                                            <span className="text-blue-100 text-2xl font-black">{qIdx + 1}</span>
                                            {q.q}
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-12">
                                            {q.options.map((opt, oIdx) => (
                                                <button
                                                    key={oIdx}
                                                    disabled={showResults}
                                                    onClick={() => setQuizAnswers({ ...quizAnswers, [qIdx]: oIdx })}
                                                    className={`p-5 text-left text-sm rounded-3xl border-2 transition-all ${quizAnswers[qIdx] === oIdx
                                                        ? showResults
                                                            ? oIdx === q.correct
                                                                ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                                                                : "border-rose-500 bg-rose-50 text-rose-800"
                                                            : "border-blue-600 bg-blue-50 text-blue-700 font-bold shadow-md"
                                                        : "border-slate-100 bg-white text-slate-500 hover:border-slate-300"
                                                        } ${showResults && oIdx === q.correct ? "border-emerald-500 bg-emerald-50 shadow-sm" : ""}`}
                                                >
                                                    {opt}
                                                    {showResults && oIdx === q.correct && (
                                                        <CheckCircle2 className="inline ml-2 h-4 w-4 text-emerald-500" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                <div className="pt-8 border-t flex flex-col items-center gap-6">
                                    {!showResults ? (
                                        <Button
                                            className="w-full h-16 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-blue-200 shadow-xl disabled:opacity-50"
                                            onClick={() => setShowResults(true)}
                                            disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                                        >
                                            Complete Assessment
                                        </Button>
                                    ) : (
                                        <div className="flex flex-col items-center gap-6 w-full">
                                            <div className="text-center p-8 bg-blue-50 rounded-[2rem] border border-blue-100 w-full">
                                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-2">Assessment Results</p>
                                                <p className="text-5xl font-black text-blue-600">
                                                    {Object.entries(quizAnswers).filter(([idx, ans]) => {
                                                        const q = quizQuestions[Number(idx)];
                                                        return q ? ans === q.correct : false;
                                                    }).length} / {quizQuestions.length}
                                                </p>
                                                <p className="text-xs text-blue-400 mt-2 font-bold uppercase tracking-widest">
                                                    {Object.entries(quizAnswers).filter(([idx, ans]) => {
                                                        const q = quizQuestions[Number(idx)];
                                                        return q ? ans === q.correct : false;
                                                    }).length === quizQuestions.length
                                                        ? "Elite Mastery Achieved!"
                                                        : "Review the logic and retry."}
                                                </p>
                                            </div>
                                            <Button variant="outline" className="h-14 px-12 rounded-[1.5rem] border-2 font-bold" onClick={() => { setShowResults(false); setQuizAnswers({}); }}>
                                                Retry Assessment
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Status Bar */}
            <div className="bg-slate-900 px-8 py-3 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.3em]">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-blue-400">
                        <div className={`w-2 h-2 rounded-full ${isRunning ? "bg-blue-400 animate-pulse shadow-[0_0_8px_rgba(96,165,250,0.8)]" : "bg-slate-700"}`} />
                        {protocol.toUpperCase()} Engine Active
                    </div>
                    <span className="text-slate-700">|</span>
                    <span className="text-slate-500">Flow Control Simulation Phase 1.0</span>
                </div>
                <div className="text-slate-600 flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Layer 2 Reliability Lab
                </div>
            </div>
        </div>
    );
}
