const JogosService = require('../services/JogosService.js');
const AmigoService = require('../services/AmigoService.js');
const {Amigo} = require('../models');
const {Jogo} = require('../models');
const PDFDocument = require('pdfkit');

class JogosController {
    constructor () {
        this.jogoService = new JogosService(Jogo);
        this.amigoService = new AmigoService(Amigo);
    }

    // /jogos
    exibirJogos = async (req, res) => {
        const jogos = await this.jogoService.getAllJogos()

        res.render('jogos/index', { jogos });
    }

    // /jogos/novo
    exibirListaDeAmigos = async (req, res) => {
        const amigos = await this.amigoService.getAllAmigosOrderedByName();

        res.render('jogos/novo', { amigos });
    }

    // /jogos/novo
    adicionarJogo = async (req, res) => {
        const { titulo, plataforma, amigoId } = req.body;
        await this.jogoService.createJogo({ titulo, plataforma, amigoId: Number(amigoId) });

        res.redirect('/jogos');
    }

    // /jogos/editar/:id
    exibirEditarJogo = async (req, res) => {
        const jogo = await this.jogoService.getJogoById(req.params.id);
        if (!jogo) return res.status(404).send('Jogo não encontrado.');
        const amigos = await this.amigoService.getAllAmigosOrderedByName();
        res.render('jogos/editar', { jogo, amigos });
    }

    // /jogos/editar/:id
    editarJogo = async (req, res) => {
        const { titulo, plataforma, amigoId } = req.body;
        await this.jogoService.updateJogo({ titulo, plataforma, amigoId: Number(amigoId) }, {
            where: { id: req.params.id }
        });
        res.redirect('/jogos');
    }

    // /jogos/excluir/:id
    excluirJogo = async (req, res) => {
        await this.jogoService.deleteJogo({ id: req.params.id });
        res.redirect('/jogos');
    }

    // jogos/json
    exibirJson = async (req,res) => {
        const data = await this.jogoService.getJogosJson();

        res.status(200).json(data);
    }

    // jogos/pdf
    gerarPdf = async (req, res) => {
        const jogos = await this.jogoService.getAllJogos();
        const doc = new PDFDocument({ margin: 50 });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            'inline; filename=relatorio-jogos.pdf'
        );

        doc.pipe(res);

        // Título
        doc.fontSize(18).text('Relatório de Jogos', { align: 'center' });
        doc.moveDown(2);

        let currentY = doc.y;

        const largura = {
            id: 40,
            amigoId: 60,
            titulo: 220,
            plataforma: 180
        };

        const colunas = {
            id: 50,
            amigoId: 50 + largura.id,
            titulo: 50 + largura.id + largura.amigoId,
            plataforma: 50 + largura.id + largura.amigoId + largura.titulo
        };

        doc.fontSize(12).font('Helvetica-Bold');
        doc.text('ID', colunas.id, currentY, { width: largura.id });
        doc.text('AmigoID', colunas.amigoId, currentY, { width: largura.amigoId });
        doc.text('Título', colunas.titulo, currentY, { width: largura.titulo });
        doc.text('Plataforma', colunas.plataforma, currentY, { width: largura.plataforma });

        currentY += 18;

        doc.moveTo(50, currentY).lineTo(550, currentY).stroke();
        currentY += 10;

        doc.font('Helvetica');

        jogos.forEach(j => {
            const textos = {
                id: String(j.id),
                amigoId: String(j.amigoId),
                titulo: j.titulo,
                plataforma: j.plataforma
            };

            const alturas = {
                id: doc.heightOfString(textos.id, { width: largura.id }),
                amigoId: doc.heightOfString(textos.amigoId, { width: largura.amigoId }),
                titulo: doc.heightOfString(textos.titulo, { width: largura.titulo }),
                plataforma: doc.heightOfString(textos.plataforma, { width: largura.plataforma })
            };

            const alturaLinha = Math.max(...Object.values(alturas));

            doc.text(textos.id, colunas.id, currentY, { width: largura.id });
            doc.text(textos.amigoId, colunas.amigoId, currentY, { width: largura.amigoId });
            doc.text(textos.titulo, colunas.titulo, currentY, { width: largura.titulo });
            doc.text(textos.plataforma, colunas.plataforma, currentY, { width: largura.plataforma });

            currentY += alturaLinha + 8;

            if (currentY > doc.page.height - 50) {
                doc.addPage();
                currentY = 50;
            }
        });

        doc.end();
    }
}

module.exports = JogosController;