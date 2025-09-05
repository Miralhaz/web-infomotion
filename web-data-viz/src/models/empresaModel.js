var database = require("../database/config");

function buscarPorId(id) {
  var instrucaoSql = `SELECT * FROM empresa WHERE id = ${id};`;

  return database.executar(instrucaoSql);
}

function listar() {
  var instrucaoSql = `SELECT id, nome, email, cnpj FROM empresa;`;

  return database.executar(instrucaoSql);
}

function buscarPorCnpj(cnpj) {
  var instrucaoSql = `SELECT * FROM empresa WHERE cnpj = '${cnpj}';`;

  return database.executar(instrucaoSql);
}

function cadastrar(cnpj, nome) {
  var instrucaoSql = `INSERT INTO empresa (nome, cnpj) VALUES ('${nome}', '${cnpj}');`;

  return database.executar(instrucaoSql);
}

module.exports = { buscarPorCnpj, buscarPorId, cadastrar, listar };
