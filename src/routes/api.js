const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const veiculoController = require('../controllers/veiculoController');
const motoristaController = require('../controllers/motoristaController');
const clienteController = require('../controllers/clienteController');
const cacambaController = require('../controllers/cacambaController');
const rotaController = require('../controllers/rotaController');

// Usuários
router.post('/usuarios', usuarioController.criar);
router.get('/usuarios', usuarioController.listar);

// Veículos
router.post('/veiculos', veiculoController.criar);
router.get('/veiculos', veiculoController.listar);

// Motoristas
router.post('/motoristas', motoristaController.criar);
router.get('/motoristas', motoristaController.listar);

// Clientes
router.post('/clientes', clienteController.criar);
router.get('/clientes', clienteController.listar);

// Caçambas
router.post('/cacambas', cacambaController.criar);
router.get('/cacambas', cacambaController.listar);

// Rotas
router.post('/rotas', rotaController.criar);
router.get('/rotas', rotaController.listar);

module.exports = router;
