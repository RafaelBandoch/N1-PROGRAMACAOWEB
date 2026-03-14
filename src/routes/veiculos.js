const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ rota: "veiculos funcionando" });
});

router.post('/', (req, res) => {
  res.json({ mensagem: "veiculo criado" });
});

module.exports = router;
