var database = require("../database/config");

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

function cadastrar(empresaId, ip, nome) {
  
  var instrucaoSql = `INSERT INTO (nome, ip, fk_empresa) servidor VALUES ('${nome}', '${ip}', ${empresaId})`;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}


function listarServidoresPorEmpresa(idEmpresa){

  var instrucaoSql = `SELECT nome,ip FROM servidor where fk_empresa = ${idEmpresa}`;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

module.exports = {
  buscarServidoresPorEmpresa,
  buscarServidoresPorUsuario,
  listarServidoresPorEmpresa,
  cadastrar
}
