import Layout from "../components/Layout";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalStock: 0,
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ============================
  //   FETCH STATS + PRODUCTS
  // ============================
  const fetchData = async () => {
    try {
      const resStats = await fetch("http://localhost:5000/stats");
      const resProducts = await fetch("http://localhost:5000/products");

      const dataStats = await resStats.json();
      const dataProducts = await resProducts.json();

      setStats(dataStats);
      setProducts(dataProducts);
    } catch (error) {
      console.error("Erreur lors du chargement du dashboard :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ============================
  //   CALCUL STOCK BAS
  // ============================
  const lowStockCount = products.filter(
    (p) => p.quantity <= (p.quantite_min || 5)
  ).length;

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

          {/* INDICATEUR STOCK BAS */}
          <div className={`card-global ${lowStockCount > 0 ? "kpi-alert" : ""}`}>
            <h4>Stock bas</h4>
            <p className="stat-number">{lowStockCount}</p>
          </div>

        </div>
      )}
    </Layout>
  );
}
