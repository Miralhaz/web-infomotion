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

async function carregarJsonS3(nomeArquivo) {
    const resp = await fetch(`/dashboardHistorico/dados/${nomeArquivo}`);
    if (!resp.ok) throw new Error(`Falha ao carregar ${nomeArquivo}`);
    return await resp.json();
}

async function carregarDashboardDoS3() {
    const tempo = Number(localStorage.getItem("tempoSelecionado"));

    const arqTabela = `historicoAlertas_${tempo}.json`;
    const arqLinhas = `historicoAlertasLinhas_${tempo}.json`;
    const arqDonut = `nivelCriticidadeDonut_${tempo}.json`;

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
    plotarGraficoBarra(idServidor);
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
        } else if (item == 'rede') {
            if (infoOrdenada.length > 0) {
                let inserido = false
                for (let j = 0; j < infoOrdenada.length; j++) {
                    const elemento = infoOrdenada[j];
                    if (Number(element.AlertaRede) > Number(elemento.AlertaRede)) {
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

    const tempo = Number(localStorage.getItem("tempoSelecionado"));

    const canvas = document.getElementById('pieChart');
    const existingChart = Chart.getChart(canvas);
    if (existingChart) existingChart.destroy();

    const titulo = tempo > 1
        ? `Situação dos servidores nos últimos ${tempo} dias`
        : `Situação dos servidores no último dia`;
    document.getElementById("nome_gráfico_donut").innerHTML = titulo;

    const labels = dadosDonut.map(i => i.classificacao);
    const dados = dadosDonut.map(i => Number(i.quantidade));
    const critico = dadosDonut.find(i => i.classificacao === "CRITICO");
    const criticoTexto = critico ? `${critico.percentual.toFixed(0)}% CRÍTICO` : "0% CRÍTICO";

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
            ctx.fillText(criticoTexto, centerX, centerY); // Texto que vai aparecer no meio!
            ctx.restore(); // restaura o contexto salvo
        }
    }

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
                    },
                    display: function (context) {
                        return context.dataset.data[context.dataIndex] !== 0;
                    }
                }
            }
        },
        plugins: [ChartDataLabels, textoCentro]
    }

    new Chart(canvas, config);

}




function plotarGraficoLinhas(idServidor) {

    const canvas = document.getElementById('lineChartHistorico');
    const existingChart = Chart.getChart(canvas);
    if (existingChart) existingChart.destroy();

    const dadosServidor = serieLinhas
        .filter(d => String(d.fk_servidor) === String(idServidor))
        .sort((a, b) => new Date(a.timestamp.replace(' ', 'T')) - new Date(b.timestamp.replace(' ', 'T')));

    const tempo = Number(localStorage.getItem("tempoSelecionado"));

    const labels = dadosServidor.map(d =>
        tempo != 1 ? formatarBR(d.timestamp) : (d.timestamp)
    );

    if (dadosServidor.length === 0) {
        console.log("Sem dados de linhas para esse servidor.");
        return;
    }

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
                label: 'CPU',
                data: cpu,
                fill: false,
                backgroundColor: '#d9b98a',
                borderColor: '#d9b98a',
                tension: 0.1
            },
            {
                label: 'RAM',
                data: ram,
                fill: false,
                backgroundColor: '#E2E2E2',
                borderColor: '#E2E2E2',
                tension: 0.1
            },
            {
                label: 'DISCO',
                data: disco,
                fill: false,
                backgroundColor: '#BD953F',
                borderColor: '#BD953F',
                tension: 0.1
            },
            {
                label: 'REDE',
                data: rede,
                fill: false,
                backgroundColor: '#8c6f45',
                borderColor: '#8c6f45',
                tension: 0.1
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: 'white',
                        stepSize: 1,
                        font: {
                            size: 12
                        }
                    },
                    title: {
                        display: true,
                        text: 'Quantidade de alertas',
                        color: 'white',
                        font: {
                            size: 14
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
                            size: 12
                        }
                    },
                    title: {
                        display: true,
                        text: 'Tempo',
                        color: 'white',
                        font: {
                            size: 14
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
                            size: 12
                        }
                    },
                }
            }
        }
    };

    new Chart(canvas, config);

}


function plotarGraficoBarra(idServidor) {

    const canvas = document.getElementById('barChart');
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();

    const srv = infoTabela.find(s => String(s.id) === String(idServidor));

    if (!srv) {
        return;
    }

    const cpu = Number(srv.AlertaCPU) || 0;
    const ram = Number(srv.AlertaRAM) || 0;
    const disco = Number(srv.AlertaDisco) || 0;
    const rede = Number(srv.AlertaRede) || 0;
    const total = cpu + ram + disco + rede;

    const tempoSel = Number(localStorage.getItem("tempoSelecionado")) || 1;
    const titulo = tempoSel > 1
        ? `Alertas por componente (últimos ${tempoSel} dias) — ${srv.apelido} | Total: ${total}`
        : `Alertas por componente (último dia) — ${srv.apelido} | Total: ${total}`;

    document.getElementById("nome_gráfico_linhas2").innerHTML = titulo;

    const config = {
        type: "bar",
        data: {
            labels: [" "],
            datasets: [
                { label: "CPU", data: [cpu], backgroundColor: "#d9b98a" },
                { label: "RAM", data: [ram], backgroundColor: "#E2E2E2" },
                { label: "DISCO", data: [disco], backgroundColor: "#BD953F" },
                { label: "REDE", data: [rede], backgroundColor: "#8c6f45" }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            scales: {
                y: {
                    stacked: true,
                    ticks: { color: "white" },
                    grid: { display: false }
                },
                x: {
                    stacked: true,
                    beginAtZero: true,
                    ticks: { color: "white" },
                    grid: { color: "rgba(153, 153, 153, 0.2)" }
                }
            },
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        usePointStyle: true,
                        color: "white"
                    }
                },
                tooltip: {
                    callbacks: {
                        label: (ctx) => {
                            const v = Number(ctx.raw) || 0;
                            const p = total > 0 ? (v * 100 / total) : 0;
                            return `${ctx.dataset.label}: ${v} (${p.toFixed(1)}%)`;
                        }
                    }
                }
            }
        }
    }

    barChart = new Chart(canvas, config);
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

function formatarBR(ts) {
    const d = new Date(ts.replace(' ', 'T'));
    return d.toLocaleDateString('pt-BR');
}
