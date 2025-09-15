import express from "express";
import healthCheck from "../controllers/healthControllers.js";

const router = express.Router();

router.get("/test", healthCheck);

export default router;
