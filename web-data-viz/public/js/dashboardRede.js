 document.addEventListener('DOMContentLoaded', () => {
      const leftCtx = document.getElementById('chartLeft').getContext('2d');
      const rightCtx = document.getElementById('chartRight').getContext('2d');

      const leftConfig = {
        type: 'bar',
        data: {
          labels: ['MAX', 'MÉD', 'MIN'],
          datasets: [{
            label: 'Métricas',
            data: [429, 312, 44,],
            backgroundColor: ['#fff','#fffae6','#e6e1c8']
          }]
        },
        options: {
          indexAxis: 'y', 
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { beginAtZero: true },
            y: { ticks: { color: '#fff' } }
          }
        }
      };

      const rightConfig = {
        type: 'bar',
        data: {
          labels: ['MAX', 'MÉD', 'MIN'],
          datasets: [{
            label: 'Métricas',
            data: [623, 434, 72],
            backgroundColor: ['#d9b98a','#b89360','#8c6f45']
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { beginAtZero: true },
            y: { ticks: { color: '#fff' } }
          }
        }
      };

      new Chart(leftCtx, leftConfig);
      new Chart(rightCtx, rightConfig);
    });


document.addEventListener('DOMContentLoaded', () => {
      const mainCtx = document.getElementById('graficoLinhaPrincipal').getContext('2d');

  const labels = ['2022', '2023', '2024']   

  const dataMain = {
    labels: labels,
    datasets: [
      {
        label: 'Pacotes enviados',
        data: [12, 23, 43, 52],
        borderColor: '#fffae6',
        backgroundColor: '#fffae6'
      },
      {
        label: 'Pacotes recebidos',
        data: [52, 43, 23, 12],
        borderColor: '#b89360',
        backgroundColor: '#b89360'
      }
    ]
  }

  const configMainLineChart = {
    type: 'line',
    data: dataMain,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: false
        }
      }
    },
  };


  new Chart(mainCtx, configMainLineChart)
  
  
});


document.addEventListener('DOMContentLoaded', () => {
      const SecondCtx = document.getElementById('graficoLinhaSecundario').getContext('2d');

  const labels = ['2022', '2023', '2024']   

  const dataSecond = {
    labels: labels,
    datasets: [
      {
        label: 'Quantidade de pacotes perdidos',
        data: [0, 1, 0],
        borderColor: '#ccc',
        backgroundColor: '#ccc'
      }
    ]
  }

  const configSecondLineChart = {
    type: 'line',
    data: dataSecond,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: false
        }
      }
    },
  };


  new Chart(SecondCtx, configSecondLineChart)
  
  
});

