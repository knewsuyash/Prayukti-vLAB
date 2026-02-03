"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
    Activity, Play, Pause, RotateCcw, Monitor, Zap,
    ArrowRightLeft, Circle, Database, BarChart3, HelpCircle,
    CheckCircle2, AlertTriangle, ArrowRight, Layout, Info,
    FileText, Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { LabMode, LAB_MODES } from "@/lib/labs/modes";

const TOPOLOGY_CHARACTERISTICS = {
    ring: {
        name: "Ring (IEEE 802.5)",
        throughput: 85,
        delay: 40,
        reliability: 60,
        cost: 50,
        setup: 60,
        pros: ["Deterministic wait time", "Efficient under heavy load"],
        cons: ["Single point of failure (break in ring)", "Difficult to reconfigure"],
        bestFor: "Token Ring LANs, Industrial Automation"
    },
    bus: {
        name: "Bus (IEEE 802.4)",
        throughput: 60,
        delay: 70,
        reliability: 40,
        cost: 90,
        setup: 90,
        pros: ["Low cost", "Simple to install"],
        cons: ["Heavy load causes delay", "Fault isolation is hard"],
        bestFor: "Small Networks, Heritage Systems"
    },
    star: {
        name: "Star",
        throughput: 90,
        delay: 20,
        reliability: 80,
        cost: 60,
        setup: 80,
        pros: ["Easy setup", "Fault isolated to one leg"],
        cons: ["Hub failure kills network", "High cabling requirement"],
        bestFor: "Home/Office LANs"
    },
    mesh: {
        name: "Mesh",
        throughput: 98,
        delay: 10,
        reliability: 95,
        cost: 20,
        setup: 30,
        pros: ["Extremely robust", "High privacy/security"],
        cons: ["Very expensive", "Massive cabling complexity"],
        bestFor: "Backbone Networks, Military, Critical Infrastructure"
    },
    hybrid: {
        name: "Hybrid",
        throughput: 80,
        delay: 30,
        reliability: 85,
        cost: 40,
        setup: 40,
        pros: ["Scalable", "Flexible design"],
        cons: ["Complex configuration", "Maintenance intensive"],
        bestFor: "Enterprises, Large Campus Networks"
    }
};

// --- Types ---
interface Node {
    id: number;
    x: number;
    y: number;
    state: "idle" | "requesting" | "transmitting" | "holding" | "failed";
    hasToken: boolean;
    waitingTime: number;
    priority: number;
    type: "pc" | "hub"; // Added for Star topology
}

interface Edge {
    from: number;
    to: number;
}

interface StatData {
    avgDelay: number;
    throughput: number;
    efficiency: number;
    fairnessIndex: number;
    totalTransmissions: number;
    channelUtilization: number;
}

interface HistoryPoint {
    time: number;
    throughput: number;
    efficiency: number;
    nodeCount: number;
}

// --- Component ---
export default function TokenProtocolsSimulation({ labMode = "LEARNING" }: { labMode?: LabMode }) {
    const context = LAB_MODES[labMode];
    // Simulation State
    const [mode, setMode] = useState<"ring" | "bus" | "star" | "mesh" | "hybrid">("ring");
    const [nodeCount, setNodeCount] = useState(6);
    const [packetSize, setPacketSize] = useState(256);
    const [simSpeed, setSimSpeed] = useState(1);
    const [isRunning, setIsRunning] = useState(false);
    const [isStepMode, setIsStepMode] = useState(false);
    const [tokenHoldingTime, setTokenHoldingTime] = useState(2000);

    // Core Logic State
    const [nodes, setNodes] = useState<Node[]>([]);
    const [tokenPos, setTokenPos] = useState(0);
    const [isTokenLost, setIsTokenLost] = useState(false);
    const [activeTransmission, setActiveTransmission] = useState<{
        from: number,
        to: number,
        progress: number,
        isReturning: boolean
    } | null>(null);
    const [stats, setStats] = useState<StatData>({
        avgDelay: 0, throughput: 0, efficiency: 0, fairnessIndex: 1, totalTransmissions: 0, channelUtilization: 0
    });
    const [history, setHistory] = useState<HistoryPoint[]>([]);
    const [time, setTime] = useState(0);
    const [activeTab, setActiveTab] = useState<"simulation" | "comparison" | "quiz">("simulation");
    const [logs, setLogs] = useState<{ msg: string, type: 'info' | 'error' | 'success' }[]>([]);

    // Advanced Topology State
    const [edges, setEdges] = useState<Edge[]>([]);
    const [isDesignerMode, setIsDesignerMode] = useState(false);
    const [draggedNode, setDraggedNode] = useState<number | null>(null);
    const [connectSource, setConnectSource] = useState<number | null>(null);
    const [designerTool, setDesignerTool] = useState<"move" | "connect">("move");

    // Quiz State
    const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
    const [showResults, setShowResults] = useState(false);

    // Comparison Selection State
    const [compTopologyA, setCompTopologyA] = useState<"ring" | "bus" | "star" | "mesh" | "hybrid">("ring");
    const [compTopologyB, setCompTopologyB] = useState<"bus" | "ring" | "star" | "mesh" | "hybrid">("bus");

    // Initialization
    useEffect(() => {
        const radius = 140; // Reduced from 180 for more compact layout
        const centerX = 350;
        const centerY = 250;

        let newNodes: Node[] = [];
        let newEdges: Edge[] = [];

        if (mode === "ring") {
            newNodes = Array.from({ length: nodeCount }).map((_, i) => {
                const angle = (i / nodeCount) * 2 * Math.PI;
                return {
                    id: i + 1,
                    x: centerX + radius * Math.cos(angle),
                    y: centerY + radius * Math.sin(angle),
                    state: "idle" as "idle",
                    hasToken: i === 0,
                    waitingTime: 0,
                    priority: Math.floor(Math.random() * 3),
                    type: "pc" as "pc"
                };
            });
            // Implicit Ring Edges
            newEdges = newNodes.map((_, i) => ({ from: i, to: (i + 1) % nodeCount }));
        } else if (mode === "bus") {
            newNodes = Array.from({ length: nodeCount }).map((_, i) => ({
                id: i + 1,
                x: 100 + (i * (500 / (nodeCount - 1))),
                y: 200 + (i % 2 === 0 ? -60 : 60),
                state: "idle" as "idle",
                hasToken: i === 0,
                waitingTime: 0,
                priority: Math.floor(Math.random() * 3),
                type: "pc" as "pc"
            }));
        } else if (mode === "star") {
            // Central Hub
            newNodes = [
                { id: 0, x: centerX, y: centerY, state: "idle" as "idle", hasToken: false, waitingTime: 0, priority: 0, type: "hub" as "hub" },
                ...Array.from({ length: nodeCount }).map((_, i) => {
                    const angle = (i / nodeCount) * 2 * Math.PI;
                    return {
                        id: i + 1,
                        x: centerX + radius * Math.cos(angle),
                        y: centerY + radius * Math.sin(angle),
                        state: "idle" as "idle",
                        hasToken: i === 0,
                        waitingTime: 0,
                        priority: Math.floor(Math.random() * 3),
                        type: "pc" as "pc"
                    };
                })
            ];
            // Connect everyone to Hub (id 0)
            newEdges = Array.from({ length: nodeCount }).map((_, i) => ({ from: i + 1, to: 0 }));
        } else if (mode === "mesh") {
            newNodes = Array.from({ length: nodeCount }).map((_, i) => {
                const angle = (i / nodeCount) * 2 * Math.PI;
                return {
                    id: i + 1,
                    x: centerX + radius * Math.cos(angle),
                    y: centerY + radius * Math.sin(angle),
                    state: "idle" as "idle",
                    hasToken: i === 0,
                    waitingTime: 0,
                    priority: Math.floor(Math.random() * 3),
                    type: "pc" as "pc"
                };
            });
            // Fully Connect
            for (let i = 0; i < nodeCount; i++) {
                for (let j = i + 1; j < nodeCount; j++) {
                    newEdges.push({ from: i, to: j });
                }
            }
        }

        if (mode === "hybrid") {
            // If the user explicitly switched to hybrid, we want them to stay in designer mode
            // We only provide the default if they are entering hybrid for the first time or if it's completely empty
            const hasPC = nodes.some(n => n.type === "pc");
            const hasHub = nodes.some(n => n.type === "hub");

            if (nodes.length === 0) {
                // Initialize with a simple starting point if empty
                setNodes([
                    { id: 0, x: 350, y: 250, state: "idle", hasToken: true, waitingTime: 0, priority: 1, type: "pc" }
                ]);
                setTokenPos(0);
                setIsDesignerMode(true);
            } else if (!hasPC && hasHub) {
                // If only hubs exist, ensure we don't crash
                setTokenPos(0);
            } else if (hasPC && !nodes.some(n => n.hasToken)) {
                // Ensure a token exists on a PC
                const firstPC = nodes.findIndex(n => n.type === "pc");
                if (firstPC !== -1) {
                    setNodes(prev => prev.map((n, i) => i === firstPC ? { ...n, hasToken: true } : n));
                    setTokenPos(firstPC);
                }
            }
            return;
        }

        setNodes(newNodes);
        setEdges(newEdges);
        setTokenPos(mode === "star" ? 1 : 0);
        setIsTokenLost(false);
        setActiveTransmission(null);
    }, [nodeCount, mode]);

    // Helper: Add to Logs
    const addLog = (msg: string, type: 'info' | 'error' | 'success' = 'info') => {
        setLogs(prev => [{ msg, type }, ...prev].slice(0, 5));
    };

    // Simulation Loop
    const tick = useCallback(() => {
        if (!isRunning || isTokenLost) return;

        setTime(prev => {
            const newTime = prev + 1;

            // Periodic History Updates for Graphs
            if (newTime % 20 === 0) {
                setStats(s => {
                    setHistory(h => [...h, { time: newTime, throughput: s.throughput, efficiency: s.efficiency, nodeCount }].slice(-20));
                    return s;
                });
            }

            return newTime;
        });

        setNodes(prevNodes => {
            const nextNodes = [...prevNodes];
            const currentNode = nextNodes[tokenPos];

            if (!currentNode || currentNode.state === "failed") {
                // Skip failed node or pass token
                setTokenPos(prev => (prev + 1) % nextNodes.length);
                return prevNodes;
            }

            // Waiting Time Tracking
            nextNodes.forEach(n => {
                if (n.state === "idle" && n.id !== nodes[tokenPos]?.id) {
                    n.waitingTime += 0.1;
                }
            });

            // If node is currently transmitting
            if (activeTransmission) {
                const nextProgress = activeTransmission.progress + (5 * simSpeed);

                if (nextProgress >= 100) {
                    // One leg of journey complete
                    if (mode === "ring" && !activeTransmission.isReturning) {
                        // Frame reached destination, now must travel back to source (Source Stripping)
                        setActiveTransmission({ ...activeTransmission, progress: 0, isReturning: true });
                        addLog(`Frame reached destination. Returning to PC-${nodes[activeTransmission.from]?.id} for stripping.`, 'info');
                        return nextNodes;
                    }

                    // Transmission Fully Complete (or Bus reached dest)
                    setActiveTransmission(null);
                    setStats(s => {
                        const newTotal = s.totalTransmissions + 1;
                        // Calculate bits per tick-equivalent (approximate for visualization)
                        const newThroughput = (newTotal * packetSize * 10) / (time + 1);

                        // Efficiency Calculation: Ratio of transmission time vs total time
                        const activeTicks = newTotal * (mode === "ring" ? 40 : 20);
                        const newEfficiency = Math.min(98, (activeTicks / (time + 1)) * 100);

                        return {
                            ...s,
                            totalTransmissions: newTotal,
                            throughput: newThroughput,
                            efficiency: newEfficiency,
                            channelUtilization: Math.min(100, (newTotal / (time + 1)) * 500)
                        };
                    });

                    addLog(`PC-${nodes[activeTransmission.from]?.id} stripped frame. Releasing token.`, 'success');

                    // Token Passing Logic: In Star mode, token visits Hub between PCs
                    let nextTokenPos = (tokenPos + 1) % nodes.length;

                    // If we just finished a transmission from a PC, next logically "visits" hub? 
                    // No, usually in Star, Hub is just a physical path. 
                    // To satisfy "hub se hoke pass ho", we should ensure the animation or sequence involves it.
                    // Let's make the hub part of the logical rotation if user insists, 
                    // OR just fix the animation. The user said "token jo pass ho rha hai", 
                    // which could mean the passing animation.

                    setTokenPos(nextTokenPos);

                    return nextNodes.map((n, i) => ({
                        ...n,
                        state: n.state === "failed" ? "failed" : "idle",
                        hasToken: i === nextTokenPos
                    }));
                } else {
                    setActiveTransmission(prev => prev ? { ...prev, progress: nextProgress } : null);
                    return nextNodes;
                }
            }

            // Decide if current node wants to transmit
            if (currentNode.hasToken && !activeTransmission) {
                const wantsToTransmit = Math.random() < 0.4;
                if (wantsToTransmit) {
                    const pcNodes = nextNodes.filter(n => n.type === "pc" && n.id !== currentNode.id);
                    const targetNode = pcNodes.length > 0 ? pcNodes[Math.floor(Math.random() * pcNodes.length)] : null;

                    if (targetNode) {
                        const targetIndex = nextNodes.findIndex(n => n.id === targetNode.id);
                        setActiveTransmission({ from: tokenPos, to: targetIndex, progress: 0, isReturning: false });
                        addLog(`PC-${currentNode.id} initiated transmission to PC-${targetNode.id}`, 'info');
                    } else {
                        // Pass token if no targets
                        let nextTokenPos = (tokenPos + 1) % nextNodes.length;
                        setTokenPos(nextTokenPos);
                    }
                    return nextNodes.map((n, i) => ({
                        ...n,
                        state: i === tokenPos && pcNodes.length > 0 ? "transmitting" : (n.state === "failed" ? "failed" : "idle")
                    }));
                } else {
                    // No data, pass token
                    // No data, pass token
                    const nextTokenPos = (tokenPos + 1) % nextNodes.length;
                    setTokenPos(nextTokenPos);
                    return nextNodes.map((n, i) => ({
                        ...n,
                        state: n.state === "failed" ? "failed" : "idle",
                        hasToken: i === nextTokenPos
                    }));
                }
            }

            return nextNodes;
        });
    }, [isRunning, isTokenLost, tokenPos, activeTransmission, nodeCount, simSpeed, time, mode, packetSize]);

    const injectFault = (type: 'node' | 'token') => {
        if (type === 'token') {
            setIsTokenLost(true);
            addLog("CRITICAL: Token Lost! System Halted.", "error");
        } else {
            const idleNodes = nodes.filter(n => n.state !== "failed" && !n.hasToken);
            if (idleNodes.length === 0) return;
            const target = idleNodes[Math.floor(Math.random() * idleNodes.length)];
            setNodes(prev => prev.map(n => n.id === target?.id ? { ...n, state: "failed" } : n));
            addLog(`FAULT: Node PC-${target?.id} failed!`, "error");
        }
    };

    const handleMouseDown = (nodeId: number) => {
        if (mode === "hybrid" && isDesignerMode) {
            if (designerTool === "move") {
                setDraggedNode(nodeId);
                addLog(`Moving PC-${nodeId}`, "info");
            } else if (designerTool === "connect") {
                if (connectSource === null) {
                    setConnectSource(nodeId);
                    addLog(`Source Selected: PC-${nodeId}. Select target PC to connect.`, "info");
                } else if (connectSource === nodeId) {
                    setConnectSource(null);
                } else {
                    // Create connection
                    const edgeExists = edges.some(e =>
                        (e.from === connectSource && e.to === nodeId) ||
                        (e.from === nodeId && e.to === connectSource)
                    );

                    if (!edgeExists) {
                        setEdges([...edges, { from: connectSource, to: nodeId }]);
                        addLog(`Connected PC-${connectSource} to PC-${nodeId}`, "success");
                    }
                    setConnectSource(null);
                }
            }
        }
    };

    const handleStageClick = (e: React.MouseEvent<SVGSVGElement>) => {
        // No longer using click-to-place, using mouseup
    };

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        if (draggedNode === null || mode !== "hybrid" || !isDesignerMode) return;

        const svg = e.currentTarget;
        const point = svg.createSVGPoint();
        point.x = e.clientX;
        point.y = e.clientY;
        const cursorPoint = point.matrixTransform(svg.getScreenCTM()?.inverse());

        if (cursorPoint) {
            setNodes(prev => prev.map(n =>
                n.id === draggedNode ? { ...n, x: cursorPoint.x, y: cursorPoint.y } : n
            ));
        }
    };

    const handleMouseUp = () => {
        if (draggedNode !== null) {
            setDraggedNode(null);
            addLog("Node position updated", "success");
        }
    };

    useEffect(() => {
        const interval = setInterval(tick, 100 / simSpeed);
        return () => clearInterval(interval);
    }, [tick, simSpeed]);

    const resetSimulation = () => {
        setIsRunning(false);
        setTime(0);
        setStats({ avgDelay: 0, throughput: 0, efficiency: 0, fairnessIndex: 1, totalTransmissions: 0, channelUtilization: 0 });
        setTokenPos(0);
        setHistory([]);
        setActiveTransmission(null);
    };

    // --- State Serialization (for Multiplayer/Exams) ---
    const serializeState = useCallback(() => {
        return JSON.stringify({
            mode,
            nodes,
            edges,
            tokenPos,
            stats,
            time,
            activeTransmission,
            isTokenLost,
            nodeCount
        });
    }, [mode, nodes, edges, tokenPos, stats, time, activeTransmission, isTokenLost, nodeCount]);

    const restoreState = useCallback((stateJson: string) => {
        try {
            const state = JSON.parse(stateJson);
            setMode(state.mode);
            setNodes(state.nodes);
            setEdges(state.edges);
            setTokenPos(state.tokenPos);
            setStats(state.stats);
            setTime(state.time);
            setActiveTransmission(state.activeTransmission);
            setIsTokenLost(state.isTokenLost);
            setNodeCount(state.nodeCount);
            addLog("Simulation state restored successfully", "success");
        } catch (e) {
            addLog("Failed to restore simulation state", "error");
        }
    }, []);

    const quizQuestions = [
        {
            q: "Which protocol uses a logical ring on a physical bus?",
            options: ["IEEE 802.3", "IEEE 802.4", "IEEE 802.5", "IEEE 802.11"],
            correct: 1
        },
        {
            q: "What is 'Source Stripping' in Token Ring?",
            options: ["Destination removes frame", "Token is destroyed", "Sender removes its own returned frame", "Switch clears the ring"],
            correct: 2
        },
        {
            q: "Why is Token Ring called deterministic?",
            options: ["It always fails", "Wait time for access is predictable", "It uses collisions", "It has no speed limit"],
            correct: 1
        },
        {
            q: "What happens in a Token Bus if a node fails?",
            options: ["Whole bus crashes", "Logical ring must be reconstructed", "Collisions start occurring", "Token is lost forever"],
            correct: 1
        },
        {
            q: "Which protocol is generally better for heavy, high-priority industrial traffic?",
            options: ["ALOHA", "CSMA/CD", "Token-based protocols", "Polled access"],
            correct: 2
        }
    ];

    return (
        <div className="flex flex-col h-full bg-[#f8fafc] overflow-hidden">
            {/* Minimalist Tabs */}
            <div className="flex bg-white border-b px-6 pt-2 gap-8 shadow-sm">
                {["simulation", "comparison", "quiz"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`pb-3 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-2 ${activeTab === tab
                            ? "border-cyan-500 text-cyan-600"
                            : "border-transparent text-slate-400 hover:text-slate-600"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-auto">
                {(activeTab === "simulation" || activeTab === "comparison") && (
                    <div className="p-6 max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6">
                        {/* Control Sidebar */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white/70 backdrop-blur-md p-6 rounded-[2.5rem] border border-slate-200 shadow-xl space-y-8">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Layout className="h-4 w-4 text-indigo-500" />
                                    Environment
                                </h3>

                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase">Topology</label>
                                        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl gap-1">
                                            <Button
                                                variant={mode === "ring" ? "default" : "ghost"}
                                                size="sm"
                                                className={`rounded-xl text-[10px] font-bold ${mode === "ring" ? "bg-indigo-600 shadow-md text-white" : ""}`}
                                                onClick={() => setMode("ring")}
                                            >
                                                Ring
                                            </Button>
                                            <Button
                                                variant={mode === "bus" ? "default" : "ghost"}
                                                size="sm"
                                                className={`rounded-xl text-[10px] font-bold ${mode === "bus" ? "bg-amber-600 shadow-md text-white" : ""}`}
                                                onClick={() => setMode("bus")}
                                            >
                                                Bus
                                            </Button>
                                            <Button
                                                variant={mode === "star" ? "default" : "ghost"}
                                                size="sm"
                                                className={`rounded-xl text-[10px] font-bold ${mode === "star" ? "bg-cyan-600 shadow-md text-white" : ""}`}
                                                onClick={() => setMode("star")}
                                            >
                                                Star
                                            </Button>
                                            <Button
                                                variant={mode === "mesh" ? "default" : "ghost"}
                                                size="sm"
                                                className={`rounded-xl text-[10px] font-bold ${mode === "mesh" ? "bg-emerald-600 shadow-md text-white" : ""}`}
                                                onClick={() => setMode("mesh")}
                                            >
                                                Mesh
                                            </Button>
                                            <Button
                                                variant={mode === "hybrid" ? "default" : "ghost"}
                                                size="sm"
                                                className={`col-span-2 rounded-xl text-[10px] font-bold ${mode === "hybrid" ? "bg-slate-800 shadow-md text-white" : ""}`}
                                                onClick={() => { setMode("hybrid"); setIsDesignerMode(true); }}
                                            >
                                                Hybrid (Designer Mode)
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black text-slate-400 uppercase">Nodes</span>
                                            <span className="text-xs font-bold text-indigo-600">{nodeCount}</span>
                                        </div>
                                        <Slider value={[nodeCount]} min={3} max={10} step={1} onValueChange={(v) => setNodeCount(v[0]!)} />
                                    </div>

                                    <div className="pt-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase mb-3 block">Fault Hazards</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Button variant="outline" size="sm" className="rounded-xl text-[9px] font-bold text-rose-600 border-rose-100 bg-rose-50" onClick={() => injectFault('node')}>
                                                Fail Node
                                            </Button>
                                            <Button variant="outline" size="sm" className="rounded-xl text-[9px] font-bold text-rose-600 border-rose-100 bg-rose-50" onClick={() => injectFault('token')}>
                                                Lose Token
                                            </Button>
                                        </div>
                                        {isTokenLost && (
                                            <Button className="w-full mt-2 bg-emerald-600 text-[9px] h-8 rounded-xl" onClick={() => setIsTokenLost(false)}>
                                                Regenerate Token
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-4 space-y-3">
                                    <Button
                                        className={`w-full rounded-[1.5rem] h-12 text-xs font-black uppercase tracking-widest ${isRunning ? "bg-rose-500 hover:bg-rose-600" : "bg-indigo-600 hover:bg-indigo-700"} shadow-lg`}
                                        onClick={() => setIsRunning(!isRunning)}
                                    >
                                        {isRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                                        {isRunning ? "Stop Lab" : "Initiate Lab"}
                                    </Button>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" className={`flex-1 rounded-xl text-[9px] ${isStepMode ? "bg-slate-200" : ""}`} onClick={() => setIsStepMode(!isStepMode)}>
                                            Step Mode
                                        </Button>
                                        <Button variant="ghost" className="flex-1 rounded-xl text-[9px]" onClick={() => tick()}>
                                            Step {">>"}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-900 p-6 rounded-[2.5rem] shadow-2xl h-64 flex flex-col relative overflow-hidden">
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Performance Metrics</h4>
                                    <div className="flex gap-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]"></div>
                                            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter">Throughput</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter">Efficiency</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 relative group">
                                    <svg className="w-full h-full overflow-visible" viewBox="0 0 200 100" preserveAspectRatio="none">
                                        {/* Grid Lines */}
                                        {[25, 50, 75, 100].map(val => (
                                            <g key={val}>
                                                <line x1="0" y1={100 - val} x2="200" y2={100 - val} stroke="#1e293b" strokeWidth="0.5" />
                                                <text x="-5" y={100 - val + 2} textAnchor="end" className="fill-slate-700 text-[6px] font-bold">{val}%</text>
                                            </g>
                                        ))}

                                        {history.length > 1 ? (
                                            <>
                                                <defs>
                                                    <linearGradient id="grad-cyan" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.2" />
                                                        <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                                                    </linearGradient>
                                                    <linearGradient id="grad-emerald" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
                                                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                                                    </linearGradient>
                                                </defs>

                                                {/* Area Fills */}
                                                <path
                                                    d={`M 0,100 L ${history.map((h, i) => `${(i / (history.length - 1)) * 200},${100 - Math.min(90, h.throughput / 20)}`).join(' L ')} L 200,100 Z`}
                                                    fill="url(#grad-cyan)" className="transition-all duration-500"
                                                />
                                                <path
                                                    d={`M 0,100 L ${history.map((h, i) => `${(i / (history.length - 1)) * 200},${100 - Math.min(90, h.efficiency)}`).join(' L ')} L 200,100 Z`}
                                                    fill="url(#grad-emerald)" className="transition-all duration-500"
                                                />

                                                {/* Throughput Path */}
                                                <path
                                                    d={`M ${history.map((h, i) => `${(i / (history.length - 1)) * 200},${100 - Math.min(90, h.throughput / 20)}`).join(' L ')}`}
                                                    fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-500"
                                                />
                                                {/* Efficiency Path */}
                                                <path
                                                    d={`M ${history.map((h, i) => `${(i / (history.length - 1)) * 200},${100 - Math.min(90, h.efficiency)}`).join(' L ')}`}
                                                    fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="4 2" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-500 opacity-80"
                                                />

                                                {/* Final Point Glow */}
                                                <circle cx="200" cy={100 - Math.min(90, (history[history.length - 1]?.throughput || 0) / 20)} r="3" fill="#22d3ee" className="animate-pulse" />
                                            </>
                                        ) : (
                                            <text x="100" y="50" textAnchor="middle" className="fill-slate-700 text-[10px] font-black uppercase tracking-widest">Initializing Telemetry...</text>
                                        )}
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Stage */}
                        <div className="lg:col-span-4 bg-white rounded-[3rem] border border-slate-200 relative overflow-hidden flex flex-col p-8 shadow-inner min-h-[600px]">
                            {mode === "hybrid" && isDesignerMode && (
                                <div className="absolute top-8 right-8 flex flex-col gap-4 z-10">
                                    <div className="flex gap-2 bg-white/80 backdrop-blur p-1 rounded-full border border-slate-200 shadow-sm">
                                        <Button
                                            variant={designerTool === "move" ? "default" : "ghost"}
                                            size="sm"
                                            className="rounded-full h-8 px-4 text-[10px] font-bold"
                                            onClick={() => { setDesignerTool("move"); setConnectSource(null); }}
                                        >Move</Button>
                                        <Button
                                            variant={designerTool === "connect" ? "default" : "ghost"}
                                            size="sm"
                                            className="rounded-full h-8 px-4 text-[10px] font-bold"
                                            onClick={() => { setDesignerTool("connect"); setDraggedNode(null); }}
                                        >Connect</Button>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="rounded-full bg-white/80 backdrop-blur font-bold text-[10px]" onClick={() => {
                                            const newId = nodes.length > 0 ? Math.max(...nodes.map(n => n.id)) + 1 : 0;
                                            setNodes([...nodes, { id: newId, x: 350, y: 250, state: "idle", hasToken: nodes.length === 0, waitingTime: 0, priority: 1, type: "pc" }]);
                                            addLog(`Node PC-${newId} added`, "info");
                                        }}>Add PC</Button>
                                        <Button variant="outline" size="sm" className="rounded-full bg-white/80 backdrop-blur font-bold text-[10px]" onClick={() => {
                                            const newId = nodes.length > 0 ? Math.max(...nodes.map(n => n.id)) + 1 : 0;
                                            setNodes([...nodes, { id: newId, x: 350, y: 250, state: "idle", hasToken: false, waitingTime: 0, priority: 0, type: "hub" }]);
                                            addLog(`Central Hub added`, "info");
                                        }}>Add Hub</Button>
                                        <Button variant="outline" size="sm" className="rounded-full bg-rose-50 border-rose-200 text-rose-600 font-bold text-[10px]" onClick={() => {
                                            setNodes([]);
                                            setEdges([]);
                                            setTokenPos(0);
                                            addLog("Canvas Cleared", "error");
                                        }}>Clear</Button>
                                        <Button variant="outline" size="sm" className="rounded-full bg-[#10b981] text-white border-0 hover:bg-[#059669] font-bold text-[10px] ml-4" onClick={() => {
                                            if (edges.length === 0 && nodes.length > 1) {
                                                addLog("Cannot start without connections!", "error");
                                                return;
                                            }
                                            setIsDesignerMode(false);
                                            addLog("Topology Saved. Starting Simulation...", "success");
                                        }}>Start Sim</Button>
                                    </div>
                                </div>
                            )}

                            {activeTab === "comparison" ? (
                                <div className="flex flex-col w-full h-full gap-8 overflow-hidden">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex gap-4">
                                            <div className="flex flex-col">
                                                <label className="text-[10px] font-black text-slate-400 uppercase mb-2">Target Alpha</label>
                                                <select
                                                    value={compTopologyA}
                                                    onChange={(e) => setCompTopologyA(e.target.value as any)}
                                                    className="text-[10px] font-bold bg-slate-100 border-none rounded-lg px-4 py-2 focus:ring-2 ring-indigo-500 cursor-pointer"
                                                >
                                                    <option value="ring">Ring (802.5)</option>
                                                    <option value="bus">Bus (802.4)</option>
                                                    <option value="star">Star</option>
                                                    <option value="mesh">Mesh</option>
                                                    <option value="hybrid">Current Hybrid</option>
                                                </select>
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-[10px] font-black text-slate-400 uppercase mb-2">Target Beta</label>
                                                <select
                                                    value={compTopologyB}
                                                    onChange={(e) => setCompTopologyB(e.target.value as any)}
                                                    className="text-[10px] font-bold bg-slate-100 border-none rounded-lg px-4 py-2 focus:ring-2 ring-amber-500 cursor-pointer"
                                                >
                                                    <option value="ring">Ring (802.5)</option>
                                                    <option value="bus">Bus (802.4)</option>
                                                    <option value="star">Star</option>
                                                    <option value="mesh">Mesh</option>
                                                    <option value="hybrid">Current Hybrid</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Observation metrics for easy side-by-side comparison */}
                                    <div className="bg-slate-50 flex-1 rounded-[3rem] p-8 border border-slate-100 overflow-auto">
                                        <div className="flex items-center gap-3 mb-8">
                                            <div className="h-8 w-1 bg-indigo-500 rounded-full"></div>
                                            <h5 className="font-black text-slate-800 uppercase tracking-widest text-xs">Engineering Parameter Analysis</h5>
                                        </div>

                                        <div className="grid grid-cols-7 gap-6">
                                            {/* Labels Column */}
                                            <div className="col-span-1 flex flex-col pt-12 gap-10">
                                                {["Throughput", "Latency", "Cost-Efficiency", "Fault Tolerance", "Setup Ease"].map(label => (
                                                    <span key={label} className="text-[10px] font-black text-slate-400 uppercase tracking-tighter h-4 flex items-center">{label}</span>
                                                ))}
                                            </div>

                                            {/* Topology Alpha Stats */}
                                            <div className="col-span-3 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                                <div className="flex items-center gap-2 mb-6">
                                                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                                    <span className="text-[10px] font-black text-indigo-500 uppercase">{TOPOLOGY_CHARACTERISTICS[compTopologyA].name}</span>
                                                </div>
                                                <div className="space-y-10">
                                                    {[
                                                        TOPOLOGY_CHARACTERISTICS[compTopologyA].throughput,
                                                        100 - TOPOLOGY_CHARACTERISTICS[compTopologyA].delay,
                                                        TOPOLOGY_CHARACTERISTICS[compTopologyA].cost,
                                                        TOPOLOGY_CHARACTERISTICS[compTopologyA].reliability,
                                                        TOPOLOGY_CHARACTERISTICS[compTopologyA].setup
                                                    ].map((val, idx) => (
                                                        <div key={idx} className="space-y-1.5">
                                                            <div className="flex justify-between items-center text-[9px] font-bold text-slate-500">
                                                                <span>{val}%</span>
                                                            </div>
                                                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                                <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out" style={{ width: `${val}%` }}></div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-8 pt-6 border-t border-slate-50 space-y-4">
                                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">Core Use Case</p>
                                                    <p className="text-xs font-bold text-slate-700">{TOPOLOGY_CHARACTERISTICS[compTopologyA].bestFor}</p>
                                                </div>
                                            </div>

                                            {/* Topology Beta Stats */}
                                            <div className="col-span-3 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                                <div className="flex items-center gap-2 mb-6 text-right justify-end">
                                                    <span className="text-[10px] font-black text-amber-500 uppercase">{TOPOLOGY_CHARACTERISTICS[compTopologyB].name}</span>
                                                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                                </div>
                                                <div className="space-y-10">
                                                    {[
                                                        TOPOLOGY_CHARACTERISTICS[compTopologyB].throughput,
                                                        100 - TOPOLOGY_CHARACTERISTICS[compTopologyB].delay,
                                                        TOPOLOGY_CHARACTERISTICS[compTopologyB].cost,
                                                        TOPOLOGY_CHARACTERISTICS[compTopologyB].reliability,
                                                        TOPOLOGY_CHARACTERISTICS[compTopologyB].setup
                                                    ].map((val, idx) => (
                                                        <div key={idx} className="space-y-1.5">
                                                            <div className="flex justify-between items-center text-[9px] font-bold text-slate-500">
                                                                <span>{val}%</span>
                                                            </div>
                                                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                                <div className="h-full bg-amber-500 rounded-full transition-all duration-1000 ease-out" style={{ width: `${val}%` }}></div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-8 pt-6 border-t border-slate-50 space-y-4 text-right">
                                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">Core Use Case</p>
                                                    <p className="text-xs font-bold text-slate-700">{TOPOLOGY_CHARACTERISTICS[compTopologyB].bestFor}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6 mt-10 p-6 bg-indigo-50/30 rounded-3xl border border-indigo-50">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2">
                                                    <Target className="h-4 w-4 text-indigo-500" />
                                                    <h6 className="text-[10px] font-bold text-indigo-700 uppercase">Alpha Advantages</h6>
                                                </div>
                                                <ul className="text-xs space-y-1">
                                                    {TOPOLOGY_CHARACTERISTICS[compTopologyA].pros.map((p, i) => (
                                                        <li key={i} className="flex items-center gap-2 text-slate-600 font-medium">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div> {p}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2">
                                                    <Target className="h-4 w-4 text-amber-500" />
                                                    <h6 className="text-[10px] font-bold text-amber-700 uppercase">Beta Advantages</h6>
                                                </div>
                                                <ul className="text-xs space-y-1">
                                                    {TOPOLOGY_CHARACTERISTICS[compTopologyB].pros.map((p, i) => (
                                                        <li key={i} className="flex items-center gap-2 text-slate-600 font-medium">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div> {p}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Experiment Observations Section */}
                                        <div className="mt-10 p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="flex items-center gap-3">
                                                    <FileText className="h-5 w-5 text-indigo-500" />
                                                    <h5 className="font-black text-slate-800 uppercase tracking-widest text-xs">Experiment Observations</h5>
                                                </div>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase bg-slate-50 px-3 py-1 rounded-full">Record Results Here</span>
                                            </div>
                                            <textarea
                                                className="w-full h-32 p-4 bg-slate-50 rounded-2xl border-none text-xs font-medium text-slate-600 focus:ring-2 ring-indigo-500 transition-all resize-none"
                                                placeholder="Observations from the current simulation run... (e.g., Star topology demonstrated 90% throughput but total failure during Hub fault injection)"
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                                </div>
                        ) : (
                        <svg
                            className="w-full h-full min-h-[500px] cursor-crosshair"
                            viewBox="0 0 700 500"
                            onClick={handleStageClick}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                        >
                            <SimulationSVGArt
                                mode={mode as any}
                                nodes={nodes}
                                edges={edges}
                                tokenPos={tokenPos}
                                activeTransmission={activeTransmission}
                                width={700} height={500}
                                onNodeMouseDown={handleMouseDown}
                                selectedNodeId={draggedNode}
                                connectSourceId={connectSource}
                            />
                        </svg>
                            )}

                        {/* Log Banner */}
                        <div className="absolute top-8 left-8 space-y-2 max-w-[300px]">
                            {logs.map((log, i) => (
                                <div key={i} className={`p-2 px-4 rounded-xl text-[9px] font-bold shadow-sm flex items-center gap-2 animate-in slide-in-from-left duration-500
                                        ${log.type === 'error' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                                        log.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                            'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                                    {log.type === 'error' ? <AlertTriangle className="h-3 w-3" /> : log.type === 'success' ? <CheckCircle2 className="h-3 w-3" /> : <Info className="h-3 w-3" />}
                                    {log.msg}
                                </div>
                            ))}
                        </div>

                        {/* Legend Overlay */}
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-8 px-8 py-3 bg-white/50 backdrop-blur-md rounded-full border border-slate-200">
                            <LegendItem label="Token" color="bg-amber-500" />
                            <LegendItem label="Data Flow" color="bg-indigo-500" />
                            <LegendItem label="Failed Node" color="bg-rose-500" />
                        </div>
                    </div>
                    </div>
                )}

            {activeTab === "comparison" && (
                <div className="p-8 max-w-5xl mx-auto space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black text-slate-800">Experiment Observations</h2>
                        <Button variant="outline" size="sm" onClick={() => window.print()} className="rounded-xl">
                            Export Results (PDF)
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <StatCard label="Total Transmission Cycles" value={stats.totalTransmissions} icon={<RotateCcw className="text-blue-500" />} />
                        <StatCard label="Peak Throughput" value={`${stats.throughput.toFixed(2)} bps`} icon={<Zap className="text-amber-500" />} />
                        <StatCard label="Time Efficiency" value={`${stats.efficiency.toFixed(1)}%`} icon={<Activity className="text-emerald-500" />} />
                        <StatCard label="Avg Access Delay" value={`${(stats.avgDelay / 10).toFixed(2)} ms`} icon={<Activity className="text-rose-500" />} />
                    </div>

                    <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-xl">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Time Point</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Active Nodes</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Throughput (bps)</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Efficiency (%)</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((h, i) => (
                                    <tr key={i} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-xs font-mono">{h.time} units</td>
                                        <td className="px-6 py-4 text-xs">{h.nodeCount}</td>
                                        <td className="px-6 py-4 text-xs font-bold text-blue-600">{h.throughput.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-xs font-bold text-emerald-600">{h.efficiency.toFixed(1)}%</td>
                                        <td className="px-6 py-4 text-[9px] font-black uppercase text-emerald-500">Normal Operation</td>
                                    </tr>
                                ))}
                                {history.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic text-sm">
                                            No observations recorded. Run the simulation to capture data.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Result Analysis */}
                    <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white space-y-4">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <CheckCircle2 /> Final Result Analysis
                        </h3>
                        <p className="text-sm text-blue-100 leading-relaxed">
                            Base on the recorded {stats.totalTransmissions} transmissions, the {mode} protocol demonstrates
                            a channel utilization of {stats.channelUtilization.toFixed(1)}%. The system maintained a Fairness
                            Index of {stats.fairnessIndex.toFixed(2)}, proving deterministic access.
                        </p>
                    </div>
                </div>
            )}

            {activeTab === "quiz" && (
                <div className="p-8 max-w-3xl mx-auto">
                    {/* Quiz Content remains mostly similar but with results refined */}
                    <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
                        <div className="bg-indigo-600 p-10 text-white relative">
                            <div className="absolute top-0 right-0 p-8 opacity-20"><HelpCircle size={80} /></div>
                            <h2 className="text-3xl font-black tracking-tight mb-2 italic">Theory Mastery</h2>
                            <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest opacity-80">B.Tech CN Lab Evaluation</p>
                        </div>

                        <div className="p-10 space-y-12">
                            {quizQuestions.map((q, qIdx) => (
                                <div key={qIdx} className="space-y-6">
                                    <h4 className="font-bold text-slate-800 flex gap-4">
                                        <span className="text-indigo-100 text-2xl font-black italic">{qIdx + 1}</span>
                                        {q.q}
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-9">
                                        {q.options.map((opt, oIdx) => (
                                            <button
                                                key={oIdx}
                                                disabled={showResults}
                                                onClick={() => setQuizAnswers({ ...quizAnswers, [qIdx]: oIdx })}
                                                className={`p-4 text-left text-sm rounded-2xl border-2 transition-all ${quizAnswers[qIdx] === oIdx
                                                    ? showResults
                                                        ? oIdx === q.correct
                                                            ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                                                            : "border-rose-500 bg-rose-50 text-rose-800"
                                                        : "border-indigo-600 bg-indigo-50 text-indigo-700 font-bold"
                                                    : "border-slate-100 hover:border-slate-200 text-slate-600"
                                                    } ${showResults && oIdx === q.correct ? "border-emerald-500 bg-emerald-50" : ""}`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            <div className="pt-8 border-t">
                                {!showResults ? (
                                    <Button
                                        className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl"
                                        onClick={() => setShowResults(true)}
                                        disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                                    >
                                        Complete Final Assessment
                                    </Button>
                                ) : (
                                    <div className="flex flex-col items-center gap-6">
                                        <div className="text-center p-8 bg-indigo-50 rounded-[2rem] w-full border border-indigo-100">
                                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Final Score</p>
                                            <p className="text-5xl font-black text-indigo-600">
                                                {Object.entries(quizAnswers).filter(([idx, ans]) => {
                                                    const q = quizQuestions[Number(idx)];
                                                    return q && q.correct === ans;
                                                }).length} / {quizQuestions.length}
                                            </p>
                                        </div>
                                        <Button variant="outline" className="rounded-2xl h-12 px-12 font-bold" onClick={() => { setShowResults(false); setQuizAnswers({}); }}>
                                            Try Again
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>

            {/* Footer Status Bar */ }
            <div className="bg-slate-900 px-6 py-2 flex items-center justify-between text-[8px] font-black uppercase tracking-[0.2em]">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-cyan-400">
                        <div className={`w-1.5 h-1.5 rounded-full ${isRunning ? "bg-cyan-400 animate-pulse" : "bg-slate-700"}`} />
                        {mode === "ring" ? "IEEE 802.5 Protocol Active" : "IEEE 802.4 Protocol Active"}
                    </div>
                    <span className="text-slate-700">|</span>
                    <span className="text-slate-400 italic">Collision probability: 0.0% (Deterministic)</span>
                </div>
                <div className="text-slate-500">
                    Engineered for Prayukti-vLAB Academic Excellence
                </div>
            </div>

            <style jsx global>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 15s linear infinite;
                    transform-origin: center;
                }
            `}</style>
        </div >
    );
}

// --- Sub-components ---

function SimulationSVGArt({ mode, nodes, edges, tokenPos, activeTransmission, width = 700, height = 500, onNodeMouseDown, selectedNodeId, connectSourceId }: any) {
    if (nodes.length === 0) return null;

    // Compact mode: Smaller radius (140) and dynamic scaling
    const radius = 140;
    const nodeSize = nodes.length > 10 ? 20 : nodes.length > 6 ? 25 : 30;

    // Use internal calculation for fixed topologies, but props for Hybrid
    const nodePositions = nodes.map((n: any, i: number) => {
        if (mode === "hybrid") return { x: n.x, y: n.y };

        if (mode === "ring") {
            const centerX = width / 2;
            const centerY = height / 2;
            const angle = (i / nodes.length) * 2 * Math.PI;
            return {
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle)
            };
        } else if (mode === "bus") {
            const x = 100 + (i * ((width - 200) / (nodes.length - 1)));
            const y = height / 2 + (i % 2 === 0 ? -60 : 60);
            return { x, y };
        } else if (mode === "star") {
            const centerX = width / 2;
            const centerY = height / 2;
            if (n.type === "hub") return { x: centerX, y: centerY };
            // PCs are 1 to nodes.length-1
            const angle = ((i - 1) / (nodes.length - 1)) * 2 * Math.PI;
            return {
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle)
            };
        } else if (mode === "mesh") {
            const centerX = width / 2;
            const centerY = height / 2;
            const angle = (i / nodes.length) * 2 * Math.PI;
            return {
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle)
            };
        }
        return { x: n.x, y: n.y };
    });

    return (
        <g>
            <defs>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
            </defs>

            {/* Base Topology Backgrounds */}
            {mode === "ring" && (
                <circle
                    cx={width / 2} cy={height / 2} r={Math.min(width, height) * 0.35}
                    fill="none" stroke="#f1f5f9" strokeWidth="15"
                />
            )}
            {mode === "bus" && (
                <g>
                    <line x1="80" y1={height / 2} x2={width - 80} y2={height / 2} stroke="#f1f5f9" strokeWidth="15" strokeLinecap="round" />
                    {/* Connection lines to bus */}
                    {nodePositions.map((pos: any, i: number) => (
                        <line
                            key={`conn-${i}`}
                            x1={pos.x} y1={pos.y} x2={pos.x} y2={height / 2}
                            stroke="#f1f5f9" strokeWidth="4" strokeDasharray="4 2"
                        />
                    ))}
                    {/* Logical Ring (dashed) */}
                    {nodePositions.map((pos: any, i: number) => {
                        const nextPos = nodePositions[(i + 1) % nodes.length];
                        return (
                            <path
                                key={`logical-${i}`}
                                d={`M ${pos.x} ${pos.y} Q ${(pos.x + nextPos.x) / 2} ${(pos.y + nextPos.y) / 2 - 100} ${nextPos.x} ${nextPos.y}`}
                                fill="none" stroke="rgba(245, 158, 11, 0.1)" strokeWidth="2" strokeDasharray="8 4"
                            />
                        );
                    })}
                </g>
            )}
            {(mode === "star" || mode === "mesh" || mode === "hybrid") && edges && (
                <g>
                    {edges.map((edge: any, i: number) => {
                        const fromNode = nodePositions[edge.from];
                        const toNode = nodePositions[edge.to];
                        if (!fromNode || !toNode) return null;
                        return (
                            <line
                                key={`edge-${i}`}
                                x1={fromNode.x} y1={fromNode.y}
                                x2={toNode.x} y2={toNode.y}
                                stroke={mode === "star" ? "#22d3ee" : mode === "mesh" ? "#10b981" : "#6366f1"}
                                strokeWidth="3"
                                strokeOpacity="0.2"
                            />
                        );
                    })}
                </g>
            )}

            {/* Ring Sequence Preview for Hybrid - Always visible in Designer/Sim */}
            {mode === "hybrid" && nodes.map((n: any, i: number) => {
                if (n.type !== "pc") return null;
                // Find next PC in array
                let nextPCIndex = (i + 1) % nodes.length;
                while (nodes[nextPCIndex] && nodes[nextPCIndex].type !== "pc" && nextPCIndex !== i) {
                    nextPCIndex = (nextPCIndex + 1) % nodes.length;
                }
                if (nextPCIndex === i || !nodes[nextPCIndex]) return null;

                const from = nodePositions[i];
                const to = nodePositions[nextPCIndex];
                if (!from || !to) return null;

                return (
                    <path
                        key={`ring-seq-${i}`}
                        d={`M ${from.x} ${from.y} Q ${(from.x + to.x) / 2} ${(from.y + to.y) / 2 - 40} ${to.x} ${to.y}`}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                        strokeOpacity="0.3"
                    />
                );
            })}

            {/* Data Frame Animation */}
            {activeTransmission && nodePositions[activeTransmission.from] && nodePositions[activeTransmission.to] && (() => {
                const from = nodePositions[activeTransmission.from];
                const to = nodePositions[activeTransmission.to];
                let currentPos = { x: 0, y: 0 };
                let pathD = "";

                if (mode === "ring") {
                    const radius = Math.min(width, height) * 0.35;
                    const centerX = width / 2;
                    const centerY = height / 2;
                    const fromAngle = (activeTransmission.from / nodes.length) * 2 * Math.PI;
                    let toAngle = (activeTransmission.to / nodes.length) * 2 * Math.PI;

                    // Always move clockwise
                    if (toAngle <= fromAngle) toAngle += 2 * Math.PI;

                    const currentAngle = fromAngle + (toAngle - fromAngle) * (activeTransmission.progress / 100);
                    currentPos = {
                        x: centerX + radius * Math.cos(currentAngle),
                        y: centerY + radius * Math.sin(currentAngle)
                    };
                    pathD = `M ${from.x} ${from.y} A ${radius} ${radius} 0 0 1 ${to.x} ${to.y}`;
                } else if (mode === "bus") {
                    // Bus Path: from -> bus -> to
                    const busY = height / 2;
                    const progress = activeTransmission.progress;

                    if (progress < 20) { // Going down to bus
                        const p = progress / 20;
                        currentPos = { x: from.x, y: from.y + (busY - from.y) * p };
                    } else if (progress < 80) { // Traveling along bus
                        const p = (progress - 20) / 60;
                        currentPos = { x: from.x + (to.x - from.x) * p, y: busY };
                    } else { // Going up to target
                        const p = (progress - 80) / 20;
                        currentPos = { x: to.x, y: busY + (to.y - busY) * p };
                    }
                    pathD = `M ${from.x} ${from.y} L ${from.x} ${busY} L ${to.x} ${busY} L ${to.x} ${to.y}`;
                } else if (mode === "star") {
                    // Star Path: from -> hub (id 0) -> to
                    const hub = nodePositions[0];
                    const progress = activeTransmission.progress;
                    if (progress < 50) {
                        const p = progress / 50;
                        currentPos = {
                            x: from.x + (hub.x - from.x) * p,
                            y: from.y + (hub.y - from.y) * p
                        };
                    } else {
                        const p = (progress - 50) / 50;
                        currentPos = {
                            x: hub.x + (to.x - hub.x) * p,
                            y: hub.y + (to.y - hub.y) * p
                        };
                    }
                    pathD = `M ${from.x} ${from.y} L ${hub.x} ${hub.y} L ${to.x} ${to.y}`;
                } else {
                    // Direct Point-to-Point Path (Mesh/Star/Hybrid)
                    const p = activeTransmission.progress / 100;
                    currentPos = {
                        x: from.x + (to.x - from.x) * p,
                        y: from.y + (to.y - from.y) * p
                    };
                    pathD = `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
                }

                return (
                    <g>
                        <path d={pathD} fill="none" stroke="rgba(99, 102, 241, 0.1)" strokeWidth="15" strokeLinecap="round" />
                        <circle cx={currentPos.x} cy={currentPos.y} r="12" fill={activeTransmission.isReturning ? "#10b981" : "#6366f1"} filter="url(#glow)">
                            <animate attributeName="r" values="10;14;10" dur="1s" repeatCount="indefinite" />
                        </circle>
                        <text x={currentPos.x} y={currentPos.y - 25} textAnchor="middle" className="text-[10px] font-black fill-slate-800 uppercase">
                            {activeTransmission.isReturning ? "ACK/STRIP" : "DATA"}
                        </text>
                    </g>
                );
            })()}

            {/* Nodes */}
            {nodes.map((node: any, i: number) => (
                <g
                    key={node.id}
                    onMouseDown={(e) => {
                        e.stopPropagation();
                        onNodeMouseDown?.(node.id);
                    }}
                    className={mode === "hybrid" ? "cursor-pointer" : ""}
                >
                    <circle
                        cx={nodePositions[i].x} cy={nodePositions[i].y}
                        r={node.type === "hub" ? (nodeSize * 1.3) : nodeSize}
                        fill={node.state === "failed" ? "#fee2e2" : node.hasToken ? "#10b981" : node.state === "transmitting" ? "#6366f1" : node.type === "hub" ? "#fef3c7" : "white"}
                        stroke={connectSourceId === node.id ? "#f59e0b" : (selectedNodeId === node.id ? "#3b82f6" : (node.state === "failed" ? "#ef4444" : node.hasToken ? "#059669" : node.type === "hub" ? "#f59e0b" : "#e2e8f0"))}
                        strokeWidth={connectSourceId === node.id || selectedNodeId === node.id ? "5" : (node.type === "hub" ? "4" : "3")}
                        filter={connectSourceId === node.id || selectedNodeId === node.id ? "url(#glow)" : ""}
                        className="transition-all duration-300"
                    />
                    <foreignObject
                        x={nodePositions[i].x - (node.type === "hub" ? (nodeSize * 0.6) : (nodeSize * 0.5))}
                        y={nodePositions[i].y - (node.type === "hub" ? (nodeSize * 0.6) : (nodeSize * 0.5))}
                        width={node.type === "hub" ? (nodeSize * 1.2) : nodeSize}
                        height={node.type === "hub" ? (nodeSize * 1.2) : nodeSize}
                        className="pointer-events-none"
                    >
                        <Monitor className={`w-full h-full ${node.hasToken ? "text-white" : node.state === "failed" ? "text-rose-500" : node.type === "hub" ? "text-amber-600" : "text-slate-400"}`} />
                    </foreignObject>

                    <text x={nodePositions[i].x} y={nodePositions[i].y + (nodeSize + 20)} textAnchor="middle" className="text-[10px] font-black fill-slate-500 pointer-events-none">
                        {node.type === "hub" ? "HUB" : `PC-${node.id}`}
                    </text>
                    {node.state === "idle" && node.waitingTime > 0 && (
                        <circle cx={nodePositions[i].x + 25} cy={nodePositions[i].y - 25} r="10" fill="#f8fafc" stroke="#e2e8f0" className="pointer-events-none" />
                    )}
                    {node.state === "idle" && node.waitingTime > 0 && (
                        <text x={nodePositions[i].x + 25} y={nodePositions[i].y - 22} textAnchor="middle" className="text-[8px] font-bold fill-rose-500 pointer-events-none">{Math.floor(node.waitingTime)}s</text>
                    )}
                </g>
            ))}

            {/* Token Sprite */}
            {nodePositions[tokenPos] && !activeTransmission && (
                <g className="transition-all duration-700" style={{ transform: `translate(${nodePositions[tokenPos].x}px, ${nodePositions[tokenPos].y}px)` }}>
                    <circle cx="0" cy="0" r="14" fill="#f59e0b" filter="url(#glow)">
                        <animate attributeName="r" values="12;16;12" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <text y="-25" textAnchor="middle" className="text-[10px] font-black fill-amber-600 uppercase">Token</text>
                </g>
            )}
        </g>
    );
}

function StatCard({ label, value, icon }: any) {
    return (
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
                <div className="p-2 bg-slate-50 rounded-xl">{icon}</div>
            </div>
            <p className="text-xl font-black text-slate-800 font-mono">{value}</p>
        </div>
    );
}

function LegendItem({ label, color }: { label: string, color: string }) {
    return (
        <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${color} shadow-sm`}></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{label}</span>
        </div>
    );
}
