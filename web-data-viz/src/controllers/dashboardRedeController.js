const AWS = require("aws-sdk");
const Papa = require("papaparse");
var servidorModel = require("../models/servidorModel");

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN,
});

const s3 = new AWS.S3();
const PASTA_S3 = "Dashboard_Rede/";

async function lerArquivoRede(req, res) {
  try {
    const nomeDoArquivo = req.params.arquivo;
    const fileKey = PASTA_S3 + nomeDoArquivo;
    console.log("nome do arquivo dentro do controller", nomeDoArquivo);

    if (!/^[\w.\-\/]+$/.test(fileKey)) {
      return res.status(400).send("❌ Nome de arquivo inválido.");
    }

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: fileKey,
    };

    console.log(`📥 Lendo do S3: ${params.Bucket}/${params.Key}`);

    const data = await s3.getObject(params).promise();
    const text = data.Body.toString("utf-8").trim();

    // tenta JSON primeiro (com correção simples)
    function sanitizeJsonString(s) {
      return s
        .replace(/^\uFEFF/, "")
        .replace(/,\s*(\]|})/g, "$1")
        .trim();
    }

    try {
      const sanitized = sanitizeJsonString(text);
      const json = JSON.parse(sanitized);
      res.type("application/json; charset=utf-8");
      return res.json(json);
    } catch (jsonErr) {
      console.warn("[dashboardRede] parse JSON falhou:", jsonErr.message);
    }

    // se parecer CSV, parseia com PapaParse e retorna JSON
    const looksLikeCSV =
      (data.ContentType && data.ContentType.toLowerCase().includes("csv")) ||
      /\.csv$/i.test(nomeDoArquivo) ||
      (text.indexOf(",") !== -1 &&
        text.indexOf("\n") !== -1 &&
        !/^[\{\[]/.test(text));

    if (looksLikeCSV) {
      const parsed = Papa.parse(text, {
        header: true,
        delimiter: text.includes(";") ? ";" : ",",
        skipEmptyLines: true,
        dynamicTyping: true,
      });
      res.type("application/json; charset=utf-8");
      return res.json(parsed.data);
    }

    // fallback: tenta extrair JSON dentro do texto
    const m = text.match(/(\[.*\]|\{.*\})/s);
    if (m) {
      try {
        const maybe = sanitizeJsonString(m[1]);
        return res.json(JSON.parse(maybe));
      } catch (e) {
        /* continua para enviar texto bruto */
      }
    }

    // se nada funcionou, envia texto bruto (força content-type json se for JSON-like)
    res.type("text/plain; charset=utf-8");
    return res.send(text);
  } catch (err) {
    console.error(
      "❌ Erro ao buscar arquivo:",
      err && err.message ? err.message : err
    );
    res
      .status(500)
      .send(
        "Erro ao buscar arquivo: " + (err && err.message ? err.message : err)
      );
  }
}

async function lerArquivoConexoes(req, res) {
  try {
    const nomeDoArquivo = req.params.arquivo;
    const fileKey = PASTA_S3 + nomeDoArquivo;
    console.log("nome do arquivo dentro do controller", nomeDoArquivo);

    if (!/^[\w.\-\/]+$/.test(fileKey)) {
      return res.status(400).send("❌ Nome de arquivo inválido.");
    }

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: fileKey,
    };

    console.log(`📥 Lendo do S3: ${params.Bucket}/${params.Key}`);

    const data = await s3.getObject(params).promise();
    const text = data.Body.toString("utf-8").trim();

    // tenta JSON primeiro (com correção simples)
    function sanitizeJsonString(s) {
      return s
        .replace(/^\uFEFF/, "")
        .replace(/,\s*(\]|})/g, "$1")
        .trim();
    }

    try {
      const sanitized = sanitizeJsonString(text);
      const json = JSON.parse(sanitized);
      res.type("application/json; charset=utf-8");
      return res.json(json);
    } catch (jsonErr) {
      console.warn("[dashboardRede] parse JSON falhou:", jsonErr.message);
    }

    // se parecer CSV, parseia com PapaParse e retorna JSON
    const looksLikeCSV =
      (data.ContentType && data.ContentType.toLowerCase().includes("csv")) ||
      /\.csv$/i.test(nomeDoArquivo) ||
      (text.indexOf(",") !== -1 &&
        text.indexOf("\n") !== -1 &&
        !/^[\{\[]/.test(text));

    if (looksLikeCSV) {
      const parsed = Papa.parse(text, {
        header: true,
        delimiter: text.includes(";") ? ";" : ",",
        skipEmptyLines: true,
        dynamicTyping: true,
      });
      res.type("application/json; charset=utf-8");
      return res.json(parsed.data);
    }

    // fallback: tenta extrair JSON dentro do texto
    const m = text.match(/(\[.*\]|\{.*\})/s);
    if (m) {
      try {
        const maybe = sanitizeJsonString(m[1]);
        return res.json(JSON.parse(maybe));
      } catch (e) {
        /* continua para enviar texto bruto */
      }
    }

    // se nada funcionou, envia texto bruto (força content-type json se for JSON-like)
    res.type("text/plain; charset=utf-8");
    return res.send(text);
  } catch (err) {
    console.error(
      "❌ Erro ao buscar arquivo:",
      err && err.message ? err.message : err
    );
    res
      .status(500)
      .send(
        "Erro ao buscar arquivo: " + (err && err.message ? err.message : err)
      );
  }
}

async function contarTicketsPorTermo(req, res) {
  const idServidor = req.params.idServidor
  const tempo = req.params.tempo
  const termo = req.params.termo

    servidorModel.buscartickets(idServidor, tempo, termo)
        .then(
            function (resultadoDadosServidores) {
                res.json(resultadoDadosServidores);
            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log(
                    "\nHouve um erro ao tentar buscar tickets ativos no jira! Erro: ",
                    erro.sqlMessage
                );
                res.status(500).json(erro.sqlMessage);
            }
        )
}

module.exports = {
  lerArquivoRede,
  lerArquivoConexoes,
  contarTicketsPorTermo
};
