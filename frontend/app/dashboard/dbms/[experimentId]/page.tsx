import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FlaskConical, Database, Table, Columns, LayoutList, Settings, Play } from "lucide-react";

// Data for Experiments
const practicalData = {
    1: {
        title: "DBMS Environment and Basic Operations",
        aim: "To demonstrate the installation and basic environment setup of a Database Management System (MySQL/Oracle/PostgreSQL) and perform basic DDL/DML operations (Create Database, Create Table, Insert Record).",
        theory: (
            <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed">
                    A <strong>Database Management System (DBMS)</strong> is software that allows users to define, create, maintain, and control access to the database.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-2 mb-2 text-blue-700">
                            <Database size={20} />
                            <h4 className="font-bold">Database</h4>
                        </div>
                        <p className="text-sm text-gray-600">An organized collection of structured information, acting as a container for tables.</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                        <div className="flex items-center gap-2 mb-2 text-green-700">
                            <Table size={20} />
                            <h4 className="font-bold">Table</h4>
                        </div>
                        <p className="text-sm text-gray-600">A collection of related data held in a table format (rows and columns).</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                        <div className="flex items-center gap-2 mb-2 text-purple-700">
                            <Columns size={20} />
                            <h4 className="font-bold">Field (Column)</h4>
                        </div>
                        <p className="text-sm text-gray-600">A unit of data stored in a table (e.g., Name, Age).</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                        <div className="flex items-center gap-2 mb-2 text-orange-700">
                            <LayoutList size={20} />
                            <h4 className="font-bold">Record (Row)</h4>
                        </div>
                        <p className="text-sm text-gray-600">A single entry in a table representing a set of related data.</p>
                    </div>
                </div>
            </div>
        ),
        procedure: (
            <div className="space-y-4">
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0">1</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Select Environment</h4>
                        <p className="text-sm text-gray-600">Choose the database environment (MySQL, Oracle, etc.) from the dropdown.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0">2</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Create Database</h4>
                        <p className="text-sm text-gray-600">Use the 'Create Database' command to initialize a new DB container.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0">3</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Create Table</h4>
                        <p className="text-sm text-gray-600">Define a schema (columns and types) and create a table within the database.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0">4</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Observe & Verify</h4>
                        <p className="text-sm text-gray-600">Check the visual representation and the generated SQL log.</p>
                    </div>
                </div>
            </div>
        )
    },
    2: {
        title: "Database Application Development",
        aim: "To design and develop a database application for a Store, Vendor, or Finance Management System. This simulation focuses on schema design, data entry forms, and transactional integrity.",
        theory: (
            <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed">
                    Database applications serve as the interface between end-users and the database management system. They allow users to perform operations like inserting data (e.g., New Customer), updating records (e.g., Stock Update), and viewing reports without writing raw SQL.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h4 className="font-bold text-blue-800 mb-2">Store Management</h4>
                        <p className="text-xs text-blue-700">Tracks Inventory, Products, and Sales.</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                        <h4 className="font-bold text-green-800 mb-2">Vendor Management</h4>
                        <p className="text-xs text-green-700">Manages Suppliers, Purchase Orders, and Deliveries.</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                        <h4 className="font-bold text-purple-800 mb-2">Finance Management</h4>
                        <p className="text-xs text-purple-700">Handles Transactions, Ledgers, and Accounts.</p>
                    </div>
                </div>
            </div>
        ),
        procedure: (
            <div className="space-y-4">
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0">1</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Select Mode</h4>
                        <p className="text-sm text-gray-600">Choose between Store, Vendor, or Finance application modes.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0">2</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Manage Master Data</h4>
                        <p className="text-sm text-gray-600">Use forms to adding new Entities (e.g., Add a new Item to Store, Add a new Vendor).</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0">3</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Perform Transactions</h4>
                        <p className="text-sm text-gray-600">Execute business logic (e.g., Place an Order) and observe how multiple tables update automatically.</p>
                    </div>
                </div>
            </div>
        )
    },
    4: {
        title: "Normalization and Dependency Analysis",
        aim: "To strict functional dependencies and normalize a database table into 1NF, 2NF, 3NF, and BCNF through a step-by-step interactive definition.",
        theory: (
            <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed">
                    <strong>Normalization</strong> is the process of organizing data in a database to reduce redundancy and improve data integrity. It involves breaking down large tables into smaller, related tables.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                        <h4 className="font-bold text-red-800 mb-1">1NF (First Normal Form)</h4>
                        <p className="text-xs text-red-700">Eliminate repeating groups. Ensure atomicity.</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                        <h4 className="font-bold text-orange-800 mb-1">2NF (Second Normal Form)</h4>
                        <p className="text-xs text-orange-700">Eliminate Partial Dependencies (Non-key depends on part of Composite Key).</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                        <h4 className="font-bold text-yellow-800 mb-1">3NF (Third Normal Form)</h4>
                        <p className="text-xs text-yellow-700">Eliminate Transitive Dependencies (Non-key depends on another Non-key).</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                        <h4 className="font-bold text-green-800 mb-1">BCNF (Boyce-Codd NF)</h4>
                        <p className="text-xs text-green-700">A stricter version of 3NF where every determinant must be a Super Key.</p>
                    </div>
                </div>
            </div>
        ),
        procedure: (
            <div className="space-y-4">
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0">1</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Identify Redundancy</h4>
                        <p className="text-sm text-gray-600">Observe the unnormalized table and identify repeating groups and anomalies.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0">2</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Decompose Step-by-Step</h4>
                        <p className="text-sm text-gray-600">Apply normalization rules sequentially (1NF &rarr; 2NF &rarr; 3NF) using the simulation tools.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0">3</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Verify Dependencies</h4>
                        <p className="text-sm text-gray-600">Ensure all functional dependencies are preserved and no data is lost during decomposition.</p>
                    </div>
                </div>
            </div>
        )
    }
};

export default async function PracticalDetail({ params }: { params: Promise<{ experimentId: string }> }) {
    const { experimentId } = await params;
    const practical = practicalData[Number(experimentId) as keyof typeof practicalData] || practicalData[1];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex items-center gap-4">
                    <Link href="/dashboard/dbms" className="text-gray-500 hover:text-black hover:bg-gray-100 p-1 rounded-full">
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
                        <h2 className="text-xl font-bold text-[#d32f2f] mb-4 border-b pb-2">Aim</h2>
                        <p className="text-gray-700">{practical.aim}</p>
                    </section>

                    <section className="bg-white p-6 rounded-lg shadow-sm border">
                        <h2 className="text-xl font-bold text-[#d32f2f] mb-4 border-b pb-2">Theory</h2>
                        {practical.theory}
                    </section>

                    <section className="bg-white p-6 rounded-lg shadow-sm border">
                        <h2 className="text-xl font-bold text-[#d32f2f] mb-4 border-b pb-2">Procedure</h2>
                        {practical.procedure}
                    </section>
                </div>

                {/* Right Sidebar (Actions) */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-md border border-orange-200">
                        <h3 className="font-bold text-lg mb-2">Ready to Experiment?</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Launch the virtual simulator to perform database operations and see SQL queries in action.
                        </p>
                        <Link href={`/dashboard/dbms/${experimentId}/simulation`}>
                            <Button className="w-full bg-[#f57f17] hover:bg-[#e65100] text-lg font-bold py-6 shadow-lg hover:shadow-xl transition-all">
                                <FlaskConical className="mr-2 h-6 w-6" />
                                Enter Simulation
                            </Button>
                        </Link>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="font-bold text-md mb-4 text-gray-800">Resources</h3>
                        <ul className="space-y-2 text-sm text-[#d32f2f]">
                            <li className="cursor-pointer hover:underline">SQL Syntax Guide</li>
                            <li className="cursor-pointer hover:underline">DBMS Concepts Video</li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
}
