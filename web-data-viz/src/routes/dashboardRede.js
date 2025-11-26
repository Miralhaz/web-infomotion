const express = require('express');
const router = express.Router();
const path = require('path');

const dashboardRedeController = require('../controllers/dashboardRedeController');

router.get('/rede/:arquivo', dashboardRedeController.lerArquivoRede);

router.get('/conexoes/:arquivo', dashboardRedeController.lerArquivoConexoes);

router.get('/jira/:termo/:idServidor/:tempo', dashboardRedeController.contarTicketsPorTermo);

module.exports = router;