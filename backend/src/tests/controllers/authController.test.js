jest.mock('../../database/db', () => jest.fn());

const db = require('../../database/db');
const bcrypt = require('bcryptjs');
const authController = require('../../controllers/authController');

describe('Auth Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Deve retornar erro se email ou senha não forem enviados', async () => {
    const req = { body: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    await authController.login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('Deve retornar erro quando a senha estiver errada', async () => {
    const usuarioMock = {
      id: 1,
      email: 'teste@email.com',
      senha: 'senhaCriptografada',
      role: 'cliente'
    };

    db.mockReturnValue({
      where: jest.fn().mockReturnThis(),
      first: jest.fn().mockResolvedValue(usuarioMock)
    });

    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

    const req = {
      body: {
        email: 'teste@email.com',
        senha: 'senhaErrada'
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const next = jest.fn();

    await authController.login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Credenciais inválidas.' });
  });

  test('Deve fazer login corretamente e retornar token', async () => {
    const usuarioMock = {
      id: 1,
      email: 'teste@email.com',
      senha: 'senhaCriptografada',
      role: 'cliente',
      cliente_id: 2,
      motorista_id: null
    };

    db.mockReturnValue({
      where: jest.fn().mockReturnThis(),
      first: jest.fn().mockResolvedValue(usuarioMock)
    });

    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    const req = {
      body: {
        email: 'teste@email.com',
        senha: '123456'
      }
    };

    const res = {
      json: jest.fn()
    };

    const next = jest.fn();

    await authController.login(req, res, next);

    expect(res.json).toHaveBeenCalled();
    expect(res.json.mock.calls[0][0]).toHaveProperty('token');
    expect(res.json.mock.calls[0][0].usuario.email).toBe('teste@email.com');
  });
});