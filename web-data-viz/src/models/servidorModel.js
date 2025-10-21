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


function listarServidoresPorUsuario(idUsuario) {
  var instrucaoSql = `
    Select s.id, s.ip, s.apelido, rs.uso_cpu, rs.uso_ram, rs.uso_disco from servidor as s 
    inner join usuario_has_servidor as uhs on s.id = uhs.fk_servidor
    inner join usuario as u on uhs.fk_usuario = u.id 
    inner join (
      select * from registro_servidor as rs1
      where rs1.id = (
        select max(rs2.id)
        from registro_servidor as rs2
        where rs2.fk_servidor = rs1.fk_servidor
      )
    ) as rs on s.id = rs.fk_servidor
    where u.id = ${idUsuario};`
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
    select rs.*, c.tipo, pa.max from registro_servidor rs
    inner join servidor s on rs.fk_servidor = s.id
    inner join parametro_alerta pa on pa.fk_servidor = s.id
    inner join componentes c on c.id = pa.fk_componente
    where rs.fk_servidor = '${idServidor}';
  `;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function listarDadosLinhas(idServidor) {

  var instrucaoSql = `
    select fk_servidor, uso_cpu, uso_ram, uso_disco, dt_registro 
    from registro_servidor where fk_servidor = '${idServidor}';
  `;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function listarDadosDoughnut(idServidor) {

  var instrucaoSql = `
    select qtd_processos from registro_servidor
    where fk_servidor = '${idServidor}';
  `;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

module.exports = {
  buscarServidoresPorEmpresa,
  buscarServidoresPorUsuario,
  listarServidoresPorUsuario,
  excluirServidor,
  listarServidores,
  obterDadosKpi,
  listarDadosLinhas,
  listarDadosDoughnut,
  cadastrar
}
