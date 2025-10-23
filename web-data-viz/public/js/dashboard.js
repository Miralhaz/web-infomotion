function listarServidores() {
    let idEmpresa = sessionStorage.ID_EMPRESA;

    fetch(`/servidores/listarServidores/${idEmpresa}`)
        .then(function (resposta) {
            console.log("resposta:", resposta);

            if (resposta.ok) {
                resposta.json().then(function (resposta) {
                    console.log("Dados recebidos: ", JSON.stringify(resposta));

                    const select = document.getElementById('servidores');

                    let frase = "";

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
                    <p>USO em % ATUAL</p>
                    <div class="div-content">
                        <div class="div-atual">
                            <a class="titulo">Atual:</a>
                            <p>RAM: <a class="dados-uso">${Math.round(dados[0].uso_ram)}%</a></p>
                            <p>CPU: <a class="dados-uso">${Math.round(dados[0].uso_cpu)}%</a></p>
                            <p>DISCO: <a class="dados-uso">${Math.round(dados[0].uso_disco)}%</a></p>
                        </div>

                        <div class="div-parametro">
                            <a class="titulo">Parâmetro Máx:</a>
                            <p>RAM: <a class="dados-uso">${max_ram}%</a></p>
                            <p>CPU: <a class="dados-uso">${max_cpu}%</a></p>
                            <p>DISCO: <a class="dados-uso">${max_disco}%</a></p>
                        </div>
                    </div>
                </div>

                <div class="div-dados">
                    <p>Temperatura atual:</p>
                    <div class="div-content">
                        <div class="temp-atual">
                            <div class="div-graph"></div>
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
                            <div class="div-graph"></div>
                        </div>
                    </div>
                </div>

                <div class="div-dados">
                    <p>Quantidade total de processos</p>
                    <div class="div-proc">
                        <div class="div-donut">
                            <canvas id="doughnutChart"></canvas>
                        </div>
                        <p style="color:#ffc64b;">${dados[0].qtd_processos}/1000</p>
                    </div>
                </div>

                `;

                    listarDadosDoughnut(idServidor);
                    listarDadosLinhas(idServidor);
                    listarDadosBarras(idServidor);

                    divs.innerHTML = frase;


                    let div_temp = document.querySelectorAll('.div-temp');
                    div_temp[0].style.backgroundColor = dados[0].temp_cpu > 80 ? '#940000' : '#C89C00';
                    div_temp[1].style.backgroundColor = dados[0].temp_disco > 80 ? '#940000' : '#C89C00';

                });

            } else {
                throw "Houve um erro ao tentar listar os servidores!";
            }
        })

        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });

}


function listarDadosDoughnut(idServidor) {

    fetch(`/servidores/listarDadosDoughnut/${idServidor}`)
        .then(function (resposta) {
            if (resposta.ok) {
                resposta.json().then(function (dados) {
                    console.log("Dados recebidos: ", JSON.stringify(dados));
                    plotarGraficoDoughnut(dados, idServidor);

                })
            } else {
                throw "Houve um erro ao tentar listar os servidores!";
            }
        })

        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });
}


function plotarGraficoDoughnut(dados, idServidor) {
    let labels = ['Processos atuais', 'Total de processos'];
    let resposta = [dados[0].qtd_processos, 1000 - (dados[0].qtd_processos)];
    
    const config = {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: '',
                data: resposta,
                backgroundColor: [
                    '#940000',
                    '#C89C00'
                ],
                borderColor: [
                    '#940000',
                    '#C89C00'
                ],
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 8,
                        boxHeight: 8,
                        color: 'white'
                    }
                }
            }
        }
    };

    new Chart(
        document.getElementById('doughnutChart'),
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
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(153, 153, 153, 0.2)',
                        display: true,
                        drawTicks: false
                    }
                },
                x: {
                    grid: {
                        drawOnChartArea: true
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: "Porcentagem de uso de componentes",
                    color: 'white'
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
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(153, 153, 153, 0.2)',
                        display: true,
                        drawTicks: false
                    }
                },
                x: {
                    grid: {
                        drawOnChartArea: true
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: "Quantidade de processos",
                    color: 'white'
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

