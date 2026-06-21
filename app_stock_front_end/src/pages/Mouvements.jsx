import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import "./Mouvements.css"; // Importation du CSS dédié côte à côte

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
      const headers = {
        "Authorization": "Bearer " + localStorage.getItem("token")
      };

      // CORRECTION ICI : Ajout de /api/ et correction de /mouvements en /movements
      const [resM, resP] = await Promise.all([
        fetch("http://localhost:5000/api/movements", { headers }),
        fetch("http://localhost:5000/api/products", { headers })
      ]);

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
      // CORRECTION ICI : Ajout de /api/movements pour la création du flux
      const res = await fetch("http://localhost:5000/api/movements", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Erreur serveur lors de l'ajout");
      const created = await res.json();

      // Mise à jour instantanée du tableau
      setMouvements([created, ...mouvements]);

      // Reset du formulaire + fermeture de la pop-up
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
        <div>
          <h1>Mouvements de stock</h1>
          <p className="page-subtitle">Pilotez les entrées et sorties de marchandises instantanément</p>
        </div>
        <button className="btn-accent" onClick={() => setShowPopup(true)}>
          + Effectuer un mouvement
        </button>
      </div>

      {loading && (
        <div className="loading-container">
          <p>Chargement du registre des flux...</p>
        </div>
      )}

      {!loading && mouvements.length === 0 && (
        <div className="loading-container">
          <p>Aucun mouvement enregistré pour le moment.</p>
        </div>
      )}

      {!loading && mouvements.length > 0 && (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Type de flux</th>
                <th>Quantité</th>
                <th>Date d'action</th>
                <th>Commentaire / Motif</th>
              </tr>
            </thead>

            <tbody>
              {mouvements.map((m) => (
                <tr key={m.id}>
                  <td className="product-name">{m.product_name}</td>
                  <td>
                    {m.type_mouvement === "ENTREE" ? (
                      <span className="movement-badge badge-entree">Entrée</span>
                    ) : (
                      <span className="movement-badge badge-sortie">Sortie</span>
                    )}
                  </td>
                  <td className="fw-bold">{m.quantite}</td>
                  <td>{new Date(m.date).toLocaleString("fr-FR")}</td>
                  <td className="text-comment" title={m.commentaire}>
                    {m.commentaire || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ============================
          POP-UP MODALE D'AJOUT
      ============================ */}
      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-card" onClick={(e) => e.stopPropagation()}>
            <h3>Enregistrer un flux</h3>

            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
              
              <div>
                <select
                  className="form-select"
                  value={form.product_id}
                  onChange={(e) => setForm({ ...form, product_id: e.target.value })}
                  required
                >
                  <option value="">Sélectionner le produit ciblé...</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  className="form-select"
                  value={form.type_mouvement}
                  onChange={(e) => setForm({ ...form, type_mouvement: e.target.value })}
                >
                  <option value="ENTREE">📈 Entrée de stock (Réapprovisionnement)</option>
                  <option value="SORTIE">📉 Sortie de stock (Distribution / Perte)</option>
                </select>
              </div>

              <div>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Quantité transférée"
                  min="1"
                  value={form.quantite}
                  onChange={(e) => setForm({ ...form, quantite: e.target.value })}
                  required
                />
              </div>

              <div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Note, bon de livraison, motif..."
                  value={form.commentaire}
                  onChange={(e) => setForm({ ...form, commentaire: e.target.value })}
                />
              </div>

              <div className="d-flex justify-content-end gap-2 mt-2">
                <button
                  type="button"
                  className="btn-danger-custom"
                  onClick={() => setShowPopup(false)}
                >
                  Annuler
                </button>
                <button type="submit" className="btn-accent">
                  Confirmer le flux
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}