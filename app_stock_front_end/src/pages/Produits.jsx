import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Produits.css"; // Importation du CSS dédié

export default function Produits() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // POPUP MODIFICATION
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editProduct, setEditProduct] = useState({
    id: null,
    nom: "",
    description: "",
    prix: "",
    quantite: "",
    quantite_min: "",
    unit: "",
    categorieId: ""
  });

  // POPUP STOCK
  const [showStockPopup, setShowStockPopup] = useState(false);
  const [stockForm, setStockForm] = useState({
    product_id: "",
    quantite: "",
    commentaire: "",
  });

  // ============================
  //   FETCH PRODUITS
  // ============================
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products", {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token")
        }
      });

      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Erreur fetch produits :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ============================
  //   DELETE PRODUIT
  // ============================
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer définitivement ce produit ?")) return;

    try {
      await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token")
        }
      });

      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Erreur suppression :", err);
    }
  };

  // ============================
  //   OPEN EDIT POPUP
  // ============================
  const openEditPopup = (p) => {
    setEditProduct({
      id: p.id,
      nom: p.nom,
      description: p.description,
      prix: p.prix,
      quantite: p.quantite,
      quantite_min: p.quantite_min,
      unit: p.unit,
      categorieId: p.categorieId
    });
    setShowEditPopup(true);
  };

  // ============================
  //   EDIT PRODUIT
  // ============================
  const handleEdit = async (e) => {
    e.preventDefault();

    try {
      await fetch(`http://localhost:5000/api/products/${editProduct.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify(editProduct)
      });

      fetchProducts();
      setShowEditPopup(false);
    } catch (err) {
      console.error("Erreur modification :", err);
    }
  };

  // ============================
  //   OPEN STOCK POPUP
  // ============================
  const openStockPopup = (p) => {
    setStockForm({
      product_id: p.id,
      quantite: "",
      commentaire: "",
    });
    setShowStockPopup(true);
  };

  // ============================
  //   AJOUT STOCK
  // ============================
  const handleStockSubmit = async (e) => {
    e.preventDefault();

    try {
      await fetch("http://localhost:5000/api/movements", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({
          ...stockForm,
          type_mouvement: "ENTREE",
        }),
      });

      fetchProducts();
      setShowStockPopup(false);
    } catch (err) {
      console.error("Erreur mouvement :", err);
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1>Catalogue Produits</h1>
          <p className="page-subtitle">Visualisez, éditez et surveillez les seuils critiques de vos stocks</p>
        </div>
        <Link to="/produits/ajouter" className="btn-accent" style={{ textDecoration: "none" }}>
          + Ajouter un produit
        </Link>
      </div>

      {loading && (
        <div className="loading-container">
          <p>Chargement de l'inventaire...</p>
        </div>
      )}

      {!loading && products.length === 0 && (
        <div className="loading-container">
          <p>Aucun produit enregistré dans la base de données.</p>
        </div>
      )}

      {!loading && products.length > 0 && (
        <div className="table-container">
          <table className="produits-table">
            <thead>
              <tr>
                <th>Famille / Catégorie</th>
                <th>Désignation</th>
                <th>Description</th>
                <th>Prix unitaire</th>
                <th>Stock disponible</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => {
                const isLow = Number(p.quantite) <= Number(p.quantite_min);
                return (
                  <tr key={p.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        {p.categorieIcone && (
                          <img
                            src={`http://localhost:5000/uploads/categories/${p.categorieIcone}`}
                            alt=""
                            className="category-icon"
                          />
                        )}
                        <span className="ms-2 fw-medium">{p.categorieNom || "Général"}</span>
                      </div>
                    </td>

                    <td className="product-name">{p.nom}</td>
                    <td className="text-comment">{p.description || "—"}</td>
                    <td className="fw-bold">{Number(p.prix).toFixed(2)} €</td>

                    <td className={isLow ? "stock-warning-row" : ""}>
                      {p.quantite} <span className="text-muted" style={{ fontSize: "0.85rem" }}>{p.unit}</span>
                      {isLow && <span className="badge-low">Seuil bas</span>}
                    </td>

                    <td>
                      <div className="actions-cell">
                        <button className="btn-accent" onClick={() => openStockPopup(p)}>
                          Réapprovisionner
                        </button>
                        <button className="btn-warning-custom" onClick={() => openEditPopup(p)}>
                          ✏️
                        </button>
                        <button className="btn-danger-custom" onClick={() => handleDelete(p.id)} title="Supprimer">
                          ❌​
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ============================
          POPUP MODIFICATION PRODUIT
      ============================ */}
      {showEditPopup && (
        <div className="popup-overlay" onClick={() => setShowEditPopup(false)}>
          <div className="popup-card" onClick={(e) => e.stopPropagation()}>
            <h3>Modifier la fiche produit</h3>

            <form onSubmit={handleEdit} className="d-flex flex-column gap-3">
              
              <div className="form-group-popup">
                <label>Nom du produit</label>
                <input
                  type="text"
                  className="form-control"
                  value={editProduct.nom}
                  onChange={(e) => setEditProduct({ ...editProduct, nom: e.target.value })}
                  required
                />
              </div>

              <div className="form-group-popup">
                <label>Description</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={editProduct.description}
                  onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                />
              </div>

              <div className="row g-2">
                <div className="col-6 form-group-popup">
                  <label>Prix unitaire (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={editProduct.prix}
                    onChange={(e) => setEditProduct({ ...editProduct, prix: e.target.value })}
                    required
                  />
                </div>
                <div className="col-6 form-group-popup">
                  <label>Unité de mesure</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ex: kg, pcs"
                    value={editProduct.unit}
                    onChange={(e) => setEditProduct({ ...editProduct, unit: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="row g-2">
                <div className="col-6 form-group-popup">
                  <label>Stock actuel</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editProduct.quantite}
                    onChange={(e) => setEditProduct({ ...editProduct, quantite: e.target.value })}
                    required
                  />
                </div>
                <div className="col-6 form-group-popup">
                  <label>Alerte stock minimal</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editProduct.quantite_min}
                    onChange={(e) => setEditProduct({ ...editProduct, quantite_min: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group-popup">
                <label>ID de la catégorie</label>
                <input
                  type="number"
                  className="form-control"
                  value={editProduct.categorieId}
                  onChange={(e) => setEditProduct({ ...editProduct, categorieId: e.target.value })}
                  required
                />
              </div>

              <div className="d-flex justify-content-end gap-2 mt-2">
                <button type="button" className="btn-danger-custom" onClick={() => setShowEditPopup(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn-accent">
                  Sauvegarder les modifications
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ============================
          POPUP ALIMENTER STOCK
      ============================ */}
      {showStockPopup && (
        <div className="popup-overlay" onClick={() => setShowStockPopup(false)}>
          <div className="popup-card" onClick={(e) => e.stopPropagation()}>
            <h3>Réapprovisionnement rapide</h3>

            <form onSubmit={handleStockSubmit} className="d-flex flex-column gap-3">

              <div className="form-group-popup">
                <label>Quantité à ajouter au stock disponible</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Ex: 50"
                  min="1"
                  value={stockForm.quantite}
                  onChange={(e) => setStockForm({ ...stockForm, quantite: e.target.value })}
                  required
                />
              </div>

              <div className="form-group-popup">
                <label>Note d'accompagnement / Justificatif</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ex: Réception livraison fournisseur"
                  value={stockForm.commentaire}
                  onChange={(e) => setStockForm({ ...stockForm, commentaire: e.target.value })}
                />
              </div>

              <div className="d-flex justify-content-end gap-2 mt-2">
                <button type="button" className="btn-danger-custom" onClick={() => setShowStockPopup(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn-accent">
                  Injecter les unités
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}