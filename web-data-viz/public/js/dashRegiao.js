document.addEventListener('DOMContentLoaded', () => {
  const ctxPrevisao = document.getElementById('grafico-linha-barra-previsao');

  const graficoPrevisao = {
    type: 'line',
    data: {
      labels: ['24/11/25', '25/11/25', '26/11/25', '27/11/25', '28/11/25', '29/11/25', '3O/11/25', '31/11/25', '01/12/25', '02/12/25', '03/12/25', '04/12/25', '05/12/25', '06/12/25', '07/12/25', '08/12/25', '09/12/25'],
      datasets: [
         {
          type: 'bar',
          label: 'Requisições',
          data: [63238, 13332, 22321, 32321, 32323, 13232, 53323, 23242, 53323, 23242, 32321, 32323, 13232, 53323, 23242, 53323, 23242],
          backgroundColor: ['#ffe09cb7'],
          yAxisID: 'y',
          xAxisID: 'x'
        },
        {
          type: 'line',
          label: 'temperatura Cº',

          data: [10, 20, 32, 42, 22, 32, 36, 32, 32, 16, 12, 11, 14, 13, 22,21,21],
          backgroundColor: ['#b6240a85'],
          borderColor: ['#dd961173'],
          fill: true,
          pointBackgroundColor: ['#000000e1'],
          pointHitRadius: 6,
          borderWidth: 3,
          tension: 0.2,
          yAxisID: 'y2',
          xAxisID: 'x2'
        },
       
        {
          type: 'line',
          label: 'Chance precipitação %',
          data: [99, 99, 0, 0, 33, 37, 47, 0, 0, 0, 0, 33, 37, 47, 32, 37, 47],
          backgroundColor: ['#62d3e244'],
          pointBackgroundColor: ['#ffffffe1'],
          fill: true,
          borderWidth: 5,
          tension: 0.2,
          yAxisID: 'y2',
          xAxisID: 'x2'
        },


      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: true, scales: false } },
      scales: {
        x: {
          grid: {
            offset: false // Isso alinha o início da barra/linha com a origem
          },
          bounds: 'data' // Garante que não haja espaço extra nas bordas
        },
        x2: {
          display: false

        },
        y: {
          type: 'linear',
          position: 'right',
          display: true,
          beginAtZero: true,
          grid: {
            color: 'E2E1DE'
          }
        },
        y2: {
          type: 'linear',
          position: 'left',
          display: true,
          beginAtZero: true,
          grid: {

          }
        },






      }
    }
  };

  new Chart(ctxPrevisao, graficoPrevisao);
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
          backgroundColor: ['#ffe09cb7'],
          yAxisID: 'y',
          xAxisID: 'x'
        },
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false, 
        scales: false, 
          position: 'bottom',
          labels: {
            usePointStyle: true,
            color: 'white'
          }
        } },
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
            color: 'E2E1DE'
          }
        },
      }
    }
  };

  new Chart(ctxPico, graficoPico);
})


document.addEventListener('DOMContentLoaded', () => {
  const ctxDireita = document.getElementById('grafico-barra-comparacao-r');
  const ctxEsquerda = document.getElementById('grafico-linha-barra-previsao');

  const graficoDireta = {
    type: '',
    data: {
      labels: ['24/11/25', '25/11/25', '26/11/25', '27/11/25', '28/11/25', '29/11/25', '3O/11/25'],
      datasets: [
        {
          type: 'Bar',
          label: 'Chance de precipitação',
          data: [88, 89, 82],
          backgroundColor: ['#fff9c5ff'],
          borderColor: ['#fff9c5ff'],
          pointBackgroundColor: ['#000000e1'],
          pointHitRadius: 6,
          borderWidth: 3,
          tension: 0.2,
          yAxisID: 'y2',
          xAxisID: 'x2'
        },


      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        legend: {
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
        }, y: {
          type: 'linear',
          position: 'right',
          display: true,
          beginAtZero: true,
          grid: {
            color: 'E2E1DE'
          }
        },







      }
    }
  };

  new Chart(ctxDireita, graficoDireta);
})

