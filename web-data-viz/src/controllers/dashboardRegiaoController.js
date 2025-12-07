const AWS = require('aws-sdk');
const Papa = require('papaparse');

const dashboardRegiaoModel = require('../models/dashboardRegiaoModel');

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN
});

const s3 = new AWS.S3();

async function lerArquivoHorario(req, res) {
  try {
    
    const idRegiao = req.params.idRegiao; 


    let pastaS3 = `/DashBoard_Regiao/RegiaoHorario${idRegiao}.json`;
  
    console.log(`Buscando arquivo: ${pastaS3}`);

    const parametros = {
      Bucket: process.env.S3_BUCKET,
      Key: pastaS3
    };

    const dados = await s3.getObject(parametros).promise();
    const textoArquivo = dados.Body.toString('utf-8');

    const dadosJson = JSON.parse(textoArquivo);

    res.json(dadosJson);

  } catch (erro) {
    console.error(' Erro ao buscar arquivo:', erro.message);
    res.status(500).send('Erro ao buscar arquivo: ' + erro.message);
  }
}

async function lerArquivoPrevisao(req, res) {

 try {
    
    const idRegiao = req.params.idRegiao; 


    let pastaS3 = `DashBoard_Regiao/RegiaoPrevisao${idRegiao}.json`;
  
    console.log(`Buscando arquivo: ${pastaS3}`);

    const parametros = {
      Bucket: process.env.S3_BUCKET,
      Key: pastaS3
    };

    console.log(parametros)

    const dados = await s3.getObject(parametros).promise();
  
    const textoArquivo = dados.Body.toString('utf-8');
  
    
    const dadosJson = JSON.parse(textoArquivo);
    console.log(dadosJson)
    res.json(dadosJson);

  } catch (erro) {
    console.error(' Erro ao buscar arquivo:', erro.message);
    res.status(500).send('Erro ao buscar arquivo: ' + erro.message);
  }
}

async function lerArquivoKpi(req, res) {

  try {
    
    const idRegiao = req.params.idRegiao; 


    let pastaS3 = `/DashBoard_Regiao/RegiaoKpi${idRegiao}.json`;

    console.log(pastaS3)
  
    console.log(`Buscando arquivo: ${pastaS3}`);

    const parametros = {
      Bucket: process.env.S3_BUCKET,
      Key: pastaS3
    };

    const dados = await s3.getObject(parametros).promise();
    const textoArquivo = dados.Body.toString('utf-8');

    const dadosJson = JSON.parse(textoArquivo);

    res.json(dadosJson);

  } catch (erro) {
    console.error(' Erro ao buscar arquivo:', erro.message);
    res.status(500).send('Erro ao buscar arquivo: ' + erro.message);
  }
}

module.exports = {
  lerArquivoHorario,
  lerArquivoPrevisao,
  lerArquivoKpi
};