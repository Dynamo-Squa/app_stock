import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/me", auth, async (req, res) => {
  const [[user]] = await db.query(
    "SELECT id, username, role FROM users WHERE id = ?",
    [req.user.id]
  );

  res.json(user);
});

// ============================
//   REGISTER (optionnel)
// ============================
router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [username, hashed, role || "user"]
    );

    res.json({ message: "Utilisateur créé" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ============================
//   LOGIN
// ============================
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const [[user]] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (!user) {
      return res.status(400).json({ message: "Utilisateur introuvable" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      "SECRET_KEY",
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
