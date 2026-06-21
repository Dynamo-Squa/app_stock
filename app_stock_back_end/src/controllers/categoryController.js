import Category from "../models/categoryModel.js";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.getAll();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Erreur récupération catégories" });
  }
};

export const createCategory = async (req, res) => {
  try {
    const icone = req.file ? req.file.filename : null;

    const data = {
      nom: req.body.nom,
      description: req.body.description,
      icone
    };

    const id = await Category.create(data);
    res.status(201).json({ id, ...data });
  } catch (err) {
    res.status(500).json({ error: "Erreur création catégorie" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const icone = req.file ? req.file.filename : req.body.icone;

    const data = {
      nom: req.body.nom,
      description: req.body.description,
      icone
    };

    await Category.update(req.params.id, data);
    res.json({ message: "Catégorie mise à jour" });
  } catch (err) {
    res.status(500).json({ error: "Erreur mise à jour catégorie" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await Category.delete(req.params.id);
    res.json({ message: "Catégorie supprimée" });
  } catch (err) {
    res.status(500).json({ error: "Erreur suppression catégorie" });
  }
};
