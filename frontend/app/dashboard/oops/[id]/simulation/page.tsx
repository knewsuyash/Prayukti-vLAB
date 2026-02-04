import Link from "next/link";
import { ArrowLeft, Construction } from "lucide-react";

export default async function SimulationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    return (
        <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
            <header className="bg-white border-b shadow-sm h-14 flex items-center px-4 justify-between shrink-0 z-20">
                <div className="flex items-center gap-4">
                    <Link href={`/dashboard/oops/${id}`} className="text-gray-500 hover:text-black p-1 transition-colors hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="font-bold text-gray-800">
                        OOPs Simulation Workbench
                        <span className="text-gray-400 text-sm font-normal ml-2">| Practical {id}</span>
                    </h1>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center bg-white">
                <div className="bg-purple-50 p-12 rounded-3xl border-2 border-dashed border-purple-200 text-center max-w-lg">
                    <Construction className="h-16 w-16 text-purple-600 mx-auto mb-6 animate-bounce" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Simulation Under Construction</h2>
                    <p className="text-gray-600">
                        The interactive simulation for this OOPs practical is currently being developed. Please check back soon!
                    </p>
                    <Link href={`/dashboard/oops/${id}`} className="mt-8 inline-block">
                        <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                            Go Back to Details
                        </Button>
                    </Link>
                </div>
            </main>
        </div>
    );
}

// Minimal Button component since it's used in the template
function Button({ children, variant, className, ...props }: any) {
    return (
        <button
            className={`px-4 py-2 rounded-md font-medium transition-colors ${variant === 'outline' ? 'border' : 'bg-purple-600 text-white'} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
