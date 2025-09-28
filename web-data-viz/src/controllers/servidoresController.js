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
  var nome = req.body.nome;
  var ip = req.body.ip;
  var idUsuario = req.body.idUsuario;

  if (nome == undefined) {
    res.status(400).send("nome está undefined!");
  } else if (idUsuario == undefined) {
    res.status(400).send("idUsuario está undefined!");
  }  else if (ip == undefined) {
    res.status(400).send("ip está undefined!");
  } else {


    servidorModel.cadastrar(descricao, idUsuario)
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
  }
}

function listarServidoresPorEmpresa(req, res) {
    var idEmpresaVar = req.params.idEmpresa;
    console.log(idEmpresaVar)

    servidorModel.listarServidoresPorEmpresa(idEmpresaVar)
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



module.exports = {
  buscarServidoresPorEmpresa,
  listarServidoresPorEmpresa,
  buscarServidoresPorUsuario,
  cadastrar
}