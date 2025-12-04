
var idEmpresa = sessionStorage.ID_EMPRESA;

function kpiComparativaAlertas() {
    var dadosHoje = 0
    fetch(`/dashboardDisco/alertasHoje/${idEmpresa}`)
        .then(resposta => {
            if (!resposta.ok) throw "Erro na requisição";
            return resposta.json();
        })
        .then(dados => {
            dadosHoje = dados.length
            saidaAlertasHoje.innerHTML = dadosHoje;
            console.log(`total de alertas hoje ${dadosHoje}`)
        })
        .catch(erro => console.error("Erro:", erro));

    fetch(`/dashboardDisco/alertasOntem/${idEmpresa}`)
        .then(resposta => {
            if (!resposta.ok) throw "Erro na requisição";
            return resposta.json();
        })
        .then(dados => {
            var dadosOntem = dados.length
            let calculo = 0
            console.log(`total de alertas ontem ${dadosOntem}`)
            if (dadosHoje < dadosOntem) {
                calculo = (dadosOntem - dadosHoje)
                saidaAlertasOntem.innerHTML = `${calculo} a menos que ontem`;
            } else if (dadosHoje > dadosOntem) {
                calculo = (dadosHoje - dadosOntem)
                saidaAlertasOntem.innerHTML = `${calculo} a mais que ontem`;
            } else if (dadosHoje == dadosOntem) {
                calculo = dadosHoje
                saidaAlertasOntem.innerHTML = `${calculo} mesma quantidade que ontem`;
            }
        })
        .catch(erro => console.error("Erro:", erro));
}

 fetch(`/dashboardDisco/obterDados/${idEmpresa}`)
        .then(resposta => {
            if (!resposta.ok) throw "Erro na requisição";
            return resposta.json();
        })
        .then(dados => {
            plotarGraficoLinha(dados, '7d');
            
        })
        .catch(erro => console.error("Erro:", erro));



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
            }
        }
    }


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
                    elementos[i].innerHTML = `${servidor.apelidoDisco}: ${servidor.disco.toFixed(2)}%`;
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

                    el.innerHTML = `${s.apelidoDisco}: ${unidade}`;
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
                    el.innerHTML = `${top3Temp[i].apelidoDisco}: ${top3Temp[i].temperatura_disco.toFixed(1)}°C`;
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


function puxarQuantidadeAlertaPorServidor() {
    fetch(`/dashboardDisco/alertasPorServidor/${idEmpresa}`)
        .then(resposta => {
            if (!resposta.ok) throw "Erro na requisição";
            return resposta.json();
        })
        .then(alertas => {
            // Conta quantos alertas cada servidor teve
            const contagem = {};
            alertas.forEach(alerta => {
                const servidor = alerta.apelido;
                contagem[servidor] = (contagem[servidor] || 0) + 1;
            });

            // Converte para array de { nome, quantidade }
            const dadosGrafico = Object.entries(contagem)
                .map(([nome, qtd]) => ({ nome, quantidade: qtd }))
                .sort((a, b) => b.quantidade - a.quantidade) // ordem decrescente
                .slice(0, 5); // top 5

            // Atualiza o gráfico
            atualizarGraficoBarras(dadosGrafico);
        })
        .catch(erro => {
            console.error("Erro ao carregar alertas:", erro);
            // Opcional: exibir mensagem de erro no gráfico
        });
}

function atualizarGraficoBarras(dados) {
    const labels = dados.map(d => d.nome);
    const valores = dados.map(d => d.quantidade);
    const cores = valores.map(v =>
        v > 10 ? "#ff3b30" :
            v > 5 ? "#ff9500" : "#ffd966"
    );

    if (window.graficoBarras) window.graficoBarras.destroy();

    window.graficoBarras = new Chart(document.getElementById('graficobarras'), {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Quantidade de Alertas (Hoje)',
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
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `Alertas: ${context.raw}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: { color: "white" },
                    title: {
                        display: true,
                        text: 'Número de Alertas',
                        color: 'white'
                    }
                },
                y: { ticks: { color: "white" } }
            }
        }
    });
}



// tudo para funcionamento do gráfico de linha

function plotarGraficoLinha(dados, periodo = '24h') {
    // 1. Define o período em milissegundos
    const periodos = {
        '1h': 1 * 60 * 60 * 1000,
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000
    };
    const agora = new Date();
    const limiteMs = periodos[periodo] || periodos['24h'];
    const limite = new Date(agora.getTime() - limiteMs);

    // 2. Pega os TOP 5 servidores por uso (no momento atual)
    const top5Ids = dados.servidores
        .sort((a, b) => b.disco - a.disco)
        .slice(0, 5)
        .map(s => s.fk_servidor);

    // 3. Filtra o histórico: só top5 + dentro do período
    const historicoFiltrado = dados.historico
        .filter(r => {
            const ts = new Date(r.timestamp);
            return ts >= limite && top5Ids.includes(r.fk_servidor);
        })
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    // 4. Agrupa por servidor
    const dadosPorServidor = {};
    historicoFiltrado.forEach(reg => {
        if (!dadosPorServidor[reg.fk_servidor]) {
            dadosPorServidor[reg.fk_servidor] = { labels: [], valores: [] };
        }
        const label = periodo === '1h'
            ? new Date(reg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : new Date(reg.timestamp).toLocaleDateString();

        dadosPorServidor[reg.fk_servidor].labels.push(label);
        dadosPorServidor[reg.fk_servidor].valores.push(reg.disco);
    });

    // 5. Prepara datasets para o Chart.js
    const datasets = Object.keys(dadosPorServidor).map((fk_servidor, i) => {
        // Encontra o nome/apelido do servidor
        const servidor = dados.servidores.find(s => s.fk_servidor == fk_servidor);
        const nome = servidor ? servidor.apelidoDisco || servidor.nomeMaquina : `Servidor ${fk_servidor}`;

        return {
            label: nome,
            data: dadosPorServidor[fk_servidor].valores,
            borderColor: cores[i % cores.length],
            borderWidth: 2,
            tension: 0.3,
            fill: false
        };
    });

    // 6. Define cores (adicione isso antes do Chart)
    const cores = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
    ];

    // 7. Pega labels (do primeiro servidor)
    const labels = datasets.length > 0
        ? dadosPorServidor[Object.keys(dadosPorServidor)[0]].labels
        : [];

    // 8. Destroi gráfico anterior (evita sobreposição)
    if (window.graficoDisco) {
        window.graficoDisco.destroy();
    }
    console.log(datasets)
    window.graficoDisco = new Chart(
        document.getElementById('graficolinhas'), // seu <canvas id="graficolinhas">
        {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: 'white' // texto da legenda branco
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { color: 'white' },
                        title: {
                            display: true,
                            text: '% Uso do Disco',
                            color: 'white'
                        }
                    },
                    x: {
                        ticks: { color: 'white' }
                    }
                }
            }
        }
    );
}

// final gráfico linha

window.onload = () => {
    definirStatusOperacao()
    DiscosComMaiorRiscoDeFalha()
    puxarQuantidadeAlertaPorServidor();
    DiscosQueRecebemMaisRequisicoes()
    kpiComparativaAlertas()
    ListagemDosDiscosEmAlerta()
};