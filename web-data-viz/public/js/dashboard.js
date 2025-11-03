let graficoLinhas;
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

    fetch(`/servidores/obterDadosKpi/${idServidor}`)
        .then(function (resposta) {
            if (resposta.ok) {
                resposta.json().then(function (dados) {
                    console.log("Dados recebidos: ", JSON.stringify(dados));

                    let divs = document.querySelector('.div-kpis');
                    let max_cpu, max_ram, max_disco;


                    for (let i = 0; i < dados.length; i++) {

                        if (dados[i].tipo.toLowerCase() == 'CPU'.toLowerCase()) {
                            max_cpu = dados[i].max;
                        }

                        else if (dados[i].tipo.toLowerCase() == 'RAM'.toLowerCase()) {
                            max_ram = dados[i].max;
                        }

                        else if (dados[i].tipo.toLowerCase() == 'DISCO'.toLowerCase()) {
                            max_disco = dados[i].max;
                        }
                    }

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
                                <p class="titulo">Máx: <a class="dados-uso">85°C</a></p>
                                <div class="div-temp">
                                    <p>${Math.round(dados[0].temp_cpu)}°C</p>
                                </div>
                            </div>
                        </div>

                        <div class="temp-atual">
                            <div>
                                <p class="titulo">DISCO</p>
                                <p class="titulo">Máx: <a class="dados-uso">85°C</a></p>
                                <div class="div-temp">
                                    <p>${Math.round(dados[0].temp_disco)}°C</p>
                                </div>
                            </div>
                            <div class="div-graph">
                                <a id="circ_disco">◎</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="div-dados">
                    <p style="margin-top: 20px;" class="titulo"> Uso de CPU Atual (%) </p>
                    <div class="div-container-kpi">
                        <div class="div-velocimetro">
                            <canvas id="velocimeterCpuChart"></canvas>
                        </div>
                        <p> Parâmetro Máximo da CPU: ${max_cpu}% </p>
                    </div>
                </div>

                <div class="div-dados">
                    <p style="margin-top: 20px;" class="titulo"> Uso de RAM Atual (%) </p>
                    <div class="div-container-kpi">
                        <div class="div-velocimetro">
                            <canvas id="velocimeterRamChart"></canvas>
                        </div>
                        <p> Parâmetro Máximo da RAM: ${max_ram}% </p>
                    </div>
                </div>

                `;

                    divs.innerHTML = frase;

                    const dadosKpiCpu = {
                        uso_cpu: dados[0].uso_cpu,
                        max_cpu: max_cpu
                    };

                    const dadosKpiRam = {
                        uso_ram: dados[0].uso_ram,
                        max_ram: max_ram
                    };

                    const dadosKpiDisco = {
                        uso_disco: dados[0].uso_disco,
                        max_disco: max_disco
                    }

                    plotarGraficoVelocimetroCpu(dadosKpiCpu);
                    plotarGraficoVelocimetroRam(dadosKpiRam);
                    listarDadosLinhas(idServidor);
                    plotarGraficoStackBarDisco(dadosKpiDisco);
                    plotarGraficoParticaoDisco(dadosKpiDisco);


                    let div_temp = document.querySelectorAll('.div-temp');
                    div_temp[0].style.backgroundColor = dados[0].temp_cpu >= 85 ? '#940000' : '#C89C00';
                    div_temp[1].style.backgroundColor = dados[0].temp_disco >= 85 ? '#940000' : '#C89C00';

                    let circ_cpu = document.getElementById('circ_cpu');
                    let dado_cpu = dados[0].temp_cpu;

                    if (dado_cpu >= 95) {
                        circ_cpu.style.top = '0%';
                    }

                    else if (dado_cpu >= 90) {
                        circ_cpu.style.top = '5%';
                    }

                    else if (dado_cpu >= 80) {
                        circ_cpu.style.top = '10%';
                    }

                    else if (dado_cpu >= 70) {
                        circ_cpu.style.top = '20%';
                    }

                    else if (dado_cpu >= 60) {
                        circ_cpu.style.top = '30%';
                    }

                    else if (dado_cpu >= 50) {
                        circ_cpu.style.top = '40%';
                    }

                    else if (dado_cpu >= 40) {
                        circ_cpu.style.top = '50%';
                    }

                    else if (dado_cpu >= 30) {
                        circ_cpu.style.top = '60%';
                    }

                    else if (dado_cpu >= 20) {
                        circ_cpu.style.top = '70%';
                    }

                    else if (dado_cpu >= 10) {
                        circ_cpu.style.top = '80%';
                    }


                    let circ_disco = document.getElementById('circ_disco');
                    let dado_disco = dados[0].temp_disco;


                    if (dado_disco >= 95) {
                        circ_disco.style.top = '0%';
                    }

                    else if (dado_disco >= 90) {
                        circ_disco.style.top = '5%';
                    }

                    else if (dado_disco >= 80) {
                        circ_disco.style.top = '10%';
                    }

                    else if (dado_disco >= 70) {
                        circ_disco.style.top = '20%';
                    }

                    else if (dado_disco >= 60) {
                        circ_disco.style.top = '30%';
                    }

                    else if (dado_disco >= 50) {
                        circ_disco.style.top = '40%';
                    }

                    else if (dado_disco >= 40) {
                        circ_disco.style.top = '50%';
                    }

                    else if (dado_disco >= 30) {
                        circ_disco.style.top = '60%';
                    }

                    else if (dado_disco >= 20) {
                        circ_disco.style.top = '70%';
                    }

                    else if (dado_disco >= 10) {
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

function listarDadosLinhas(idServidor) {
    fetch(`/servidores/listarDadosLinhas/${idServidor}`)
        .then(function (resposta) {
            if (resposta.ok) {
                resposta.json().then(function (dados) {
                    console.log("Dados recebidos: ", JSON.stringify(dados));
                    console.log("Dados recebidos: ", JSON.stringify(dados));

                    dados.reverse();

                    plotarGraficoLinhas(dados, idServidor);

                });

            } else {
                throw "Houve um erro ao tentar listar os servidores!";
            }
        })

        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });
}




function plotarGraficoLinhas(dados, idServidor) {
    let labels = [];
    let ram = [];
    let cpu = [];
    let disco = [];

    for (let i = 0; i < dados.length; i++) {

        const dtHora = new Date(dados[i].dt_registro);
        const hora = dtHora.getHours();
        const min = dtHora.getMinutes();
        const minFormatado = ('0' + min).slice(-2);

        labels.push((hora + ':' + minFormatado));
        ram.push(dados[i].uso_ram);
        cpu.push(dados[i].uso_cpu);
        disco.push(dados[i].uso_disco);
    }

    if (window.graficoLinhas instanceof Chart) {
        window.graficoLinhas.destroy();
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
                tension: 0.2
            },
            {
                label: 'CPU',
                data: cpu,
                fill: false,
                backgroundColor: '#E2E2E2',
                borderColor: '#E2E2E2',
                tension: 0.2
            },
            {
                label: 'DISCO',
                data: disco,
                fill: false,
                backgroundColor: '#FAFF00',
                borderColor: '#FAFF00',
                tension: 0.2
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
                        text: 'Horário',
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
                title: {
                    display: true,
                    text: "Porcentagem de uso de componentes (%)",
                    color: 'white',
                    font: {
                        size: 18
                    }
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

    window.graficoLinhas = new Chart(
        document.getElementById('lineChart'),
        config
    );
}




function plotarGraficoStackBarDisco(dadosKpi) {
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




function plotarGraficoParticaoDisco(dadosKpi) {
        
    const fatorParticaoC = 0.74;
    const fatorParticaoD = 0.61; 
    
    const usoParticaoC = 100 * fatorParticaoC;
    const usoParticaoD = 100 * fatorParticaoD;

    const labels = ['Partição C:/', 'Partição D:/'];
    const usados = [usoParticaoC, usoParticaoD];
    const livres = [100 - usoParticaoC, 100 - usoParticaoD];
    
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
};