import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { Line, Pie, Bar } from "react-chartjs-2";
import "./Graphiques.css"; // Importation du CSS dédié côte à côte
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

// Enregistrement des éléments essentiels de Chart.js
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend
);

export default function Graphiques() {
  const [charts, setCharts] = useState(null);

  useEffect(() => {
    const fetchCharts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/charts", {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
          }
        });
        const data = await res.json();
        setCharts(data);
      } catch (err) {
        console.error("Erreur récupération graphiques :", err);
      }
    };

    fetchCharts();
  }, []);

  if (!charts) {
    return (
      <Layout>
        <div className="loading-container">
          <p>Génération de vos rapports visuels...</p>
        </div>
      </Layout>
    );
  }

  // ==========================================================================
  // CONFIGURATION DES OPTIONS DU THÈME SOMBRE (Polices, Grilles translucides)
  // ==========================================================================
  const basePluginsConfig = {
    legend: {
      labels: {
        color: "rgba(255, 255, 255, 0.7)",
        font: { family: "'Inter', sans-serif", size: 12 }
      }
    },
    tooltip: {
      backgroundColor: "#1a1a22",
      titleColor: "#fff",
      bodyColor: "rgba(255, 255, 255, 0.8)",
      borderColor: "rgba(255, 255, 255, 0.1)",
      borderWidth: 1
    }
  };

  const xyScalesConfig = {
    x: {
      grid: { color: "rgba(255, 255, 255, 0.04)" },
      ticks: { color: "rgba(255, 255, 255, 0.5)", font: { family: "'Inter', sans-serif" } }
    },
    y: {
      grid: { color: "rgba(255, 255, 255, 0.04)" },
      ticks: { color: "rgba(255, 255, 255, 0.5)", font: { family: "'Inter', sans-serif" } }
    }
  };

  // ============================
  //   1) Mouvements 30 jours
  // ============================
  const lineData = {
    labels: charts.mouvements.map(m => m.date),
    datasets: [
      {
        label: "Entrées",
        data: charts.mouvements.map(m => m.entrees),
        borderColor: "#4BD396", // Vert émeraude moderne
        backgroundColor: "rgba(75, 211, 150, 0.1)",
        tension: 0.3,
        pointBackgroundColor: "#4BD396"
      },
      {
        label: "Sorties",
        data: charts.mouvements.map(m => m.sorties),
        borderColor: "#FF5C5C", // Rouge corail premium
        backgroundColor: "rgba(255, 92, 92, 0.1)",
        tension: 0.3,
        pointBackgroundColor: "#FF5C5C"
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: basePluginsConfig,
    scales: xyScalesConfig
  };

  // ============================
  //   2) Stock par catégorie
  // ============================
  const pieData = {
    labels: charts.stockCategories.map(c => c.categorie),
    datasets: [
      {
        data: charts.stockCategories.map(c => c.total),
        backgroundColor: [
          "#D4AF37", // Or mat (Signature)
          "#5B73A6", // Bleu ardoise pastel
          "#A370F7", // Violet électrique adouci
          "#4BD396", // Émeraude
          "#FF8A65"  // Orange doux
        ],
        borderWidth: 2,
        borderColor: "#16161a" // Délimitation sombre entre les parts
      }
    ]
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: basePluginsConfig
  };

  // ============================
  //   3) Top 5 sorties
  // ============================
  const barData = {
    labels: charts.topSorties.map(p => p.produit),
    datasets: [
      {
        label: "Unités sorties",
        data: charts.topSorties.map(p => p.total),
        backgroundColor: "rgba(255, 92, 92, 0.85)",
        borderRadius: 6, // Arrondir le haut des barres
        hoverBackgroundColor: "#FF5C5C"
      }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: basePluginsConfig,
    scales: xyScalesConfig
  };

  return (
    <Layout>
      <div className="page-header">
        <h1>Analyses & Graphiques</h1>
        <p className="page-subtitle">Suivi visuel des flux et états des stocks de l'association</p>
      </div>

      <div className="charts-layout">
        
        {/* Graphique temporel - Pleine largeur */}
        <div className="chart-card full-width">
          <h3>Mouvements des stocks (30 derniers jours)</h3>
          <div className="chart-wrapper">
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>

        {/* Répartition par catégorie */}
        <div className="chart-card">
          <h3>Volume de stock par catégorie</h3>
          <div className="chart-wrapper pie-wrapper">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>

        {/* Top Sorties */}
        <div className="chart-card">
          <h3>Top 5 des produits les plus sortis</h3>
          <div className="chart-wrapper">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

      </div>
    </Layout>
  );
}