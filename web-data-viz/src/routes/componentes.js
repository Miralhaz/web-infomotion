var express = require("express");
var router = express.Router();

var componenteController = require("../controllers/componenteController");

router.put("/editarComponente/:idEspecifico_Componente/:idServidor/:nomeTipo", function(req, res){
    componenteController.editarComponente(req, res);
});

router.get("/listarComponentes/:idServidor", function(req, res){
    componenteController.listarComponentes(req, res);
});

router.get("/puxandoColunasPreenchidas/:idEspecifico_Componente/:idServidor/:nomeTipo/:unidadeMedida", function(req,res){
    componenteController.puxandoColunasPreenchidas(req,res);
});

module.exports = router;