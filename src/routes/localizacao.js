const express = require('express');
const router = express.Router();
const localizacaoController = require('../controllers/localizacaoController');
const { checkRole } = require('../middlewares/authMiddleware');

router.post('/atualizar', checkRole(['motorista']), localizacaoController.updateLocation);
router.get('/:id', localizacaoController.getLocation);

module.exports = router;
