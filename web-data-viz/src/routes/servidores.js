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

router.get("/listarServidores/:idEmpresa", function (req, res){
  servidoresController.listarServidores(req, res);
});

router.get("/obterDadosKpi/:idServidor", function (req, res){
  servidoresController.obterDadosKpi(req, res);
});

router.get("/listarDadosLinhas/:idServidor", function (req, res){
  servidoresController.listarDadosLinhas(req, res);
});

router.get("/listarDadosDoughnut/:idServidor", function (req, res){
  servidoresController.listarDadosDoughnut(req, res);
});

router.get("/listarDadosBarras/:idServidor", function (req, res){
  servidoresController.listarDadosBarras(req, res);
});

module.exports = router;