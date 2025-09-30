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

// router.get("/listarUm/:idEmpresa, :id", function(req, res){
//     usuarioController.editarFuncionario(req, res);
// });

router.delete("/excluir/:id", function(req, res){
    usuarioController.excluirFuncionario(req, res);
});

module.exports = router;