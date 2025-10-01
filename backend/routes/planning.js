const express = require('express');
const router = express.Router();
const { query } = require('express-validator');
const { validateRequest } = require('../middlewares/validation');
const { requireAuth } = require('../middlewares/auth');
const planningController = require('../controllers/planningController');

const weekValidation = [
  query('date').optional().isISO8601().withMessage('Format de date invalide (ISO 8601 requis)')
];

router.get('/week', requireAuth, weekValidation, validateRequest, planningController.getWeekPlanning);

router.get('/', requireAuth, planningController.getAllEvents);

router.get('/:id', requireAuth, planningController.getEventById);

module.exports = router;
