import Product from "../models/productModel.js";

// GET all products
// GET all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.getAll();
    res.json(products);
  } catch (err) {
    // AJOUTEZ CETTE LIGNE POUR VOIR LE VRAI SOUCI DANS LE TERMINAL :
    console.error("Erreur détaillée dans getAllProducts :", err); 
    
    res.status(500).json({ error: "Erreur lors de la récupération des produits" });
  }
};

// GET product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.getById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Produit introuvable" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération du produit" });
  }
};

// CREATE product (avec image)
export const createProduct = async (req, res) => {
  try {
    const data = {
      nom: req.body.nom,
      description: req.body.description,
      prix: req.body.prix,
      quantite: req.body.quantite,
      quantite_min: req.body.quantite_min,
      unit: req.body.unit,
      categorieId: req.body.categorieId
    };

    const id = await Product.create(data);
    res.status(201).json({ id, ...data });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur création produit" });
  }
};


// UPDATE product
export const updateProduct = async (req, res) => {
  try {
    await Product.update(req.params.id, req.body);
    res.json({ message: "Produit mis à jour" });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la mise à jour du produit" });
  }
};

// DELETE product
export const deleteProduct = async (req, res) => {
  try {
    await Product.delete(req.params.id);
    res.json({ message: "Produit supprimé" });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la suppression du produit" });
  }
};
