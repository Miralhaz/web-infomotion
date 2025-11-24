const express = require('express');
const router = express.Router();
const path = require('path');

const dashboardRedeController = require('../controllers/dashboardRedeController');

router.get('/:arquivo', dashboardRedeController.lerArquivoRede);

router.get('/jira/count', dashboardRedeController.contarTicketsPorTermo);

module.exports = router;