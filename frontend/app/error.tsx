"use client"; // Error components must be Client Components

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800">
            <h1 className="text-4xl font-bold text-[#d32f2f] mb-4">Something went wrong!</h1>
            <p className="text-gray-600 mb-8 max-w-md text-center">
                An unexpected error occurred. Please try again.
            </p>
            <Button
                onClick={() => reset()}
                className="bg-[#f57f17] hover:bg-[#e65100] text-white font-bold"
            >
                Try again
            </Button>
        </div>
    );
}
