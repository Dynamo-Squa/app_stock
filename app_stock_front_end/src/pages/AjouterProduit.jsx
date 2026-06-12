import Layout from "../components/Layout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AjouterProduit() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    unit: "",
    image: null,
  });

  // ============================
  //   HANDLE INPUTS
  // ============================
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  // ============================
  //   SUBMIT (POST /products)
  // ============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("category", form.category);
      formData.append("unit", form.unit);

      if (form.image) {
        formData.append("image", form.image);
      }

      const response = await fetch("http://localhost:5000/products", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création du produit");
      }

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
      <h1 className="mb-4">Créer un produit</h1>

      <form onSubmit={handleSubmit} className="form-global">

        <div className="mb-3">
          <label className="form-label">Nom du produit</label>
          <input
            type="text"
            name="name"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <input
            type="text"
            name="description"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Prix (€)</label>
          <input
            type="number"
            name="price"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Catégorie</label>
          <select
            name="category"
            className="form-select"
            onChange={handleChange}
            required
          >
            <option value="">Sélectionner...</option>
            <option value="Légumes">Légumes</option>
            <option value="Fruits">Fruits</option>
            <option value="Épicerie">Épicerie</option>
            <option value="Conserves">Conserves</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Unité</label>
          <select
            name="unit"
            className="form-select"
            onChange={handleChange}
            required
          >
            <option value="">Sélectionner...</option>
            <option value="Kg">Kilogramme</option>
            <option value="L">Litre</option>
            <option value="Unité">Unité</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Image du produit</label>
          <input
            type="file"
            className="form-control"
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn-submit">
          {loading ? "Création..." : "Créer le produit"}
        </button>
      </form>
    </Layout>
  );
}
