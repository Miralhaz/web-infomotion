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

module.exports = {
  obterDados
};
