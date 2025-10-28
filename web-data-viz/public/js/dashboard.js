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
                    <p> Temperatura atual (°C):</p>
                    <div class="div-content">
                        <div class="temp-atual">
                            <div class="div-graph">
                                <a id="circ_cpu">◎</a>
                            </div>
                            <div>
                                <p>CPU</p>
                                <p class="titulo">Máx: <a class="dados-uso">85°C</a></p>
                                <p class="titulo">Min: <a class="dados-uso">50°C</a></p>
                                <div class="div-temp">
                                    <p>${Math.round(dados[0].temp_cpu)}°C</p>
                                </div>
                            </div>
                        </div>

                        <div class="temp-atual">
                            <div>
                                <p>DISCO</p>
                                <p class="titulo">Máx: <a class="dados-uso">85°C</a></p>
                                <p class="titulo">Min: <a class="dados-uso">30°C</a></p>
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
                    <p style="margin-top: 5px;"> Uso de CPU Atual (%) </p>
                    <div class="div-container-kpi">
                        <div class="div-velocimetro">
                            <canvas id="velocimeterCpuChart"></canvas>
                        </div>
                        <p> Parâmetro Máximo da CPU: ${max_cpu}% </p>
                    </div>
                </div>

                <div class="div-dados">
                    <p style="margin-top: 5px;"> Uso de RAM Atual (%) </p>
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

                    plotarGraficoVelocimetroCpu(dadosKpiCpu);
                    plotarGraficoVelocimetroRam(dadosKpiRam);
                    listarDadosLinhas(idServidor);
                    listarDadosBarras(idServidor);


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

    let corUso;
    if (usoCpu < dadoKpi.max_cpu / 1.5) {
        corUso = '#4CAF50';
    } else if (usoCpu < dadoKpi.max_cpu) {
        corUso = '#FFC107';
    } else {
        corUso = '#F44336';
    }
    const corRestante = '#E0E0E0';

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
            ctx.fillStyle = corUso;
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
                    corUso,
                    corRestante
                ],
                borderColor: [
                    corUso,
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

    let corUso;
    if (usoRam < dadoKpi.max_ram / 1.5) {
        corUso = '#4CAF50';
    } else if (usoRam < dadoKpi.max_ram) {
        corUso = '#FFC107';
    } else {
        corUso = '#F44336';
    }
    const corRestante = '#E0E0E0';

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
            ctx.fillStyle = corUso;
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
                    corUso,
                    corRestante
                ],
                borderColor: [
                    corUso,
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
                tension: 0.4
            },
            {
                label: 'CPU',
                data: cpu,
                fill: false,
                backgroundColor: '#E2E2E2',
                borderColor: '#E2E2E2',
                tension: 0.4
            },
            {
                label: 'DISCO',
                data: disco,
                fill: false,
                backgroundColor: '#FAFF00',
                borderColor: '#FAFF00',
                tension: 0.4
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
                        text: 'Porcentagem (%)',
                        color: 'white',
                        font: {
                            size: 14
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
                    },
                    title: {
                        display: true,
                        text: 'Horário',
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

    new Chart(
        document.getElementById('lineChart'),
        config
    );

}


function listarDadosBarras(idServidor) {
    fetch(`/servidores/listarDadosBarras/${idServidor}`)
        .then(function (resposta) {
            if (resposta.ok) {
                resposta.json().then(function (dados) {
                    console.log("Dados recebidos: ", JSON.stringify(dados));
                    console.log("Dados recebidos: ", JSON.stringify(dados));
                    plotarGraficoBarras(dados, idServidor);

                });

            } else {
                throw "Houve um erro ao tentar listar os servidores!";
            }
        })

        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });
}


function plotarGraficoBarras(dados, idServidor) {
    let labels = [];
    let proc = [];

    for (let i = 0; i < dados.length; i++) {

        const dtHora = new Date(dados[i].dt_registro);
        const hora = dtHora.getHours();
        const min = dtHora.getMinutes();
        const minFormatado = ('0' + min).slice(-2);

        labels.push((hora + ':' + minFormatado));
        proc.push(dados[i].qtd_processos);
    }

    const config = {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Processos',
                data: proc,
                fill: false,
                backgroundColor: '#FAFF00',
                borderColor: '#FAFF00',
                borderRadius: 5,
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
                        text: 'Quantidade de processos',
                        color: 'white',
                        font: {
                            size: 14
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
                        color: 'white'
                    },
                    title: {
                        display: true,
                        text: 'Horário',
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
                    display: true,
                    text: "Processos a cada 30 minutos",
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

    new Chart(
        document.getElementById('barChart'),
        config
    );
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