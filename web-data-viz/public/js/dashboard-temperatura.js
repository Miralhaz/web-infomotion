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






async function carregarDadosCpu() {
    const nomeArquivoCPU = 'cpu_temperaturas_uso.json';

    const resposta = await fetch(`/dados/${nomeArquivoCPU}`);
    const data = await resposta.json();

    if (!Array.isArray(data) || data.length === 0) return;

    const ultimoRegistro = data[data.length - 1];

    const labelsTimestamp = data.map(d => d.timestamp)

    const arrayDeTemperaturaCpu = data.map(d => { return parseFloat(String(d.temperatura_cpu).replace(',', '.')) });
    const arrayDeUsoCpu = data.map(d => { return parseFloat(String(d.cpu_uso).replace(',', '.')) });

    const limiteMaximoTemperatura = 85;

    graficoGaugeCPUTemperatura(arrayDeTemperaturaCpu[arrayDeTemperaturaCpu.length - 1], limiteMaximoTemperatura);
    atualizarKPIsCpu(arrayDeTemperaturaCpu[arrayDeTemperaturaCpu.length - 1], arrayDeUsoCpu[arrayDeUsoCpu.length - 1], limiteMaximoTemperatura);

    // const chavesJson = Object.keys(data[0]);
    // const labelTimeStamp = keys[1];
    // const valores = keys[1];
    // const labels = data.map(d => d[labelKey]);
    // const values = data.map(d => Number(d[valueKey]) || 0);
}






function atualizarKPIsCpu(tempCPU, usoCPU, limiteMaximoCPU) {
    const tempCPUAdesivo = document.querySelector('.kpi1 p[style*="margin-top: 3%"]');
    if (tempCPUAdesivo) {
        tempCPUAdesivo.textContent = `Parâmetro Atual Temp. CPU: ${limiteMaximoCPU}°C`;
    }

    const eficienciaContainerCPU = document.querySelector('.kpi3 .container-eficiencia:nth-child(2)');

    if (eficienciaContainerCPU) {
        const infoElement = eficienciaContainerCPU.querySelector('.info-eficiencia');
        const numeroElement = eficienciaContainerCPU.querySelector('.numero-eficiencia');
        const statusElement = eficienciaContainerCPU.querySelector('.status');

        const eficiencia = tempCPU / (usoCPU || 1);
        const status = calcularStatus(eficiencia);

        if (infoElement && numeroElement && statusElement) {
            infoElement.textContent = `${tempCPU.toFixed(1)}°C • ${usoCPU.toFixed(1)}% uso`;

            numeroElement.innerHTML = `${eficiencia.toFixed(2)} <span class="unidade-eficiencia"> °C/% </span>`;
            numeroElement.style.color = status.cor;

            statusElement.textContent = status.texto;
            statusElement.style.color = status.cor;
        }
    }
}






async function carregarDadosDisco() {
    const caminho = window.location.pathname;
    const nomeArquivoDisco = 'disco_temperaturas_uso.json';

    const resposta = await fetch(`/dados/${nomeArquivoDisco}`);
    const data = await resposta.json();

    if (!Array.isArray(data) || data.length === 0) return;

    const ultimoRegistro = data[data.length - 1];

    const labelsTimestamp = data.map(d => d.timestamp)

    const arrayDeTemperaturaDisco = data.map(d => { return parseFloat(String(d.temperatura_disco).replace(',', '.')) });
    const arrayDeUsoDisco = data.map(d => { return parseFloat(String(d.disco_uso).replace(',', '.')) });

    const limiteMaximoTemperatura = 85;

    graficoGaugeTemperaturaDisco(arrayDeTemperaturaDisco[arrayDeTemperaturaDisco.length - 1], limiteMaximoTemperatura);
    atualizarKPIsDisco(arrayDeTemperaturaDisco[arrayDeTemperaturaDisco.length - 1], arrayDeUsoDisco[arrayDeUsoDisco.length - 1], limiteMaximoTemperatura);

    // const keys = Object.keys(data[0]);
    // const labelKey = keys[0];
    // const valueKey = keys[1];
    // const labels = data.map(d => d[labelKey]);
    // const values = data.map(d => Number(d[valueKey]) || 0);
}





function atualizarKPIsDisco(tempDisco, usoDisco, limiteMaximoDisco) {
    const tempDiscoAdesivo = document.querySelector('.kpi1 p[style*="margin-top: 3%"]');
    if (tempDiscoAdesivo) {
        tempDiscoAdesivo.textContent = `Parâmetro Atual Temp. CPU: ${limiteMaximoDisco}°C`;
    }

    const eficienciaContainerCPU = document.querySelector('.kpi3 .container-eficiencia:nth-child(3)');

    if (eficienciaContainerCPU) {
        const infoElement = eficienciaContainerCPU.querySelector('.info-eficiencia');
        const numeroElement = eficienciaContainerCPU.querySelector('.numero-eficiencia');
        const statusElement = eficienciaContainerCPU.querySelector('.status');

        const eficiencia = tempDisco / (usoDisco || 1);
        const status = calcularStatus(eficiencia);

        if (infoElement && numeroElement && statusElement) {
            infoElement.textContent = `${tempDisco.toFixed(1)}°C • ${usoDisco.toFixed(1)}% uso`;

            numeroElement.innerHTML = `${eficiencia.toFixed(2)} <span class="unidade-eficiencia"> °C/% </span>`;
            numeroElement.style.color = status.cor;

            statusElement.textContent = status.texto;
            statusElement.style.color = status.cor;
        }
    }
}






function calcularStatus(eficiencia) {
    if (eficiencia < 1.0) {
        return { texto: 'Excelente', cor: '#4caf50' };
    } else if (eficiencia >= 1.0 && eficiencia <= 1.5) {
        return { texto: 'Adequado', cor: '#8bc34a' };
    } else if (eficiencia > 1.5 && eficiencia <= 2.0) {
        return { texto: 'Atenção', cor: '#ffc107' };
    } else {
        return { texto: 'Crítico', cor: '#f44336' };
    }
}





document.addEventListener('DOMContentLoaded', () => {
    
    carregarDadosCpu();
    carregarDadosDisco();

    const componenteInicial = document.getElementById('select_value_componentes').value; 
    const periodoInicial = document.getElementById('select_value').value; 
    
    carregarEAtualizarGraficoLinhas(componenteInicial, periodoInicial);

    // atualizarGraficoDispersaoPorComponente(componenteInicial);
});







async function carregarEAtualizarGraficoLinhas(componente, periodo) {
    let nomeArquivo;
    let labelTempKey;
    let labelUsoKey;

    if (componente === 'cpu') {
        nomeArquivo = 'cpu_temperaturas_uso.json';
        labelTempKey = 'temperatura_cpu';
        labelUsoKey = 'cpu_uso';

        if (periodo === '1hora'){
            document.querySelector('.grafico-linha-hist .titulo p').textContent = `Uso CPU X Temperatura CPU (na última hora):`;
        } else if (periodo === '24horas'){
            document.querySelector('.grafico-linha-hist .titulo p').textContent = `Uso CPU X Temperatura CPU (últimas 24 horas):`;
        } else if (periodo === 'dias'){
            document.querySelector('.grafico-linha-hist .titulo p').textContent = `Uso CPU X Temperatura CPU (últimos 7 dias):`;
        }

    } else if (componente === 'disco') {
        nomeArquivo = 'disco_temperaturas_uso.json';
        labelTempKey = 'temperatura_disco';
        labelUsoKey = 'disco_uso';

        if (periodo === '1hora'){
            document.querySelector('.grafico-linha-hist .titulo p').textContent = `Uso Disco X Temperatura Disco (na última hora):`;
        } else if (periodo === '24horas'){
            document.querySelector('.grafico-linha-hist .titulo p').textContent = `Uso Disco X Temperatura Disco (últimas 24 horas):`;
        } else if (periodo === 'dias'){
            document.querySelector('.grafico-linha-hist .titulo p').textContent = `Uso Disco X Temperatura Disco (últimos 7 dias):`;
        }
        
    } else {
        return; 
    }

    try {
        const resposta = await fetch(`/dados/${nomeArquivo}`);
        const data = await resposta.json();

        if (!Array.isArray(data) || data.length === 0) return;

        const labelsTimestamp = data.map(d => d.timestamp);

        const arrayDeTemperatura = data.map(d => parseFloat(String(d[labelTempKey]).replace(',', '.')));
        const arrayDeUso = data.map(d => parseFloat(String(d[labelUsoKey]).replace(',', '.')));

        graficoLinhaHist(labelsTimestamp, arrayDeTemperatura, arrayDeUso, componente);

    } catch (error) {
        console.error(`Erro ao carregar dados do ${componente} para o gráfico de linhas:`, error);
    }
}






function graficoGaugeCPUTemperatura(temperaturaAtual, limiteMaximo) {

    const restante = (100 - temperaturaAtual);
    const corMinima = 120;
    const corMaxima = 0;
    let hueFinal;

    if (temperaturaAtual >= limiteMaximo) {
        hueFinal = corMaxima;
    } else {
        const pontoInicialMudanca = 60;

        if (temperaturaAtual < pontoInicialMudanca) {
            hueFinal = corMinima;
        } else {

            const rangeUso = limiteMaximo - pontoInicialMudanca;
            const rangeCor = corMinima - corMaxima;
            const fator = (temperaturaAtual - pontoInicialMudanca) / rangeUso;
            hueFinal = corMinima - (fator * rangeCor);
        }
    }

    const corUsada = `hsl(${hueFinal.toFixed(0)}, 80%, 50%)`;
    const corRestante = '#c0c0c0ff';

    const textCenter = {
        id: 'textCenter',
        beforeDatasetsDraw(chart, args, pluginOptions) {
            const { ctx, chartArea: { top, bottom, width, height } } = chart;
            ctx.save();

            const text = `${temperaturaAtual}ºC`;
            const fontSize = (height / 70).toFixed(2);
            const textX = width / 1.98;
            const textY = (bottom + top) / 1.4;

            ctx.font = `bold ${fontSize}em sans-serif`;
            ctx.fillStyle = corUsada;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, textX, textY);

            ctx.restore();
        }
    };

    const config = {
        type: 'doughnut',
        data: {
            labels: [' Atual', ' Ociosa'],
            datasets: [{
                label: 'Métrica Atual',
                data: [temperaturaAtual, restante],
                backgroundColor: [corUsada, corRestante],
                borderColor: [corUsada, corRestante],
                borderWidth: 1
            }]
        },
        options: {
            rotation: -90,
            circumference: 180,
            cutout: '75%',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (context) => context.label + ': ' + context.formattedValue + 'ºC'
                    }
                }
            },
            elements: { arc: { hoverOffset: 0 } }
        },
        plugins: [textCenter]
    };

    const canvas = document.getElementById('gaugeCPUTempChart');
    if (canvas) {
        if (Chart.getChart('gaugeCPUTempChart')) {
            Chart.getChart('gaugeCPUTempChart').destroy();
        }
        new Chart(canvas, config);
    }
}







function graficoGaugeTemperaturaDisco(temperaturaAtual, limiteMaximo) {

    const restante = (100 - temperaturaAtual);
    const corMinima = 120;
    const corMaxima = 0;
    let hueFinal;

    if (temperaturaAtual >= limiteMaximo) {
        hueFinal = corMaxima;
    } else {
        const pontoInicialMudanca = 60;

        if (temperaturaAtual < pontoInicialMudanca) {
            hueFinal = corMinima;
        } else {

            const rangeUso = limiteMaximo - pontoInicialMudanca;
            const rangeCor = corMinima - corMaxima;
            const fator = (temperaturaAtual - pontoInicialMudanca) / rangeUso;
            hueFinal = corMinima - (fator * rangeCor);
        }
    }

    const corUsada = `hsl(${hueFinal.toFixed(0)}, 80%, 50%)`;
    const corRestante = '#c0c0c0ff';

    const textCenter = {
        id: 'textCenter',
        beforeDatasetsDraw(chart, args, pluginOptions) {
            const { ctx, chartArea: { top, bottom, width, height } } = chart;
            ctx.save();

            const text = `${temperaturaAtual}ºC`;
            const fontSize = (height / 70).toFixed(2);
            const textX = width / 1.98;
            const textY = (bottom + top) / 1.4;

            ctx.font = `bold ${fontSize}em sans-serif`;
            ctx.fillStyle = corUsada;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, textX, textY);

            ctx.restore();
        }
    };

    const config = {
        type: 'doughnut',
        data: {
            labels: [' Atual', ' Ocioso'],
            datasets: [{
                label: 'Métrica Atual',
                data: [temperaturaAtual, restante],
                backgroundColor: [corUsada, corRestante],
                borderColor: [corUsada, corRestante],
                borderWidth: 1
            }]
        },
        options: {
            rotation: -90,
            circumference: 180,
            cutout: '75%',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (context) => context.label + ': ' + context.formattedValue + 'ºC'
                    }
                }
            },
            elements: { arc: { hoverOffset: 0 } }
        },
        plugins: [textCenter]
    };

    const canvas = document.getElementById('gaugeDiscoTempChart');
    if (canvas) {
        if (Chart.getChart('gaugeDiscoTempChart')) {
            Chart.getChart('gaugeDiscoTempChart').destroy();
        }
        new Chart(canvas, config);
    }
}








function graficoLinhaHist(timestamp, temperaturas, uso, componente) {

    if (Chart.getChart('lineChart')) {
        Chart.getChart('lineChart').destroy();
    }

    const labelUso = componente === 'cpu' ? 'Uso da CPU (%)' : 'Uso do Disco (%)';

    const dadosDoGrafico = {
        labels: timestamp,
        datasets: [
            {
                label: 'Temperatura (°C)',
                data: temperaturas,
                borderColor: 'rgba(106, 24, 90, 1)',
                yAxisID: 'temp-y-axis',
                tension: 0.1
            },
            {
                label: 'Uso (%)',
                data: uso,
                borderColor: 'rgba(110, 158, 255, 1)',
                yAxisID: 'uso-y-axis',
                tension: 0.1
            },
        ]
    };

    const configuracao = {
        type: 'line',
        data: dadosDoGrafico,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Comparação Uso X Temperatura',
                    color: 'white',
                    font: {
                        size: 16
                    }
                }
            },
            scales: {
                'temp-y-axis': {
                    type: 'linear',
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Temperatura (°C)',
                        font: {
                            size: 14
                        },
                        color: 'white'
                    },
                    ticks: {
                        color: 'white'
                    },
                },
                'uso-y-axis': {
                    type: 'linear',
                    position: 'right',
                    title: {
                        display: true,
                        text: labelUso,
                        font: {
                            size: 14
                        },
                        color: 'white'
                    },
                    ticks: {
                        color: 'white'
                    },
                    grid: { drawOnChartArea: false }
                }
            }
        }
    };

    const meuGrafico = new Chart(
        document.getElementById('lineChart'),
        configuracao
    );
}







function graficoDispersao() {
    const dadosDoHistograma = {
        labels: ['0-10', '11-20', '21-30', '31-40', '41-50', '51-60'],
        datasets: [{
            label: 'Frequência de Dados',
            data: [15, 25, 30, 18, 12, 18],
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 1
        }]
    };

    const configuracao = {
        type: 'bar',
        data: dadosDoHistograma,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Histograma de Frequências',
                    color: 'white',
                    font: {
                        size: 16
                    }
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Frequência',
                        color: 'white',
                        font: {
                            size: 14
                        }
                    },
                    ticks: {
                        color: 'white'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Intervalos de Temperatura (°C)',
                        color: 'white',
                        font: {
                            size: 14
                        }
                    },
                    ticks: {
                        color: 'white'
                    },
                    categoryPercentage: 1.0,
                    barPercentage: 1.0
                }
            }
        }
    };

    const meuHistograma = new Chart(
        document.getElementById('histogramChart'),
        configuracao
    );
}

graficoDispersao();