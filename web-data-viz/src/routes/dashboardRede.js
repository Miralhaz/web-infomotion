const express = require('express');
const router = express.Router();
const path = require('path');

const dashboardRedeController = require('../controllers/dashboardRedeController');

router.get('/:arquivo', dashboardRedeController.lerArquivoRede);

router.get('/:arquivo', dashboardRedeController.lerArquivoRede);


module.exports = router;