const AWS = require("aws-sdk");

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: "us-east-1"
});

function obterDados(idEmpresa) {
    return new Promise((resolve, reject) => {
        // 1. Busca o JSON principal
        const paramsPrincipal = {
            Bucket: "s3-client-infomotion-1",
            Key: `tratamento_willian/DiscoTratamentoEmpresa_${idEmpresa}.json`
        };

        // 2. Busca o JSON de histórico
        const paramsHistorico = {
            Bucket: "s3-client-infomotion-1",
            Key: `tratamento_willian/DiscoHistoricoEmpresa_${idEmpresa}.json`
        };

        let dadosPrincipal = null;
        let dadosHistorico = null;
        let principalPronto = false;
        let historicoPronto = false;

        // Callback para processar quando ambos estiverem prontos
        function processarResposta() {
            if (principalPronto && historicoPronto) {
                const resultado = {
                    ...dadosPrincipal,
                    historico: dadosHistorico || []
                };
                resolve(resultado);
            }
        }

        // Busca JSON principal
        s3.getObject(paramsPrincipal, (erro, data) => {
            if (erro) {
                console.log("ERRO no JSON principal:", erro);
                reject("Erro ao carregar dados principais");
                return;
            }
            try {
                dadosPrincipal = JSON.parse(data.Body.toString("utf-8"));
                principalPronto = true;
                processarResposta();
            } catch (e) {
                reject("Erro ao parsear JSON principal");
            }
        });

        // Busca JSON de histórico
        s3.getObject(paramsHistorico, (erro, data) => {
            if (erro) {
                console.log("AVISO: Histórico não encontrado, usando vazio:", erro);
                dadosHistorico = [];
                historicoPronto = true;
                processarResposta();
                return;
            }
            try {
                dadosHistorico = JSON.parse(data.Body.toString("utf-8"));
                historicoPronto = true;
                processarResposta();
            } catch (e) {
                console.log("Erro no histórico, usando vazio:", e);
                dadosHistorico = [];
                historicoPronto = true;
                processarResposta();
            }
        });
    });
}

module.exports = {
    obterDados
};