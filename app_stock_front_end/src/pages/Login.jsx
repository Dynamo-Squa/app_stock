import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Importation du CSS dédié

export default function Login() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  // ============================
  //   HANDLE INPUTS
  // ============================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ============================
  //   SUBMIT (POST /auth/login)
  // ============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.message || "Identifiants incorrects");
        return;
      }

      localStorage.setItem("token", data.token);
      navigate("/dashboard");

    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      setErrorMsg("Impossible de se connecter au serveur distant.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        
        <h1>Connexion</h1>
        <span className="auth-subtitle">Accéder à la gestion des stocks</span>

        <form onSubmit={handleSubmit}>

          {errorMsg && (
            <div className="auth-error-alert" role="alert">
              {errorMsg}
            </div>
          )}

          <div className="mb-4">
            <label className="form-label">Identifiant / Email</label>
            <input
              type="email"
              name="username"
              className="form-control"
              placeholder="nom@exemple.com"
              value={form.username}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Mot de passe</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn-auth-submit" 
            disabled={loading}
          >
            {loading ? "Vérification..." : "Se connecter"}
          </button>
          
        </form>

      </div>
    </div>
  );
}