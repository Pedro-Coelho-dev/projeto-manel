const {Amigo} = require('../models');
const {Jogo} = require('../models');
const {Emprestimo} = require('../models');

class EmprestimosService {
    constructor (model) {
        this.Emprestimo = model;
    }

    createEmprestimo = async (data) => {
        const { jogoId, amigoId, dataInicio, dataFim } = data;
        
        await Emprestimo.create({
            jogoId: Number(jogoId),
            amigoId: Number(amigoId),
            dataInicio,
            dataFim: dataFim || null
        });
    }

    getAllEmprestimos = async () => {
        const emprestimos = await Emprestimo.findAll({
            include: [{ model: Jogo, as: 'jogo' }, { model: Amigo, as: 'amigo' }],
            order: [['id', 'ASC']]
        });

        return emprestimos;
    }

    excluirEmprestimo = async (data) => {
        await Emprestimo.destroy({where: {id: data.id}});
    }

    getEmprestimosJson = async () => {
        const emprestimos = await this.Emprestimo.findAll({
            include: [{ model: Jogo, as: 'jogo' }, { model: Amigo, as: 'amigo' }],
            order: [['id', 'ASC']]
        });

        const resultado = {};

        emprestimos.forEach(emprestimo => {
            resultado[emprestimo.id] = {
                dataInicio: emprestimo.dataInicio,
                dataFim: emprestimo.dataFim,
                jogoId: emprestimo.jogoId,
                amigoId: emprestimo.amigoId 
            };
        });

        return resultado;
    }
}

module.exports = EmprestimosService;