import db from "../config/db.js";

export const getCharts = async (req, res) => {
  try {
    
    const [categories] = await db.query(
      "SELECT categorie, COUNT(*) as total FROM produits GROUP BY categorie"
    );
    
    const [mouvements] = await db.query(
      "SELECT DATE(date_mouvement) as date, type, SUM(quantite) as total FROM mouvements GROUP BY DATE(date_mouvement), type"
    );

    res.json({
      stockCategories: categories,
      mouvements: mouvements,
      topSorties: [] 
    });

  } catch (error) {
    console.error("Erreur dans getCharts :", error);
    res.status(500).json({ message: "Erreur lors de la récupération des données." });
  }
};