var express = require("express");
var router = express.Router();

var dashboardDiscoController = require("../controllers/dashboardDiscoController");

router.get("/obterDados/:idEmpresa", function (req, res) {
  dashboardDiscoController.obterDados(req, res);
});

router.get("/alertasHoje/:idEmpresa", function (req, res) {
  dashboardDiscoController.buscarAlertasHoje(req, res);
});

router.get("/alertasOntem/:idEmpresa", function (req, res) {
  dashboardDiscoController.buscarAlertasOntem(req, res);
});

router.get("/alertasPorServidor/:idEmpresa", function (req, res) {
  dashboardDiscoController.alertasPorServidor(req, res);
});

module.exports = router;
