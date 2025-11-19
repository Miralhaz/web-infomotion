const AWS = require('aws-sdk');
const Papa = require('papaparse');

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN
});

const s3 = new AWS.S3();

async function lerArquivoCpu(req, res) {
  try {
    const nomeDoArquivo = req.params.arquivo;
    const PASTA_S3 = "produto_final/";
    const fileKey = PASTA_S3 + nomeDoArquivo;

    if (!/^[\w.\-\/]+$/.test(fileKey)) {
      return res.status(400).send('❌ Nome de arquivo inválido.');
    }

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: fileKey
    };

    console.log(`📥 Lendo do S3: ${params.Bucket}/${params.Key}`);

    const data = await s3.getObject(params).promise();
    const text = data.Body.toString('utf-8').trim();

    let content;
    if (text.startsWith('[') || text.startsWith('{')) {

      let correctedText = text.replace(/(\d),(\d)/g, '$1.$2');

      try {
        content = JSON.parse(correctedText);
      } catch (parseError) {
        console.error("Erro fatal ao analisar JSON:", parseError.message);
        // Se falhar, retorne o erro 500
        return res.status(500).send("Erro fatal: Estrutura JSON inválida.");
      }
    } else {
      const parsed = Papa.parse(text, {
        header: true,
        delimiter: text.includes(';') ? ';' : ',',
        skipEmptyLines: true
      });
      content = parsed.data;
    }

    res.json(content);
  } catch (err) {
    console.error('❌ Erro ao buscar arquivo:', err.message);
    res.status(500).send('Erro ao buscar arquivo: ' + err.message);
  }
}

async function lerArquivoDisco(req, res) {
  try {
    const nomeDoArquivo = req.params.arquivo;
    const PASTA_S3 = "produto_final/";
    const fileKey = PASTA_S3 + nomeDoArquivo;

    if (!/^[\w.\-\/]+$/.test(fileKey)) {
      return res.status(400).send('❌ Nome de arquivo inválido.');
    }

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: fileKey
    };

    console.log(`📥 Lendo do S3: ${params.Bucket}/${params.Key}`);

    const data = await s3.getObject(params).promise();
    const text = data.Body.toString('utf-8').trim();

    let content;
    if (text.startsWith('[') || text.startsWith('{')) {

      let correctedText = text.replace(/(\d),(\d)/g, '$1.$2');

      try {
        content = JSON.parse(correctedText);
      } catch (parseError) {
        console.error("Erro fatal ao analisar JSON:", parseError.message);
        // Se falhar, retorne o erro 500
        return res.status(500).send("Erro fatal: Estrutura JSON inválida.");
      }
    } else {
      const parsed = Papa.parse(text, {
        header: true,
        delimiter: text.includes(';') ? ';' : ',',
        skipEmptyLines: true
      });
      content = parsed.data;
    }

    res.json(content);
  } catch (err) {
    console.error('❌ Erro ao buscar arquivo:', err.message);
    res.status(500).send('Erro ao buscar arquivo: ' + err.message);
  }
}

module.exports = {
  lerArquivoCpu,
  lerArquivoDisco
};