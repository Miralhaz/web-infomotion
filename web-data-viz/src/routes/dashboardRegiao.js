const express = require('express');
const router = express.Router();

const dashboardRegiaoController = require('../controllers/dashboardRegiaoController');

router.get('/lerArquivoHorario/:idRegiao', dashboardRegiaoController.lerArquivoHorario);

router.get('/lerArquivoPrevisao/:idRegiao', dashboardRegiaoController.lerArquivoPrevisao);

router.get('/lerArquivoKpi/:idRegiao', dashboardRegiaoController.lerArquivoPrevisao);

module.exports = router;