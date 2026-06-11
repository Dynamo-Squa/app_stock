import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Produits from "./pages/Produits.jsx";
import AjouterProduit from "./pages/AjouterProduit.jsx";
import Categories from "./pages/Categories.jsx";
import AjouterCategorie from "./pages/AjouterCategorie.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/produits" element={<Produits />} />
        <Route path="/produits/ajouter" element={<AjouterProduit />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/ajouter" element={<AjouterCategorie />} />
      </Routes>
    </Router>
  );
}

export default App;
