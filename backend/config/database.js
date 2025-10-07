const mysql = require('mysql2/promise')

// Configuration du pool de connexions
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'user',
  database: process.env.DB_NAME || 'planningDB',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

async function testConnection() {
  try {
    const connection = await pool.getConnection()
    console.log('Connexion à la base de données réussie')
    connection.release()
  } catch (error) {
    console.error('Erreur de connexion à la base de données:', error.message)
  }
}

testConnection()

module.exports = pool

