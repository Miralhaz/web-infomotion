var dashboardDiscoModel = require("../models/dashboardDiscoModel");

function obterDados(req, res) {
  var idEmpresa = req.params.idEmpresa;

  dashboardDiscoModel.obterDados(idEmpresa)
    .then(resultado => {
      res.status(200).json(resultado);
    })
    .catch(erro => {
      console.log("Erro ao obter dados:", erro);
      res.status(500).json(erro);
    });
}

function buscarAlertasHoje(req, res) {
var idEmpresa = req.params.idEmpresa;

  dashboardDiscoModel.buscarAlertasHoje(idEmpresa).then((resultado) => {
    res.status(200).json(resultado);
  });
}

function buscarAlertasOntem(req, res) {
var idEmpresa = req.params.idEmpresa;

  dashboardDiscoModel.buscarAlertasOntem(idEmpresa).then((resultado) => {
    res.status(200).json(resultado);
  });
}

function alertasPorServidor(req, res) {
var idEmpresa = req.params.idEmpresa;

  dashboardDiscoModel.alertasPorServidor(idEmpresa).then((resultado) => {
    res.status(200).json(resultado);
  });
}

module.exports = {
  obterDados,
  buscarAlertasHoje,
  buscarAlertasOntem,
  alertasPorServidor
};
