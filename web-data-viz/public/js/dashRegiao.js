var regiao = "";



listarRegioes()


function listarRegioes() {
  const empresaId = sessionStorage.getItem('ID_EMPRESA')
  console.log("Empresa ID= " + empresaId)
  const select = document.getElementById("select_regiao")

  fetch(`/servidores/listarRegioes/${empresaId}`)
    .then(res => res.json())
    .then(regioes => {
      console.log("Regiões recebidas:", regioes);
      let regioes = regioes.map(item => item.id);

    })
    .catch(err => {
      console.error("Erro ao carregar regiões:", err);
      select.innerHTML = "<option>Erro ao carregar regiões</option>";
    });
}














function buscarParametros() {

  fetch(`/dashboardRegiao/buscarParametro/${idRegiao}`)
    .then(function (resposta) {
      if (resposta.ok) {
        resposta.json().then(function (dados) {
          const paragrafoParametroCPU = document.getElementById('paragrafo-parametro-cpu');
          const paragrafoParametroDisco = document.getElementById('paragrafo-parametro-disco');

          let maxAlertaCPU, maxAlertaDisco;

          if (dados.length > 0) {

            const parametroCPU = dados.find(item =>
              item.tipo_componente && item.tipo_componente.toUpperCase() === 'CPU'
            );

            const parametroDisco = dados.find(item =>
              item.tipo_componente && item.tipo_componente.toUpperCase() === 'DISCO'
            )

            if (parametroCPU) {
              maxAlertaCPU = parametroCPU.max_alerta;
              paragrafoParametroCPU.innerHTML = `Parâmetro Atual Temp. CPU: ${maxAlertaCPU}°C`;
            }

            if (parametroDisco) {
              maxAlertaDisco = parametroDisco.max_alerta;
              paragrafoParametroDisco.innerHTML = `Parâmetro Atual Temp. Disco: ${maxAlertaDisco}°C`
            }

            const tempCPUAdesivo = document.querySelector('.kpi1 p[style*="margin-top: 3%"]');
            if (tempCPUAdesivo) {
              tempCPUAdesivo.textContent = `Parâmetro Atual Temp. CPU: ${maxAlertaCPU}°C`;
            }

            const tempDiscoAdesivo = document.querySelector('.kpi2 p[style*="margin-top: 3%"]');
            if (tempDiscoAdesivo) {
              tempDiscoAdesivo.textContent = `Parâmetro Atual Temp. Disco: ${maxAlertaDisco}°C`;
            }

            carregarDadosCpu(idServidor, maxAlertaCPU);
            carregarDadosDisco(idServidor, maxAlertaDisco);
          }
        })
      }
    })
}

document.addEventListener('DOMContentLoaded', () => {
  const ctx = document.getElementById('grafico-barra-previsao');

  const graficoPrevisaoBarra = {
    type: 'bar',
    data: {
      labels: ['24/11/25', '25/11/25', '26/11/25', '27/11/25', '28/11/25', '29/11/25', '3O/11/25', '31/11/25', '01/12/25', '02/12/25', '03/12/25', '04/12/25', '05/12/25', '06/12/25', '07/12/25', '08/12/25', '09/12/25'],
      datasets: [
        {
          type: 'bar',
          label: 'Requisições',
          data: [45000, 30000, 15000, 15000, 15000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000],
          backgroundColor: ['#ffe09cff'],
          yAxisID: 'y',
          xAxisID: 'x'
        },
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true, scales: false, title: {
            display: true,
            text: 'Quantidade de requisições previstas nos proximos 16 dias',
            color: '#ffffff',
            font: {
              size: 24,
            }
          },
          labels: { usePointStyle: true }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          bounds: 'data'
        },
        y: {
          type: 'linear',
          position: 'left',
          display: true,
          beginAtZero: true,
          grid: {
            color: '#a1a1a1b7'
          }
        },
      }
    }
  };

  new Chart(ctx, graficoPrevisaoBarra);
})

document.addEventListener('DOMContentLoaded', () => {
  const ctx = document.getElementById('grafico-linha-previsao');

  const graficoPrevisaoLinha = {
    type: 'line',
    data: {
      labels: ['24/11/25', '25/11/25', '26/11/25', '27/11/25', '28/11/25', '29/11/25', '3O/11/25', '31/11/25', '01/12/25', '02/12/25', '03/12/25', '04/12/25', '05/12/25', '06/12/25', '07/12/25', '08/12/25', '09/12/25'],
      datasets: [
        {
          type: 'line',
          label: 'Estimativa percentual de aumento nas requisições',
          data: [25.2, 23.1, 12.3, 13.8, 34.3, 54.43, 23.1, 32.2, 12.3, 34.2, 12.1, 12.3, 17.2, 23.2, 18.4, 20.3, 32.9],
          borderWidth: 3,
          borderColor: ['#fdf076ff'],
          pointBackgroundColor: ['black'],
          pointHitRadius: 5,
          yAxisID: 'y',
          xAxisID: 'x'
        },
        {
          type: 'line',
          label: 'Probabilidade de interferencia climatica nas requisições %',
          data: [32.0, 30.0, 21.0, 15.0, 15.5, 20.3, 23.3, 25.5, 39.8, 44.5, 45.2, 20.3, 22, 3, 21.2, 23.4, 43.4, 12.3],
          backgroundColor: ['#48b9db48'],
          borderColor: ['#5dabdfff'],
          fill: true,
          pointBackgroundColor: ['white'],
          pointHitRadius: 5,
          borderWidth: 3,
          yAxisID: 'y',
          xAxisID: 'x'
        },
     
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true, scales: false, title: {
            display: true,
            text: 'Probabilidade de aumento no número de requisições nos próximos 16 dias',
            color: '#ffffff',
            font: {
              size: 24,
            }
          },
          labels: { usePointStyle: true }
        }
      },
      scales: {
        x: {
          grid: {
            offset: false,
            color: '#a1a1a1b7',
          },
          bounds: 'data',
          color: '#ffffff',
          font: {
            size: 24,
          }
        },
        y: {
          type: 'linear',
          position: 'left',
          display: true,
          beginAtZero: true,
          grid: {
            color: '#a1a1a1b7'
          }
        },



      }
    }
  };

  new Chart(ctx, graficoPrevisaoLinha);
})

document.addEventListener('DOMContentLoaded', () => {
  const ctxPico = document.getElementById('grafico-barra-horarioDePico');

  const graficoPico = {
    type: 'bar',
    data: {
      labels: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00',],
      datasets: [
        {
          type: 'bar',
          label: 'Requisições',
          data: [93238, 13332, 22321, 32321, 32323, 13232, 53323, 23242, 53323, 23242, 32321, 32323, 13232, 53323, 23242, 53323, 23242, 23242, 32321, 32323, 13232, 53323, 23242, 53323, 23242],
          backgroundColor: ['#ffe09cff'],
          yAxisID: 'y',
          xAxisID: 'x'
        },
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
          scales: false,
          position: 'bottom',
          labels: {
            usePointStyle: true,
            color: 'white'
          }
        }
      },
      scales: {
        x: {

          grid: {
            offset: false
          },
          bounds: 'data'
        },
        y: {
          type: 'linear',
          position: 'left',
          display: true,
          beginAtZero: true,
          grid: {
            color: '#a1a1a1b7'
          },
          color: '#ffffff',
          font: {
            size: 24,
          }
        },
      }
    }
  };

  new Chart(ctxPico, graficoPico);
})

document.addEventListener('DOMContentLoaded', () => {
  const ctx = document.getElementById('grafico_uso_de_disco_total_regiao');

  const graficoDiscoTotal = {
    type: 'doughnut',
    data: {
      labels: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00',],
      datasets: [
        {
          type: 'doughnut',
          label: 'Requisições',
          data: [230,570 ],
          backgroundColor: [
                    '#ffffffff',
                    '#e9c67aff'
                ],
                borderColor: [
                    '#ffffffff',
                    '#e9c67aff'
                ],
                borderWidth: 1
        },
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
          position: 'bottom',
          labels: {
            usePointStyle: true,
            color: 'white'
          }
        }
      },
    }
  };

  new Chart(ctx, graficoDiscoTotal);
})

