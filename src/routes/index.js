const express = require('express');
const router = express.Router();

router.use('/usuarios', require('./usuarios'));
router.use('/clientes', require('./clientes'));
router.use('/motoristas', require('./motoristas'));
router.use('/veiculos', require('./veiculos'));
router.use('/cacambas', require('./cacambas'));
router.use('/rotas', require('./rotas'));

module.exports = router;
