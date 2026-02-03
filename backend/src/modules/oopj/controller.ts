import { Request, Response } from "express";
import { OOPJService } from "./service.js";

export class OOPJController {

    static async getExperiments(req: Request, res: Response) {
        try {
            const experiments = await OOPJService.getAllExperiments();
            res.json(experiments);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

    static async getExperiment(req: Request, res: Response) {
        try {
            const id = req.params.id;
            if (!id) {
                return res.status(400).json({ message: "Experiment ID required" });
            }
            const experiment = await OOPJService.getExperimentById(id);
            if (!experiment) return res.status(404).json({ message: "Experiment not found" });
            res.json(experiment);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

    static async run(req: Request, res: Response) {
        try {
            const { code, input, experimentId } = req.body;
            const result = await OOPJService.runCode("temp-user", experimentId, code, input);
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

    static async submit(req: Request, res: Response) {
        try {
            const { code, experimentId } = req.body;
            // TODO: Extract user ID from auth middleware
            const userId = "temp-user";
            const result = await OOPJService.submitCode(userId, experimentId, code);
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

    // Dev only: seed
    static async createExperiment(req: Request, res: Response) {
        try {
            const experiment = await OOPJService.createExperiment(req.body);
            res.json(experiment);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }
}
