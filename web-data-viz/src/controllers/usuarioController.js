var usuarioModel = require("../models/usuarioModel");
var servidorModel = require("../models/servidorModel");

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {

        usuarioModel.autenticar(email, senha)
            .then(
                function (resultadoAutenticar) {
                    console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`); // transforma JSON em String

                    if (resultadoAutenticar.length == 1) {
                        console.log(resultadoAutenticar);
                                res.json({
                                    id: resultadoAutenticar[0].id,
                                    email: resultadoAutenticar[0].email,
                                    nome: resultadoAutenticar[0].nome,
                                    senha: resultadoAutenticar[0].senha,
                                    idEmpresa: resultadoAutenticar[0].idEmpresa,
                                    cargo: resultadoAutenticar[0].cargo                    
                                });
                    } else if (resultadoAutenticar.length == 0) {
                        res.status(403).send("Email e/ou senha inválido(s)");
                    } else {
                        res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }

}

function cadastrar(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var cnpj = req.body.cnpjServer;

    // Faça as validações dos valores
    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else if (cnpj == undefined) {
        res.status(400).send("Sua empresa a vincular está undefined!");
    } else {

        // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
        usuarioModel.cadastrarGestor(nome, email, senha, cnpj)
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

function cadastrarFuncionario(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var cargo = req.body.cargoServer;
    var idEmpresa = req.params.idEmpresa

    // Faça as validações dos valores
    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else if (cargo == undefined) {
        res.status(400).send("Sua empresa a vincular está undefined!");
    } else {

        // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
        usuarioModel.cadastrarFuncionarioNaEmpresa(nome, email, senha, cargo, idEmpresa)
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

function listarFuncionarios(req, res) {
    var idEmpresa = req.params.idEmpresa;

    usuarioModel.listarFuncionarios(idEmpresa)
        .then(
            function (resultado) {
                if (resultado.length > 0) {
                    res.status(200).json(resultado);
                } else {
                    res.status(204).send("Nenhum funcionário encontrado!");
                }
            }
        )
        .catch(
            function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao listar os funcionários! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );
}

function listarUmFuncionario(req, res) {
    var id = req.params.id;
    var idEmpresa = req.params.idEmpresa;

    console.log("ID recebido:", id);
    console.log("ID Empresa recebido:", idEmpresa);

    usuarioModel.listarUmFuncionario(id, idEmpresa)
        .then(
            function (resultado) {
                if (resultado.length > 0) {
                    res.status(200).json(resultado);
                } else {
                    res.status(204).send("Funcionário não encontrado!");
                }
            }
        )
        .catch(
            function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao listar o funcionário! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );
}

function listarServidoresFuncionario(req, res){
    var idEmpresa = req.params.idEmpresa;
    var idFuncionario = req.params.idFuncionario

    usuarioModel.listarServidoresFuncionario(idEmpresa, idFuncionario)
        .then(
            function (resultado) {
                if (resultado.length > 0) {
                    res.status(200).json(resultado);
                } else {
                    res.status(204).send("Nenhum funcionário encontrado!");
                }
            }
        )
        .catch(
            function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao listar os funcionários! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );
}


function adicionarServidor(req, res){
    var idFuncionario = req.params.idFuncionario;
    var idServidor = req.params.idServidor;

    usuarioModel.adicionarServidor(idFuncionario, idServidor)
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

function desassociarServidor(req, res) {
    var idFuncionario = req.params.idFuncionario;
    var idServidor = req.params.idServidor;

    usuarioModel.desassociarServidor(idFuncionario, idServidor)
        .then(
            function (resultado) {
                res.json(resultado);
            }
        )
        .catch(
            function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao desassociar o servidor do funcionário! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );
}


function excluirFuncionario(req, res) {
    var id = req.params.id;
    var idEmpresa = req.params.idEmpresa;

    usuarioModel.excluirFuncionario(id, idEmpresa)
        .then(
            function (resultado) {
                res.json(resultado);
            }
        )
        .catch(
            function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao excluir o funcionário! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );
}

function buscarPorId(req, res) {
  const idUsuario = req.params.idUsuario;

  usuarioModel.buscarPorId(idUsuario)
    .then(resultado => {
      if (resultado.length > 0) {
        res.status(200).json(resultado[0]);
      } else {
        res.status(404).send("Usuário não encontrado");
      }
    })
    .catch(erro => {
      console.log(erro);
      res.status(500).json(erro);
    });
}

function atualizarPerfil(req, res) {
    const idUsuario = req.params.idUsuario;
    const novoNome = req.body.nome;

    if (!novoNome) {
        return res.status(400).json({ erro: "Nome não fornecido" });
    }

    usuarioModel.atualizarNome(idUsuario, novoNome)
        .then(resultado => {
            res.status(200).json({ mensagem: "Nome atualizado com sucesso!" });
        })
        .catch(erro => {
            console.log("Erro ao atualizar nome: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    autenticar,
    cadastrar,
    cadastrarFuncionario,
    listarFuncionarios,
    listarUmFuncionario,
    listarServidoresFuncionario,
    adicionarServidor,
    desassociarServidor,
    excluirFuncionario,
    buscarPorId,
    atualizarPerfil
}