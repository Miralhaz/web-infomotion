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

  const labels = ['10/11/2025 11:40', '10/11/2025 11:50', '10/11/2025 12:00', '10/11/2025 12:10', '10/11/2025 12:20' ]   

  const dataMain = {
    labels: labels,
    datasets: [
      {
        label: 'Pacotes enviados',
        data: [8, 10, 15, 52, 7],
        
        backgroundColor: (context) => {
            const valor = context.raw;
            if (valor > 20) return '#0cff03ff'; 
            if (valor > 10) return '#fffb00ff';   
            return 'red';                      
        },
        borderColor: 'fffae6', 
        segment: {
          borderColor: (ctx) => {
              
              if (!ctx.p1 || !ctx.p1.parsed) return 'gray';
              const valor = ctx.p1.parsed.y; 
              if (valor > 20) {
                  return '#0cff03ff'; 
              } else if (valor > 10) {
                  return '#fffb00ff';   
              } else {
                  return 'red';       
              }
          },},
        borderDash: [20, 5], 
        borderWidth: 2
      },
      {
        label: 'Pacotes recebidos',
        data: [3, 12, 17, 27, 50,],
        backgroundColor: (context) => {
            const valor = context.raw;
            if (valor > 20) return '#0cff03ff'; 
            if (valor > 10) return '#fffb00ff';   
            return 'red';                      
        },
        borderColor: 'fffae6', 
        segment: {
          borderColor: (ctx) => {
              
              if (!ctx.p1 || !ctx.p1.parsed) return 'gray';
              const valor = ctx.p1.parsed.y; 
              if (valor > 20) {
                  return '#0cff03ff'; 
              } else if (valor > 10) {
                  return '#fffb00ff';   
              } else {
                  return 'red';       
              }
          },},
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
          labels: {
                color: '#E2E1DE' ,
                generateLabels: function(chart) {
                  const defaults = Chart.defaults.plugins.legend.labels.generateLabels(chart);
                  return defaults.map(item => ({
                    ...item,
                    fillStyle: 'transparent',                
                  }));
                },
                
              boxWidth: 40,
              padding: 8
            }
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

