import { Router } from "express";
import { OOPJController } from "./controller.js";

const router = Router();

router.get("/experiments", OOPJController.getExperiments);
router.get("/experiments/:id", OOPJController.getExperiment);
router.post("/run", OOPJController.run);
router.post("/submit", OOPJController.submit);
router.post("/experiments", OOPJController.createExperiment); // Admin only ideal

export default router;
