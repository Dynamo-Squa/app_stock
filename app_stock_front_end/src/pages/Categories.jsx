import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import "./Categories.css"; // Importation du CSS dédié côte à côte

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // POPUP AJOUT
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [newCat, setNewCat] = useState({ nom: "", description: "", icone: null });

  // POPUP MODIFICATION
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editCat, setEditCat] = useState({ id: null, nom: "", description: "", icone: null });

  // ============================
  //   FETCH CATEGORIES
  // ============================
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

    const formData = new FormData();
    formData.append("nom", newCat.nom);
    formData.append("description", newCat.description);
    if (newCat.icone) formData.append("icone", newCat.icone);

    try {
      await fetch("http://localhost:5000/api/categories", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: formData,
      });

      fetchCategories();
      setNewCat({ nom: "", description: "", icone: null });
      setShowAddPopup(false);
    } catch (err) {
      console.error("Erreur ajout :", err);
    }
  };

  // ============================
  //   OUVRIR POPUP MODIFICATION
  // ============================
  const openEditPopup = (cat) => {
    setEditCat({
      id: cat.id,
      nom: cat.nom,
      description: cat.description,
      icone: null,
      oldIcone: cat.icone
    });
    setShowEditPopup(true);
  };

  // ============================
  //   MODIFIER CATEGORIE
  // ============================
  const handleEdit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nom", editCat.nom);
    formData.append("description", editCat.description);

    if (editCat.icone) {
      formData.append("icone", editCat.icone);
    } else {
      formData.append("icone", editCat.oldIcone);
    }

    try {
      await fetch(`http://localhost:5000/api/categories/${editCat.id}`, {
        method: "PUT",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: formData,
      });

      fetchCategories();
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
      await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token")
        }
      });

      fetchCategories();
    } catch (err) {
      console.error("Erreur suppression :", err);
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1>Catégories</h1>
          <p className="page-subtitle">Gérez les rayons et classifications de vos produits</p>
        </div>
        <button className="btn-accent" onClick={() => setShowAddPopup(true)}>
          + Ajouter une catégorie
        </button>
      </div>

      {loading && (
        <div className="loading-container">
          <p>Chargement des catégories...</p>
        </div>
      )}

      {!loading && categories.length === 0 && (
        <div className="loading-container">
          <p>Aucune catégorie enregistrée pour le moment.</p>
        </div>
      )}

      {!loading && categories.length > 0 && (
        <div className="d-flex flex-column gap-3">
          {categories.map((cat) => (
            <div key={cat.id} className="category-card">
              
              <div className="d-flex align-items-center gap-3">
                {cat.icone && (
                  <img
                    src={`http://localhost:5000/uploads/categories/${cat.icone}`}
                    alt={cat.nom}
                    className="category-icon"
                  />
                )}

                <div>
                  <h5>{cat.nom}</h5>
                  <p className="text-muted">{cat.description}</p>
                </div>
              </div>

              <div className="d-flex gap-2">
                <button className="btn-warning-custom" onClick={() => openEditPopup(cat)}>
                  ✏️
                </button>
                <button className="btn-danger-custom" onClick={() => handleDelete(cat.id)}>
                  ❌​
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* POPUP AJOUT */}
      {showAddPopup && (
        <div className="popup-overlay" onClick={() => setShowAddPopup(false)}>
          <div className="popup-card" onClick={(e) => e.stopPropagation()}>
            <h3>Ajouter une catégorie</h3>

            <form onSubmit={handleAdd} className="d-flex flex-column gap-3">
              <input
                type="text"
                className="form-control"
                placeholder="Nom de la catégorie"
                value={newCat.nom}
                onChange={(e) => setNewCat({ ...newCat, nom: e.target.value })}
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

              <input
                type="file"
                className="form-control"
                onChange={(e) => setNewCat({ ...newCat, icone: e.target.files[0] })}
              />

              <div className="d-flex justify-content-end gap-2 mt-2">
                <button type="button" className="btn-secondary-custom" onClick={() => setShowAddPopup(false)}>
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
        <div className="popup-overlay" onClick={() => setShowEditPopup(false)}>
          <div className="popup-card" onClick={(e) => e.stopPropagation()}>
            <h3>Modifier la catégorie</h3>

            <form onSubmit={handleEdit} className="d-flex flex-column gap-3">
              <input
                type="text"
                className="form-control"
                value={editCat.nom}
                onChange={(e) => setEditCat({ ...editCat, nom: e.target.value })}
                required
              />

              <input
                type="text"
                className="form-control"
                value={editCat.description}
                onChange={(e) => setEditCat({ ...editCat, description: e.target.value })}
                required
              />

              <input
                type="file"
                className="form-control"
                onChange={(e) => setEditCat({ ...editCat, icone: e.target.files[0] })}
              />

              <div className="d-flex justify-content-end gap-2 mt-2">
                <button type="button" className="btn-secondary-custom" onClick={() => setShowEditPopup(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn-accent">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}