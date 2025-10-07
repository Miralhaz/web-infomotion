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

function puxandoColunasPreenchidas(req, res) {
    var idComponente = req.params.idEspecifico_Componente;
    var id_Servidor = req.params.idServidor;
    var tipo = req.params.nomeTipo;
    componenteModel.puxandoColunasPreenchidas(idComponente, id_Servidor, tipo)
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


function editarComponente(req, res) {
    var idComponente = req.params.idEspecifico_Componente;
    var id_Servidor = req.params.idServidor;

    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var apelido = req.body.apelidoComponente;
    var bodytipo = req.body.tipoComponente;
    var unidadeMedida = req.body.unidadeMedidaComponente;
    var parametro = req.body.parametro1Componente;
    var statusPadrao = req.body.statusComponente;
    // Faça as validações dos valores
    if (apelido == undefined) {
        res.status(400).send("Seu apelido está undefined!");
    } else if (bodytipo == undefined) {
        res.status(400).send("Seu tipo está undefined!");
    } else if (unidadeMedida == undefined) {
        res.status(400).send("Sua unidade de medida está undefined!");
    }
      else if (parametro == undefined) {
        res.status(400).send("Seu parâmetro está undefined!");
    }
      else if (statusPadrao == undefined) {
        res.status(400).send("Seu status padrão está undefined!");
    }
    else {

        // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
        componenteModel.editarComponente(idComponente, id_Servidor, apelido, bodytipo, unidadeMedida, parametro, statusPadrao)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}


module.exports = {
    listarComponentes,
    puxandoColunasPreenchidas,
    editarComponente
}