const AWS = require("aws-sdk");

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: "us-east-1"
});

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

module.exports = {
    obterDados
};
