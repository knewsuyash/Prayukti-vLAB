import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FlaskConical } from "lucide-react";

// Mock Data for Computer Networks
const practicalData = {
    1: {
        title: "OSI vs TCP/IP Reference Models",
        aim: "To study and compare the OSI (Open Systems Interconnection) reference model and the TCP/IP (Transmission Control Protocol/Internet Protocol) model.",
        theory: `
      <div class="space-y-4">
        <p><strong>The OSI Model</strong> is a conceptual framework that standardizes the functions of a communication system into seven abstraction layers. Developed by ISO in 1984, it provides a universal set of rules for networking.</p>
        <p><strong>The TCP/IP Model</strong> is a more simplified and practical model used for the modern internet. It consists of four layers that map to the OSI model's seven layers.</p>
        <div class="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h4 class="font-bold text-blue-800 mb-2">Key Differences:</h4>
            <ul class="list-disc ml-6 space-y-1">
                <li>OSI is a generic, independent model; TCP/IP is based on standard protocols.</li>
                <li>OSI has 7 layers; TCP/IP has 4 layers.</li>
                <li>OSI provides a clear distinction between services, interfaces, and protocols.</li>
            </ul>
        </div>
      </div>
    `,
        procedure: `
      <ol class="list-decimal ml-6 space-y-2">
        <li>Select the OSI vs TCP/IP simulation from the dashboard.</li>
        <li>Click on each layer of the OSI model to understand its functions and protocols.</li>
        <li>Observe the mapping between OSI layers and TCP/IP layers.</li>
        <li>Trigger the "Packet Flow" animation to see how data moves from the Application layer to the Physical layer.</li>
        <li>Review the comparison table and complete the quiz to verify your understanding.</li>
      </ol>
    `,
    },
    2: {
        title: "CSMA/CD Protocol Study",
        aim: "To create a scenario and study the performance of CSMA/CD (Carrier Sense Multiple Access with Collision Detection) protocol through simulation.",
        theory: `
      <div class="space-y-4">
        <p><strong>CSMA/CD</strong> is a media access control method used most notably in early Ethernet technology for local area networking.</p>
        <ul class="list-disc ml-6 space-y-1">
            <li><strong>Carrier Sense:</strong> A node listens to the channel before transmitting.</li>
            <li><strong>Multiple Access:</strong> Multiple nodes share the same physical medium.</li>
            <li><strong>Collision Detection:</strong> If two nodes transmit simultaneously, a collision occurs. Nodes detect this by monitoring signal voltage levels.</li>
        </ul>
        <div class="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h4 class="font-bold text-blue-800 mb-2">Backoff Algorithm:</h4>
            <p>After a collision, nodes wait for a random amount of time before retransmitting. The <strong>Binary Exponential Backoff</strong> algorithm is used to determine this wait time, reducing the probability of another collision.</p>
        </div>
      </div>
    `,
        procedure: `
      <ol class="list-decimal ml-6 space-y-2">
        <li>Enter the CSMA/CD simulation workbench.</li>
        <li>Configure the number of nodes, packet size, and transmission probability.</li>
        <li>Start the simulation and observe how nodes sense the carrier.</li>
        <li>Watch for collisions when multiple nodes attempt to transmit.</li>
        <li>Observe the jamming signal and the backoff timers.</li>
        <li>Analyze the throughput and collision statistics in the results section.</li>
      </ol>
    `,
    },
    3: {
        title: "Token Bus and Token Ring Protocols",
        aim: "To create a scenario and study the performance of Token Bus and Token Ring protocols through simulation.",
        theory: `
      <div class="space-y-4">
        <p><strong>Token-based protocols</strong> are collision-free medium access control (MAC) methods that regulate access to a shared channel using a control frame called a <strong>Token</strong>.</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                <h4 class="font-bold text-indigo-800 mb-1">Token Ring (IEEE 802.5)</h4>
                <p class="text-xs">Nodes are physically connected in a ring. The token circulates in one direction. A node captures the token to transmit and releases it after the frame returns (source stripping).</p>
            </div>
            <div class="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                <h4 class="font-bold text-amber-800 mb-1">Token Bus (IEEE 802.4)</h4>
                <p class="text-xs">Nodes are on a physical bus but form a <strong>logical ring</strong>. The token is passed based on descending node addresses. It combines the physical robustness of a bus with the deterministic nature of a ring.</p>
            </div>
        </div>
        <p>These protocols provide <strong>deterministic access</strong>, meaning a node is guaranteed to get a turn to transmit within a predictable time frame, making them ideal for real-time applications.</p>
      </div>
    `,
        procedure: `
      <ol class="list-decimal ml-6 space-y-2">
        <li>Select the protocol mode: <strong>Token Bus</strong> or <strong>Token Ring</strong> from the lab interface.</li>
        <li>Set the <strong>Number of Nodes</strong> and <strong>Packet Size</strong> for the transmission.</li>
        <li>Observe the <strong>Token Circulation</strong>:
            <ul class="list-disc ml-6 mt-1 opacity-80">
                <li>In Token Ring, see it move physically around the circle.</li>
                <li>In Token Bus, see it jump between nodes in logical order.</li>
            </ul>
        </li>
        <li>Trigger a transmission and follow the <strong>Data Frame</strong> as it travels across the network.</li>
        <li>Monitor the <strong>Throughput</strong> and <strong>Fairness</strong> metrics as multiple nodes compete for access.</li>
        <li>Complete the quiz to evaluate your understanding of predictable network delays.</li>
      </ol>
    `,
    },
    4: {
        title: "Sliding Window Protocols (Stop & Wait, GBN, SR)",
        aim: "To study and analyze the performance of various flow control protocols: Stop & Wait, Go-Back-N, and Selective Repeat.",
        theory: `
      <div class="space-y-4">
        <p><strong>Sliding Window Protocols</strong> are data link layer protocols used for reliable and sequential delivery of data frames. They provide <strong>Flow Control</strong> to ensure a fast sender doesn't overwhelm a slow receiver.</p>
        <div class="space-y-4">
            <div class="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <h4 class="font-bold text-blue-800 mb-1">Stop & Wait ARQ</h4>
                <p class="text-xs">The sender sends one frame and waits for an acknowledgment (ACK) before sending the next. It is simple but inefficient due to high waiting time.</p>
            </div>
            <div class="p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                <h4 class="font-bold text-indigo-800 mb-1">Go-Back-N (GBN)</h4>
                <p class="text-xs">Sender can send multiple frames (up to window size 'N') without waiting for ACKs. If a frame is lost, the sender retransmits ALL frames from the lost one onwards. Uses <strong>Cumulative ACKs</strong>.</p>
            </div>
            <div class="p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                <h4 class="font-bold text-emerald-800 mb-1">Selective Repeat (SR)</h4>
                <p class="text-xs">Similar to GBN, but ONLY the lost frame is retransmitted. The receiver buffers out-of-order frames. It is more efficient but requires more complex logic at both ends.</p>
            </div>
        </div>
      </div>
    `,
        procedure: `
      <ol class="list-decimal ml-6 space-y-2">
        <li>Select the Protocol: <strong>Stop & Wait</strong>, <strong>GBN</strong>, or <strong>Selective Repeat</strong>.</li>
        <li>Set the <strong>Window Size</strong> and <strong>Timeout</strong> values.</li>
        <li>Start the simulation and observe the sequence numbers of transmitted packets.</li>
        <li>Use the <strong>Manual Error Injection</strong> buttons to simulate a "Lost Packet" or "Lost ACK".</li>
        <li>Observe the retransmission behavior (Does it resend one packet or the whole window?).</li>
        <li>Analyze the <strong>Efficiency</strong> and <strong>Throughput</strong> graphs to compare the three methods.</li>
      </ol>
    `,
    }
};

export default async function PracticalDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const practical = practicalData[Number(id) as keyof typeof practicalData] || practicalData[1];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex items-center gap-4">
                    <Link href="/dashboard/cn" className="text-gray-500 hover:text-black hover:bg-gray-100 p-1 rounded-full transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <span className="text-gray-300">|</span>
                    <h1 className="text-lg font-bold text-gray-800 truncate">{practical.title}</h1>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Content (Theory) */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-white p-6 rounded-lg shadow-sm border">
                        <h2 className="text-xl font-bold text-[#1976d2] mb-4 border-b pb-2">Aim</h2>
                        <p className="text-gray-700">{practical.aim}</p>
                    </section>

                    <section className="bg-white p-6 rounded-lg shadow-sm border">
                        <h2 className="text-xl font-bold text-[#1976d2] mb-4 border-b pb-2">Theory</h2>
                        <div className="text-gray-700 prose max-w-none" dangerouslySetInnerHTML={{ __html: practical.theory }} />
                    </section>

                    <section className="bg-white p-6 rounded-lg shadow-sm border">
                        <h2 className="text-xl font-bold text-[#1976d2] mb-4 border-b pb-2">Procedure</h2>
                        <div className="text-gray-700 prose max-w-none" dangerouslySetInnerHTML={{ __html: practical.procedure }} />
                    </section>
                </div>

                {/* Right Sidebar (Actions) */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-md border border-blue-200">
                        <h3 className="font-bold text-lg mb-2 text-blue-900">Start Learning</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Enter the interactive simulation to visualize the layer architecture and packet flow.
                        </p>
                        <Link href={`/dashboard/cn/${id}/simulation`}>
                            <Button className="w-full bg-[#1976d2] hover:bg-[#1565c0] text-lg font-bold py-6 shadow-lg hover:shadow-xl transition-all">
                                <FlaskConical className="mr-2 h-6 w-6" />
                                Enter Simulation
                            </Button>
                        </Link>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="font-bold text-md mb-4 text-gray-800">Resources</h3>
                        <ul className="space-y-2 text-sm text-[#1976d2]">
                            <li className="cursor-pointer hover:underline">Reference Guide (PDF)</li>
                            <li className="cursor-pointer hover:underline">Animation Lecture</li>
                            <li className="cursor-pointer hover:underline">Self Assessment Quiz</li>
                        </ul>
                    </div>
                </div>

            </main>
        </div>
    );
}
