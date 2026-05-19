jest.mock('../../database/db', () => jest.fn());

const db = require('../../database/db');
const rotaController = require('../../controllers/rotaController');

describe('Rota Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Deve retornar erro ao criar rota sem data ou motorista', async () => {
    const req = { body: {} };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const next = jest.fn();

    await rotaController.criar(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      erro: 'Data e motorista são obrigatórios'
    });
  });

  test('Deve retornar erro quando motorista não existir', async () => {
    db.mockReturnValue({
      where: jest.fn().mockReturnThis(),
      first: jest.fn().mockResolvedValue(null)
    });

    const req = {
      body: {
        data: '2026-05-19',
        motorista_id: 99
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const next = jest.fn();

    await rotaController.criar(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      erro: 'Motorista não encontrado'
    });
  });
});