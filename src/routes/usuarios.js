const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ rota: "usuarios funcionando" });
});

router.post('/', (req, res) => {
  res.json({ mensagem: "usuario criado" });
});

module.exports = router;
