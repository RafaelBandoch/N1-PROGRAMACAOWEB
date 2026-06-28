function errorHandler(err, req, res, next) {

  console.error(err);

  res.status(500).json({
    erro: "Erro interno no servidor",
    detalhe: process.env.NODE_ENV === "development" ? err.message : undefined
  });

}

module.exports = errorHandler;
