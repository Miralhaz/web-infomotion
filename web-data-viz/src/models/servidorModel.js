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

function cadastrar(idEmpresa, ip, nome) {
  
  var instrucaoSql = `INSERT INTO servidor (apelido, ip, fk_empresa)  VALUES ('${nome}', '${ip}', ${idEmpresa})`;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}


function listarServidoresPorEmpresa(idEmpresa){
  var instrucaoSql = `SELECT apelido,ip,id FROM servidor where fk_empresa = ${idEmpresa}`;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}


async function excluirServidor(id){
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




module.exports = {
  buscarServidoresPorEmpresa,
  buscarServidoresPorUsuario,
  listarServidoresPorEmpresa,
  excluirServidor,
  cadastrar
}
