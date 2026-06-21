import express from "express";
import * as movementController from "../controllers/movementController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, movementController.getAllMovements);
router.post("/", auth, movementController.createMovement);

export default router;
