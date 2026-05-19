function loggerMiddleware(req, res, next) {

    const data = new Date().toISOString();

    console.log(`
[${data}]
Método: ${req.method}
Rota: ${req.originalUrl}
IP: ${req.ip}
    `);

    next();
}

module.exports = loggerMiddleware;