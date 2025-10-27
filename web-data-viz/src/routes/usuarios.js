var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/usuarioController");

router.post("/cadastrar", function (req, res) {
    usuarioController.cadastrar(req, res);
});

router.post("/autenticar", function (req, res) {
    usuarioController.autenticar(req, res);
});

router.post("/cadastrarFuncionario/:idEmpresa", function (req, res) {
    usuarioController.cadastrarFuncionario(req, res);
});

router.get("/listar/:idEmpresa", function(req, res){
    usuarioController.listarFuncionarios(req, res);
});

router.get("/listarUm/:id/:idEmpresa", function(req, res){
    usuarioController.listarUmFuncionario(req, res);
});

router.get("/listarServidores/:idFuncionario/:idEmpresa", function(req, res){
    usuarioController.listarServidoresFuncionario(req, res);
});

router.post("/adicionarServidor/:id/:idServidor", function(req, res){
    usuarioController.adicionarServidor(req, res);
});

router.delete("/desassociarServidor/:id/:idServidor", function(req, res){
    usuarioController.desassociarServidor(req, res);
});

router.delete("/excluir/:id/:idEmpresa", function(req, res){
    usuarioController.excluirFuncionario(req, res);
});

router.get("/:idUsuario", usuarioController.buscarPorId);

router.put("/atualizarPerfil/:idUsuario", function (req, res) {
    usuarioController.atualizarPerfil(req, res);
});


module.exports = router;