// Home.jsx
import React from "react";
import "./auth.css";
import Navbar from "../components/Navbar/NavBar.jsx";
import PlanningGrid from "../components/Planning/PlanningGrid.jsx";

function Home() {
  return (
    <>
      <Navbar />
      <div className="page-container">
        <PlanningGrid />
      </div>
    </>
  );
}

export default Home;
