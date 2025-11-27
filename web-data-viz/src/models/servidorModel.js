var database = require("../database/config");
const axios = require("axios");
require('dotenv').config({ path: '../.env.dev' });

const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const JIRA_HOST = process.env.JIRA_HOST;
const JIRA_PROJECT_KEY = process.env.JIRA_PROJECT_KEY;

function buscarServidoresPorEmpresa(empresaId) {

  var instrucaoSql = `SELECT * FROM servidor WHERE fk_empresa = ${empresaId}`;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function buscarServidoresPorUsuario(usuarioId) {

  var instrucaoSql = `SELECT fk_servidor FROM usuario WHERE fk_usuario = ${usuarioId}`;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

async function cadastrar(nome, ip, idEmpresa, idUsuario, idRegiao) {

var instrucaoSql2 = `INSERT INTO servidor (apelido, fk_regiao, ip, fk_empresa, ativo)VALUES ('${nome}', ${idRegiao}, '${ip}', ${idEmpresa}, 1);`;
await database.executar(instrucaoSql2);

var instrucaoSql3 = `INSERT INTO usuario_has_servidor (fk_usuario, fk_servidor)SELECT ${idUsuario}, id FROM servidor WHERE apelido = '${nome}'`;
await database.executar(instrucaoSql3);

var instrucaoSql4 = `
  INSERT INTO registro_servidor (fk_servidor, uso_cpu, uso_ram, uso_disco, qtd_processos, temp_cpu, temp_disco, dt_registro) SELECT id, 0.00, 0.00, 0.00, 190, 36.0, 47.0, '2025-10-24 13:21'FROM servidor WHERE apelido = '${nome}'`;
return await database.executar(instrucaoSql4);

}

async function cadastrarRede(idEmpresa, codigo, cidade, pais) {

var instrucaoSql1 = `INSERT INTO regiao (fk_empresa, cidade, pais, codigo_postal) VALUES ('${idEmpresa}', '${cidade}', '${pais}', '${codigo}');`;
await database.executar(instrucaoSql1);

}

function listarServidoresPorUsuario(idUsuario) {
  var instrucaoSql = `
  select s.id, s.apelido, s.ip from servidor as s
  inner join usuario_has_servidor as uhs on s.id = uhs.fk_servidor
  where uhs.fk_usuario = ${idUsuario};`
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

async function excluirServidor(id) {
  var instrucaoSql = `
    delete a from alertas as a
    inner join parametro_alerta as p on a.fk_parametro = p.id
    where p.fk_servidor = ${id}; 
    `;
  var instrucaoSq2 = `  
    delete from parametro_alerta where fk_servidor = ${id};`;

  var instrucaoSq3 = `
    delete from usuario_has_servidor where fk_servidor = ${id};`;

  var instrucaoSq4 = `
   delete from componentes where fk_servidor = ${id};`;

  var instrucaoSq5 = `
   delete from servidor where id = ${id};`;



  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  console.log("Executando a instrução SQL: \n" + instrucaoSq2);
  console.log("Executando a instrução SQL: \n" + instrucaoSq3);
  console.log("Executando a instrução SQL: \n" + instrucaoSq4);
  console.log("Executando a instrução SQL: \n" + instrucaoSq5);

  await database.executar(instrucaoSql);
  await database.executar(instrucaoSq2);
  await database.executar(instrucaoSq3);
  await database.executar(instrucaoSq4);
  return await database.executar(instrucaoSq5);
}

function listarServidores(idEmpresa) {

  var instrucaoSql = `SELECT id as idServidor, apelido FROM servidor WHERE fk_empresa = ${idEmpresa}`;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function obterDadosKpi(idServidor) {

  var instrucaoSql = `
  select 
    rs.uso_cpu, 
    rs.uso_ram, 
    rs.uso_disco, 
    rs.qtd_processos, 
    rs.temp_cpu, 
    rs.temp_disco, 
    rs.upload,
    rs.download,
    c.tipo, 
    pa.max 
  from registro_servidor rs
  inner join servidor s on rs.fk_servidor = s.id
  inner join parametro_alerta pa on pa.fk_servidor = s.id
  inner join componentes c on c.id = pa.fk_componente
  where rs.fk_servidor = '${idServidor}'
  and rs.id = (
      select id from registro_servidor 
      where fk_servidor = '${idServidor}' 
      order by dt_registro desc 
      LIMIT 1 
    );
  `;
  
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function listarDadosLinhas(idServidor) {

  var instrucaoSql = `
    SELECT 
        uso_cpu, 
        uso_ram, 
        uso_disco, 
        dt_registro 
    FROM registro_servidor 
    WHERE fk_servidor = '${idServidor}'
    ORDER BY dt_registro DESC 
    LIMIT 30;
`;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function listarDadosBarras(idServidor) {

  var instrucaoSql = `
    select qtd_processos, dt_registro from registro_servidor 
    where fk_servidor = '${idServidor}'
    LIMIT 10;
  `;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function receberAlertas(idUsuario) {

  var instrucaoSql = `
    SELECT 
    s.id,
    s.apelido,
    c.tipo,
    DATE_FORMAT(a.dt_registro, '%d/%m/%Y') AS data_registro,
    a.max,
    a.min
    FROM alertas AS a
      INNER JOIN parametro_alerta AS p
        ON p.id = a.fk_parametro          
        INNER JOIN servidor AS s
          ON s.id = p.fk_servidor           
          INNER JOIN usuario_has_servidor AS us
            ON us.fk_servidor = s.id    
            INNER JOIN componentes as c
              ON p.fk_componente = c.id      
            WHERE us.fk_usuario = '${idUsuario}'
            order by data_registro;
  `;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function receberAlertasPorServidor(idServidor, tipo, tempo){
  const instrucaoSql = `
    select count(a.id) as total_alertas from alertas a 
    inner join parametro_alerta pa on a.fk_parametro = pa.id
    inner join servidor s on s.id = pa.fk_servidor
    inner join componentes c on c.id = pa.fk_componente
    where s.id = ${idServidor} and c.tipo = '${tipo}' and a.dt_registro >= DATE_SUB(NOW(), INTERVAL ${tempo} HOUR);

  `;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
  
}

function editarApelido(idServidor, apelido) {
  var instrucaoSql = `
    UPDATE servidor
    SET apelido = '${apelido}'
    WHERE id = ${idServidor};
  `;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function receberRegiao(idServer){
  var instrucaoSql = `SELECT codigo_postal, pais, cidade FROM regiao r INNER JOIN servidor s ON s.fk_regiao = r.id WHERE s.id = ${idServer};`

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function listarRegioes(empresaId){
  var instrucaoSql = `SELECT id, codigo_postal, pais, cidade FROM regiao WHERE fk_empresa = ${empresaId};`

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function atualizarRegiao(idServidor, idRegiao) {
  var instrucaoSql = `
    UPDATE servidor 
    SET fk_regiao = ${idRegiao}
    WHERE id = ${idServidor};
  `;

  console.log("Executando SQL:", instrucaoSql);
  return database.executar(instrucaoSql);
}

async function buscartickets(idServidor, tempo, termo){
  try {

        let body = {
            jql: `project = ${JIRA_PROJECT_KEY} AND created >= -7d ORDER BY created DESC`,
            maxResults: 50,
            fieldsByKeys: true,
            fields: ["summary", "created", "status"],
        };

        let response = await axios.post(
            `${JIRA_HOST}/rest/api/3/search/jql`,
            body,
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Basic ${Buffer.from(
                        `${JIRA_EMAIL}:${JIRA_API_TOKEN}`,
                    ).toString("base64")}`,
                },
            }
        );

        return response.data;

    } catch (error) {
        console.error("Erro ao buscar alertas do Jira:", error);
        throw error;
    }
}

module.exports = {
  buscarServidoresPorEmpresa,
  buscarServidoresPorUsuario,
  listarServidoresPorUsuario,
  excluirServidor,
  listarServidores,
  obterDadosKpi,
  listarDadosLinhas,
  listarDadosBarras,
  cadastrar,
  receberAlertas,
  editarApelido,
  receberRegiao,
  listarRegioes,
  atualizarRegiao,
  cadastrarRede,
  receberAlertasPorServidor,
  buscartickets
}
