const express = require('express');
const router = express.Router();
const tarefaController = require('../controllers/tarefaController');

router.post('/', tarefaController.criar);
router.get('/', tarefaController.listar);
router.patch('/:id/status', tarefaController.updateStatus);

router.delete('/:id', tarefaController.delete);
module.exports = router;
