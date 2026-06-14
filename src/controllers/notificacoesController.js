const db = require('../database/db');

module.exports = {
  async index(req, res, next) {
    try {
      const usuario_id = req.user.id;
      const notificacoes = await db('notificacoes')
        .where({ usuario_id })
        .orderBy('created_at', 'desc')
        .limit(20);

      return res.json(notificacoes);
    } catch (error) {
      next(error);
    }
  },

  async markAsRead(req, res, next) {
    try {
      const { id } = req.params;
      await db('notificacoes')
        .where({ id, usuario_id: req.user.id })
        .update({ lida: true });

      return res.json({ message: 'Notificação marcada como lida' });
    } catch (error) {
      next(error);
    }
  },

  async markAllAsRead(req, res, next) {
    try {
      await db('notificacoes')
        .where({ usuario_id: req.user.id, lida: false })
        .update({ lida: true });

      return res.json({ message: 'Todas as notificações marcadas como lidas' });
    } catch (error) {
      next(error);
    }
  }
};
