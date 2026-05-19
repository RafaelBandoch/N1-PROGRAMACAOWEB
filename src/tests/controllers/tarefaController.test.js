const tarefaController = require('../../controllers/tarefaController');

describe('Tarefa Controller', () => {

    test('Deve retornar erro se faltar dados obrigatórios', async () => {

        const req = {
            body: {}
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await tarefaController.criar(req, res);

        expect(res.status).toHaveBeenCalledWith(400);

    });

});