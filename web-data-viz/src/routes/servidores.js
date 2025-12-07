var express = require("express");
var router = express.Router();

var servidoresController = require("../controllers/servidoresController");

router.get("/receberRegiao/:idServer", function (req, res) {
  servidoresController.receberRegiao(req, res);
});

router.get('/buscarRamRegiao/:idRegiao',function (req, res) {
    servidoresController.buscarRamRegiao(req, res);
});

router.get("/listarRegioes/:empresaId", function (req, res) {
    servidoresController.listarRegioes(req, res);
});

router.put("/atualizarRegiao/:idServidor/:idRegiao", function (req, res) {
  servidoresController.atualizarRegiao(req, res);
});

router.post("/cadastrar", function (req, res) {
  servidoresController.cadastrar(req, res);
})

router.post("/cadastrarRede", function (req, res) {
  servidoresController.cadastrarRede(req, res);
})

router.get("/receberAlertasPorServidor/:idServidor/:tipo/:tempo", function (req, res) {
  servidoresController.receberAlertasPorServidor(req, res);
});

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

router.get("/listarDadosBarras/:idServidor", function (req, res){
  servidoresController.listarDadosBarras(req, res);
});

router.get("/receberAlertas/:idUsuario", function (req, res){
  servidoresController.receberAlertas(req, res);
});

router.put("/editarApelido/:idServidor", function (req, res) {
  servidoresController.editarApelido(req, res);
});


router.get("/:empresaId", function (req, res) {
  servidoresController.buscarServidoresPorEmpresa(req, res);
});

router.get('/status/servidores', servidoresController.buscarStatusServidores);
//
module.exports = router;