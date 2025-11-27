var dashboardNearModel = require("../models/dashboardNearModel");

function obterDados(req, res) {
  var idServidor = req.params.idServidor;

  dashboardNearModel.obterDados(idServidor)
    .then(resultado => {
      res.status(200).json(resultado);
    })
    .catch(erro => {
      console.log("Erro ao obter dados:", erro);
      res.status(500).json(erro);
    });
}

async function obterAlertas(req, res) {
  const idServidor = req.params.idServidor;

  dashboardNearModel.obterAlertas(idServidor)
    .then(resultado => {
      res.json(resultado);
    })
    .catch(erro => {
      console.log("Erro ao obter alertas:", erro);
      res.status(500).json(erro.sqlMessage || erro);
    });
}



module.exports = {
  obterDados,
  obterAlertas
};
