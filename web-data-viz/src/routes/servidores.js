var express = require("express");
var router = express.Router();

var servidoresController = require("../controllers/servidoresController");

router.get("/listarServidores/:idUsuario", function (req, res) {
  servidoresController.buscarServidoresPorUsuario(req, res);
});

router.get("/:empresaId", function (req, res) {
  servidoresController.buscarServidoresPorEmpresa(req, res);
});

router.post("/cadastrar", function (req, res) {
  servidoresController.cadastrar(req, res);
})

router.get("listarServidoresPorEmpresa/:empresaId", function (req, res) {
  servidoresController.listarServidoresPorEmpresa(req, res);
});

module.exports = router;