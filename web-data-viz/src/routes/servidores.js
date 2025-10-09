var express = require("express");
var router = express.Router();

var servidoresController = require("../controllers/servidoresController");


router.get("/:empresaId", function (req, res) {
  servidoresController.buscarServidoresPorEmpresa(req, res);
});

router.post("/cadastrar", function (req, res) {
  servidoresController.cadastrar(req, res);
})

router.get("/listarServidoresPorUsuario/:idUsuario", function (req, res) {
  servidoresController.listarServidoresPorUsuario(req, res);
});

router.get("/excluirServidor/:idServidor", function (req, res) {
  servidoresController.excluirServidor(req, res);
});


module.exports = router;