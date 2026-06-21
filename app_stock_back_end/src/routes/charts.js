import express from "express";
import { getCharts } from "../controllers/chartController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, getCharts);

export default router;
