import React from 'react';
import { useUser } from '../../contexts/UserContext';
import styles from './NavBar.module.css';

const Navbar = () => {
    const { user, logout, isAdmin } = useUser();

    const handleLogout = () => {
        logout();
        window.location.href = '/login';
    };

    return (
      <nav className="navbar_container">
        <div className={styles.navbar_container}>
          {/* Logo */}
          <div className="text-2xl font-bold text-blue-600">
            <a href="/home">Labo Company</a> 
          </div>
  
          {/* Navigation */}
          <ul className={styles.list_navbar}>
            <li>
              <a href="/home" className="hover:text-blue-600 transition">
                Planning
              </a>
            </li>
            {isAdmin() && (
              <li>
                <a href="/admin" className="hover:text-blue-600 transition">
                  Administration
                </a>
              </li>
            )}
          </ul>

          {/* Informations utilisateur */}
          {user && (
            <div className={styles.user_info}>
              <span className={styles.user_name}>
                {user.username} ({user.role === 'admin' ? 'Administrateur' : 'Étudiant'})
              </span>
              <button 
                onClick={handleLogout}
                className={styles.logout_btn}
              >
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </nav>
    );
  };
  
  export default Navbar;