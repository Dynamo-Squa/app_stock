import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import "./Historique.css"; // Importation du CSS dédié côte à côte

export default function Historique() {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMovements = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/movements", {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token")
        }
      });

      const data = await res.json();
      setMovements(data);
    } catch (err) {
      console.error("Erreur fetch mouvements :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovements();
  }, []);

  return (
    <Layout>
      <div className="page-header">
        <h1>Historique des mouvements</h1>
        <p className="page-subtitle">Rapport d'audit en temps réel des entrées et sorties de stock</p>
      </div>

      {loading && (
        <div className="loading-container">
          <p>Chargement du journal des flux...</p>
        </div>
      )}

      {!loading && movements.length === 0 && (
        <div className="loading-container">
          <p>Aucun mouvement de stock enregistré pour le moment.</p>
        </div>
      )}

      {!loading && movements.length > 0 && (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Date / Heure</th>
                <th>Produit</th>
                <th>Type</th>
                <th>Quantité</th>
                <th>Commentaire</th>
              </tr>
            </thead>

            <tbody>
              {movements.map((m) => (
                <tr key={m.id}>
                  {/* Formatage de la date plus lisible */}
                  <td>{new Date(m.date_mouvement).toLocaleString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}</td>

                  <td className="product-name">{m.produitNom}</td>

                  <td>
                    {m.type_mouvement === "ENTREE" ? (
                      <span className="movement-badge badge-entree">Entrée</span>
                    ) : (
                      <span className="movement-badge badge-sortie">Sortie</span>
                    )}
                  </td>

                  <td>
                    {m.quantite} {m.unit}
                  </td>

                  <td className="text-comment" title={m.commentaire}>
                    {m.commentaire || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}