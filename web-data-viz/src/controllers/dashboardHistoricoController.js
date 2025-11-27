const AWS = require('aws-sdk');
const Papa = require('papaparse');

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN
});

const s3 = new AWS.S3();
const PASTA_S3 = "tratamentos_giulia/";

async function lerArquivo(req, res) {
  try {

    const nomeArq = req.params.arquivo;
    const fileKey = PASTA_S3 + nomeArq;

    if (!/^[\w.\-\/]+$/.test(fileKey) || fileKey.includes("..")) {
      return res.status(400).send('❌ Nome de arquivo inválido!');
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
      content = JSON.parse(text);
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
  lerArquivo
};