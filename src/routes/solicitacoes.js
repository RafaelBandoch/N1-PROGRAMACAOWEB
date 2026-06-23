const express = require('express');
const router = express.Router();
const solicitacaoController = require('../controllers/solicitacaoController');
const { authenticateToken, checkRole } = require('../middlewares/authMiddleware');

router.get('/', solicitacaoController.index);
router.post('/', solicitacaoController.create);
router.get('/gastos/cliente', authenticateToken, solicitacaoController.obterGastosCliente);
router.patch('/:id/status', solicitacaoController.updateStatus);
router.post('/:id/aprovar', authenticateToken, checkRole(['admin']), solicitacaoController.aprovar);
router.get('/:id/rastreamento', authenticateToken, checkRole(['cliente', 'admin']), solicitacaoController.rastrear);
router.delete('/:id', authenticateToken, checkRole(['admin']), solicitacaoController.delete);
module.exports = router;
