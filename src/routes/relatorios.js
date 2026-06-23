const express = require('express');
const router = express.Router();
const relatorioController = require('../controllers/relatorioController');
const { authenticateToken, checkRole } = require('../middlewares/authMiddleware');

router.get('/financeiro', authenticateToken, checkRole(['admin']), relatorioController.relatorioFinanceiro);
router.get('/clientes-maior-gasto', authenticateToken, checkRole(['admin']), relatorioController.relatorioClientesMaiorGasto);

module.exports = router;
