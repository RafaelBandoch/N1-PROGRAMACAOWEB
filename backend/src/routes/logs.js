const express = require('express');
const router = express.Router();
const loggerMiddleware = require('../middlewares/loggerMiddleware');

router.get('/', (req, res) => {
  res.json(loggerMiddleware.getLogs());
});

module.exports = router;
