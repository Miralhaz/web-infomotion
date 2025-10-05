var express = require("express");
var router = express.Router();

var componenteController = require("../controllers/componenteController");

router.post("/editarComponente/:idServidor", function(req, res){
    componenteController.editarComponente(req, res);
});

router.get("/listarComponentes/:idServidor", function(req, res){
    componenteController.listarComponentes(req, res);
});

router.get("/puxandoColunasPreenchidas/:idEspecifico_Componente", function(req,res){
    componenteController.puxandoColunasPreenchidas(req,res);
});

module.exports = router;