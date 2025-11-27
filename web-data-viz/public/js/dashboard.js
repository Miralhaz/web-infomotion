let graficoStackBarDisco;
let graficoParticaoDisco;

function carregarDashboardInicial() {
    const idServidorClicado = sessionStorage.ID_SERVIDOR_SELECIONADO;

    listarServidores(idServidorClicado);

    if (idServidorClicado) {
        console.log("Iniciando carregamento do Servidor ID:", idServidorClicado);
        obterDadosKpi(idServidorClicado);
    }
}

function listarServidores() {
    let idEmpresa = sessionStorage.ID_EMPRESA;

    fetch(`/servidores/listarServidores/${idEmpresa}`)
        .then(function (resposta) {
            console.log("resposta:", resposta);

            if (resposta.ok) {
                resposta.json().then(function (resposta) {
                    console.log("Dados recebidos: ", JSON.stringify(resposta));

                    const select = document.getElementById('servidores');

                    let frase = `<option value="escolha_op">Escolha um servidor</option>`;

                    for (let i = 0; i < resposta.length; i++) {
                        frase += `
                                <option value="${resposta[i].idServidor}" data-id="${resposta[i].idServidor}">${resposta[i].apelido}</option>
                        `;
                    }

                    select.innerHTML = frase;

                });

            } else {
                throw "Houve um erro ao tentar listar os servidores!";
            }
        })

        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });
}
var cargoUsuario = sessionStorage.getItem("USUARIO_CARGO")
document.addEventListener("DOMContentLoaded", function () {
    if (cargoUsuario != "Gestor") {
        var elemento = document.getElementById("usuario-header");
        elemento.style.display = "none";
    }
})

function obterDadosKpi(idServidor) {
    fetch(`/dashboardNear/obterDados/${idServidor}`)
        .then(function (resposta) {
            if (resposta.ok) {
                resposta.json().then(function (dados) {
                    console.log("Dados recebidos: ", JSON.stringify(dados));

                    const divs = document.querySelector(".div-kpis");

                    let frase = `
                <div class="div-dados">
                    <p class="titulo"> Temperatura atual (°C)</p>
                    <div class="div-content">
                        <div class="temp-atual">
                            <div class="div-graph">
                                <a id="circ_cpu">◎</a>
                            </div>
                            <div>
                                <p class="titulo">CPU</p>
                                <p class="titulo">Máx: <a class="dados-uso">${dados.maximo.maxCpuTemp}°C</a></p>
                                <div class="div-temp">
                                    <p>${dados.atual.temperatura_cpu}°C</p>
                                </div>
                            </div>
                        </div>

                        <div class="temp-atual">
                            <div>
                                <p class="titulo">DISCO</p>
                                <p class="titulo">Máx: <a class="dados-uso">${dados.maximo.maxDiscoTemp}°C</a></p>
                                <div class="div-temp">
                                    <p>${dados.atual.temperatura_disco}°C</p>
                                </div>
                            </div>
                            <div class="div-graph">
                                <a id="circ_disco">◎</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="div-dados2">
                    <p style="margin-top: 20px;" class="titulo"> Uso de CPU Atual (%) </p>
                    <div class="div-container-kpi">
                        <div class="div-velocimetro">
                            <canvas id="velocimeterCpuChart"></canvas>
                        </div>
                        <p> Parâmetro Máximo da CPU: ${dados.maximo.maxCpuUso}% </p>
                    </div>
                </div>

                <div class="div-dados2">
                    <p style="margin-top: 20px;" class="titulo"> Uso de RAM Atual (%) </p>
                    <div class="div-container-kpi">
                        <div class="div-velocimetro">
                            <canvas id="velocimeterRamChart"></canvas>
                        </div>
                        <p> Parâmetro Máximo da RAM: ${dados.maximo.maxRam}% </p>
                    </div>
                </div>

                <div class="div-dados2">
                    <p style="margin-top: 20px;" class="titulo"> Uso de Rede Atual (Mbps) </p>
                    <div class="div-container-kpi">
                        <p class="titulo2" style="margin-top: 0vh;"><img src="../assets/imgs-dashboard/Upload.png" alt=""> Upload: </p>
                        <div class="div-rede"> <p> ${dados.atual.uploadByte} Mbps </p> </div>
                        <p>Mínimo: ${dados.maximo.maxUpload}Mbps</p>
                        <p class="titulo2"><img src="../assets/imgs-dashboard/Download.png" alt=""> Download: </p>
                        <div class="div-rede"> <p> ${dados.atual.downloadByte} Mbps </p> </div>
                        <p>Mínimo: ${dados.maximo.maxDownload}Mbps</p>
                    </div>
                </div>
                `;

                    divs.innerHTML = frase;

                    const dadosKpiCpu = {
                        uso_cpu: dados.atual.cpu,
                        max_cpu: dados.maximo.maxCpuUso
                    };

                    const dadosKpiRam = {
                        uso_ram: dados.atual.ram,
                        max_ram: dados.maximo.maxRam
                    };

                    const dadosKpiDisco = {
                        uso_disco: dados.atual.disco,
                        max_disco: dados.maximo.maxDiscoUso
                    }

                    const dadosKpiDiscoParticao = {
                        particoes: dados.particoes
                    };

                    plotarGraficoVelocimetroCpu(dadosKpiCpu);
                    plotarGraficoVelocimetroRam(dadosKpiRam);
                    plotarGraficoStackBarDisco(dadosKpiDisco);
                    plotarGraficoParticaoDisco(dadosKpiDiscoParticao);

                    let div_temp = document.querySelectorAll('.div-temp');

                    let div_rede = document.querySelectorAll('.div-rede');
                    if (dados.atual.uploadByte < dados.maximo.maxUpload) {
                        div_rede[0].style.backgroundColor = '#940000'
                    } else if (dados.atual.uploadByte <= dados.maximo.maxUpload + 20) {
                        div_rede[0].style.backgroundColor = '#C89C00'
                    } else {
                        div_rede[0].style.backgroundColor = '#009900ff'
                    }

                    if (dados.atual.downloadByte <= dados.maximo.maxDownload) {
                        div_rede[1].style.backgroundColor = '#940000'
                    } else if (dados.atual.downloadByte <= dados.maximo.maxDownload + 20) {
                        div_rede[1].style.backgroundColor = '#C89C00'
                    } else {
                        div_rede[1].style.backgroundColor = '#009900ff'
                    }

                    let circ_cpu = document.getElementById('circ_cpu');

                    if (dados.atual.temperatura_cpu >= 75) {
                        div_temp[0].style.backgroundColor = '#940000'
                    }
                    else if (dados.atual.temperatura_cpu >= 55) {
                        div_temp[0].style.backgroundColor = '#ff3c00ff'
                    }
                    else if (dados.atual.temperatura_cpu >= 40) {
                        div_temp[0].style.backgroundColor = '#ff7b00ff'
                    }
                    else {
                        div_temp[0].style.backgroundColor = '#fdd700ff'
                    }



                    if (dados.atual.temperatura_disco >= 75) {
                        div_temp[1].style.backgroundColor = '#940000'
                    }
                    else if (dados.atual.temperatura_disco >= 55) {
                        div_temp[1].style.backgroundColor = '#ff3c00ff'
                    }
                    else if (dados.atual.temperatura_disco >= 40) {
                        div_temp[1].style.backgroundColor = '#ff7b00ff'
                    }
                    else {
                        div_temp[1].style.backgroundColor = '#fdd700ff'
                    }

                    if (dados.atual.temperatura_cpu >= 95) {
                        circ_cpu.style.top = '0%';
                    }

                    else if (dados.atual.temperatura_cpu >= 90) {
                        circ_cpu.style.top = '5%';
                    }

                    else if (dados.atual.temperatura_cpu >= 80) {
                        circ_cpu.style.top = '10%';
                    }

                    else if (dados.atual.temperatura_cpu >= 70) {
                        circ_cpu.style.top = '20%';
                    }

                    else if (dados.atual.temperatura_cpu >= 60) {
                        circ_cpu.style.top = '30%';
                    }

                    else if (dados.atual.temperatura_cpu >= 50) {
                        circ_cpu.style.top = '40%';
                    }

                    else if (dados.atual.temperatura_cpu >= 40) {
                        circ_cpu.style.top = '50%';
                    }

                    else if (dados.atual.temperatura_cpu >= 30) {
                        circ_cpu.style.top = '60%';
                    }

                    else if (dados.atual.temperatura_cpu >= 20) {
                        circ_cpu.style.top = '70%';
                    }

                    else if (dados.atual.temperatura_cpu >= 10) {
                        circ_cpu.style.top = '80%';
                    }

                    let circ_disco = document.getElementById('circ_disco');

                    if (dados.atual.temperatura_disco >= 95) {
                        circ_disco.style.top = '0%';
                    }

                    else if (dados.atual.temperatura_disco >= 90) {
                        circ_disco.style.top = '5%';
                    }

                    else if (dados.atual.temperatura_disco >= 80) {
                        circ_disco.style.top = '10%';
                    }

                    else if (dados.atual.temperatura_disco >= 70) {
                        circ_disco.style.top = '20%';
                    }

                    else if (dados.atual.temperatura_disco >= 60) {
                        circ_disco.style.top = '30%';
                    }

                    else if (dados.atual.temperatura_disco >= 50) {
                        circ_disco.style.top = '40%';
                    }

                    else if (dados.atual.temperatura_disco >= 40) {
                        circ_disco.style.top = '50%';
                    }

                    else if (dados.atual.temperatura_disco >= 30) {
                        circ_disco.style.top = '60%';
                    }

                    else if (dados.atual.temperatura_disco >= 20) {
                        circ_disco.style.top = '70%';
                    }

                    else if (dados.atual.temperatura_disco >= 10) {
                        circ_disco.style.top = '80%';
                    }

                });

            } else {
                throw "Houve um erro ao tentar listar os servidores!";
            }
        })

        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });

}

function plotarGraficoVelocimetroCpu(dadoKpi) {
    const usoCpu = dadoKpi.uso_cpu;
    const restante = (100 - usoCpu);
    const parametro = dadoKpi.max_cpu

    let corUsada;
    let hueFinal;

    const corMinima = 120;
    const corMaxima = 0;

    if (usoCpu >= parametro) {
        hueFinal = corMaxima
        corUsada = `hsl(${corMaxima}, 80%, 50%)`;
    } else {
        const pontoInicialMudanca = 60;

        if (usoCpu < pontoInicialMudanca) {
            hueFinal = corMinima
            corUsada = `hsl(${corMinima}, 80%, 50%)`;
        } else {
            const rangeUso = parametro - pontoInicialMudanca;
            const rangeCor = corMinima - corMaxima;

            const fator = (usoCpu - pontoInicialMudanca) / rangeUso;
            hueFinal = corMinima - (fator * rangeCor);

            corUsada = `hsl(${hueFinal}, 80%, 50%)`;
        }
    }

    const corRestante = '#c0c0c0ff'

    const textCenter = {
        id: 'textCenter',
        beforeDatasetsDraw(chart, args, pluginOptions) {
            const { ctx, chartArea: { top, bottom, width, height } } = chart;
            ctx.save();

            const text = `${usoCpu}%`;
            const fontSize = (height / 90).toFixed(2);
            const textX = width / 2;
            const textY = (bottom + top) / 1.5;

            ctx.font = `bold ${fontSize}em sans-serif`;
            ctx.fillStyle = corUsada;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, textX, textY);

            const labelText = '';
            const labelFontSize = (height / 100).toFixed(2);
            const labelY = (bottom + top) / 1.8;

            ctx.font = `lighter ${labelFontSize}em sans-serif`;
            ctx.fillStyle = 'gray';
            ctx.fillText(labelText, textX, labelY);

            ctx.restore();
        }
    };

    const config = {
        type: 'doughnut',
        data: {
            labels: ['Uso da CPU', 'Ocioso'],
            datasets: [{
                label: 'Uso da CPU (%)',
                data: [usoCpu, restante],
                backgroundColor: [
                    corUsada,
                    corRestante
                ],
                borderColor: [
                    corUsada,
                    corRestante
                ],
                borderWidth: 1
            }]
        },
        options: {
            rotation: -90,
            circumference: 180,
            cutout: '75%',
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return context.label + ': ' + context.formattedValue + '%';
                        }
                    }
                }
            },
            elements: {
                arc: {
                    hoverOffset: 0
                }
            }
        },
        plugins: [textCenter]
    };

    new Chart(
        document.getElementById('velocimeterCpuChart'),
        config
    );

    let chart = document.getElementsByClassName('div-chart');

    for (let i = 0; i < chart.length; i++) {
        chart[i].style.display = 'flex';
    }
}

function plotarGraficoVelocimetroRam(dadoKpi) {
    const usoRam = dadoKpi.uso_ram;
    const restante = (100 - usoRam);
    const parametro = dadoKpi.max_ram

    let corUsada;

    const corMinima = 120;
    const corMaxima = 0;

    if (usoRam >= parametro) {
        corUsada = `hsl(${corMaxima}, 80%, 50%)`;
    } else {
        const pontoInicialMudanca = 60;

        if (usoRam < pontoInicialMudanca) {
            corUsada = `hsl(${corMinima}, 80%, 50%)`;
        } else {
            const rangeUso = parametro - pontoInicialMudanca;
            const rangeCor = corMinima - corMaxima;

            const fator = (usoRam - pontoInicialMudanca) / rangeUso;
            const hue = corMinima - (fator * rangeCor);

            corUsada = `hsl(${hue}, 80%, 50%)`;
        }
    }

    const corRestante = '#c0c0c0ff'

    const textCenter = {
        id: 'textCenter',
        beforeDatasetsDraw(chart, args, pluginOptions) {
            const { ctx, chartArea: { top, bottom, width, height } } = chart;
            ctx.save();

            const text = `${usoRam}%`;
            const fontSize = (height / 90).toFixed(2);
            const textX = width / 2;
            const textY = (bottom + top) / 1.5;

            ctx.font = `bold ${fontSize}em sans-serif`;
            ctx.fillStyle = corUsada;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, textX, textY);

            const labelText = '';
            const labelFontSize = (height / 100).toFixed(2);
            const labelY = (bottom + top) / 1.8;

            ctx.font = `lighter ${labelFontSize}em sans-serif`;
            ctx.fillStyle = 'gray';
            ctx.fillText(labelText, textX, labelY);

            ctx.restore();
        }
    };

    const config = {
        type: 'doughnut',
        data: {
            labels: ['Uso da CPU', 'Ocioso'],
            datasets: [{
                label: 'Uso da CPU (%)',
                data: [usoRam, restante],
                backgroundColor: [
                    corUsada,
                    corRestante
                ],
                borderColor: [
                    corUsada,
                    corRestante
                ],
                borderWidth: 1
            }]
        },
        options: {
            rotation: -90,
            circumference: 180,
            cutout: '75%',
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return context.label + ': ' + context.formattedValue + '%';
                        }
                    }
                }
            },
            elements: {
                arc: {
                    hoverOffset: 0
                }
            }
        },
        plugins: [textCenter]
    };

    new Chart(
        document.getElementById('velocimeterRamChart'),
        config
    );

    let chart = document.getElementsByClassName('div-chart');

    for (let i = 0; i < chart.length; i++) {
        chart[i].style.display = 'flex';
    }
}

function plotarGraficoStackBarDisco(dadosKpi) {
    console.log("dados Grafico Bar: " + dadosKpi)
    const usado = dadosKpi.uso_disco;
    const parametro = dadosKpi.max_disco;
    const total = 100;
    const livre = total - usado;

    let corUsada;

    const corMinima = 60;
    const corMaxima = 0;

    /* 
    Verde: em torno de 120
    Amarelo: em torno de 60 a 30
    Vermelho: 0
    */

    // se a quantidade usada for maior que o parâmetro, já é vermelho direto
    if (usado >= parametro) {
        corUsada = `hsl(${corMaxima}, 80%, 50%)`;
    } else {
        // deixa o ponto de mudanca = 50, que é a % intermediária para mudança de cor em relação ao uso 
        const pontoInicialMudanca = 50;

        if (usado < pontoInicialMudanca) {
            // cor usada começa a ficar mais esverdeada ou se mantém em perto do amarelo
            corUsada = `hsl(${corMinima}, 80%, 50%)`;
        } else {
            // rangeUso é para definir em que intervalo de uso irá mudar do amarelo ao vermelho 
            // Se parametro for 80, irá variar entre 30 pontos percentuais (80 - 50)
            // rangeCor é a cor (60 e 0) para ver qual entr amarelo e vermelho irá ficar
            const rangeUso = parametro - pontoInicialMudanca;
            const rangeCor = corMinima - corMaxima;

            // fator calcula a proporção de quanto o usado percorreu dentro da faixa de uso.
            const fator = (usado - pontoInicialMudanca) / rangeUso;
            // hue determina a cor intermediária que a cor ficará (talvez mais laranja pro vermelho, laranja mais pro amarelo)
            // cor varia entre 60 e 0
            const hue = corMinima - (fator * rangeCor);

            corUsada = `hsl(${hue}, 80%, 50%)`;
        }
    }

    const ctx = document.getElementById('stackBarChart').getContext('2d');

    if (window.graficoStackBarDisco instanceof Chart) {
        window.graficoStackBarDisco.destroy();
    }

    window.graficoStackBarDisco = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Uso do Disco'],
            datasets: [
                {
                    label: 'Usado',
                    data: [usado],
                    color: 'white',
                    backgroundColor: corUsada,
                    order: 1,
                    barThickness: 30
                },
                {
                    label: 'Livre',
                    data: [livre],
                    color: 'white',
                    backgroundColor: 'rgba(220, 220, 220, 1)',
                    order: 2,
                    barThickness: 30
                }
            ]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            aspectRatio: 4,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        color: 'white',
                        font: {
                            size: 15
                        }
                    }
                },
                title: {
                    display: true,
                    text: `Espaço em Disco Utilizado (%) - Parâmetro Máximo: ${parametro}%`,
                    color: 'white',
                    font: {
                        size: 18
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            let label = context.dataset.label || '';
                            let value = context.parsed.x;
                            return label + ': ' + value.toFixed(1) + '%';
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    max: total,
                    beginAtZero: true,
                    display: true,
                    ticks: {
                        padding: 10,
                        color: 'white',
                        font: {
                            size: 15
                        }
                    }
                },
                y: {
                    stacked: true,
                    display: false
                }
            },
            elements: {
                bar: {
                    borderWidth: 1,
                    borderColor: 'rgba(0, 0, 0, 0.1)'
                }
            }
        }
    });
}



function plotarGraficoParticaoDisco(dadosKpiDiscoParticao) {
    const labels = [];
    const usados = [];
    const livres = [];

    for (let i = 0; i < dadosKpiDiscoParticao.particoes.length; i++) {
        const p = dadosKpiDiscoParticao.particoes[i];

        labels.push(`Partição ${p.nome}:/`);
        usados.push(p.uso);
        livres.push(100 - p.uso);
    }

    const canvasId = 'barParticaoChart';
    const ctx = document.getElementById(canvasId);

    if (window.graficoParticaoDisco instanceof Chart) {
        window.graficoParticaoDisco.destroy();
    }

    window.graficoParticaoDisco = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Usado',
                    data: usados,
                    backgroundColor: 'rgba(255, 198, 75, 0.8)',
                    order: 1,
                },
                {
                    label: 'Livre',
                    data: livres,
                    backgroundColor: 'rgba(220, 220, 220, 1)',
                    order: 2,
                }
            ]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            aspectRatio: 4,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        usePointStyle: true,
                        color: 'white',
                        font: {
                            size: 15
                        }
                    }
                },
                title: {
                    display: true,
                    font: {
                        size: 18
                    },
                    text: 'Uso de Disco por Partição (%)',
                    color: 'white',
                },
            },
            scales: {
                x: {
                    stacked: true,
                    max: 100,
                    beginAtZero: true,
                    ticks: {
                        padding: 10,
                        color: 'white',
                        font: {
                            size: 15
                        }
                    }
                },
                y: {
                    stacked: true,
                    ticks: {
                        padding: 10,
                        color: 'white',
                        font: {
                            size: 15
                        }
                    }
                }
            }
        }
    });
}

async function obterAlertas() {
    const idServidorSelecionado = sessionStorage.ID_SERVIDOR_SELECIONADO;
    try {
        const res = await fetch(`/dashboardNear/obterAlertas/${idServidorSelecionado}`);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        console.log("Últimos alertas:", json.issues);

        preencherTabelaAlertas(json.issues);

        return json.issues;

    } catch (err) {
        console.error("Erro ao obter alertas:", err);
        document.getElementById("tabela_alertas_corpo").innerHTML =
            `<tr><td colspan="3" style="text-align:center;color:red;">Erro ao carregar alertas</td></tr>`;
    }
}

function formatarValorComUnidade(componente, valorBruto) {
    const valorNumerico = valorBruto.replace(/[^\d.,]/g, '').replace(',', '.');

    const comp = componente.toLowerCase().trim();

    if (isNaN(valorNumerico)) {
        return valorBruto;
    }

    if (comp.includes('cpu') && comp.includes('temperatura')) {
        return `${valorNumerico}°C`;
    }
    if (comp.includes('disco') && comp.includes('temperatura')) {
        return `${valorNumerico}°C`;
    }
    if (comp === 'cpu' || comp === 'ram' || comp === 'disco' || comp.includes('uso')) {
        return `${valorNumerico}%`;
    }
    if (comp === 'rede') {
        return `${valorNumerico} Mbps`;
    }

    return valorBruto;
}

function preencherTabelaAlertas(issues) {
  const tabela = document.getElementById("tabela_alertas_corpo");
  if (!tabela) return;

  tabela.innerHTML = "";

  if (!issues || issues.length === 0) {
    tabela.innerHTML = `<tr><td colspan="3" style="text-align:center;">Nenhum alerta encontrado</td></tr>`;
    return;
  }

  issues.forEach(issue => {
    const titulo = issue.fields.summary;
    const dataCriacao = issue.fields.created;
    const status = issue.fields.status.name; 

    let classeLinha = "";
    const statusUpper = status.toUpperCase();
    if (statusUpper === "ABERTO" || statusUpper === "REABERTO") {
      classeLinha = "linha-critica"; 
    } else {
      classeLinha = "linha-alerta"; 
    }

    const regex = /^Alerta Crítico:\s*([A-Za-zÀ-ÿ\s]+?)\s+em\s+([^\s]+)/i;
    const match = titulo.match(regex);

    let componente, valorFormatado;
    if (match) {
      componente = match[1].trim();
      const valorBruto = match[2];

      let valorLimpo = valorBruto
        .replace(/[^\d,\.]/g, '')
        .replace(/,/g, '.');
      valorLimpo = valorLimpo.replace(/(\.\d*)\./g, '$1');

      const valorNumerico = parseFloat(valorLimpo);

      if (isNaN(valorNumerico)) {
        valorFormatado = valorBruto;
      } else {
        const compLower = componente.toLowerCase();

        if (compLower === "rede") {
          const mbps = (valorNumerico * 8) / 1_000_000;
          valorFormatado = `${mbps.toFixed(2)} Mbps`;
        } else if (compLower.includes("temperatura")) {
          valorFormatado = `${valorNumerico}°C`;
        } else if (
          ["cpu", "ram", "disco"].includes(compLower) ||
          compLower.includes("uso")
        ) {
          valorFormatado = `${valorNumerico}%`;
        } else {
          valorFormatado = valorBruto;
        }
      }
    } else {
      componente = "Desconhecido";
      valorFormatado = "—";
    }

    const dataFormatada = new Date(dataCriacao).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const tr = document.createElement("tr");
    tr.className = classeLinha; 
    tr.innerHTML = `
      <td>${componente}</td>
      <td>${valorFormatado}</td>
      <td>${dataFormatada}</td>
    `;
    tabela.appendChild(tr);
  });
}

const selectElement = document.getElementById('dash');

selectElement.addEventListener('change', function () {
    const url = this.value;
    if (url) {
        window.location = url;
    }
});

window.onload = () => {
    carregarDashboardInicial();
    const select = document.getElementById('servidores');
    select.addEventListener('change', (e) => {
        const opcao = e.target.selectedOptions[0];
        const idServidor = opcao.dataset.id;
        if (!idServidor) return;
        obterDadosKpi(idServidor);
    });

    let chart = document.getElementsByClassName('div-chart');

    for (let i = 0; i < chart.length; i++) {
        chart[i].style.display = 'none';
    }

    listarServidores();
    obterAlertas();
};
