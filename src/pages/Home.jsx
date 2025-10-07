// Home.jsx
import React, { useState, useEffect } from "react";
import "./auth.css";
import Navbar from "../components/Navbar/NavBar.jsx";
import PlanningGrid from "../components/Planning/PlanningGrid.jsx";

function Home() {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // Mettre à jour la date chaque minute
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000); // 60000 ms = 1 minute

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('fr-FR', options);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        {/* Affichage de la date et heure */}
        <div style={{
          color: 'black',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '20px',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '8px'
          }}>
            {formatDate(currentDate)}
          </div>
          <div style={{
            fontSize: '16px',
            opacity: '0.9',
            fontWeight: '500'
          }}>
            {formatTime(currentDate)}
          </div>
        </div>
        
        <PlanningGrid />
      </div>
    </>
  );
}

export default Home;
