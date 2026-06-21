import db from "../config/db.js";

// 1) Récupérer tous les mouvements
const getAll = async () => {
  const sql = `
    SELECT 
      m.id,
      m.product_id,
      m.type_mouvement,
      m.quantite,
      m.commentaire,
      m.date_mouvement AS date,
      p.nom AS product_name,
      p.unit
    FROM mouvements m
    LEFT JOIN produits p ON m.product_id = p.id
    ORDER BY m.date_mouvement DESC
  `;

  // Avec mysql2/promise, on attend directement le résultat et on destructure [rows]
  const [rows] = await db.query(sql);
  return rows;
};

// 2) Créer un mouvement
const create = async (data) => {
  const sql = "INSERT INTO mouvements SET ?";
  
  // mysql2 gère automatiquement le format "SET ?" en lui passant l'objet 'data'
  const [result] = await db.query(sql, [data]);
  return result.insertId;
};

export default { getAll, create };