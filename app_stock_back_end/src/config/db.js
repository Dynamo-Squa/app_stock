import mysql from "mysql2/promise";

const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "app_stock"
});

console.log("Connexion MySQL OK (Promise)");

export default db;
