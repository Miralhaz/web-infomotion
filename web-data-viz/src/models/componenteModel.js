var database = require("../database/config")

function listarComponentes(idServidor) {
    console.log("ACESSEI O COMPONENTE MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function listarComponentes()");

    var instrucaoSql = `
     select c.id, fk_servidor, tipo, c.numero_serie as numero_serie, c.apelido as apelido, date_format(c.dt_cadastro, '%d/%m/%Y %H:%i:%s') from componentes c
        join servidor s on c.fk_servidor = s.id
        where s.id = '${idServidor}'
        order by tipo;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


function puxandoColunasPreenchidas(idComponente, id_Servidor, tipo) {
    console.log("ACESSEI O COMPONENTE MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function listarComponentes()");
        var instrucaoSql = `
 select
 c.tipo,
 c.apelido,
 s.id,
 p.max,
 p.unidade_medida as un
 from componentes as c
 inner join servidor as s on c.fk_servidor = s.id
 inner join parametro_alerta as p on p.fk_servidor = s.id
 where c.id = ${idComponente} && p.componente = '${tipo}' && c.tipo = '${tipo}' && s.id = ${id_Servidor};
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}



function editarComponente(idComponente, id_Servidor, bodytipo, apelido, unidadeMedida, parametro, statuspadrao) {
    console.log("ACESSEI O COMPONENTE MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function listarComponentes()");
        var instrucaoSql = `
update componentes as c
set
c.tipo = '${bodytipo}',
c.apelido = '${apelido}'
where c.id = ${idComponente};    

    `;

    var instrucaoSql2 = `
UPDATE parametro_alerta 
SET componente = '${bodytipo}', unidade_medida = '${unidadeMedida}', max = ${parametro}
WHERE fk_servidor = ${id_Servidor} AND componente = '${bodytipo}';
`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    console.log("Executando a instrução SQL: \n" + instrucaoSql2);
    
    database.executar(instrucaoSql2)
    return database.executar(instrucaoSql);
    
    
}

module.exports = {
  listarComponentes,
  puxandoColunasPreenchidas,
  editarComponente
}