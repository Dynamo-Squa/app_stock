import db from "../config/db.js";

const Category = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM categories");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM categories WHERE id = ?", [id]);
    return rows[0];
  },

  create: async (data) => {
    const [result] = await db.query("INSERT INTO categories SET ?", data);
    return result.insertId;
  },

  update: async (id, data) => {
    await db.query("UPDATE categories SET ? WHERE id = ?", [data, id]);
  },

  delete: async (id) => {
    await db.query("DELETE FROM categories WHERE id = ?", [id]);
  }
};

export default Category;
