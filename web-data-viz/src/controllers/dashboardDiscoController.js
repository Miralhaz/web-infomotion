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

module.exports = {
  obterDados
};
