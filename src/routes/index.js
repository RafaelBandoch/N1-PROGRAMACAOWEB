const express = require('express');
const router = express.Router();

const cacambasRouter = require('./cacambas');
const clientesRouter = require('./clientes');
const motoristasRouter = require('./motoristas');
const rotasRouter = require('./rotas');
const usuariosRouter = require('./usuarios');
const veiculosRouter = require('./veiculos');
const solicitacoesRouter = require('./solicitacoes');

router.use('/cacambas', cacambasRouter);
router.use('/clientes', clientesRouter);
router.use('/motoristas', motoristasRouter);
router.use('/rotas', rotasRouter);
router.use('/usuarios', usuariosRouter);
router.use('/veiculos', veiculosRouter);
router.use('/solicitacoes', solicitacoesRouter);

module.exports = router;
