var database = require("../database/config");

function buscarServidoresPorEmpresa(empresaId) {

  var instrucaoSql = `SELECT * FROM servidor a WHERE fk_empresa = ${empresaId}`;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function cadastrar(empresaId, ip, nome) {
  
  var instrucaoSql = `INSERT INTO (nome, ip, fk_empresa) servidor VALUES ('${nome}', '${ip}', ${empresaId})`;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}


module.exports = {
  buscarServidoresPorEmpresa,
  cadastrar
}
