import Layout from "../components/Layout";
import { useEffect, useState } from "react";

export default function User() {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error("Erreur profil :", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <Layout>
      <h1>Profil</h1>

      {!user ? (
        <p>Chargement...</p>
      ) : (
        <div className="card-global p-3">
          <p><strong>Email :</strong> {user.email}</p>
          <p><strong>Nom :</strong> {user.name}</p>
        </div>
      )}
    </Layout>
  );
}
