 document.addEventListener('DOMContentLoaded', () => {
 const ctxPrevisao = document.getElementById('grafico-linha-barra-previsao');

 const graficoPrevisao = {
        type: 'bar',
        data: {
          labels: ['', '', ''],
          datasets: [{
            label: 'Métricas',
            data: [12, 9, 7,],
            backgroundColor: ['#fff','#fffae6','#e6e1c8']
          }]
        },
            type: 'line',
        data: {
          labels: ['', '', ''],
          datasets: [{
            label: 'Métricas',
            data: [12, 9, 7,],
            backgroundColor: ['#fff','#fffae6','#e6e1c8']
          }]
        },
        options: {
          indexAxis: 'x', 
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { beginAtZero: true },
            y: { ticks: { color: '#fff' } }
          }
        }
      };

  new Chart(ctxPrevisao, graficoPrevisao);
  })
 