const express = require('express');
const router = express.Router();
const path = require('path');

const dashboardTemperaturaController = require('../controllers/dashboardTemperaturaController');

router.get('/:arquivo', dashboardTemperaturaController.lerArquivoCpu);

router.get('/:arquivo', dashboardTemperaturaController.lerArquivoDisco);

module.exports = router;