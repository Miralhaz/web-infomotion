
let info = []
let infoExibicao = []
const tempo = localStorage.getItem("tempoSelecionado");
let chartInstance = null;
let especificacao = []
let infoTabela = []
let jaOrdenado = true;

function receberAlertas(idUsuario) {
    fetch(`/servidores/receberAlertas/${idUsuario}`)
        .then(function (resposta) {
            if (resposta.ok) {
                resposta.json().then(function (dados) {
                    // console.log("Dados recebidos: ", JSON.stringify(dados));
                    info.push(...dados)
                    inserirDadosTabela()
                    
                });

            } else {
                throw "Houve um erro ao tentar listar os servidores!";
            }
        })

        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });
}

function inserirDadosTabela() {
    let infoAjustada = JSON.parse(JSON.stringify(info)); 

    let hoje = new Date();           
    let dataLimite = new Date(); 
    dataLimite.setDate(hoje.getDate() - tempo);
    
    
    for (let index = 0; index < infoAjustada.length; index++) {
        const element = infoAjustada[index];
        const dataStr = element.data_registro;
        let [dia, mes, ano] = dataStr.split("/"); 
        let data = new Date(`${ano}-${mes}-${dia}`); 
        element.data_registro = data
    }
    
    infoExibicao = [];

    for (let index = 0; index < infoAjustada.length; index++) {
        const element = infoAjustada[index];
        if (element.data_registro > dataLimite){
            infoExibicao.push(element)
        }
    }
    console.log("infoExibicao", infoExibicao);
    
    infoTabela = [];

    for (let index = 0; index < infoExibicao.length; index++) {
        const element = infoExibicao[index];
        let indice = -1
        for (let j = 0; j < infoTabela.length; j++) {
            const element2 = infoTabela[j];
            if (element2.apelido === element.apelido) {indice = j; break;}
        }

        if(indice >= 0){
            const tipo = element.tipo.toUpperCase();
            if (tipo === 'CPU') {
                infoTabela[indice].AlertaCPU ++;
            }else if (tipo === 'DISCO') {
                infoTabela[indice].AlertaDisco ++;
            }else {
                infoTabela[indice].AlertaRAM ++;
            }
            infoTabela[indice].QuantidadeTotalAlertas ++;
        }  
        else {
            let novoRegistro = {
                id: element.id,
                apelido: element.apelido,
                AlertaCPU: 0,
                AlertaRAM: 0,
                AlertaDisco: 0,
                QuantidadeTotalAlertas: 1
            };
            
            const tipo = element.tipo.toUpperCase();
            if (tipo === 'CPU') {
                novoRegistro.AlertaCPU = 1;
            }else if (tipo === 'DISCO') {
                novoRegistro.AlertaDisco = 1;
            }else {
                novoRegistro.AlertaRAM = 1;
            }
            infoTabela.push(novoRegistro);
        }
    }

    if (infoExibicao.length > 0) {
        chamarFuncoesServidores(infoExibicao[0].id);
    } else {
        console.log("Nenhum alerta recente encontrado para exibir.");
    }

    chamarFuncoesServidores(infoExibicao[0].id)

    // jogando os dados no HTML
    document.getElementById("nome_tabela").innerHTML = `Relatório de alertas X ${tempo} dias`
    const bodyTabela = document.getElementById("bodyTabelaAlerta")
    for (let index = 0; index < infoTabela.length; index++) {
        const element = infoTabela[index];
        bodyTabela.innerHTML += `
        <tr  onclick="chamarFuncoesServidores(${element.id})">
            <td>
                ${element.apelido}
            </td>
            <td>
            ${element.AlertaCPU}
            </td>
            <td>
            ${element.AlertaRAM}
            </td>
            <td>
            ${element.AlertaDisco}
            </td>
            <td>
            ${element.QuantidadeTotalAlertas}
            </td>
        </tr>
              `
    }
}
    


function dataToString(d){
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    return `${dia}/${mes}`; 
  };

let totalDisco;


function chamarFuncoesServidores(idServidor) {
}

function ordenarPor(item){
    if (!jaOrdenado){
        document.getElementById(`table_alerta_${item}`).innerHTML += `<img src="../assets/icon/arrow_drop_down.svg" alt="drop_down">`
        jaOrdenado = true
    } else {
        document.getElementById(`table_alerta_nome`).innerHTML = 'Nome do servidor'
        document.getElementById(`table_alerta_cpu`).innerHTML = 'CPU'
        document.getElementById(`table_alerta_ram`).innerHTML = 'RAM'
        document.getElementById(`table_alerta_disco`).innerHTML = 'Disco'
        document.getElementById(`table_alerta_risco`).innerHTML = 'Total de alertas'

        document.getElementById(`table_alerta_${item}`).innerHTML += `<img src="../assets/icon/arrow_drop_down.svg" alt="drop_down">`
        jaOrdenado = true
    }

    let infoOrdenada = []
    for (let index = 0; index < infoTabela.length; index++) {
        const element = infoTabela[index];
        if(item == 'nome') {
            infoOrdenada = infoTabela
        } else if (item == 'cpu') {
            
            if (infoOrdenada.length > 0){
                let inserido = false
                for (let j = 0; j < infoOrdenada.length; j++) {
                    const elemento = infoOrdenada[j];
                    if (Number(element.AlertaCPU) > Number(elemento.AlertaCPU)) {
                        infoOrdenada.splice(j, 0, element)
                        inserido = true
                        break;
                    } 
                }
                if (!inserido) {
                    infoOrdenada.push(element)
                }
            } else infoOrdenada.push(element)
        } else if (item == 'ram') {
            if (infoOrdenada.length > 0){
                let inserido = false
                for (let j = 0; j < infoOrdenada.length; j++) {
                    const elemento = infoOrdenada[j];
                    if (Number(element.AlertaRAM) > Number(elemento.AlertaRAM)) {
                        infoOrdenada.splice(j, 0, element)
                        inserido = true
                        break;
                    } 
                }
                if (!inserido) {
                    infoOrdenada.push(element)
                }
            } else infoOrdenada.push(element)
        }else if (item == 'disco') {
            if (infoOrdenada.length > 0){
                let inserido = false
                for (let j = 0; j < infoOrdenada.length; j++) {
                    const elemento = infoOrdenada[j];
                    if (Number(element.AlertaDisco) > Number(elemento.AlertaDisco)) {
                        infoOrdenada.splice(j, 0, element)
                        inserido = true
                        break;
                    } 
                }
                if (!inserido) {
                    infoOrdenada.push(element)
                }
            } else infoOrdenada.push(element)
        }else { // RISCO
            if (infoOrdenada.length > 0){
                let inserido = false
                for (let j = 0; j < infoOrdenada.length; j++) {
                    const elemento = infoOrdenada[j];
                    if (Number(element.QuantidadeTotalAlertas) > Number(elemento.QuantidadeTotalAlertas)) {
                        infoOrdenada.splice(j, 0, element)
                        inserido = true
                        break;
                    } 
                }
                if (!inserido) {
                    infoOrdenada.push(element)
                }
            } else infoOrdenada.push(element)
        }
    }

    const bodyTabela = document.getElementById("bodyTabelaAlerta")
    bodyTabela.innerHTML = ''
    for (let index = 0; index < infoOrdenada.length; index++) {
        const element = infoOrdenada[index];
        bodyTabela.innerHTML += `
            <tr onclick="(${element.id})">
            <td>
                ${element.apelido}
            </td>
            <td>
                ${element.AlertaCPU}
            </td>
            <td>
                ${element.AlertaRAM}
            </td>
            <td>
                ${element.AlertaDisco}
            </td>
            <td>
                ${element.QuantidadeTotalAlertas}
            </td>
        </tr>
            `
    }
}

function plotarGraficoPizza(){
    let labels = ['Ok', 'Atenção', 'Crítico'];
    let dados = [20, 30, 50];

    const config = {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: '',
                data: dados,
                backgroundColor: [
                    '#BD953F',
                    '#BD5C20',
                    '#BD2C2C'
                ],
                borderColor: [
                    '#BD953F',
                    '#BD5C20',
                    '#BD2C2C'
                ],
                borderWidth: 1
            }]
        },
    };

    new Chart(
        document.getElementById(`pieChart`),
        config
    );

}
