
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
        select u.nome, c.nome as cargo from usuario u
        inner join empresa e on u.fk_empresa = e.id
        inner join cargo c on u.fk_cargo = c.id
        where e.id = '${idEmpresa}';
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


function excluirFuncionario(id, idEmpresa){
    console.log("ACESSEI O FUNCIONARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function excluirFuncionario()");

    var instrucaoSql = `
    delete from usuario where id = '${id}' && fk_empresa = '${idEmpresa}';
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);

}

module.exports = {
    autenticar,
    cadastrarGestor,
    cadastrarFuncionarioNaEmpresa,
    listarFuncionarios,
    excluirFuncionario
};