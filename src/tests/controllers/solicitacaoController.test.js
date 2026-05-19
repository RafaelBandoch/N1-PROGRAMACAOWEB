const solicitacaoController = require('../../controllers/solicitacaoController');

describe('Solicitação Controller', () => {
  test('Deve retornar erro ao atualizar com status inválido', async () => {
    const req = {
      params: { id: 1 },
      body: { status: 'STATUS_ERRADO' }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const next = jest.fn();

    await solicitacaoController.updateStatus(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Status inválido'
    });
  });
});