
let info = []
let infoExibicao = []
const tempo = localStorage.getItem("tempoSelecionado");
let chartInstance = null;
let especificacao = []

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

function inserirDadosTabela(){
    
    
    let infoAjustada = JSON.parse(JSON.stringify(info)); 
    let infoTabela = []

    let hoje = new Date();           
    let dataLimite = new Date(); 
    dataLimite.setDate(hoje.getDate() - tempo); // seta a data limite para exibir os dados
    

    for (let index = 0; index < infoAjustada.length; index++) {
        const element = infoAjustada[index];
        const dataStr = element.data_registro;
        let [dia, mes, ano] = dataStr.split("/"); 
        let data = new Date(`${ano}-${mes}-${dia}`);
        element.data_registro = data
    }
    
    
    for (let index = 0; index < infoAjustada.length; index++) {
        const element = infoAjustada[index];
        if (element.data_registro > dataLimite){
            infoExibicao.push(element)
        }
    }
    console.log("infoExibicao", infoExibicao);
    
    

    for (let index = 0; index < infoExibicao.length; index++) {
        const element = infoExibicao[index];
        let indice = -1
            for (let j = 0; j < infoTabela.length; j++) {
                const element2 = infoTabela[j];
                if (element2.apelido === element.apelido) {indice = j; break;}
            }
        if(indice >= 0){
            if (element.tipo.toUpperCase() === 'CPU') {
                infoTabela[indice].AlertaCPU ++;
            }else if (element.tipo.toUpperCase() === 'DISCO') {
                infoTabela[indice].AlertaDisco ++;
            }else {
                infoTabela[indice].AlertaRAM ++;
            }
        }  
        else {
            infoTabela.push({
                id: element.id,
                apelido: element.apelido,
                AlertaCPU: 0,
                AlertaRAM: 0,
                AlertaDisco: 0,
                Risco: 0
            })
            indice = infoTabela.length -1
            if (element.tipo.toUpperCase() === 'CPU') {
                    infoTabela[indice].AlertaCPU ++;
                }else if (element.tipo.toUpperCase() === 'DISCO') {
                    infoTabela[indice].AlertaDisco ++;
                }else {
                    infoTabela[indice].AlertaRAM ++;
                }
        }
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
            ${element.Risco}
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

function plotarGraficoLinhas(idServidor) {

    const canvas = document.getElementById('lineChartHistorico');
    const existingChart = Chart.getChart(canvas);
    if (existingChart) existingChart.destroy();

   
    const widthPx = window.innerWidth * 0.6;  // 60vw
    const heightPx = window.innerHeight * 0.30; // 35vh

    canvas.width = widthPx;
    canvas.height = heightPx;

    let labels = [];
    let ram = [];
    let cpu = [];
    let disco = [];
    let nomeServidor;

    for (let index = 0; index < infoExibicao.length; index++) {
        const element = infoExibicao[index];
        if (element.id == idServidor){
            nomeServidor = element.apelido
        }
    }
    
    for (let i = 0; i < infoExibicao.length; i++) {

        if(infoExibicao[i].id == idServidor){
            const el = infoExibicao[i];
            const d = el.data_registro instanceof Date ? el.data_registro : new Date(el.data_registro); // verifica se é Date ou não
            const key = dataToString(d);
        

            // procurar índice da label
            let idx = -1;
            for (let j = 0; j < labels.length; j++) {
            if (labels[j] === key) { idx = j; break; }
            }

            // se não existe, cria linha
            if (idx === -1) {
            labels.push(key);
            ram.push(0);
            cpu.push(0);
            disco.push(0);
            idx = labels.length - 1; // <<< índice correto
            }

            // incrementa série correta
            const tipo = String(el.tipo).toUpperCase();
            if (tipo === 'CPU'){       cpu[idx]   += 1;}
            else if (tipo === 'DISCO') {disco[idx] += 1;}
            else                       ram[idx]   += 1;
        }
    }

    // Pegando o nome do servidor
    if (nomeServidor) {
        if(tempo > 1){
            document.getElementById("nome_gráfico").innerHTML = `Quantidade de alertas dos ultimos ${tempo} dias do servidor: ${nomeServidor}`
        }
        else document.getElementById("nome_gráfico").innerHTML = `Quantidade de alertas do ultimo dia do servidor: ${nomeServidor}`
    }
    

    const config = {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'RAM',
                data: ram,
                fill: false,
                backgroundColor: '#FFB000',
                borderColor: '#FFB000',
                tension: 0.1
            },
            {
                label: 'CPU',
                data: cpu,
                fill: false,
                backgroundColor: '#E2E2E2',
                borderColor: '#E2E2E2',
                tension: 0.1
            },
            {
                label: 'DISCO',
                data: disco,
                fill: false,
                backgroundColor: '#FAFF00',
                borderColor: '#FAFF00',
                tension: 0.1
            }]
        },

        options: {
            responsive: false,
            maintainAspectRatio: false,         
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: 'white',
                    },
                    title: {
                        display: true,
                        text: 'Quantidade de alertas',
                        color: 'white'
                    },
                    grid: {
                        color: 'rgba(153, 153, 153, 0.2)',
                        display: true,
                        drawTicks: false
                    }
                },
                x: {
                    ticks: {
                        color: 'white',
                    },
                    title: {
                        display: true,
                        text: 'Tempo',
                        color: 'white'
                    },
                    grid: {
                        drawOnChartArea: true
                    }
                }
            },
            plugins: {
                title: {
                    display: false,
                    text: "",
                    color: ''
                },
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        color: 'white'
                    }
                }
            }
        }
    };

    new Chart(canvas, config);

}

function listarEspecificacoes(idServidor) {
    
    fetch(`/servidores/receberEspecificacoes/${idServidor}`)
        .then(function (resposta) {
            if (resposta.ok) {
                resposta.json().then(function (dados) {
                    console.log("Dados recebidos: ", JSON.stringify(dados));
                    especificacao.push(...dados)
                    console.log("especificacao", especificacao);
                    plotarEspecificacaoHardware()
                    
                });

            } else {
                throw "Houve um erro ao tentar receber as especificações dos servidores!";
            }
        })

        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });

        console.log();
        
        //
        

}

function plotarEspecificacaoHardware(){

    const ramTotal = document.getElementById("ram_total")
        const CPU = document.getElementById("nucleos_cpu")
        const disco = document.getElementById("disco")
        let logico = ''
        let fisico = ''

        for (let index = 0; index < especificacao.length; index++) {
            const element = especificacao[index];
            if (element.tipo.toUpperCase() == 'cpu'.toUpperCase()){
                if (element.nome_especificacao.toUpperCase() == "Quantidade de núcleos lógicos".toUpperCase()) {
                    logico = element.valor
                } else fisico = element.valor
            } else if (element.tipo.toUpperCase() == 'ram'.toUpperCase()){
                ramTotal.innerHTML = `RAM Total: ${element.valor}`
            } else disco.innerHTML = `Capacidade Disco: ${element.valor}`
        }
        CPU.innerHTML = `Núcleos da CPU<br>Físicos: ${fisico}<br>Lógicos: ${logico}`

}

function chamarFuncoesServidores(idServidor) {
    plotarGraficoLinhas(idServidor)
    listarEspecificacoes(idServidor)
}