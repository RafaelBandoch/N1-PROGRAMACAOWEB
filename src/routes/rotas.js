const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ rota: "rotas funcionando" });
});

router.post('/', (req, res) => {
  res.json({ mensagem: "rota criada" });
});

module.exports = router;
