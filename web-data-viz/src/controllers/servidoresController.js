var servidorModel = require("../models/servidorModel");

function buscarServidoresPorEmpresa(req, res) {
  var idUsuario = req.params.idUsuario;

  servidorModel.buscarServidoresPorEmpresa(idUsuario).then((resultado) => {
    if (resultado.length > 0) {
      res.status(200).json(resultado);
    } else {
      res.status(204).json([]);
    }
  }).catch(function (erro) {
    console.log(erro);
    console.log("Houve um erro ao buscar os servidores: ", erro.sqlMessage);
    res.status(500).json(erro.sqlMessage);
  });
}


function buscarServidoresPorUsuario(req, res) {
  console.log("req.params: ", req.params.idUsuario);

  var idUsuario = req.params.idUsuario;

  servidorModel.buscarServidoresPorUsuario(idUsuario).then((resultado) => {
    if (resultado.length > 0) {
      res.status(200).json(resultado);
    } else {
      res.status(204).json([]);
    }
  }).catch(function (erro) {
    console.log(erro);
    console.log("Houve um erro ao buscar os servidores: ", erro.sqlMessage);
    res.status(500).json(erro.sqlMessage);
  });
}


function cadastrar(req, res) {
  var nome = req.body.nomeServer;
  var ip = req.body.ipServer;
  var idEmpresa = req.body.idServer;
  var idUsuario = req.body.idUsuarioServer;
  console.log(nome)
  console.log(ip)
  console.log(idEmpresa)
  console.log(idUsuario);



  console.log("a")
  if (nome == undefined) {
    res.status(400).send("nome está undefined!");
  } else if (ip == undefined) {
    res.status(400).send("idEmpresa está undefined!");
  } else if (idEmpresa == undefined) {
    res.status(400).send("ip está undefined!");
  } else if (idUsuario == undefined) {
    res.status(400).send("Id Usuario está undefined!")
  } else {
    console.log("b")

    servidorModel.cadastrar(idEmpresa, ip, nome, idUsuario)
      .then((resultado) => {
        res.status(201).json(resultado);
      }
      ).catch((erro) => {
        console.log(erro);
        console.log(
          "\nHouve um erro ao realizar o cadastro! Erro: ",
          erro.sqlMessage
        );
        res.status(500).json(erro.sqlMessage);
      });
    console.log("c")
  }
}

function listarServidoresPorUsuario(req, res) {
  var idUsuarioVar = req.params.idUsuario;

  servidorModel.listarServidoresPorUsuario(idUsuarioVar)
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
        console.log("\nHouve um erro ao listar os servidores! Erro: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
      }
    );
}

function excluirServidor(req, res) {
  console.log("req.params: ", req.params.idServidor);

  var idServidor = req.params.idServidor;

  servidorModel.excluirServidor(idServidor).then((resultado) => {
    if (resultado.length > 0) {
      res.status(200).json(resultado);
    } else {
      res.status(204).json([]);
    }
  }).catch(function (erro) {
    console.log(erro);
    console.log("Houve um erro ao buscar os servidores: ", erro.sqlMessage);
    res.status(500).json(erro.sqlMessage);
  });

}


function listarServidores(req, res) {
  var idEmpresa = req.params.idEmpresa;

  servidorModel.listarServidores(idEmpresa)
    .then(
      function (resultado) {
        if (resultado.length > 0) {
          res.status(200).json(resultado);
        } else {
          res.status(204).send("Nenhum servidor encontrado!");
        }
      }
    )
    .catch(
      function (erro) {
        console.log(erro);
        console.log("\nHouve um erro ao listar os servidores! Erro: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
      }
    );
}

function obterDadosKpi(req, res){
  var idServidor = req.params.idServidor;

  servidorModel.obterDadosKpi(idServidor)
    .then(
      function (resultado){
        if (resultado.length > 0) {
          res.status(200).json(resultado);
        } else {
          res.status(204).send("Nenhum servidor encontrado!");
        }
      }
    )
    .catch(
      function (erro) {
        console.log(erro);
        console.log("\nHouve um erro ao buscar dados dos servidores! Erro: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
      }
    );
}

function listarDadosLinhas(req, res){
  var idServidor = req.params.idServidor;

  servidorModel.listarDadosLinhas(idServidor)
    .then(
      function (resultado){
        if (resultado.length > 0) {
          res.status(200).json(resultado);
        } else {
          res.status(204).send("Nenhum servidor encontrado!");
        }
      }
    )
    .catch(
      function (erro) {
        console.log(erro);
        console.log("\nHouve um erro ao buscar dados dos servidores! Erro: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
      }
    );
}


function listarDadosBarras(req, res){
  var idServidor = req.params.idServidor;

  servidorModel.listarDadosBarras(idServidor)
    .then(
      function (resultado){
        if (resultado.length > 0) {
          res.status(200).json(resultado);
        } else {
          res.status(204).send("Nenhum servidor encontrado!");
        }
      }
    )
    .catch(
      function (erro) {
        console.log(erro);
        console.log("\nHouve um erro ao buscar dados dos servidores! Erro: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
      }
    );
}

function receberAlertas(req, res){
  var idUsuario = req.params.idUsuario;

  servidorModel.receberAlertas(idUsuario)
    .then(
      function (resultado){
        if (resultado.length > 0) {
          res.status(200).json(resultado);
        } else {
          res.status(204).send("Nenhum alerta encontrado!");
        }
      }
    )
    .catch(
      function (erro) {
        console.log(erro);
        console.log("\nHouve um erro ao buscar alertas dos servidores! Erro: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
      }
    );
}

function receberEspecificações(req, res){
  var idUsuario = req.params.idUsuario;

  servidorModel.receberEspecificações(idUsuario)
    .then(
      function (resultado){
        if (resultado.length > 0) {
          res.status(200).json(resultado);
        } else {
          res.status(204).send("Nenhum alerta encontrado!");
        }
      }
    )
    .catch(
      function (erro) {
        console.log(erro);
        console.log("\nHouve um erro ao buscar alertas dos servidores! Erro: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
      }
    );
}


module.exports = {
  buscarServidoresPorEmpresa,
  listarServidoresPorUsuario,
  buscarServidoresPorUsuario,
  excluirServidor,
  listarServidores,
  obterDadosKpi,
  listarDadosLinhas,
  listarDadosBarras,
  cadastrar,
  receberAlertas,
  receberEspecificações
}