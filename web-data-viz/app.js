// var ambiente_processo = 'producao';
var ambiente_processo = 'desenvolvimento';

var caminho_env = ambiente_processo === 'producao' ? '.env' : '.env.dev';
// Acima, temos o uso do operador ternário para definir o caminho do arquivo .env
// A sintaxe do operador ternário é: condição ? valor_se_verdadeiro : valor_se_falso

require("dotenv").config({ path: caminho_env });

var express = require("express");
var cors = require("cors");
var path = require("path");
var PORTA_APP = process.env.APP_PORT;
var HOST_APP = process.env.APP_HOST;

var app = express();

var indexRouter = require("./src/routes/index");
var usuarioRouter = require("./src/routes/usuarios");
var servidoresRouter = require("./src/routes/servidores");
var empresasRouter = require("./src/routes/empresas");
var componentesRouter = require("./src/routes/componentes");
var dashboardTemperaturaRouter = require("./src/routes/dashboardTemperatura");
var dashboardRegiaoRouter = require("./src/routes/dashboardRegiao");
var dashboardNearRouter = require("./src/routes/dashboardNear");
var dashboardRede = require("./src/routes/dashboardRede");
var dashboardHistorcio = require("./src/routes/dashboardHistorico");
var dashboardDisco = require("./src/routes/dashboardDisco")

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/usuarios", usuarioRouter);
app.use("/servidores", servidoresRouter);
app.use("/empresas", empresasRouter);
app.use("/componentes", componentesRouter);
app.use("/dashboardTemperatura", dashboardTemperaturaRouter);
app.use("/dashboardRegiao", dashboardRegiaoRouter);
app.use("/dados", dashboardTemperaturaRouter);
app.use("/dashboardNear", dashboardNearRouter);
app.use('/dashboardRede', dashboardRede);
app.use("/dashboardHistorico", dashboardHistorcio);
app.use('/dashboardDisco', dashboardDisco);

app.listen(PORTA_APP, function () {
    console.log(`
    ##   ##  ######   #####             ####       ##     ######     ##              ##  ##    ####    ######  
    ##   ##  ##       ##  ##            ## ##     ####      ##      ####             ##  ##     ##         ##  
    ##   ##  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##        ##   
    ## # ##  ####     #####    ######   ##  ##   ######     ##     ######   ######   ##  ##     ##       ##    
    #######  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##      ##     
    ### ###  ##       ##  ##            ## ##    ##  ##     ##     ##  ##             ####      ##     ##      
    ##   ##  ######   #####             ####     ##  ##     ##     ##  ##              ##      ####    ######  
    \n\n\n                                                                                                 
    Servidor do seu site já está rodando! Acesse o caminho a seguir para visualizar .: http://${HOST_APP}:${PORTA_APP} :. \n\n
    Você está rodando sua aplicação em ambiente de .:${process.env.AMBIENTE_PROCESSO}:. \n\n
    \tSe .:desenvolvimento:. você está se conectando ao banco local. \n
    \tSe .:producao:. você está se conectando ao banco remoto. \n\n
    \t\tPara alterar o ambiente, comente ou descomente as linhas 1 ou 2 no arquivo 'app.js'\n\n`);
});
