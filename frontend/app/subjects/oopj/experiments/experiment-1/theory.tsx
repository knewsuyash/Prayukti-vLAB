export default function Theory() {
    return (
        <div className="prose prose-sm max-w-none">
            <h3>Introduction to Java</h3>
            <p>
                Java is a high-level, class-based, object-oriented programming language that is designed to have as few implementation dependencies as possible.
            </p>

            <h4>The Main Method</h4>
            <p>
                Every Java application must contain a main method that follows this signature:
            </p>
            <pre className="bg-gray-100 p-2 rounded text-xs">
                public static void main(String[] args)
            </pre>

            <h4>System.out.println</h4>
            <p>
                Used to print text to the console.
            </p>
        </div>
    );
}
