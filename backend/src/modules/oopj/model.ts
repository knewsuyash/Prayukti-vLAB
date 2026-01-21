import mongoose from "mongoose";

// --- Enums ---
export enum TestCaseType {
    PUBLIC = "public",
    HIDDEN = "hidden"
}

// --- Interfaces ---
export interface ITestcase {
    experimentId: string;
    input: string;
    expectedOutput: string;
    type: TestCaseType;
    marks: number;
}

export interface IExperiment {
    experimentId: string;
    title: string;
    aim: string;
    problemStatement: string;
    theoryMd: string;
    starterCode: string;
    testCases: ITestcase[];
}

export interface ISubmission {
    userId: string;
    experimentId: string;
    code: string;
    language: string;
    verdict: "PASS" | "FAIL" | "ERROR";
    score: number;
    output: string;
    createdAt: Date;
}

// --- Schemas ---

const TestcaseSchema = new mongoose.Schema({
    experimentId: { type: String, required: true },
    input: { type: String, default: "" },
    expectedOutput: { type: String, required: true },
    type: { type: String, enum: Object.values(TestCaseType), default: TestCaseType.PUBLIC },
    marks: { type: Number, default: 10 }
});

const ExperimentSchema = new mongoose.Schema({
    experimentId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    aim: { type: String, required: true },
    problemStatement: { type: String, required: true },
    theoryMd: { type: String, default: "" }, // Markdown content
    starterCode: { type: String, required: true },
    testCases: [TestcaseSchema] // Embedded for simplicity as per modular monolith request
});

const SubmissionSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    experimentId: { type: String, required: true },
    code: { type: String, required: true },
    language: { type: String, default: "java" },
    verdict: { type: String, enum: ["PASS", "FAIL", "ERROR"], required: true },
    score: { type: Number, default: 0 },
    output: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now }
});

// --- Models ---
// Using specific collection names as requested: oopj_experiments, oopj_submissions
export const OOPJExperiment = mongoose.model<IExperiment>("OOPJExperiment", ExperimentSchema, "oopj_experiments");
export const OOPJSubmission = mongoose.model<ISubmission>("OOPJSubmission", SubmissionSchema, "oopj_submissions");
