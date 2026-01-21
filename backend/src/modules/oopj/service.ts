import { JavaRunner } from "./compiler/javaRunner.js";
import { OOPJExperiment, OOPJSubmission, TestCaseType, IExperiment } from "./model.js";

export class OOPJService {

    // --- Experiment Management ---

    static async getAllExperiments() {
        return await OOPJExperiment.find({}, { testCases: 0 }); // Exclude test cases from list view
    }

    static async getExperimentById(id: string) {
        return await OOPJExperiment.findOne({ experimentId: id });
    }

    static async createExperiment(data: Partial<IExperiment>) {
        return await OOPJExperiment.create(data);
    }

    // --- Execution & Submission ---

    static async runCode(userId: string, experimentId: string, code: string, input: string = "") {
        // Just run the code, no scoring
        const result = await JavaRunner.execute(code, input);
        return result;
    }

    static async submitCode(userId: string, experimentId: string, code: string) {
        // 1. Fetch Experiment
        const experiment = await OOPJExperiment.findOne({ experimentId });
        if (!experiment) throw new Error("Experiment not found");

        let totalScore = 0;
        let maxScore = 0;
        const testResults = [];
        let anyFailed = false;

        // 2. Run against all Test Cases
        for (const tc of experiment.testCases) {
            maxScore += tc.marks;
            const result = await JavaRunner.execute(code, tc.input);

            // Trim output for comparison
            const actual = result.output.trim();
            const expected = tc.expectedOutput.trim();

            const passed = result.success && actual === expected;
            if (!passed) anyFailed = true;
            if (passed) totalScore += tc.marks;

            testResults.push({
                input: tc.input,
                expected: tc.expectedOutput,
                actual: actual,
                passed: passed,
                error: result.error,
                hidden: tc.type === TestCaseType.HIDDEN
            });
        }

        const finalVerdict = anyFailed ? "FAIL" : "PASS";

        // 3. Save Submission
        const submission = await OOPJSubmission.create({
            userId,
            experimentId,
            code,
            verdict: finalVerdict,
            score: totalScore,
            output: testResults.map(r => r.passed ? "P" : "F").join("") // Simple summary logs
        });

        // 4. Return detailed results (masking hidden ones)
        return {
            submissionId: submission._id,
            verdict: finalVerdict,
            score: totalScore,
            totalScore: maxScore,
            results: testResults.map(r => r.hidden ? { ...r, input: "[HIDDEN]", expected: "[HIDDEN]", actual: r.passed ? "Start Hidden Test Case..." : "Hidden Test Failed" } : r)
        };
    }
}
