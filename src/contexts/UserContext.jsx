import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser doit être utilisé dans un UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simuler un utilisateur connecté au chargement (pour les tests)
  useEffect(() => {
    // Simuler un délai de chargement
    setTimeout(() => {
      // Pour les tests, on peut définir un utilisateur par défaut
      // En production, cela viendrait d'une API ou du localStorage
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        // Utilisateur par défaut pour les tests
        const defaultUser = {
          id: 1,
          username: 'admin',
          email: 'admin@labo-company.com',
          role: 'admin' // 'admin' ou 'student'
        };
        setUser(defaultUser);
        localStorage.setItem('user', JSON.stringify(defaultUser));
      }
      setLoading(false);
    }, 1000);
  }, []);

  const login = async (email, password) => {
    // Simulation de connexion
    // En production, ceci ferait un appel API
    const mockUsers = [
      {
        id: 1,
        username: 'admin',
        email: 'admin@labo-company.com',
        role: 'admin',
        password: 'admin123'
      },
      {
        id: 2,
        username: 'etudiant1',
        email: 'etudiant1@labo-company.com',
        role: 'student',
        password: 'student123'
      },
      {
        id: 3,
        username: 'etudiant2',
        email: 'etudiant2@labo-company.com',
        role: 'student',
        password: 'student123'
      }
    ];

    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const userToStore = {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        role: foundUser.role
      };
      
      setUser(userToStore);
      localStorage.setItem('user', JSON.stringify(userToStore));
      return { success: true, user: userToStore };
    } else {
      return { success: false, error: 'Email ou mot de passe incorrect' };
    }
  };

  const register = async (username, email, password) => {
    // Simulation d'inscription
    const newUser = {
      id: Date.now(),
      username,
      email,
      role: 'student' // Par défaut, les nouveaux utilisateurs sont des étudiants
    };
    
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  const isStudent = () => {
    return user && user.role === 'student';
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin,
    isStudent
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
