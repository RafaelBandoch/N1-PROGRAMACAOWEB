const db = require('../database/db');

module.exports = {
  async updateLocation(req, res, next) {
    try {
      const motorista_id = req.user.motorista_id;
      if (!motorista_id) {
        return res.status(403).json({ erro: 'Acesso negado. Apenas motoristas.' });
      }

      const { latitude, longitude } = req.body;
      if (latitude === undefined || longitude === undefined) {
        return res.status(400).json({ erro: 'Latitude e Longitude são obrigatórios' });
      }

      await db('motoristas')
        .where({ id: motorista_id })
        .update({
          latitude,
          longitude,
          ultima_atualizacao_gps: db.fn.now()
        });

      return res.json({ message: 'Localização atualizada com sucesso' });
    } catch (error) {
      next(error);
    }
  },

  async getLocation(req, res, next) {
    try {
      const { id } = req.params; // motorista_id
      const motorista = await db('motoristas')
        .where({ id })
        .select('latitude', 'longitude', 'ultima_atualizacao_gps', 'nome')
        .first();

      if (!motorista) {
        return res.status(404).json({ erro: 'Motorista não encontrado' });
      }

      return res.json(motorista);
    } catch (error) {
      next(error);
    }
  }
};
