const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ rota: "motoristas funcionando" });
});

router.post('/', (req, res) => {
  res.json({ mensagem: "motorista criado" });
});

module.exports = router;
