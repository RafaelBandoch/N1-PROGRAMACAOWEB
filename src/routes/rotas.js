const express = require('express');
const router = express.Router();
const controller = require('../controllers/rotaController');

router.get('/', controller.listar);
router.post('/', controller.criar);
router.patch('/:id/status', controller.updateStatus);
router.get('/:id/tarefas', controller.getTarefas);

router.delete('/:id', controller.delete);
module.exports = router;
