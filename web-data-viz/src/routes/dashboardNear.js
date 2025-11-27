var express = require("express");
var router = express.Router();

var dashboardNearController = require("../controllers/dashboardNearController");

router.get("/obterDados/:idServidor", function (req, res) {
  dashboardNearController.obterDados(req, res);
});

router.get('/obterAlertas/:idServidor', dashboardNearController.obterAlertas);


module.exports = router;
