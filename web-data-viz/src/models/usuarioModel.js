
var database = require("../database/config")

function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)
    var instrucaoSql = `
        SELECT id, nome, email, cargo, fk_empresa as idEmpresa, imagem_url FROM usuario WHERE email = '${email}' AND senha = '${senha}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrarGestor(nome, email, senha, cnpj) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nome, email, senha, cnpj);

    var instrucaoSql = `
        insert into usuario (nome, email, senha, fk_empresa, cargo) select '${nome}', '${email}', '${senha}', id, 'Gestor' from empresa where cnpj = '${cnpj}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrarFuncionarioNaEmpresa(nome, email, senha, cargo, idEmpresa) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nome, email, senha, cargo, idEmpresa);

    var instrucaoSql = `
        insert into usuario (nome, email, senha, fk_empresa, cargo) select '${nome}', '${email}', '${senha}', id, '${cargo}' from empresa where id = '${idEmpresa}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listarFuncionarios(idEmpresa) {
    console.log("ACESSEI O FUNCIONARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function listarFuncionarios()");

    var instrucaoSql = `
        select u.id, u.nome, u.cargo from usuario u
        inner join empresa e on u.fk_empresa = e.id
        where e.id = '${idEmpresa}';
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listarUmFuncionario(id, idEmpresa) {
    console.log("ACESSEI O FUNCIONARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function listarUmFuncionario()");

    var instrucaoSql = `
        SELECT id, nome, cargo FROM usuario WHERE id = ${id} and fk_empresa = '${idEmpresa}';
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);

}

function listarServidoresFuncionario(idEmpresa, idFuncionario){
console.log("ACESSEI O FUNCIONARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function listarServidoresFuncionario()");

    var instrucaoSql = `
        SELECT s.apelido, s.id AS idServidor, uhs.fk_usuario AS idFuncionario
        FROM servidor s
        LEFT JOIN usuario_has_servidor uhs
        ON s.id = uhs.fk_servidor AND uhs.fk_usuario = ${idFuncionario}
        WHERE s.fk_empresa = '${idEmpresa}';
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


function adicionarServidor(idFuncionario, idServidor){
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function adicionarServidor():", idFuncionario, idServidor);

    var instrucaoSql = `
        insert ignore into usuario_has_servidor (fk_usuario, fk_servidor)
	        values('${idFuncionario}', '${idServidor}'); 
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


function desassociarServidor(idFuncionario, idServidor){
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function adicionarServidor():");

    var instrucaoSql = `
        delete from usuario_has_servidor where fk_usuario = '${idFuncionario}' and fk_servidor = '${idServidor}'; 
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


function excluirFuncionario(id, idEmpresa) {
    console.log("ACESSEI O FUNCIONARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function excluirFuncionario()");

    var instrucaoSql1 = `
     delete from usuario_has_servidor where fk_usuario = '${id}';
    `;

    var instrucaoSql2 = `
     delete from usuario where id = '${id}' and fk_empresa = '${idEmpresa}';
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql1);
    database.executar(instrucaoSql1);

    console.log("Executando a instrução SQL: \n" + instrucaoSql2);
    return database.executar(instrucaoSql2);

}

function buscarPorId(idUsuario) {
  const instrucao = `
    SELECT u.id, u.nome, u.cargo, u.dt_cadastro, e.nome AS empresa FROM usuario u
    JOIN empresa e ON u.fk_empresa = e.id WHERE u.id = ${idUsuario};
  `;
  console.log("Executando SQL buscarPorId:\n", instrucao);
  return database.executar(instrucao);
}

function atualizarNome(idUsuario, novoNome) {
    const instrucaoSql = `
        UPDATE usuario
        SET nome = '${novoNome}'
        WHERE id = ${idUsuario};
    `;
    console.log("Executando SQL:\n", instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    autenticar,
    cadastrarGestor,
    cadastrarFuncionarioNaEmpresa,
    listarFuncionarios,
    listarUmFuncionario,
    listarServidoresFuncionario,
    adicionarServidor,
    desassociarServidor,
    excluirFuncionario,
    buscarPorId,
    atualizarNome
};