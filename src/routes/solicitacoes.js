const express = require('express');
const router = express.Router();
const solicitacaoController = require('../controllers/solicitacaoController');

router.get('/', solicitacaoController.index);
router.post('/', solicitacaoController.create);
router.patch('/:id/status', solicitacaoController.updateStatus);
router.post('/:id/aprovar', solicitacaoController.aprovar);

module.exports = router;
