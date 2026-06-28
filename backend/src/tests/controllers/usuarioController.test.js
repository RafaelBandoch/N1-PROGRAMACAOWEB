jest.mock('../../database/db', () => jest.fn());

const db = require('../../database/db');
const usuarioController = require('../../controllers/usuarioController');

describe('Usuário Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Deve retornar erro ao criar usuário sem email ou senha', async () => {
    const req = {
      body: {}
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const next = jest.fn();

    await usuarioController.criar(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('Deve retornar erro ao criar usuário com email já cadastrado', async () => {
    db.mockReturnValue({
      where: jest.fn().mockReturnThis(),
      first: jest.fn().mockResolvedValue({
        id: 1,
        email: 'teste@email.com'
      })
    });

    const req = {
      body: {
        email: 'teste@email.com',
        senha: '123456'
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const next = jest.fn();

    await usuarioController.criar(req, res, next);

    expect(res.status).toHaveBeenCalledWith(409);
  });
});