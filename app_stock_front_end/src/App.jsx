import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Produits from "./pages/Produits.jsx";
import AjouterProduit from "./pages/AjouterProduit.jsx";
import Categories from "./pages/Categories.jsx";
import User from "./pages/User.jsx";
import Logout from "./pages/Logout.jsx";

// ============================
//   PROTECTION DES ROUTES
// ============================
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <Routes>

        {/* LOGIN */}
        <Route path="/" element={<Login />} />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* PRODUITS */}
        <Route
          path="/produits"
          element={
            <PrivateRoute>
              <Produits />
            </PrivateRoute>
          }
        />

        <Route
          path="/produits/ajouter"
          element={
            <PrivateRoute>
              <AjouterProduit />
            </PrivateRoute>
          }
        />

        {/* CATÉGORIES */}
        <Route
          path="/categories"
          element={
            <PrivateRoute>
              <Categories />
            </PrivateRoute>
          }
        />

        {/* PROFIL */}
        <Route
          path="/profil"
          element={
            <PrivateRoute>
              <User />
            </PrivateRoute>
          }
        />

        {/* DÉCONNEXION */}
        <Route
          path="/logout"
          element={
            <PrivateRoute>
              <Logout />
            </PrivateRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
