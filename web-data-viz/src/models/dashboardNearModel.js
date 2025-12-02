const AWS = require("aws-sdk");
const axios = require('axios');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: "us-east-1"
});

const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const JIRA_HOST = process.env.JIRA_HOST;
const JIRA_PROJECT_KEY = process.env.JIRA_PROJECT_KEY;

function obterDados(idServidor) {
    return new Promise((resolve, reject) => {

        const params = {
            Bucket: "s3-client-infomotion-1",
            Key: `DashNearRealTime/data${idServidor}.json` 
        };

        s3.getObject(params, (erro, data) => {
            if (erro) {
                console.log("ERRO AO PEGAR JSON DO S3:", erro);
                reject("Erro ao acessar bucket S3: " + erro);
                return;
            }

            try {
                const json = JSON.parse(data.Body.toString("utf-8"));
                resolve(json);
            } catch (parseErr) {
                console.log("ERRO AO PARSEAR JSON:", parseErr);
                reject("Erro ao interpretar JSON: " + parseErr);
            }
        });
    });
}

async function obterAlertas(idServidor) {
  try {

    const jql = `project = ${JIRA_PROJECT_KEY} AND summary ~ "Servidor ${idServidor}" AND created >= -7d ORDER BY created DESC
    `;

    const body = {
      jql,
      fieldsByKeys: true,
      fields: ["summary", "created", "status", "description"],
    };

    const response = await axios.post(
      `${JIRA_HOST}/rest/api/3/search/jql`,
      body,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            "Basic " +
            Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString("base64"),
        },
      }
    );

    return response.data;

  } catch (error) {
    console.error("Erro ao obter alertas do Jira:", error);
    throw error;
  }
}



module.exports = {
    obterDados,
    obterAlertas
};
