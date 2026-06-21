import db from "../config/db.js";

export const getDashboard = async (req, res) => {
  try {
    const [totalProduits] = await db.query(
      "SELECT COUNT(*) AS total FROM produits"
    );

    const [stockBas] = await db.query(
      "SELECT COUNT(*) AS total FROM produits WHERE quantite <= quantite_min"
    );

    const [valeurStock] = await db.query(
      "SELECT SUM(prix * quantite) AS total FROM produits"
    );

    const [entrees7jours] = await db.query(`
      SELECT COUNT(*) AS total 
      FROM mouvements 
      WHERE type_mouvement = 'ENTREE'
      AND date_mouvement >= NOW() - INTERVAL 7 DAY
    `);

    const [sorties7jours] = await db.query(`
      SELECT COUNT(*) AS total 
      FROM mouvements 
      WHERE type_mouvement = 'SORTIE'
      AND date_mouvement >= NOW() - INTERVAL 7 DAY
    `);

    res.json({
      totalProduits: totalProduits[0].total || 0,
      stockBas: stockBas[0].total || 0,
      valeurStock: valeurStock[0].total || 0,
      entrees7jours: entrees7jours[0].total || 0,
      sorties7jours: sorties7jours[0].total || 0
    });

  } catch (err) {
    console.error("Erreur dashboard :", err);
    res.status(500).json({ error: "Erreur dashboard" });
  }
};
