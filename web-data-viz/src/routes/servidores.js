var express = require("express");
var router = express.Router();

var servidoresController = require("../controllers/servidoresController");

router.get("/:empresaId", function (req, res) {
  servidoresController.buscarServidoresPorEmpresa(req, res);
});

router.post("/cadastrar", function (req, res) {
  servidoresController.cadastrar(req, res);
})

module.exports = router;