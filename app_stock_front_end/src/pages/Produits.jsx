import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Produits() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // POPUP MODIFICATION
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editProduct, setEditProduct] = useState({
    id: null,
    name: "",
    description: "",
    price: "",
    quantity: "",
    unit: "",
    category: "",
  });

  // ============================
  //   FETCH PRODUITS (GET)
  // ============================
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/products");
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
  //   SUPPRESSION (DELETE)
  // ============================
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce produit ?")) return;

    try {
      await fetch(`http://localhost:5000/products/${id}`, {
        method: "DELETE",
      });

      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Erreur suppression :", err);
    }
  };

  // ============================
  //   OUVRIR POPUP MODIFICATION
  // ============================
  const openEditPopup = (p) => {
    setEditProduct({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      quantity: p.quantity,
      unit: p.unit,
      category: p.category,
    });
    setShowEditPopup(true);
  };

  // ============================
  //   MODIFIER PRODUIT (PUT)
  // ============================
  const handleEdit = async (e) => {
    e.preventDefault();

    try {
      await fetch(`http://localhost:5000/products/${editProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editProduct),
      });

      // Mise à jour instantanée
      setProducts(
        products.map((p) =>
          p.id === editProduct.id ? editProduct : p
        )
      );

      setShowEditPopup(false);
    } catch (err) {
      console.error("Erreur modification :", err);
      alert("Impossible de modifier le produit.");
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <h1>Produits</h1>
        <Link to="/produits/ajouter" className="btn-accent">
          + Ajouter un produit
        </Link>
      </div>

      {loading && <p>Chargement...</p>}

      {!loading && products.length === 0 && <p>Aucun produit trouvé.</p>}

      {!loading && products.length > 0 && (
        <table className="table align-middle table-striped produits-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Nom</th>
              <th>Description</th>
              <th>Prix</th>
              <th>Quantité</th>
              <th>Catégorie</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>
                  <img src={p.image} alt={p.name} className="produit-img" />
                </td>
                <td className="fw-bold">{p.name}</td>
                <td>{p.description}</td>
                <td>{p.price} €</td>
                <td>{p.quantity} {p.unit}</td>
                <td>{p.category}</td>
                <td>
                  <button
                    className="btn-warning-custom"
                    onClick={() => openEditPopup(p)}
                  >
                    Modifier
                  </button>

                  <button
                    className="btn-danger-custom"
                    onClick={() => handleDelete(p.id)}
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ============================
          POP-UP MODIFICATION PRODUIT
      ============================ */}
      {showEditPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>Modifier le produit</h3>

            <form onSubmit={handleEdit} className="d-flex flex-column gap-3">

              <input
                type="text"
                className="form-control"
                value={editProduct.name}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, name: e.target.value })
                }
                required
              />

              <input
                type="text"
                className="form-control"
                value={editProduct.description}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, description: e.target.value })
                }
                required
              />

              <input
                type="number"
                className="form-control"
                value={editProduct.price}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, price: e.target.value })
                }
                required
              />

              <input
                type="number"
                className="form-control"
                value={editProduct.quantity}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, quantity: e.target.value })
                }
                required
              />

              <input
                type="text"
                className="form-control"
                value={editProduct.unit}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, unit: e.target.value })
                }
                required
              />

              <input
                type="text"
                className="form-control"
                value={editProduct.category}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, category: e.target.value })
                }
                required
              />

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn-danger-custom"
                  onClick={() => setShowEditPopup(false)}
                >
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
