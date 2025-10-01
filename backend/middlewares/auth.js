function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Authentification requise' });
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Authentification requise' });
  }
  
  if (req.session.userRole !== 'admin') {
    return res.status(403).json({ error: 'Accès refusé. Droits administrateur requis.' });
  }
  
  next();
}

function requireRole(roles) {
  return (req, res, next) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Authentification requise' });
    }
    
    if (!roles.includes(req.session.userRole)) {
      return res.status(403).json({ error: 'Accès refusé.' });
    }
    
    next();
  };
}

module.exports = {requireAuth,requireAdmin,requireRole};

