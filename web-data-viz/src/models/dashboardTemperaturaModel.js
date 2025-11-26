var database = require("../database/config");

function buscarParametros(idServidor) {
  var instrucaoSql = `select t2.tipo as tipo_componente, t1.max as max_alerta 
    from infomotion.parametro_alerta as t1
    join infomotion.componentes as t2 ON t1.fk_componente = t2.id
    where t2.fk_servidor = ${idServidor} and t2.tipo in ('DISCO', 'CPU') and t1.unidade_medida = 'C';`;

  console.log("Executando SQL:", instrucaoSql);
  return database.executar(instrucaoSql);
}

module.exports = {
    buscarParametros
}