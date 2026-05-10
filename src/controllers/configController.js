exports.getMapsKey = (req, res, next) => {
  try {
    const key = process.env.GOOGLE_MAPS_API_KEY;
    if (!key) {
      return res.status(500).json({ erro: 'Chave do Google Maps não configurada no servidor' });
    }
    res.json({ key });
  } catch (error) {
    next(error);
  }
};
