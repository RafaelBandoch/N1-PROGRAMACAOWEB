const logsStore = require('../utils/logsStore');

function loggerMiddleware(req, res, next) {
    const url = req.originalUrl;

    // Ignorar arquivos estáticos (só logar rotas da API)
    if (!url.startsWith('/api')) return next();

    // Ignorar endpoints de "polling" constante para não poluir os logs
    if (url.includes('/api/localizacao/atualizar')) return next();
    if (url.includes('/api/notificacoes')) return next();
    if (url.includes('/api/logs')) return next();

    const data = new Date().toISOString();
    
    // Armazena no array em memoria ao inves de poluir o terminal
    logsStore.addLog({
        data,
        metodo: req.method,
        rota: url,
        ip: req.ip
    });

    next();
}

module.exports = loggerMiddleware;