import express from "express";
import * as productController from "../controllers/productController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// ROUTES
router.get("/", auth, productController.getAllProducts);
router.get("/:id", auth, productController.getProductById);

router.post("/", auth, productController.createProduct);

router.put("/:id", auth, productController.updateProduct);

router.delete("/:id", auth, productController.deleteProduct);

export default router;
