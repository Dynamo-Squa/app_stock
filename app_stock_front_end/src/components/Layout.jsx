import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Layout.css";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Fonction de déconnexion propre
  const handleLogout = () => {
    localStorage.removeItem("token"); 
    navigate("/login"); 
  };

  // Helper pour attribuer la classe active aux liens de la sidebar
  const isActive = (path) => location.pathname === path ? "active" : "";

  return (
    <div className="layout-container">
      
      {/* SIDEBAR: NAVIGATION PRINCIPALE (Masquée sur petit mobile ou rétractable) */}
      <aside className="main-sidebar">
        <div className="sidebar-brand">
          <span className="brand-dot"></span>
          <h3>StockApp</h3>
        </div>

        <nav className="sidebar-nav">
          <Link className={`sidebar-link ${isActive("/dashboard")}`} to="/dashboard">
            <span className="nav-icon"></span> Dashboard
          </Link>
          <Link className={`sidebar-link ${isActive("/produits")}`} to="/produits">
            <span className="nav-icon"></span> Produits
          </Link>
          <Link className={`sidebar-link ${isActive("/mouvements")}`} to="/mouvements">
            <span className="nav-icon"></span> Mouvements
          </Link>
          <Link className={`sidebar-link ${isActive("/categories")}`} to="/categories">
            <span className="nav-icon"></span> Catégories
          </Link>
        </nav>
      </aside>

      {/* CONTENEUR DU CONTENU DE DROITE */}
      <div className="main-content-wrapper">
        
        {/* NAVBAR SUPÉRIEURE: IDENTITÉ & SESSION */}
        <header className="top-navbar">
          <div className="navbar-left-section">
            <span className="app-platform-badge">StockApp Management</span>
          </div>

          <div className="navbar-right-section">
            <Link to="/profil" className={`navbar-profile-link ${isActive("/user")}`}>
              <div className="avatar-mini">U</div>
              <span>Mon Profil</span>
            </Link>
            
            <button onClick={handleLogout} className="btn-logout-trigger" title="Se déconnecter">
               Déconnexion
            </button>
          </div>
        </header>

        {/* INJECTION DYNAMIQUE DES PAGES ENFANTS */}
        <main className="content-body">
          {children}
        </main>

      </div>
    </div>
  );
}