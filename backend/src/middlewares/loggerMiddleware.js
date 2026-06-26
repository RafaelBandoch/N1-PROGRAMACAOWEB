const logs = [];
const MAX_LOGS = 100;

function loggerMiddleware(req, res, next) {
    // Evita logar a própria rota de logs e requisições de arquivos estáticos/assets
    const isStatic = req.originalUrl.match(/\.(html|css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/) || req.originalUrl.startsWith('/css/') || req.originalUrl.startsWith('/js/') || req.originalUrl.startsWith('/components/') || req.originalUrl.startsWith('/pages/');
    const isLogsRoute = req.originalUrl.includes('/api/logs');

    if (!isStatic && !isLogsRoute) {
        const logEntry = {
            id: Date.now() + Math.random().toString(36).substr(2, 5),
            data: new Date().toLocaleString('pt-BR'),
            metodo: req.method,
            rota: req.originalUrl,
            ip: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress
        };

        logs.unshift(logEntry);
        if (logs.length > MAX_LOGS) {
            logs.pop();
        }
    }

    next();
}

loggerMiddleware.getLogs = () => logs;

module.exports = loggerMiddleware;