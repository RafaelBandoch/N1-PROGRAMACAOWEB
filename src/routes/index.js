const express = require('express');
const router = express.Router();
const { authenticateToken, checkRole } = require('../middlewares/authMiddleware');

const authRouter = require('./auth');
const cacambasRouter = require('./cacambas');
const clientesRouter = require('./clientes');
const motoristasRouter = require('./motoristas');
const rotasRouter = require('./rotas');
const usuariosRouter = require('./usuarios');
const veiculosRouter = require('./veiculos');
const solicitacoesRouter = require('./solicitacoes');
const tarefasRouter = require('./tarefas');
const configRouter = require('./config');
const notificacoesRouter = require('./notificacoes');
const localizacaoRouter = require('./localizacao');
const dashboardRouter = require('./dashboard');
const relatoriosRouter = require('./relatorios');

router.use('/auth', authRouter);
router.use('/notificacoes', authenticateToken, notificacoesRouter);
router.use('/localizacao', authenticateToken, localizacaoRouter);
router.use('/dashboard', authenticateToken, checkRole(['admin']), dashboardRouter);
router.use('/relatorios', authenticateToken, checkRole(['admin']), relatoriosRouter);

// Rotas restritas para admin
router.use('/cacambas', authenticateToken, checkRole(['admin']), cacambasRouter);
router.use('/clientes', authenticateToken, checkRole(['admin']), clientesRouter);
router.use('/motoristas', authenticateToken, checkRole(['admin']), motoristasRouter);
router.use('/usuarios', authenticateToken, checkRole(['admin']), usuariosRouter);
router.use('/veiculos', authenticateToken, checkRole(['admin']), veiculosRouter);

// Rotas que motoristas e admins podem acessar
router.use('/rotas', authenticateToken, checkRole(['admin', 'motorista']), rotasRouter);
router.use('/tarefas', authenticateToken, checkRole(['admin', 'motorista']), tarefasRouter);

// Solicitacoes podem ser feitas por cliente, mas gerenciadas por admin.
// A verificacao de role mais fina ocorrera dentro do controller ou na propria definicao da rota se houver conflito.
// Por hora, deixaremos aberto para logados (admin, cliente) acessarem, e o middleware la dentro restringe as acoes especificas.
router.use('/solicitacoes', authenticateToken, solicitacoesRouter);

router.use('/config', authenticateToken, configRouter);

module.exports = router;
