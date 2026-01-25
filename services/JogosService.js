const {Amigo} = require('../models');
const {Jogo} = require('../models');
class JogosService {
    constructor(model) {
        this.Jogo = model;
    }

    createJogo = async (data) => {
        const { titulo, plataforma, amigoId } = data;
        await this.Jogo.create({ titulo, plataforma, amigoId: Number(amigoId) });
    }

    getAllJogos = async () => {
        const jogos = await this.Jogo.findAll({
            include: [{ model: Amigo, as: 'dono' }],
            order: [['id', 'ASC']]
        });

        return jogos;
    }

    getAllJogosOrderedByTitle = async () => {
        const jogos = await this.Jogo.findAll({ order: [['titulo', 'ASC']] });

        return jogos;
    }

    getJogoById = async (data) => {
        const jogo = await this.Jogo.findByPk(data);

        return jogo;
    }

    updateJogo = async (data, id) => {
        const { titulo, plataforma, amigoId } = data;
        await this.Jogo.update({ titulo, plataforma, amigoId: Number(amigoId) }, id);
    }

    deleteJogo = async (data) => {
        const {id} = data;
        await Jogo.destroy({where: {id: data.id}});
    }

    getJogosJson = async () => {
        const jogos = await this.Jogo.findAll({
            include: [{ model: Amigo, as: 'dono' }],
            order: [['titulo', 'ASC']]
        });

        const resultado = {};

        jogos.forEach(jogo => {
            resultado[jogo.id] = {
                titulo: jogo.titulo,
                plataforma: jogo.plataforma,
                amigoId: jogo.amigoId 
            };
        });

        return resultado;
    };
}

module.exports = JogosService;