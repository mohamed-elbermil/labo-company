const express = require('express')
const session = require('express-session')
const cors = require('cors')
const helmet = require('helmet')
require('dotenv').config()

const authRoutes = require('./routes/auth')
const planningRoutes = require('./routes/planning')
const adminRoutes = require('./routes/admin')

const app = express()
const PORT = process.env.PORT

// Middlewares de sécurité
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))

// Parse JSON
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Configuration des sessions
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 24 heures
  }
}))

// Routes
app.use('/auth', authRoutes)
app.use('/planning', planningRoutes)
app.use('/admin', adminRoutes)

// Route de test
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' })
})

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' })
})

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Erreur serveur interne' })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur backend démarré sur le port ${PORT}`)
})

