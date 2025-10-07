import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useUser();

  // Afficher un loader pendant le chargement
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#6b7280'
      }}>
        Chargement...
      </div>
    );
  }

  // Si pas d'utilisateur connecté, rediriger vers login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si admin requis mais utilisateur n'est pas admin
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/home" replace />;
  }

  // Tout est bon, afficher le composant
  return children;
};

export default ProtectedRoute;
