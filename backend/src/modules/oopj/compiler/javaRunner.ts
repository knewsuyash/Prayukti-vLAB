import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Configure paths - simplified for prototype
// Ensure you have a 'temp' folder in backend root or handle creation
const TEMP_DIR = path.resolve(process.cwd(), "temp", "oopj");

if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
}

export interface ExecutionResult {
    success: boolean;
    output: string;
    error: string;
    executionTime: number;
}

export class JavaRunner {
    /**
     * Executes Java code in a simple sandboxed manner (Process Isolation).
     * @param code Java source code
     * @param input Stdin input for the program
     * @param timeLimitMs Max execution time
     */
    static async execute(code: string, input: string = "", timeLimitMs: number = 2000): Promise<ExecutionResult> {
        const jobId = uuidv4();
        // Extract class name from code - crude regex, assumes public class
        const classMatch = code.match(/public\s+class\s+(\w+)/);
        const className = (classMatch && classMatch[1]) ? classMatch[1] : `Main_${jobId.replace(/-/g, "_")}`;

        // If no public class found, wrap it or rename? 
        // For simplicity, let's assume the user MUST provide a public class or valid Main.
        // We'll enforce a filename based on class name.

        const fileName = `${className}.java`;
        const filePath = path.join(TEMP_DIR, fileName);
        const compiledClass = path.join(TEMP_DIR, `${className}.class`);

        // Basic Forbidden Imports Check
        if (code.includes("java.io.File") || code.includes("java.net") || code.includes("Runtime.getRuntime")) {
            return {
                success: false,
                output: "",
                error: "Security Error: Forbidden keyword/package detected (IO, Net, Runtime).",
                executionTime: 0
            };
        }

        try {
            // 1. Write File
            await fs.promises.writeFile(filePath, code);

            // 2. Compile
            const compileStart = Date.now();
            await new Promise<void>((resolve, reject) => {
                const javac = spawn("javac", [filePath]);
                let stderr = "";

                javac.stderr.on("data", (data: Buffer) => stderr += data.toString());

                javac.on("close", (code) => {
                    if (code === 0) resolve();
                    else reject(new Error(`Compilation Failed:\n${stderr}`));
                });
            });

            // 3. Run
            const executionStart = Date.now();
            const result = await new Promise<ExecutionResult>((resolve) => {
                // Run with memory limits (e.g., -Xmx256m)
                const java: ChildProcessWithoutNullStreams = spawn("java", ["-Xmx256m", "-cp", TEMP_DIR, className]);

                let stdout = "";
                let stderr = "";
                let killed = false;

                // Timeout
                const timer = setTimeout(() => {
                    killed = true;
                    java.kill();
                    resolve({
                        success: false,
                        output: stdout,
                        error: "Time Limit Exceeded",
                        executionTime: timeLimitMs
                    });
                }, timeLimitMs);

                // Input
                if (input) {
                    java.stdin.write(input);
                    java.stdin.end();
                }

                java.stdout.on("data", (data: Buffer) => stdout += data.toString());
                java.stderr.on("data", (data: Buffer) => stderr += data.toString());

                java.on("close", (code) => {
                    if (killed) return;
                    clearTimeout(timer);
                    resolve({
                        success: code === 0,
                        output: stdout,
                        error: stderr,
                        executionTime: Date.now() - executionStart
                    });
                });
            });

            // Cleanup
            // await fs.promises.unlink(filePath).catch(() => {});
            // await fs.promises.unlink(compiledClass).catch(() => {});
            // In prod, use a cron job to clean up to avoid blocking response? 
            // Or just do it async without await
            fs.unlink(filePath, () => { });
            fs.unlink(compiledClass, () => { });


            return result;

        } catch (err: unknown) {
            return {
                success: false,
                output: "",
                error: (err as Error).message || "Unknown execution error",
                executionTime: 0
            };
        }
    }
}
