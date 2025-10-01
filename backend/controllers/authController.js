const bcrypt = require('bcrypt');
const db = require('../config/database');

// Connexion d'un utilisateur
async function login(req, res) {
  try {
    const { username, password } = req.body;

    // Rechercher l'utilisateur dans la base de données
    const [users] = await db.query(
      'SELECT id, username, password, role FROM utilisateurs WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    const user = users[0];

    // Vérifier le mot de passe
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    // Créer la session
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.userRole = user.role;

    res.json({
      message: 'Connexion réussie',
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
}

// Déconnexion d'un utilisateur
function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la déconnexion' });
    }
    res.json({ message: 'Déconnexion réussie' });
  });
}

// Vérifier la session
function checkSession(req, res) {
  res.json({
    isAuthenticated: true,
    user: {
      id: req.session.userId,
      username: req.session.username,
      role: req.session.userRole
    }
  });
}

// Obtenir les informations de l'utilisateur connecté
async function getCurrentUser(req, res) {
  try {
    const [users] = await db.query(
      'SELECT id, username, role, created_at FROM utilisateurs WHERE id = ?',
      [req.session.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json({ user: users[0] });

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

module.exports = {
  login,
  logout,
  checkSession,
  getCurrentUser
};

