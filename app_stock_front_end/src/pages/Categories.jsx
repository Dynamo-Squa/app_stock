import Layout from "../components/Layout";
import { useState, useEffect } from "react";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // POPUP AJOUT
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [newCat, setNewCat] = useState({ name: "", description: "" });

  // POPUP MODIFICATION
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editCat, setEditCat] = useState({ id: null, name: "", description: "" });

  // ============================
  //   FETCH CATEGORIES
  // ============================
  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Erreur fetch :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ============================
  //   AJOUT CATEGORIE
  // ============================
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCat),
      });

      const created = await res.json();
      setCategories([...categories, created]);

      setNewCat({ name: "", description: "" });
      setShowAddPopup(false);
    } catch (err) {
      console.error("Erreur ajout :", err);
    }
  };

  // ============================
  //   OUVRIR POPUP MODIFICATION
  // ============================
  const openEditPopup = (cat) => {
    setEditCat(cat);
    setShowEditPopup(true);
  };

  // ============================
  //   MODIFIER CATEGORIE
  // ============================
  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`http://localhost:5000/categories/${editCat.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editCat),
      });

      setCategories(
        categories.map((c) =>
          c.id === editCat.id ? editCat : c
        )
      );

      setShowEditPopup(false);
    } catch (err) {
      console.error("Erreur modification :", err);
    }
  };

  // ============================
  //   SUPPRESSION
  // ============================
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette catégorie ?")) return;

    try {
      await fetch(`http://localhost:5000/categories/${id}`, {
        method: "DELETE",
      });

      setCategories(categories.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Erreur suppression :", err);
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <h1>Catégories</h1>
        <button className="btn-accent" onClick={() => setShowAddPopup(true)}>
          + Ajouter une catégorie
        </button>
      </div>

      {loading && <p>Chargement...</p>}

      {!loading && categories.length === 0 && <p>Aucune catégorie.</p>}

      {!loading && categories.length > 0 && (
        <div className="d-flex flex-column gap-3">
          {categories.map((cat) => (
            <div key={cat.id} className="category-card">
              <div>
                <h5>{cat.name}</h5>
                <p className="text-muted">{cat.description}</p>
              </div>

              <div>
                <button className="btn-warning-custom" onClick={() => openEditPopup(cat)}>
                  Modifier
                </button>
                <button className="btn-danger-custom" onClick={() => handleDelete(cat.id)}>
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* POPUP AJOUT */}
      {showAddPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>Ajouter une catégorie</h3>

            <form onSubmit={handleAdd} className="d-flex flex-column gap-3">
              <input
                type="text"
                className="form-control"
                placeholder="Nom"
                value={newCat.name}
                onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                required
              />

              <input
                type="text"
                className="form-control"
                placeholder="Description"
                value={newCat.description}
                onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
                required
              />

              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn-danger-custom" onClick={() => setShowAddPopup(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn-accent">
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP MODIFICATION */}
      {showEditPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>Modifier la catégorie</h3>

            <form onSubmit={handleEdit} className="d-flex flex-column gap-3">
              <input
                type="text"
                className="form-control"
                value={editCat.name}
                onChange={(e) => setEditCat({ ...editCat, name: e.target.value })}
                required
              />

              <input
                type="text"
                className="form-control"
                value={editCat.description}
                onChange={(e) => setEditCat({ ...editCat, description: e.target.value })}
                required
              />

              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn-danger-custom" onClick={() => setShowEditPopup(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn-accent">
                  Modifier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
