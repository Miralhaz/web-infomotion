const express = require('express');
const router = express.Router();

const dashboardTemperaturaController = require('../controllers/dashboardTemperaturaController');

router.get('/:componente/:idServidor/:periodo', dashboardTemperaturaController.lerArquivoPorServidor);

router.get('/processos/:arquivo', dashboardTemperaturaController.lerArquivoProcessos);

router.get("/buscarParametro/:idServidor", function (req, res){
  dashboardTemperaturaController.buscarParametros(req, res);
});

module.exports = router;