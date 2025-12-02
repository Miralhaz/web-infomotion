<<<<<<< HEAD
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
=======

var idEmpresa = sessionStorage.ID_EMPRESA;


function definirStatusOperacao() {
    fetch(`/dashboardDisco/obterDados/${idEmpresa}`)
        .then(resposta => {
            if (!resposta.ok) throw "Erro na requisição";
            return resposta.json();
        })
        .then(dados => {
            // Exemplo: status baseado no maior uso de disco
            const maiorUso = Math.max(...dados.servidores.map(s => s.disco));
            let status = "Normal";
            if (maiorUso > 90) status = "Crítico";
            else if (maiorUso > 75) status = "Atenção";

            txt_status_operacao.innerHTML = status;
        })
        .catch(erro => console.error("Erro:", erro));
}

async function kpiAlertas() {
    const resposta = await fetch(`/dashboardDisco/obterDados/${idEmpresa}`);
    const dados = await resposta.json();

    const hoje = new Date().toISOString().split('T')[0];
    const ontem = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let alertasHoje = 0;
    let alertasOntem = 0;

    // Conta alertas de HOJE
    for (const reg of dados.servidores) {
        if (reg.timestamp.startsWith(hoje)) {
            const param = dados.parametrosAlerta[reg.fk_servidor];
            if (reg.disco > param.limiteDisco || reg.temperatura_disco > param.limiteTemperatura) {
                alertasHoje++;
>>>>>>> 1e47480475d5747859efdd537479c9763019dc67
            }
        }
    }


<<<<<<< HEAD
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
=======
    alertasOntem = 0;


    saidaAlertasHoje.innerHTML = alertasHoje;
    saidaAlertasOntem.innerHTML =
        alertasHoje > alertasOntem ?
            `${alertasHoje - alertasOntem} a mais que ontem` :
            `${alertasOntem - alertasHoje} a menos que ontem`;
}

function ListagemDosDiscosEmAlerta() {
    fetch(`/dashboardDisco/obterDados/${idEmpresa}`)
        .then(resposta => {
            if (!resposta.ok) throw "Erro na requisição";
            return resposta.json();
        })
        .then(dados => {
            // Ordena servidores por uso de disco (do maior para o menor)
            const servidoresOrdenados = dados.servidores
                .sort((a, b) => b.disco - a.disco)
                .slice(0, 5); // Pega os top 5

            // Atualiza cada item da lista
            const elementos = [itemlista1, itemlista2, itemlista3, itemlista4, itemlista5];

            // Limpa os elementos primeiro
            elementos.forEach(el => el.innerHTML = "");

            // Preenche com os dados reais
            servidoresOrdenados.forEach((servidor, i) => {
                if (elementos[i]) {
                    // Formato: "NomeMaquina: XX.XX%"
                    elementos[i].innerHTML = `${servidor.nomeMaquina}: ${servidor.disco.toFixed(2)}%`;
                    const limite = dados.parametrosAlerta[servidor.fk_servidor]?.limiteDisco || 80;
                    const cor = servidor.disco > limite ? "corRisco" : "corModerado";
                    elementos[i].className = cor; // suas classes CSS já existem!
                }
            });
        }) 
        .catch(erro => {
            console.error("Erro ao carregar lista de discos:", erro);
            // Opcional: mostrar mensagem de erro no HTML
            itemlista1.innerHTML = "Erro ao carregar dados";
        });
}
const discoRequisicao1 = document.getElementById("discoRequisicao1");
const discoRequisicao2 = document.getElementById("discoRequisicao2");
const discoRequisicao3 = document.getElementById("discoRequisicao3");
function DiscosQueRecebemMaisRequisicoes() {
    fetch(`/dashboardDisco/obterDados/${idEmpresa}`)
        .then(resposta => {
            if (!resposta.ok) throw "Erro na requisição";
            return resposta.json();
        })
        .then(dados => {
            // Calcula "atividade total" = bytes_lidos + bytes_escritos
            const servidoresComAtividade = dados.servidores.map(serv => {
                const atividade = (serv.bytes_lidos || 0) + (serv.bytes_escritos || 0);
                return { ...serv, atividade };
            });

            // Ordena por atividade (maior primeiro) e pega top 3
            const top3Atividade = servidoresComAtividade
                .sort((a, b) => b.atividade - a.atividade)
                .slice(0, 3);

            // Atualiza os elementos
            const elementos = [discoRequisicao1, discoRequisicao2, discoRequisicao3];
            elementos.forEach((el, i) => {
                if (top3Atividade[i]) {
                    const s = top3Atividade[i];
                    // Converte bytes para TB/GB para exibir
                    const totalTB = (s.atividade / 1e12).toFixed(2);
                    const totalGB = (s.atividade / 1e9).toFixed(0);
                    const unidade = s.atividade >= 1e12 ? `${totalTB} TB` : `${totalGB} GB`;
                    
                    el.innerHTML = `${s.nomeMaquina}: ${unidade}`;
                } else {
                    el.innerHTML = "Sem dados";
                }
            });
        })
        .catch(erro => {
            console.error("Erro ao carregar atividade de disco:", erro);
            discoRequisicao1.innerHTML = "Erro";
            discoRequisicao2.innerHTML = "";
            discoRequisicao3.innerHTML = "";
        });
}

function DiscosComMaiorRiscoDeFalha() {
    fetch(`/dashboardDisco/obterDados/${idEmpresa}`)
        .then(resposta => {
            if (!resposta.ok) throw "Erro na requisição";
            return resposta.json();
        })
        .then(dados => {
            // Ordena servidores por temperatura (do maior para o menor)
            const top3Temp = dados.servidores
                .sort((a, b) => b.temperatura_disco - a.temperatura_disco)
                .slice(0, 3);

            // Atualiza os elementos
            const elementos = [discotemp1, discotemp2, discotemp3];
            elementos.forEach((el, i) => {
                if (top3Temp[i]) {
                    // Formato: "NomeMaquina: XX.XX°C"
                    el.innerHTML = `${top3Temp[i].nomeMaquina}: ${top3Temp[i].temperatura_disco.toFixed(1)}°C`;
                } else {
                    el.innerHTML = "Sem dados";
                }
            });
        })
        .catch(erro => {
            console.error("Erro ao carregar temperatura:", erro);
            discotemp1.innerHTML = "Erro";
            discotemp2.innerHTML = "";
            discotemp3.innerHTML = "";
        });
}



function plotarGraficoBarras() {
    fetch(`/dashboardDisco/obterDados/${idEmpresa}`)
        .then(resposta => resposta.json())
        .then(dados => {
            const top5 = dados.servidores
                .sort((a, b) => b.disco - a.disco)
                .slice(0, 5);

            const labels = top5.map(s => s.nomeMaquina);
            const valores = top5.map(s => s.disco);
            const cores = valores.map(v =>
                v > 90 ? "#ff3b30" :
                    v > 75 ? "#ff9500" : "#ffd966"
            );

            if (window.graficoBarras) window.graficoBarras.destroy();

            window.graficoBarras = new Chart(document.getElementById('graficobarras'), {
                type: 'bar',
                data: {
                    labels,
                    datasets: [{
                        label: '% Uso do Disco',
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
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { beginAtZero: true, ticks: { color: "white" } },
                        y: { ticks: { color: "white" } }
                    }
                }
            });
        });
}

async function plotarGraficoLinha(periodo = '7d') {
    // 1. Busca o JSON de HISTÓRICO
    const historicoRes = await fetch(`/s3/tratamento_willian/DiscoHistoricoEmpresa_${idEmpresa}.json`);
    const historico = await historicoRes.json();

    // 2. Busca os TOP 5 servidores (do JSON principal)
    const dadosRes = await fetch(`/dashboardDisco/obterDados/${idEmpresa}`);
    const dados = await dadosRes.json();
    const top5Ids = dados.servidores
        .sort((a, b) => b.disco - a.disco)
        .slice(0, 5)
        .map(s => s.fk_servidor);

    // 3. Filtra histórico por período e top5
    const agora = new Date();
    const periodos = { '1h': 3600000, '7d': 604800000, '30d': 2592000000 };
    const limite = agora - (periodos[periodo] || periodos['7d']);

    const filtrado = historico
        .filter(r => new Date(r.timestamp).getTime() >= limite && top5Ids.includes(r.fk_servidor))
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    // 4. Prepara dados para o gráfico
    const labels = filtrado.map(r => {
        const dt = new Date(r.timestamp);
        return periodo === '1h' ?
            `${dt.getHours()}:${String(dt.getMinutes()).padStart(2, '0')}` :
            `${dt.getDate()}/${dt.getMonth() + 1}`;
    });
    const valores = filtrado.map(r => r.disco);

    // 5. Renderiza
    if (window.graficoDisco) window.graficoDisco.destroy();
    window.graficoDisco = new Chart(document.getElementById('graficolinhas'), {
        type: 'line',
        data: {
            labels,
            datasets: [{
                data: valores,
                borderColor: '#D2B080',
                borderWidth: 2,
                tension: 0.3
>>>>>>> 1e47480475d5747859efdd537479c9763019dc67
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
<<<<<<< HEAD

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
=======
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, ticks: { color: 'white' } },
                x: { ticks: { color: 'white' } }
            }
        }
    });
>>>>>>> 1e47480475d5747859efdd537479c9763019dc67
}

let dadosExemplo = [
    { dt_registro: '2025-01-01T10:00:00', uso_disco: 20 },
    { dt_registro: '2025-01-01T10:01:00', uso_disco: 22 },
    { dt_registro: '2025-01-01T10:02:00', uso_disco: 23 },
    { dt_registro: '2025-01-01T10:03:00', uso_disco: 21 },
];

window.onload = () => {
<<<<<<< HEAD
    plotarGraficoBarras();
        plotarGraficoLinha(dadosExemplo, 999, 6);
};
=======
    plotarGraficoBarras()
    plotarGraficoLinha()
    definirStatusOperacao()
    DiscosComMaiorRiscoDeFalha()
    DiscosQueRecebemMaisRequisicoes()
    ListagemDosDiscosEmAlerta()
};
>>>>>>> 1e47480475d5747859efdd537479c9763019dc67
