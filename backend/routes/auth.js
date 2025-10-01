const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validateRequest } = require('../middlewares/validation');
const { requireAuth } = require('../middlewares/auth');
const authController = require('../controllers/authController');

const loginValidation = [
  body('username').trim().notEmpty().withMessage('Le nom d\'utilisateur est requis'),
  body('password').notEmpty().withMessage('Le mot de passe est requis')
];


router.post('/login', loginValidation, validateRequest, authController.login);

router.post('/logout', requireAuth, authController.logout);

router.get('/check', requireAuth, authController.checkSession);

router.get('/me', requireAuth, authController.getCurrentUser);

module.exports = router;

