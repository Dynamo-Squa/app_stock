import Layout from "../components/Layout";
import { useEffect, useState } from "react";

export default function Mouvements() {
  const [mouvements, setMouvements] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // POPUP AJOUT
  const [showPopup, setShowPopup] = useState(false);
  const [form, setForm] = useState({
    product_id: "",
    type_mouvement: "ENTREE",
    quantite: "",
    commentaire: "",
  });

  // ============================
  //   FETCH MOUVEMENTS + PRODUITS
  // ============================
  const fetchData = async () => {
    try {
      const resM = await fetch("http://localhost:5000/mouvements");
      const resP = await fetch("http://localhost:5000/products");

      const dataM = await resM.json();
      const dataP = await resP.json();

      setMouvements(dataM);
      setProducts(dataP);
    } catch (err) {
      console.error("Erreur fetch :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ============================
  //   AJOUT MOUVEMENT (POST)
  // ============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/mouvements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const created = await res.json();

      // Mise à jour instantanée
      setMouvements([created, ...mouvements]);

      // Reset + fermeture
      setForm({
        product_id: "",
        type_mouvement: "ENTREE",
        quantite: "",
        commentaire: "",
      });
      setShowPopup(false);
    } catch (err) {
      console.error("Erreur ajout mouvement :", err);
      alert("Impossible d'ajouter le mouvement.");
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <h1>Mouvements de stock</h1>
        <button className="btn-accent" onClick={() => setShowPopup(true)}>
          + Ajouter un mouvement
        </button>
      </div>

      {loading && <p>Chargement...</p>}

      {!loading && mouvements.length === 0 && (
        <p>Aucun mouvement enregistré.</p>
      )}

      {!loading && mouvements.length > 0 && (
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>Produit</th>
              <th>Type</th>
              <th>Quantité</th>
              <th>Date</th>
              <th>Commentaire</th>
            </tr>
          </thead>

          <tbody>
            {mouvements.map((m) => (
              <tr key={m.id}>
                <td>{m.product_name}</td>
                <td>
                  {m.type_mouvement === "ENTREE" ? "Entrée" : "Sortie"}
                </td>
                <td>{m.quantite}</td>
                <td>{new Date(m.date).toLocaleString()}</td>
                <td>{m.commentaire || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ============================
          POP-UP AJOUT MOUVEMENT
      ============================ */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>Ajouter un mouvement</h3>

            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">

              {/* PRODUIT */}
              <select
                className="form-select"
                value={form.product_id}
                onChange={(e) =>
                  setForm({ ...form, product_id: e.target.value })
                }
                required
              >
                <option value="">Sélectionner un produit</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              {/* TYPE */}
              <select
                className="form-select"
                value={form.type_mouvement}
                onChange={(e) =>
                  setForm({ ...form, type_mouvement: e.target.value })
                }
              >
                <option value="ENTREE">Entrée</option>
                <option value="SORTIE">Sortie</option>
              </select>

              {/* QUANTITE */}
              <input
                type="number"
                className="form-control"
                placeholder="Quantité"
                value={form.quantite}
                onChange={(e) =>
                  setForm({ ...form, quantite: e.target.value })
                }
                required
              />

              {/* COMMENTAIRE */}
              <input
                type="text"
                className="form-control"
                placeholder="Commentaire (optionnel)"
                value={form.commentaire}
                onChange={(e) =>
                  setForm({ ...form, commentaire: e.target.value })
                }
              />

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn-danger-custom"
                  onClick={() => setShowPopup(false)}
                >
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
    </Layout>
  );
}
