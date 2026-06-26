const jwt = require('jsonwebtoken');
const { authenticateToken, checkRole } = require('../../middlewares/authMiddleware');

describe('Auth Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Deve retornar erro se não houver token', () => {
    const req = { headers: {} };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const next = jest.fn();

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('Deve retornar erro se o token for inválido', () => {
    jest.spyOn(jwt, 'verify').mockImplementation((token, secret, callback) => {
      callback(new Error('Token inválido'), null);
    });

    const req = {
      headers: {
        authorization: 'Bearer tokenInvalido'
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const next = jest.fn();

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test('Deve bloquear usuário sem permissão', () => {
    const middleware = checkRole(['admin']);

    const req = {
      user: {
        role: 'cliente'
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const next = jest.fn();

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test('Deve permitir usuário com permissão correta', () => {
    const middleware = checkRole(['admin']);

    const req = {
      user: {
        role: 'admin'
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const next = jest.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});