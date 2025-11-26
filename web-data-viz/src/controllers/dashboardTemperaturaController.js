const AWS = require('aws-sdk');
const Papa = require('papaparse');

var dashboardTemperaturaModel = require("../models/dashboardTemperaturaModel");

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN
});

const s3 = new AWS.S3();

async function lerArquivoPorServidor(req, res) {
  
  try {
    const componente = req.params.componente; 
    const idServidor = req.params.idServidor; 
    const periodo = req.params.periodo; 

    let pastaS3;
    if (componente === 'cpu') {
      pastaS3 = `tratamentoMiralha/temperatura/cpu/servidor_${idServidor}/`;
    } else if (componente === 'disco') {
      pastaS3 = `tratamentoMiralha/temperatura/disco/servidor_${idServidor}/`;
    } else {
      return res.status(400).send('❌ Componente inválido. Use "cpu" ou "disco".');
    }

    const caminhoCompleto = pastaS3 + periodo;

    console.log(`📥 Buscando arquivo: ${caminhoCompleto}`);

    const parametros = {
      Bucket: process.env.S3_BUCKET,
      Key: caminhoCompleto
    };

    const dados = await s3.getObject(parametros).promise();
    const textoArquivo = dados.Body.toString('utf-8');

    const dadosJson = JSON.parse(textoArquivo);

    res.json(dadosJson);

  } catch (erro) {
    console.error('❌ Erro ao buscar arquivo:', erro.message);
    res.status(500).send('Erro ao buscar arquivo: ' + erro.message);
  }
}

async function lerArquivoProcessos(req, res) {

  try {
    const nomeArquivo = req.params.arquivo; 

    const caminhoCompleto = `tratamentoMiralha/processos/${nomeArquivo}`;

    console.log(`📥 Buscando arquivo de processos: ${caminhoCompleto}`);

    const parametros = {
      Bucket: process.env.S3_BUCKET,
      Key: caminhoCompleto
    };

    const dados = await s3.getObject(parametros).promise();
    const textoArquivo = dados.Body.toString('utf-8');
    const dadosJson = JSON.parse(textoArquivo);

    res.json(dadosJson);

  } catch (erro) {
    console.error('❌ Erro ao buscar arquivo de processos:', erro.message);
    res.status(500).send('Erro ao buscar arquivo: ' + erro.message);
  }
}

function buscarParametros(req, res) {
  var idServidor = req.params.idServidor;
  
    dashboardTemperaturaModel.buscarParametros(idServidor)
      .then(
        function (resultado) {
          if (resultado.length > 0) {
            res.status(200).json(resultado);
          } else {
            res.status(204).send("Nenhum servidor encontrado!");
          }
        }
      )
      .catch(
        function (erro) {
          console.log(erro);
          console.log("\nHouve um erro ao listar os servidores! Erro: ", erro.sqlMessage);
          res.status(500).json(erro.sqlMessage);
        }
      );
}

module.exports = {
  lerArquivoPorServidor,
  lerArquivoProcessos,
  buscarParametros
};