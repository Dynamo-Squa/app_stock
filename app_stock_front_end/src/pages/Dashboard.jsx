import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import "./Dashboard.css"; // Importation du CSS dédié à cette page

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/dashboard", {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token")
        }
      });

      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Erreur dashboard :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <p>Chargement des statistiques...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-header">
        <h1>Tableau de bord</h1>
        <p className="page-subtitle">Vue d'ensemble de l'activité de votre stock</p>
      </div>

      <div className="dashboard-grid">

        {/* Total Produits */}
        <div className="kpi-card">
          <h3>Total produits</h3>
          <p className="stat-number">{data?.totalProduits || 0}</p>
        </div>

        {/* Stock Bas (S'illumine en alerte si > 0) */}
        <div className={`kpi-card ${data?.stockBas > 0 ? "kpi-alert" : ""}`}>
          <h3>Stock bas</h3>
          <p className="stat-number style-danger">{data?.stockBas || 0}</p>
        </div>

        {/* Valeur du Stock */}
        <div className="kpi-card">
          <h3>Valeur du stock</h3>
          <p className="stat-number">
            {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(data?.valeurStock || 0)}
          </p>
        </div>

        {/* Entrées */}
        <div className="kpi-card">
          <h3>Entrées (7 jours)</h3>
          <p className="stat-number style-success">+{data?.entrees7jours || 0}</p>
        </div>

        {/* Sorties */}
        <div className="kpi-card">
          <h3>Sorties (7 jours)</h3>
          <p className="stat-number style-danger">-{data?.sorties7jours || 0}</p>
        </div>

      </div>
    </Layout>
  );
}