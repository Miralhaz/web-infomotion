let info = []
let infoExibicao = []
const tempo = localStorage.getItem("tempoSelecionado");
let chartInstance = null;
let especificacao = []
let infoTabela = []
let jaOrdenado = true;

let resumoTabela = [];
let serieLinhas = [];

async function carregarJsonS3(nomeArquivo) {
    const resp = await fetch(`/s3Route/dados/${nomeArquivo}`);
    if (!resp.ok) throw new Error(`Falha ao carregar ${nomeArquivo}`);
    return await resp.json();
}

async function carregarDashboardDoS3() {
    const tempo = Number(localStorage.getItem("tempoSelecionado") || 1);

    const arqTabela = `historicoAlertas_${tempo}.json`;
    const arqLinhas = `historicoAlertasLinhas_${tempo}.json`;

    try {
        [resumoTabela, serieLinhas] = await Promise.all([
            carregarJsonS3(arqTabela),
            carregarJsonS3(arqLinhas)
        ]);

        inserirDadosTabela(tempo);

        if (resumoTabela.length > 0) {
            chamarFuncoesServidores(resumoTabela[0].fk_servidor);
        }
    } catch (e) {
        console.error(e);
    }
}


function inserirDadosTabela(tempo) {
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
        if (element.data_registro > dataLimite) {
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
            if (element2.apelido === element.apelido) { indice = j; break; }
        }

        if (indice >= 0) {
            const tipo = element.tipo.toUpperCase();
            if (tipo === 'CPU') {
                infoTabela[indice].AlertaCPU++;
            } else if (tipo === 'DISCO') {
                infoTabela[indice].AlertaDisco++;
            } else {
                infoTabela[indice].AlertaRAM++;
            }
            infoTabela[indice].QuantidadeTotalAlertas++;
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
            } else if (tipo === 'DISCO') {
                novoRegistro.AlertaDisco = 1;
            } else {
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

    document.getElementById("nome_tabela").innerHTML = `Relatório de alertas X ${tempo} dias`
    const bodyTabela = document.getElementById("bodyTabelaAlerta")
    bodyTabela.innerHTML = "";

    infoTabela = resumoTabela.map(r => ({
        id: r.fk_servidor,
        apelido: r.apelido,
        AlertaCPU: Number(r.alertasCpu),
        AlertaRAM: Number(r.alertasRam),
        AlertaDisco: Number(r.alertasDisco),
        QuantidadeTotalAlertas: Number(r.totalAlertas)
    }));

    for (const element of infoTabela) {
        bodyTabela.innerHTML += `
        <tr onclick="chamarFuncoesServidores(${element.id})">
            <td>${element.apelido}</td>
            <td>${element.AlertaCPU}</td>
            <td>${element.AlertaRAM}</td>
            <td>${element.AlertaDisco}</td>
            <td>${element.QuantidadeTotalAlertas}</td>
        </tr>
              `;
    }
}


let totalDisco;

function chamarFuncoesServidores(idServidor) {
    plotarGraficoLinhas(idServidor)
}


function ordenarPor(item) {
    if (!jaOrdenado) {
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
    bodyTabela.innerHTML = ''
    for (let index = 0; index < infoOrdenada.length; index++) {
        const element = infoOrdenada[index];
        bodyTabela.innerHTML += `
        <tr onclick="chamarFuncoesServidores(${element.id})">
            <tr onclick="(${element.id})">
            <td>${element.apelido}</td>
            <td>${element.AlertaCPU}</td>
            <td>${element.AlertaRAM}</td>
            <td>${element.AlertaDisco}</td>
            <td>${element.QuantidadeTotalAlertas}</td>
        </tr>`;
    }
}

function plotarGraficoDonut() {
    const counts = { OK: 0, ATENCAO: 0, CRITICO: 0 };

    for (const d of data) {
        const c = (d.classificacao || "").toUpperCase();
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
                }
            }
        },
        plugins: [textoCentro]
    };

    new Chart(
        document.getElementById(`pieChart`),
        config
    );

}

function plotarGraficoBolhas() {

    const bolhas = data.map(d => ({
        x: Number(d.apelido) || 0,
        y: Number(d.percentual) || 0,
        r: Number(d.minutos) || 0
    }));

    const config = {
        type: 'bubble',
        data: {
            datasets: [{
                label: 'Servidores',
                data: bolhas,
                backgroundColor: 'rgba(189, 44, 44, 0.5)'
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
                        text: 'Porcentagem (%)',
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
                        title: function (context) {
                            const nivel = context[0].dataset.label;
                            return `Estado: ${nivel}`;
                        },
                        beforeLabel: function (context) {
                            const servidor = context.parsed.x;
                            return `Servidor: ${servidor}`;
                        },
                        label: function (context) {
                            const uso = context.parsed.y;
                            const minutos = context.raw.r;
                            return `Uso: ${uso}% por ${minutos} minutos`;
                        }
                    }
                }
            }
        }
    };

    new Chart(document.getElementById('bubbleChart'), config);
}


function plotarGraficoLinhas(idServidor) {

    const canvas = document.getElementById('lineChartHistorico');
    const existingChart = Chart.getChart(canvas);
    if (existingChart) existingChart.destroy();

    const tempo = Number(localStorage.getItem("tempoSelecionado") || 1);
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
    let ram = dadosServidor.map(d => Number(d.alertasRam));
    let disco = dadosServidor.map(d => Number(d.alertasDisco));

    const nomeServidor = dadosServidor[0].apelido || "";

    for (let index = 0; index < infoExibicao.length; index++) {
        const element = infoExibicao[index];
        if (element.id == idServidor) {
            nomeServidor = element.apelido
        }
    }

    for (let i = 0; i < infoExibicao.length; i++) {

        if (infoExibicao[i].id == idServidor) {
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
            if (tipo === 'CPU') { cpu[idx] += 1; }
            else if (tipo === 'DISCO') { disco[idx] += 1; }
            else ram[idx] += 1;
        }
    }

    // Pegando o nome do servidor
    if (nomeServidor) {
        if (tempo > 1) {
            document.getElementById("nome_gráfico").innerHTML = `Quantidade de alertas dos últimos ${tempo} dias do servidor: ${nomeServidor}`;
        }
        else document.getElementById("nome_gráfico").innerHTML = `Quantidade de alertas do último dia do servidor: ${nomeServidor}`;
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