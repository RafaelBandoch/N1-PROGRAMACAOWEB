const express = require('express');
const router = express.Router();
const notificacoesController = require('../controllers/notificacoesController');

router.get('/', notificacoesController.index);
router.patch('/:id/ler', notificacoesController.markAsRead);
router.post('/ler-todas', notificacoesController.markAllAsRead);

module.exports = router;
