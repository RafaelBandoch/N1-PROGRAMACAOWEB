const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, '../public'), { extensions: ['html'] }));

const routes = require('./routes');
app.use('/api', routes);

const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
