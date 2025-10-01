// Home.jsx
import React from "react";
import "./auth.css";
import Navbar from "../components/Navbar/NavBar.jsx";

function Home() {
  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="auth-card">
          <h1 className="auth-title">Accueil</h1>
          <p className="auth-subtitle">Bienvenue sur votre espace.</p>
        </div>
      </div>
    </>
  );
}

export default Home;
