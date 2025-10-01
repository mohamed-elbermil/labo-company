-- Création de la base de données planningDB
CREATE DATABASE IF NOT EXISTS planningDB;
USE planningDB;

-- Table utilisateurs
CREATE TABLE IF NOT EXISTS utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table planning
CREATE TABLE IF NOT EXISTS planning (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(200) NOT NULL,
    description TEXT,
    date_debut DATETIME NOT NULL,
    date_fin DATETIME NOT NULL,
    type ENUM('reunion', 'formation', 'conges', 'autre') DEFAULT 'autre',
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES utilisateurs(id) ON DELETE SET NULL,
    INDEX idx_dates (date_debut, date_fin),
    INDEX idx_type (type),
    INDEX idx_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertion d'utilisateurs de test (mots de passe hachés avec bcrypt)
-- Mot de passe pour admin: admin123
-- Mot de passe pour user: user123
INSERT INTO utilisateurs (username, password, role) VALUES
('admin', '$2b$10$VpCh/nXqZZkZvGp5kQxvC.KUPQxIvFzh7KFDHyPx6HdKPLB5yVJ0G', 'admin'),
('user', '$2b$10$cP3h8XqWLvJ5kV7UQz3w2eFTMW8oV5xN9kH2dXyK7tL6pY8wZ4qPe', 'user');

-- Insertion d'événements de test
INSERT INTO planning (titre, description, date_debut, date_fin, type, created_by) VALUES
('Réunion d\'équipe', 'Réunion hebdomadaire de l\'équipe', '2025-10-06 09:00:00', '2025-10-06 10:30:00', 'reunion', 1),
('Formation Docker', 'Formation sur Docker et les conteneurs', '2025-10-08 14:00:00', '2025-10-08 17:00:00', 'formation', 1),
('Congés', 'Congés annuels', '2025-10-15 00:00:00', '2025-10-20 23:59:59', 'conges', 2),
('Maintenance serveur', 'Maintenance planifiée des serveurs', '2025-10-10 22:00:00', '2025-10-11 02:00:00', 'autre', 1);

-- Affichage des données insérées
SELECT 'Utilisateurs créés:' AS info;
SELECT id, username, role FROM utilisateurs;

SELECT 'Événements créés:' AS info;
SELECT id, titre, date_debut, date_fin, type FROM planning;

