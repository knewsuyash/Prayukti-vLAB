export default function Problem() {
    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-bold text-gray-900">Problem Statement</h3>
                <p className="text-sm text-gray-600 mt-2">
                    Write a Java program that prints "Hello, Prayukti!" to the console.
                </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
                <h4 className="text-sm font-semibold text-blue-800">Expected Output</h4>
                <pre className="mt-2 text-xs bg-white p-2 rounded border border-blue-100 font-mono">
                    Hello, Prayukti!
                </pre>
            </div>

            <div className="text-xs text-gray-500">
                <p>Note: The class name must be <strong>Main</strong>.</p>
            </div>
        </div>
    );
}
