var componenteModel = require("../models/componenteModel");

function listarComponentes(req, res) {
    var idServidor = req.params.idServidor;

    componenteModel.listarComponentes(idServidor)
        .then(
            function (resultado) {
                if (resultado.length > 0) {
                    res.status(200).json(resultado);
                } else {
                    res.status(204).send("Nenhum componente encontrado!");
                }
            }
        )
        .catch(
            function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao listar os componentes! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );
}

function   puxandoColunasPreenchidas(req, res) {
    var idComponente = req.params.idEspecifico_Componente;

    componenteModel.  puxandoColunasPreenchidas(idComponente)
        .then(
            function (resultado) {
                if (resultado.length > 0) {
                    res.status(200).json(resultado);
                } else {
                    res.status(204).send("Nenhum componente encontrado!");
                }
            }
        )
        .catch(
            function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao listar os componentes! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );
}

module.exports = {
  listarComponentes,
  puxandoColunasPreenchidas
}