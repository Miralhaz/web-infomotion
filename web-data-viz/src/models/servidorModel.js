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

async function cadastrar(idEmpresa, ip, nome, idUsuario) {

  var instrucaoSql1 = `INSERT INTO servidor (apelido, ip, fk_empresa, ativo)  VALUES ('${nome}', '${ip}', ${idEmpresa}, 1)`;
  var instrucaoSql2 = `INSERT INTO usuario_has_servidor (fk_usuario, fk_servidor) SELECT ${idUsuario}, id FROM servidor WHERE apelido = '${nome}'`
  var instrucaoSql3 = `INSERT INTO registro_servidor (fk_servidor, uso_cpu, uso_ram, uso_disco, qtd_processos, temp_cpu, temp_disco, dt_registro)
  SELECT id, 0.00, 0.00, 0.00, 190, 36.0, 47.0, '2025-10-24 13:21' FROM servidor WHERE apelido = '${nome}'`

  await database.executar(instrucaoSql1);
  await database.executar(instrucaoSql2);
  return await database.executar(instrucaoSql3)

}


function listarServidoresPorUsuario(idUsuario) {
  var instrucaoSql = `
    SELECT s.id, s.ip, s.apelido, rs.uso_cpu, rs.uso_ram, rs.uso_disco 
FROM servidor as s
INNER JOIN usuario_has_servidor as uhs on s.id = uhs.fk_servidor
INNER JOIN usuario as u on uhs.fk_usuario = u.id
INNER JOIN (
    SELECT rs1.* FROM registro_servidor as rs1
    WHERE rs1.dt_registro = (
        SELECT MAX(rs2.dt_registro) 
        FROM registro_servidor as rs2
        WHERE rs2.fk_servidor = rs1.fk_servidor
    )
) as rs ON s.id = rs.fk_servidor
WHERE u.id = ${idUsuario}
ORDER BY rs.dt_registro desc;`
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
    LIMIT 10;
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
            WHERE us.fk_usuario = '${idUsuario}';
  `;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function receberEspecificacoes(idServidor) {

  var instrucaoSql = `
    select nome_especificacao, valor, tipo from especificacao_componente e 
    inner join componentes c on c.id = e.fk_componente
    where fk_componente in (
    select id from componentes where fk_servidor = '${idServidor}');
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
  receberEspecificacoes,
  editarApelido
}
