const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ rota: "clientes funcionando" });
});

router.post('/', (req, res) => {
  res.json({ mensagem: "cliente criado" });
});

module.exports = router;
