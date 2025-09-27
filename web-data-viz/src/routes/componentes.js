var express = require("express");
var router = express.Router();

var componenteController = require("../controllers/componenteController");

router.get("/listarComponentes/:idServidor", function(req, res){
    componenteController.listarComponentes(req, res);
});

module.exports = router;