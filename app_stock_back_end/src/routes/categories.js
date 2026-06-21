import express from "express";
import multer from "multer";
import * as categoryController from "../controllers/categoryController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// MULTER CONFIG
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/categories"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });

// ROUTES
router.get("/", auth, categoryController.getAllCategories);
router.post("/", auth, upload.single("icone"), categoryController.createCategory);
router.put("/:id", auth, upload.single("icone"), categoryController.updateCategory);
router.delete("/:id", auth, categoryController.deleteCategory);

export default router;
