function plotarGraficoBarras() {

    const ctx = document.getElementById('graficobarras');

    // Dados fictícios de servidores
    const servidores = [
        { nome: "Servidor 01", problema: 72 },
        { nome: "Servidor 02", problema: 55 },
        { nome: "Servidor 03", problema: 33 },
        { nome: "Servidor 04", problema: 18 },
        { nome: "Servidor 05", problema: 10 }
    ];

    // --------- ORDENAR (maior → menor) sem map/foreach -----------
    for (let i = 0; i < servidores.length - 1; i++) {
        for (let j = i + 1; j < servidores.length; j++) {
            if (servidores[j].problema > servidores[i].problema) {
                let temp = servidores[i];
                servidores[i] = servidores[j];
                servidores[j] = temp;
            }
        }
    }


    let labels = [];
    let valores = [];
    let cores = [];

    for (let i = 0; i < servidores.length; i++) {
        labels.push(servidores[i].nome);
        valores.push(servidores[i].problema);


        if (servidores[i].problema >= 70) {
            cores.push("#ff3b30"); 
        } else if (servidores[i].problema >= 40) {
            cores.push("#ff9500"); 
        } else {
            cores.push("#ffd966"); 
        }
    }

    // Destroy antigo
    if (window.graficoBarras instanceof Chart) {
        window.graficoBarras.destroy();
    }

    // --------- Criar gráfico horizontal ----------
    window.graficoBarras = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Problemas de Disco (%)',
                data: valores,
                backgroundColor: cores,
                borderColor: "#333",
                borderWidth: 1
            }]
        },
        options: {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,

    layout: {
        padding: 0
    },

    plugins: {
        title: { display: false },
        legend: { display: false },
        tooltip: { enabled: true }
    },

    scales: {
        x: {
            beginAtZero: true,
            ticks: { color: "white" },
            grid: { color: "rgba(255,255,255,0.1)" }
        },
        y: {
            ticks: { color: "white" },
            grid: { display: false }
        }
    }
}

    });
}

   // inicio grafico de linhas
 function plotarGraficoLinha(dados, periodoDias = 1, qtPontos = 5) {

    // 1. Filtra pelo período solicitado (1, 7 ou 30 dias)
    const agora = new Date();
    const limite = new Date(agora.getTime() - periodoDias * 24 * 60 * 60 * 1000);

    let filtrados = [];
    let i = 0;
    let total = dados.length;

    while (i < total) {
        const dt = new Date(dados[i].dt_registro);
        if (dt >= limite) filtrados.push(dados[i]);
        i++;
    }

    // 2. Reduz para "qtPontos" posições igualmente espaçadas
    let labels = [];
    let valores = [];
    let n = filtrados.length;

    if (n > 0) {
        let passo = Math.max(1, Math.floor(n / qtPontos));
        let j = 0;

        while (j < n && labels.length < qtPontos) {
            const item = filtrados[j];
            const dt = new Date(item.dt_registro);
            const hora = dt.getHours();
            const min = String(dt.getMinutes()).padStart(2, '0');

            labels.push(`${hora}:${min}`);
            valores.push(item.uso_disco);

            j += passo;
        }
    }

    // Se houver gráfico anterior, remove
    if (window.graficoDisco instanceof Chart) {
        window.graficoDisco.destroy();
    }

    const config = {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                data: valores,
                borderColor: '#D2B080',
                backgroundColor: 'rgba(210,176,128,0.15)',
                borderWidth: 2,
                tension: 0.3,
                pointRadius: 3,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#D2B080'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: { display: false },    // sem legend
                title: { display: false }      // sem título
            },

            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: 'white'
                    },
                    grid: { color: 'rgba(255,255,255,0.1)' },
                    title: {
                        display: true,
                        text: '% armazenamento',
                        color: 'white',
                        font: { size: 13 }
                    }
                },
                x: {
                    ticks: { color: 'white' },
                    grid: { display: false }
                }
            }
        }
    };

    window.graficoDisco = new Chart(
        document.getElementById('graficolinhas'),
        config
    );
}

let dadosExemplo = [
    { dt_registro: '2025-01-01T10:00:00', uso_disco: 20 },
    { dt_registro: '2025-01-01T10:01:00', uso_disco: 22 },
    { dt_registro: '2025-01-01T10:02:00', uso_disco: 23 },
    { dt_registro: '2025-01-01T10:03:00', uso_disco: 21 },
];

window.onload = () => {
    plotarGraficoBarras();
        plotarGraficoLinha(dadosExemplo, 999, 6);
};
