import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AjouterProduit.css"; // Importation du CSS dédié côte à côte

export default function AjouterProduit() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    nom: "",
    description: "",
    prix: "",
    quantite: "",
    quantite_min: 1,
    unit: "",
    categorieId: ""
  });

  // ============================
  //   FETCH CATEGORIES
  // ============================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/categories", {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
          }
        });

        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Erreur chargement catégories :", err);
      }
    };

    fetchCategories();
  }, []);

  // ============================
  //   HANDLE INPUTS
  // ============================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // ============================
  //   SUBMIT
  // ============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) throw new Error("Erreur création produit");

      setForm({
        nom: "",
        description: "",
        prix: "",
        quantite: "",
        quantite_min: 1,
        unit: "",
        categorieId: ""
      });

      navigate("/produits");

    } catch (error) {
      console.error("Erreur :", error);
      alert("Impossible de créer le produit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* En-tête de page moderne avec bouton retour */}
      <div className="action-bar">
        <div>
          <h1>Créer un produit</h1>
        </div>
        <button
          className="btn-secondary-custom"
          onClick={() => navigate("/produits")}
        >
          ← Retour aux produits
        </button>
      </div>

      {/* Formulaire stylisé */}
      <form onSubmit={handleSubmit} className="form-global">

        <div className="mb-4">
          <label className="form-label">Nom du produit</label>
          <input
            type="text"
            name="nom"
            className="form-control"
            placeholder="Ex: Lentilles de contact haute définition"
            value={form.nom}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="form-label">Description</label>
          <input
            type="text"
            name="description"
            className="form-control"
            placeholder="Informations complémentaires, dimensions, variantes..."
            value={form.description}
            onChange={handleChange}
          />
        </div>

        {/* Section en grille responsive pour les valeurs numériques et sélections */}
        <div className="form-grid">
          
          <div className="mb-4">
            <label className="form-label">Prix unitaire (€)</label>
            <input
              type="number"
              name="prix"
              step="0.01"
              className="form-control"
              placeholder="0.00"
              value={form.prix}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Unité de mesure</label>
            <select
              name="unit"
              className="form-select"
              value={form.unit}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionner...</option>
              <option value="Kg">Kilogramme (Kg)</option>
              <option value="L">Litre (L)</option>
              <option value="Unité">Unité</option>
              <option value="Paire">Paire</option>
              <option value="Pièce">Pièce</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="form-label">Quantité initiale en stock</label>
            <input
              type="number"
              name="quantite"
              className="form-control"
              placeholder="0"
              value={form.quantite}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Seuil d’alerte (Stock minimum)</label>
            <input
              type="number"
              name="quantite_min"
              className="form-control"
              value={form.quantite_min}
              onChange={handleChange}
              required
            />
          </div>

        </div>

        <div className="mb-4">
          <label className="form-label">Ranger dans la catégorie</label>
          <select
            name="categorieId"
            className="form-select"
            value={form.categorieId}
            onChange={handleChange}
            required
          >
            <option value="">Choisir une catégorie...</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.nom}
              </option>
            ))}
          </select>
        </div>

        <div className="d-flex justify-content-end">
          <button type="submit" className="btn-submit">
            {loading ? "Création en cours..." : "Créer le produit"}
          </button>
        </div>
      </form>
    </Layout>
  );
}