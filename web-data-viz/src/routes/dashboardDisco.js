var express = require("express");
var router = express.Router();

var dashboardDiscoController = require("../controllers/dashboardDiscoController");

router.get("/obterDados/:idEmpresa", function (req, res) {
  dashboardDiscoController.obterDados(req, res);
});

module.exports = router;
