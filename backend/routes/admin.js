const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validateRequest } = require('../middlewares/validation');
const { requireAdmin } = require('../middlewares/auth');
const adminController = require('../controllers/adminController');

router.use(requireAdmin);
const eventValidation = [
  body('titre').trim().notEmpty().withMessage('Le titre est requis')
    .isLength({ max: 200 }).withMessage('Le titre ne doit pas dépasser 200 caractères'),
  body('description').optional().trim()
    .isLength({ max: 1000 }).withMessage('La description ne doit pas dépasser 1000 caractères'),
  body('date_debut').notEmpty().withMessage('La date de début est requise')
    .isISO8601().withMessage('Format de date de début invalide'),
  body('date_fin').notEmpty().withMessage('La date de fin est requise')
    .isISO8601().withMessage('Format de date de fin invalide'),
  body('type').optional().trim()
    .isIn(['reunion', 'formation', 'conges', 'autre']).withMessage('Type d\'événement invalide')
];

router.post('/events', eventValidation, validateRequest, adminController.createEvent);
router.put('/events/:id', eventValidation, validateRequest, adminController.updateEvent);
router.delete('/events/:id', adminController.deleteEvent);

// ==================== GESTION DES UTILISATEURS ====================

const userValidation = [
  body('username').trim().notEmpty().withMessage('Le nom d\'utilisateur est requis')
    .isLength({ min: 3, max: 50 }).withMessage('Le nom d\'utilisateur doit contenir entre 3 et 50 caractères')
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, - et _'),
  body('password').notEmpty().withMessage('Le mot de passe est requis')
    .isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères'),
  body('role').optional().isIn(['admin', 'user']).withMessage('Rôle invalide')
];

router.post('/users', userValidation, validateRequest, adminController.createUser);
router.get('/users', adminController.getAllUsers);
router.delete('/users/:id', adminController.deleteUser);
router.patch('/users/:id/role', adminController.updateUserRole);

module.exports = router;

