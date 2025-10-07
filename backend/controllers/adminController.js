const bcrypt = require('bcrypt')
const db = require('../config/database')
const { sanitizeInput } = require('../middlewares/validation')


async function createEvent(req, res) {
  try {
    const { titre, description, professeur, jour_semaine, heure_debut, heure_fin, salle, date_debut, date_fin, type } = req.body

    const cleanTitre = sanitizeInput(titre)
    const cleanDescription = description ? sanitizeInput(description) : null
    const cleanProfesseur = sanitizeInput(professeur)
    const cleanSalle = sanitizeInput(salle)
    const cleanType = type || 'autre'

    if (new Date(date_fin) < new Date(date_debut)) {
      return res.status(400).json({ error: 'La date de fin doit être après la date de début' })
    }

    // Validation que l'heure de fin est après l'heure de début
    if (heure_fin <= heure_debut) {
      return res.status(400).json({ error: 'L\'heure de fin doit être après l\'heure de début' })
    }

    const [result] = await db.query(
      `INSERT INTO planning (titre, description, professeur, jour_semaine, heure_debut, heure_fin, salle, date_debut, date_fin, type, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [cleanTitre, cleanDescription, cleanProfesseur, jour_semaine, heure_debut, heure_fin, cleanSalle, date_debut, date_fin, cleanType, req.session.userId]
    )

    res.status(201).json({
      message: 'Événement créé avec succès',
      eventId: result.insertId
    })

  } catch (error) {
    console.error('Erreur lors de la création de l\'événement:', error)
    res.status(500).json({ error: 'Erreur lors de la création de l\'événement' })
  }
}

async function updateEvent(req, res) {
  try {
    const eventId = parseInt(req.params.id)
    const { titre, description, professeur, jour_semaine, heure_debut, heure_fin, salle, date_debut, date_fin, type } = req.body

    if (isNaN(eventId)) {
      return res.status(400).json({ error: 'ID invalide' })
    }

    const [existingEvents] = await db.query('SELECT id FROM planning WHERE id = ?', [eventId])
    
    if (existingEvents.length === 0) {
      return res.status(404).json({ error: 'Événement non trouvé' })
    }

    const cleanTitre = sanitizeInput(titre)
    const cleanDescription = description ? sanitizeInput(description) : null
    const cleanProfesseur = sanitizeInput(professeur)
    const cleanSalle = sanitizeInput(salle)
    const cleanType = type || 'autre'

    if (new Date(date_fin) < new Date(date_debut)) {
      return res.status(400).json({ error: 'La date de fin doit être après la date de début' })
    }

    if (heure_fin <= heure_debut) {
      return res.status(400).json({ error: 'L\'heure de fin doit être après l\'heure de début' })
    }

    await db.query(
      `UPDATE planning 
       SET titre = ?, description = ?, professeur = ?, jour_semaine = ?, heure_debut = ?, heure_fin = ?, salle = ?, date_debut = ?, date_fin = ?, type = ? 
       WHERE id = ?`,
      [cleanTitre, cleanDescription, cleanProfesseur, jour_semaine, heure_debut, heure_fin, cleanSalle, date_debut, date_fin, cleanType, eventId]
    )

    res.json({ message: 'Événement modifié avec succès' })

  } catch (error) {
    console.error('Erreur lors de la modification de l\'événement:', error)
    res.status(500).json({ error: 'Erreur lors de la modification de l\'événement' })
  }
}

async function deleteEvent(req, res) {
  try {
    const eventId = parseInt(req.params.id)

    if (isNaN(eventId)) {
      return res.status(400).json({ error: 'ID invalide' })
    }

    const [result] = await db.query('DELETE FROM planning WHERE id = ?', [eventId])

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Événement non trouvé' })
    }

    res.json({ message: 'Événement supprimé avec succès' })

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'événement:', error)
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'événement' })
  }
}

// ==================== GESTION DES UTILISATEURS ====================

// Créer un utilisateur
async function createUser(req, res) {
  try {
    const { username, password, role } = req.body

    const [existingUsers] = await db.query(
      'SELECT id FROM utilisateurs WHERE username = ?',
      [username]
    )

    if (existingUsers.length > 0) {
      return res.status(409).json({ error: 'Ce nom d\'utilisateur existe déjà' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const [result] = await db.query(
      'INSERT INTO utilisateurs (username, password, role) VALUES (?, ?, ?)',
      [username, hashedPassword, role || 'user']
    )

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      userId: result.insertId
    })

  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error)
    res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' })
  }
}

async function getAllUsers(req, res) {
  try {
    const [users] = await db.query(
      'SELECT id, username, role, created_at FROM utilisateurs ORDER BY created_at DESC'
    )

    res.json({ users })

  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error)
    res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' })
  }
}

async function deleteUser(req, res) {
  try {
    const userId = parseInt(req.params.id)

    if (isNaN(userId)) {
      return res.status(400).json({ error: 'ID invalide' })
    }

    if (userId === req.session.userId) {
      return res.status(400).json({ error: 'Vous ne pouvez pas supprimer votre propre compte' })
    }

    const [result] = await db.query('DELETE FROM utilisateurs WHERE id = ?', [userId])

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }

    res.json({ message: 'Utilisateur supprimé avec succès' })

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error)
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'utilisateur' })
  }
}

async function updateUserRole(req, res) {
  try {
    const userId = parseInt(req.params.id)
    const { role } = req.body

    if (isNaN(userId)) {
      return res.status(400).json({ error: 'ID invalide' })
    }

    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ error: 'Rôle invalide' })
    }

    if (userId === req.session.userId) {
      return res.status(400).json({ error: 'Vous ne pouvez pas modifier votre propre rôle' })
    }

    const [result] = await db.query(
      'UPDATE utilisateurs SET role = ? WHERE id = ?',
      [role, userId]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }

    res.json({ message: 'Rôle modifié avec succès' })

  } catch (error) {
    console.error('Erreur lors de la modification du rôle:', error)
    res.status(500).json({ error: 'Erreur lors de la modification du rôle' })
  }
}

module.exports = {createEvent,updateEvent,deleteEvent,createUser,getAllUsers,deleteUser,updateUserRole}  