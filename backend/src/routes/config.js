const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');

router.get('/maps-key', configController.getMapsKey);

module.exports = router;
