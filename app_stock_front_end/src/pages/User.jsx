import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import "./User.css"; // Importation du CSS dédié

export default function User() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Impossible de récupérer le profil");

      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error("Erreur profil :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Génération de la première lettre pour l'avatar visuel
  const getInitial = (username) => {
    if (!username) return "?";
    return username.charAt(0);
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1>Mon Compte</h1>
          <p className="page-subtitle">Consultez vos informations de connexion et vos privilèges d'accès</p>
        </div>
      </div>

      <div className="profile-wrapper">
        {loading && (
          <div className="loading-container">
            <p>Authentification et chargement du profil utilisateur...</p>
          </div>
        )}

        {!loading && !user && (
          <div className="loading-container">
            <p className="text-danger">Session expirée ou introuvable. Veuillez vous reconnecter.</p>
          </div>
        )}

        {!loading && user && (
          <div className="profile-card">
            
            {/* Bannière supérieure de l'utilisateur */}
            <div className="profile-header-banner">
              <div className="profile-avatar">
                {getInitial(user.username)}
              </div>
              <h2>Utilisateur Connecté</h2>
            </div>

            {/* Fiche technique des informations du compte */}
            <div className="profile-details">
              
              <div className="profile-info-row">
                <span className="profile-info-label">Identifiant / Email</span>
                <span className="profile-info-value">{user.username}</span>
              </div>

              <div className="profile-info-row">
              <span className="profile-info-label">Niveau d'habilitation</span>
              <span className="role-badge-user">
                {user.role || "Opérateur"}
              </span>
            </div>

              <div className="profile-info-row">
                <span className="profile-info-label">Statut du compte</span>
                <span className="profile-info-value" style={{ color: "#4BD396" }}>
                  ● Actif (Sécurisé)
                </span>
              </div>

            </div>

          </div>
        )}
      </div>
    </Layout>
  );
}