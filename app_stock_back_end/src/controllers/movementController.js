import Movement from "../models/movementModel.js";
import Product from "../models/productModel.js";

export const getAllMovements = async (req, res) => {
  try {
    const movements = await Movement.getAll();
    res.json(movements);
  } catch (err) {
    res.status(500).json({ error: "Erreur récupération mouvements" });
  }
};

export const createMovement = async (req, res) => {
  try {
    const { product_id, quantite, type_mouvement, commentaire } = req.body;

    // 1) Enregistrer le mouvement
    await Movement.create({
      product_id,
      quantite,
      type_mouvement,
      commentaire
    });

    // 2) Mettre à jour le stock
    const product = await Product.getById(product_id);

    const newQty =
      type_mouvement === "ENTREE"
        ? product.quantite + Number(quantite)
        : product.quantite - Number(quantite);

    await Product.update(product_id, { quantite: newQty });

    // Renvoie de l'objet complet structuré pour le Front
    res.json({
      id: Date.now(), 
      product_id,
      product_name: product.name || product.nom, 
      type_mouvement,
      quantite,
      commentaire,
      date: new Date()
    });

  // <-- C'est ici que ça manquait !
  } catch (err) {
    console.error("Erreur création mouvement :", err);
    res.status(500).json({ error: "Erreur création mouvement" });
  }
};