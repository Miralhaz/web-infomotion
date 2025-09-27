var database = require("../database/config")

function listarComponentes(idServidor) {
    console.log("ACESSEI O COMPONENTE MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function listarComponentes()");

    var instrucaoSql = `
        select fk_servidor, tipo, numero_serie, apelido, date_format(dt_cadastro, '%d/%m/%Y %H:%i:%s') from componentes c
        join servidor s on c.fk_servidor = s.id
        where s.id = '${idServidor}'
        order by tipo;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
  listarComponentes
}