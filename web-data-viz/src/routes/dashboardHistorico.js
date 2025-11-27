const express = require('express');
const router = express.Router();

const dashboardHistoricoController = require('../controllers/dashboardHistoricoController');

router.get('/dados/:arquivo', (req, res) => {
  dashboardHistoricoController.lerArquivo(req, res);
});

module.exports = router;