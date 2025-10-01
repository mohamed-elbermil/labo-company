import React from 'react';
import styles from './NavBar.module.css';

const Navbar = () => {
    return (
      <nav className="navbar_container">
        <div className={styles.navbar_container}>
          {/* Logo */}
          <div className="text-2xl font-bold text-blue-600">
            OSEF
          </div>
  
          {/* Liens */}
          <ul className={styles.list_navbar}>
            <li>
              <a href="#home" className="hover:text-blue-600 transition">
                Home
              </a>
            </li>
          </ul>
        </div>
      </nav>
    );
  };
  
  export default Navbar;