const AWS = require("aws-sdk");
var database = require("../database/config");

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


function buscarAlertasHoje(idEmpresa) {
  var instrucaoSql = `
select 
a.dt_registro,
p.max
from alertas as a
inner join parametro_alerta as p on a.fk_parametro = p.id
inner join componentes as c on p.fk_componente = c.id
inner join servidor as s on c.fk_servidor = s.id
inner join empresa as e on s.fk_empresa = e.id
where c.tipo = "DISCO" AND DATE(a.dt_alerta) = CURDATE() and e.id = ${idEmpresa};`;

  return database.executar(instrucaoSql);
}

function buscarAlertasOntem(idEmpresa) {
  var instrucaoSql = `
select 
a.dt_registro,
p.max
from alertas as a
inner join parametro_alerta as p on a.fk_parametro = p.id
inner join componentes as c on p.fk_componente = c.id
inner join servidor as s on c.fk_servidor = s.id
inner join empresa as e on s.fk_empresa = e.id
where c.tipo = "DISCO" AND DATE(a.dt_alerta) = CURDATE() - INTERVAL 1 DAY and e.id = ${idEmpresa};`;

  return database.executar(instrucaoSql);
}
 
function alertasPorServidor(idEmpresa) {
  var instrucaoSql = `
select 
s.apelido,
a.dt_registro,
p.max as valorParametro,
a.max as valorAlerta
from alertas as a
inner join parametro_alerta as p on a.fk_parametro = p.id
inner join componentes as c on p.fk_componente = c.id
inner join servidor as s on c.fk_servidor = s.id
inner join empresa as e on s.fk_empresa = e.id
where c.tipo = "DISCO" and e.id = ${idEmpresa} and DATE(a.dt_alerta) = CURDATE();`;

  return database.executar(instrucaoSql);
}

module.exports = {
    obterDados,
    buscarAlertasHoje,
    buscarAlertasOntem,
    alertasPorServidor
};
