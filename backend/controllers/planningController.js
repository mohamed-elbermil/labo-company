const db = require('../config/database')

async function getWeekPlanning(req, res) {
  try {
    const targetDate = req.query.date ? new Date(req.query.date) : new Date()
    
    const dayOfWeek = targetDate.getDay()
    const diff = targetDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
    const startOfWeek = new Date(targetDate.setDate(diff))
    startOfWeek.setHours(0, 0, 0, 0)
    
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    endOfWeek.setHours(23, 59, 59, 999)

    const [events] = await db.query(
      `SELECT p.id, p.titre, p.description, p.professeur, p.jour_semaine, 
              p.heure_debut, p.heure_fin, p.salle, p.date_debut, p.date_fin, 
              p.type, p.created_by, u.username as created_by_username
       FROM planning p
       LEFT JOIN utilisateurs u ON p.created_by = u.id
       WHERE (p.date_debut BETWEEN ? AND ?)
          OR (p.date_fin BETWEEN ? AND ?)
          OR (p.date_debut <= ? AND p.date_fin >= ?)
       ORDER BY p.date_debut ASC`,
      [startOfWeek, endOfWeek, startOfWeek, endOfWeek, startOfWeek, endOfWeek]
    )

    res.json({
      weekStart: startOfWeek,
      weekEnd: endOfWeek,
      events: events
    })

  } catch (error) {
    console.error('Erreur lors de la récupération du planning:', error)
    res.status(500).json({ error: 'Erreur lors de la récupération du planning' })
  }
}

async function getAllEvents(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 50
    const offset = parseInt(req.query.offset) || 0

    const [events] = await db.query(
      `SELECT p.id, p.titre, p.description, p.professeur, p.jour_semaine, 
              p.heure_debut, p.heure_fin, p.salle, p.date_debut, p.date_fin, 
              p.type, p.created_by, u.username as created_by_username, p.created_at
       FROM planning p
       LEFT JOIN utilisateurs u ON p.created_by = u.id
       ORDER BY p.date_debut DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    )

    const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM planning')

    res.json({
      events: events,
      total: total,
      limit: limit,
      offset: offset
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error)
    res.status(500).json({ error: 'Erreur lors de la récupération des événements' })
  }
}

async function getEventById(req, res) {
  try {
    const eventId = parseInt(req.params.id)

    if (isNaN(eventId)) {
      return res.status(400).json({ error: 'ID invalide' })
    }

    const [events] = await db.query(
      `SELECT p.id, p.titre, p.description, p.professeur, p.jour_semaine, 
              p.heure_debut, p.heure_fin, p.salle, p.date_debut, p.date_fin, 
              p.type, p.created_by, u.username as created_by_username, p.created_at
       FROM planning p
       LEFT JOIN utilisateurs u ON p.created_by = u.id
       WHERE p.id = ?`,
      [eventId]
    )

    if (events.length === 0) {
      return res.status(404).json({ error: 'Événement non trouvé' })
    }

    res.json({ event: events[0] })

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'événement:', error)
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'événement' })
  }
}

module.exports = {getWeekPlanning,getAllEvents,getEventById}

