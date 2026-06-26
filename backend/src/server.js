const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const app = express();

app.use(express.json());

const loggerMiddleware = require('./middlewares/loggerMiddleware');
app.use(loggerMiddleware);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/public/landing.html'));
});

app.use(express.static(path.join(__dirname, '../../frontend/public'), {
  index: false,
  extensions: ['html']
}));

const routes = require('./routes');
app.use('/api', routes);

const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});