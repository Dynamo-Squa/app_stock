import Layout from "../components/Layout";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalStock: 0,
  });

  const [loading, setLoading] = useState(true);

  // ============================
  //   FETCH STATS (GET /stats)
  // ============================
  const fetchStats = async () => {
    try {
      const response = await fetch("http://localhost:5000/stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <Layout>
      <h1 className="mb-4">Dashboard</h1>

      {loading && <p>Chargement des statistiques...</p>}

      {!loading && (
        <div className="dashboard-grid">
          <div className="card-global">
            <h4>Total Produits</h4>
            <p className="stat-number">{stats.totalProducts}</p>
          </div>

          <div className="card-global">
            <h4>Total Catégories</h4>
            <p className="stat-number">{stats.totalCategories}</p>
          </div>

          <div className="card-global">
            <h4>Stock Total</h4>
            <p className="stat-number">{stats.totalStock}</p>
          </div>
        </div>
      )}
    </Layout>
  );
}
