import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { OOPJExperiment, TestCaseType } from "../src/modules/oopj/model.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/prayukti-vlab";

const seedData = [
    {
        experimentId: "exp-1",
        title: "Experiment 1: Hello World & Basics",
        aim: "To learn how to compile and run a simple Java program.",
        problemStatement: "Write a program that prints 'Hello, Prayukti!' to the console.",
        theoryMd: "### Java Basics\nJava is a class-based, object-oriented programming language...",
        starterCode: `public class Main {
    public static void main(String[] args) {
        // Write your code here
        System.out.println("Hello, Prayukti!");
    }
}`,
        testCases: [
            {
                experimentId: "exp-1",
                input: "",
                expectedOutput: "Hello, Prayukti!",
                type: TestCaseType.PUBLIC,
                marks: 10
            }
        ]
    }
];

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log("Connected to MongoDB...");

        await OOPJExperiment.deleteMany({ experimentId: "exp-1" });
        await OOPJExperiment.insertMany(seedData);

        console.log("Seeding Complete!");
        process.exit(0);
    })
    .catch(err => {
        console.error("Seeding Error:", err);
        process.exit(1);
    });
