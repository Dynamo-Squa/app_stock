import Layout from "../components/Layout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    email: "",
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

      // Stockage du token
      localStorage.setItem("token", data.token);

      // Redirection
      navigate("/dashboard");

    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      setErrorMsg("Impossible de se connecter au serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="mb-4">Connexion</h1>

      <form onSubmit={handleSubmit} className="form-global">

        {errorMsg && <p className="text-danger">{errorMsg}</p>}

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Mot de passe</label>
          <input
            type="password"
            name="password"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn-submit">
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </Layout>
  );
}
