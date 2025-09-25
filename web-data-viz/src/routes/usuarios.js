var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/usuarioController");

router.post("/cadastrar", function (req, res) {
    usuarioController.cadastrar(req, res);
});

router.post("/autenticar", function (req, res) {
    usuarioController.autenticar(req, res);
});

router.post("/cadastrarFuncionario", function (req, res) {
    usuarioController.cadastrarFuncionario(req, res);
});

router.get("/listar/:idEmpresa", function(req, res){
    usuarioController.listarFuncionarios(req, res);
});

router.delete("/excluir", function(req, res){
    usuarioController.excluirFuncionario(req, res);
});

module.exports = router;