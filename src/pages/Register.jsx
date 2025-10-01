// Register.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./auth.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!username || !email || !password || !confirm) {
      setError("Tous les champs sont requis.");
      return;
    }
    if (username.length < 3) {
      setError("Le pseudo doit contenir au moins 3 caractères.");
      return;
    }
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    // Front uniquement pour l'instant
    console.log("Register form submitted", { username, email, password });
    alert("Inscription simulée (front uniquement)");
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Inscription</h1>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label">Pseudo</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="auth-input"
              placeholder="votre_pseudo"
            />
          </div>
          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-input"
              placeholder="vous@example.com"
            />
          </div>
          <div className="auth-field">
            <label className="auth-label">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="auth-input"
              placeholder="••••••••"
            />
          </div>
          <div className="auth-field">
            <label className="auth-label">Confirmer le mot de passe</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="auth-input"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="auth-submit">S'inscrire</button>
        </form>

        <p className="auth-footer">
          Déjà un compte ? {" "}
          <Link to="/login" className="auth-link">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;


