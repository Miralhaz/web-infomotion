
var database = require("../database/config")

function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)
    var instrucaoSql = `
        SELECT id, nome, email, fk_empresa as idEmpresa FROM usuario WHERE email = '${email}' AND senha = '${senha}';
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

function listarServidoresFuncionario(id, idEmpresa){
console.log("ACESSEI O FUNCIONARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function listarServidoresFuncionario()");

    var instrucaoSql = `
        select s.nome, uhs.fk_servidor, uhs.fk_usuario from servidor s
        inner join usuario_has_servidor uhs
        on s.id = uhs.fk_servidor
        inner join usuario u 
        on u.id = uhs.fk_usuario
        where u.id = '${id}' and u.fk_empresa = '${idEmpresa}';
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

module.exports = {
    autenticar,
    cadastrarGestor,
    cadastrarFuncionarioNaEmpresa,
    listarFuncionarios,
    listarUmFuncionario,
    listarServidoresFuncionario,
    excluirFuncionario
};