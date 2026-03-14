const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ rota: "cacambas funcionando" });
});

router.post('/', (req, res) => {
  res.json({ mensagem: "cacamba criada" });
});

module.exports = router;
