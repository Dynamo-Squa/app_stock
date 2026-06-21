import db from "../config/db.js";

const Product = {
  // Récupérer tous les produits avec les détails de leur catégorie
  getAll: async () => {
    const sql = `
      SELECT 
        p.*, 
        c.nom AS categorieNom,
        c.icone AS categorieIcone
      FROM produits p
      LEFT JOIN categories c ON p.categorieId = c.id
      ORDER BY p.nom ASC
    `;

    const [rows] = await db.query(sql);
    return rows;
  },

  // Récupérer un produit par son ID
  getById: async (id) => {
    const sql = `
      SELECT 
        p.*, 
        c.nom AS categorieNom,
        c.icone AS categorieIcone
      FROM produits p
      LEFT JOIN categories c ON p.categorieId = c.id
      WHERE p.id = ?
    `;

    const [rows] = await db.query(sql, [id]);
    return rows[0] || null;
  },

  // Créer un produit
  create: async (data) => {
    const sql = "INSERT INTO produits SET ?";
    const [result] = await db.query(sql, data);
    return result.insertId;
  },

  // Modifier un produit
  update: async (id, data) => {
    const sql = "UPDATE produits SET ? WHERE id = ?";
    const [result] = await db.query(sql, [data, id]);
    return result;
  },

  // Supprimer un produit
  delete: async (id) => {
    const sql = "DELETE FROM produits WHERE id = ?";
    const [result] = await db.query(sql, [id]);
    return result;
  }
};

export default Product;