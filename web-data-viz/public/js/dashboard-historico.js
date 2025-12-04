//const { color } = require("chart.js/helpers");

let info = []
let infoExibicao = []
const tempo = localStorage.getItem("tempoSelecionado");
let chartInstance = null;
let especificacao = []
let infoTabela = []
let jaOrdenado = true;

let resumoTabela = [];
let serieLinhas = [];

let dadosDonut = [];
let donutChart = null;
let dadosBolhas = [];
let bubbleChart = null;

async function carregarJsonS3(nomeArquivo) {
    const resp = await fetch(`/dashboardHistorico/dados/${nomeArquivo}`);
    if (!resp.ok) throw new Error(`Falha ao carregar ${nomeArquivo}`);
    return await resp.json();
}

async function carregarDashboardDoS3() {
    const tempo = Number(localStorage.getItem("tempoSelecionado"));

    const arqTabela = `historicoAlertas_${tempo}.json`;
    const arqLinhas = `historicoAlertasLinhas_${tempo}.json`;
    const arqDonut = "nivelCriticidadeDonut.json";

    console.log("Buscando:", arqTabela, arqLinhas);

    try {
        [resumoTabela, serieLinhas, dadosDonut] = await Promise.all([
            carregarJsonS3(arqTabela),
            carregarJsonS3(arqLinhas),
            carregarJsonS3(arqDonut)
        ]);

        console.log("resumoTabela len:", resumoTabela?.length, resumoTabela);
        console.log("serieLinhas len:", serieLinhas?.length, serieLinhas);

        inserirDadosTabela(tempo);

        if (resumoTabela.length > 0) {
            chamarFuncoesServidores(resumoTabela[0].fk_servidor);
        }

        await carregarBolhas("cpu");
    } catch (e) {
        console.error(e);
    }
}


function montarTabela(resumoTabela) {
    const map = new Map();

    for (const r of resumoTabela) {
        const id = Number(r.fk_servidor);
        const atual = map.get(id) || {
            id,
            apelido: r.apelido,
            AlertaCPU: 0,
            AlertaRAM: 0,
            AlertaDisco: 0,
            AlertaRede: 0,
            QuantidadeTotalAlertas: 0
        };

        atual.AlertaCPU += Number(r.alertasCpu) || 0;
        atual.AlertaRAM += Number(r.alertasRam) || 0;
        atual.AlertaDisco += Number(r.alertasDisco) || 0;
        atual.AlertaRede += Number(r.alertasRede) || 0;

        atual.QuantidadeTotalAlertas = Number(r.totalAlertas) || (atual.AlertaCPU + atual.AlertaRAM + atual.AlertaDisco + atual.AlertaRede);
        map.set(id, atual);
    }
    return Array.from(map.values());
}


function inserirDadosTabela(tempo) {
    document.getElementById("nome_tabela").innerHTML = `Relatório de alertas X ${tempo} dias`
    const bodyTabela = document.getElementById("bodyTabelaAlerta")
    bodyTabela.innerHTML = "";
    infoTabela = montarTabela(resumoTabela);

    for (const element of infoTabela) {
        bodyTabela.innerHTML += `
        <tr onclick="chamarFuncoesServidores(${element.id})">
            <td>${element.apelido}</td>
            <td>${element.AlertaCPU}</td>
            <td>${element.AlertaRAM}</td>
            <td>${element.AlertaDisco}</td>
            <td>${element.AlertaRede}</td>
            <td>${element.QuantidadeTotalAlertas}</td>
        </tr>
              `;
    }

    if (resumoTabela.length > 0) {
        plotarGraficoDonut();
        chamarFuncoesServidores(resumoTabela[0].fk_servidor);
    }
}


let totalDisco;

function chamarFuncoesServidores(idServidor) {
    plotarGraficoLinhas(idServidor);
}


function ordenarPor(item) {
    if (!jaOrdenado) {
        document.getElementById(`table_alerta_${item}`).innerHTML += `<img src="../assets/icon/arrow_drop_down.svg" alt="drop_down">`
        jaOrdenado = true
    } else {
        document.getElementById(`table_alerta_nome`).innerHTML = 'Nome do servidor';
        document.getElementById(`table_alerta_cpu`).innerHTML = 'CPU';
        document.getElementById(`table_alerta_ram`).innerHTML = 'RAM';
        document.getElementById(`table_alerta_disco`).innerHTML = 'Disco';
        document.getElementById(`table_alerta_rede`).innerHTML = 'Rede';
        document.getElementById(`table_alerta_total`).innerHTML = 'Total de alertas';

        document.getElementById(`table_alerta_${item}`).innerHTML += `<img src="../assets/icon/arrow_drop_down.svg" alt="drop_down">`
        jaOrdenado = true
    }

    let infoOrdenada = []
    for (let index = 0; index < infoTabela.length; index++) {
        const element = infoTabela[index];
        if (item == 'nome') {
            infoOrdenada = infoTabela
        } else if (item == 'cpu') {

            if (infoOrdenada.length > 0) {
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
            if (infoOrdenada.length > 0) {
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
        } else if (item == 'disco') {
            if (infoOrdenada.length > 0) {
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
        } else {
            if (infoOrdenada.length > 0) {
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
    bodyTabela.innerHTML = '';
    for (let index = 0; index < infoOrdenada.length; index++) {
        const element = infoOrdenada[index];
        bodyTabela.innerHTML += `
        <tr onclick="chamarFuncoesServidores(${element.id})">
            <td>${element.apelido}</td>
            <td>${element.AlertaCPU}</td>
            <td>${element.AlertaRAM}</td>
            <td>${element.AlertaDisco}</td>
            <td>${element.AlertaRede}</td>
            <td>${element.QuantidadeTotalAlertas}</td>
        </tr>`;
    }
}


function plotarGraficoDonut() {
    
    if(donutChart){
        donutChart.destroy();
    }

    const counts = { OK: 0, ATENCAO: 0, CRITICO: 0 };

    for (const i of dadosDonut) {
        const c = (i.classificacao) || "";
        if (counts[c] != null) counts[c]++;
    }

    const labels = Object.keys(counts);
    const dados = labels.map(k => counts[k]);

    const textoCentro = { // obj de pluggin
        id: 'kpiCentro', // chart.js reconhece os pluggins a partir de um id
        afterDraw(chart) { // função do chart.js que roda dps que o gráfico tiver sido plotado
            const ctx = chart.ctx; // contexto de desenho
            const centerX = chart.getDatasetMeta(0).data[0].x; // coordenada x
            const centerY = chart.getDatasetMeta(0).data[0].y; // coordenada y

            ctx.save(); // salva o contexto atual
            ctx.fillStyle = '#BD2C2C';
            ctx.font = 'bold 22px poppins';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(dados[2] + "% " + labels[2], centerX, centerY); // Texto que vai aparecer no meio!
            ctx.restore(); // restaura o contexto salvo
        }
    };

    const config = {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: 'Criticidade',
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
        options: {
            cutout: '75%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        color: 'white'
                    }
                },
                datalabels: {
                    color: 'white',
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                }
            }
        },
        plugins: [ChartDataLabels, textoCentro]
    };

    donutChart = new Chart(
        document.getElementById(`pieChart`),
        config
    );

}


const bolhasArquivos = {
    cpu: "criticidadeCpu.json",
    ram: "criticidadeRam.json",
    disco: "criticidadeDisco.json",
    temp_cpu: "criticidadeTempCpu.json",
    temp_disco: "criticidadeTempDisco.json",
    upload: "criticidadeUPLOAD.json",
    download: "criticidadeDOWNLOAD.json",
    pckt_rcvd: "criticidadePCKT_RCVD.json",
    pckt_snt: "criticidadePCKT_SNT.json"
}

async function carregarBolhas(tipo) {
    const arq = bolhasArquivos[tipo];
    
    if (!arq) {
        return;
    }

    dadosBolhas = await carregarJsonS3(arq);
    plotarGraficoBolhas();
    document.getElementById('menu')?.classList.remove('show');
}


function plotarGraficoBolhas() {

    if (bubbleChart) bubbleChart.destroy();

    const filtrados = (dadosBolhas).filter(i => {
        const c = String(i.classificacao || "").toUpperCase();
        return c === "ATENCAO" || c === "CRITICO";
    })

    const bolhas = filtrados.map((i) => ({
        x: Number(i.fk_servidor),
        y: Number(i.captura),
        r: Number(i.minutos)
    }));

    console.log("dados bolhas:", dadosBolhas)

    const colors = filtrados.map(i => {
        const c = (i.classificacao).toUpperCase();
        if (c == "CRITICO") {
            return "rgba(189, 44, 44, 0.5)";
        }
        if (c == "ATENCAO") {
            return "rgba(189, 92, 32, 0.5)";
        }
    });

    const config = {
        type: 'bubble',
        data: {
            datasets: [{
                label: "classificacao",
                data: bolhas,
                backgroundColor: colors
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: 'white',
                        font: {
                            size: 15
                        }
                    },
                    title: {
                        display: true,
                        text: 'Captura',
                        color: 'white',
                        font: {
                            size: 16
                        }
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
                        font: {
                            size: 15
                        }
                    },
                    title: {
                        display: true,
                        text: 'Apelido dos servidores',
                        color: 'white',
                        font: {
                            size: 16
                        }
                    },
                    grid: {
                        drawOnChartArea: true
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        color: 'white'
                    }
                },
                tooltip: {
                    callbacks: {
                        title: (ctx) => {
                            const item = filtrados[ctx];
                            return `Estado: ${item.classificacao}`;
                        },
                        beforeLabel: (ctx) => {
                            const item = filtrados[ctx];
                            return `Servidor: ${item.apelido}`;
                        },
                        label: (ctx) => {
                            const item = filtrados[ctx];
                            return `Captura: ${item.captura}% por ${item.minutos} minutos`;
                        }
                    }
                }
            }
        }
    }
    bubbleChart = new Chart(document.getElementById('bubbleChart'), config);
}


function plotarGraficoLinhas(idServidor) {

    const canvas = document.getElementById('lineChartHistorico');
    const existingChart = Chart.getChart(canvas);
    if (existingChart) existingChart.destroy();

    const tempo = Number(localStorage.getItem("tempoSelecionado"));
    const dadosServidor = serieLinhas
        .filter(d => String(d.fk_servidor) === String(idServidor))
        .sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));

    if (dadosServidor.length === 0) {
        console.log("Sem dados de linhas para esse servidor.");
        return;
    }

    const widthPx = window.innerWidth * 0.6;  // 60vw
    canvas.width = widthPx;

    const heightPx = window.innerHeight * 0.30; // 35vh
    canvas.height = heightPx;

    const labels = dadosServidor.map(d => d.timestamp);
    const cpu = dadosServidor.map(d => Number(d.alertasCpu));
    const ram = dadosServidor.map(d => Number(d.alertasRam));
    const disco = dadosServidor.map(d => Number(d.alertasDisco));
    const rede = dadosServidor.map(d => Number(d.alertasRede));
    const nomeServidor = dadosServidor[0]?.apelido;

    const titulo = tempo > 1
        ? `Quantidade de alertas dos últimos ${tempo} dias do servidor: ${nomeServidor}`
        : `Quantidade de alertas do último dia do servidor: ${nomeServidor}`;
    document.getElementById("nome_gráfico_linhas").innerHTML = titulo;

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
            },
            {
                label: 'REDE',
                data: rede,
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
                        stepSize: 1,
                        font: {
                            size: 18
                        }
                    },
                    title: {
                        display: true,
                        text: 'Quantidade de alertas',
                        color: 'white',
                        font: {
                            size: 20
                        }
                    },
                    grid: {
                        color: 'rgba(153, 153, 153, 0.2)',
                        display: true,
                        drawTicks: false
                    },
                },
                x: {
                    ticks: {
                        color: 'white',
                        font: {
                            size: 18
                        }
                    },
                    title: {
                        display: true,
                        text: 'Tempo',
                        color: 'white',
                        font: {
                            size: 20
                        }
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
                        color: 'white',
                        font: {
                            size: 18
                        }
                    }
                }
            }
        }
    };

    new Chart(canvas, config);

}


function acionarFiltro() {
    // Aqui apenas aciono o menu do filtro, se caso estiver exibindo, fecha se não ele aparece ao usuário
    const menu = document.getElementById('menu')

    if (menu.classList.contains("show")) {
        menu.classList.remove("show");
    } else {
        menu.classList.add("show");
    }
}