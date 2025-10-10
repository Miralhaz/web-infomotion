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
  console.log(nome)
  console.log(ip)
  console.log(idEmpresa)




  console.log("a")
  if (nome == undefined) {
    res.status(400).send("nome está undefined!");
  } else if (ip == undefined) {
    res.status(400).send("idEmpresa está undefined!");
  } else if (idEmpresa == undefined) {
    res.status(400).send("ip está undefined!");
  } else {
    console.log("b")

    servidorModel.cadastrar(idEmpresa, ip, nome)
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




module.exports = {
  buscarServidoresPorEmpresa,
  listarServidoresPorUsuario,
  buscarServidoresPorUsuario,
  excluirServidor,
  cadastrar
}