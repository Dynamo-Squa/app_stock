import { Link } from "react-router-dom";
import "./Layout.css";

export default function Layout({ children }) {
  return (
    <div className="d-flex layout-container">
      {/* Sidebar */}
      <aside className="sidebar bg-dark text-white p-3">
        <h3 className="mb-4">StockApp</h3>

        <nav className="nav flex-column">
          <Link className="nav-link text-white" to="/dashboard">Dashboard</Link>
          <Link className="nav-link text-white" to="/produits">Produits</Link>
          <Link className="nav-link text-white" to="/categories">Catégories</Link>
        </nav>
      </aside>

      {/* Contenu principal */}
      <div className="main-content flex-grow-1">
        
        {/* Navbar Bootstrap */}
<nav className="navbar navbar-expand-lg custom-navbar">
  <div className="container-fluid navbar-inner">

    {/* Logo à gauche */}
    <div className="navbar-left">
      <span className="navbar-brand">AssoStock</span>
    </div>

    {/* Liens au centre */}
    <div className="navbar-center">
      <Link to="/dashboard" className="nav-link">Dashboard</Link>
      <Link to="/produits" className="nav-link">Produits</Link>
      <Link to="/categories" className="nav-link">Catégories</Link>
    </div>

    {/* Profil + Déconnexion à droite */}
    <div className="navbar-right">
      <Link to="/profil" className="nav-link">Profil</Link>
      <Link to="/logout" className="nav-link">Déconnexion</Link>
    </div>

  </div>
</nav>



        {/* Page */}
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
