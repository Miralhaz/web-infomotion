
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
            if (maiorUso > 90) status = "Há discos em estado de alerta";
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

//lista de disco por uso de armazenamento
function ListagemDosDiscosEmAlerta(dados) {
    const tbody = document.getElementById("corpo-tabela-discos");
    if (!tbody) {
        console.error("Elemento #corpo-tabela-discos não encontrado!");
        return;
    }

    // Ordena TODOS os servidores por uso de disco (maior primeiro)
    const servidoresOrdenados = dados.servidores
        .sort((a, b) => b.disco - a.disco);

    // Limpa a tabela
    tbody.innerHTML = "";

    // Preenche cada linha
    servidoresOrdenados.forEach(servidor => {
        // Pega o parâmetro de alerta
        const parametro = dados.parametrosAlerta[servidor.fk_servidor];
        const limiteDisco = parametro ? parametro.limiteDisco : 80; // fallback
        const estaEmAlerta = servidor.disco > limiteDisco;

        // Cria a linha
        const tr = document.createElement("tr");
        tr.className = estaEmAlerta ? "linha-alerta" : "";

        // Coluna 1: Apelido do disco
        const tdApelido = document.createElement("td");
        tdApelido.textContent = servidor.apelidoDisco || "Desconhecido";

        // Coluna 2: Capacidade (MOCK por enquanto)
        const tdCapacidade = document.createElement("td");
        tdCapacidade.textContent = servidor.capacidade; // 🔜 substitua por servidor.capacidade depois

        // Coluna 3: Uso atual (%)
        const tdUso = document.createElement("td");
        tdUso.textContent = `${servidor.disco.toFixed(2)}%`;
        if (estaEmAlerta) tdUso.classList.add("texto-alerta");

        // Coluna 4: Parâmetro (%)
        const tdParametro = document.createElement("td");
        tdParametro.textContent = `${limiteDisco.toFixed(2)}%`;
        if (estaEmAlerta) tdParametro.classList.add("texto-alerta");

        // Coluna 5: Nome do servidor
        const tdServidor = document.createElement("td");
        tdServidor.textContent = servidor.nomeMaquina || `Servidor ${servidor.fk_servidor}`;
        if (estaEmAlerta) tdServidor.classList.add("texto-alerta");

        // Monta a linha
        tr.appendChild(tdApelido);
        tr.appendChild(tdCapacidade);
        tr.appendChild(tdUso);
        tr.appendChild(tdParametro);
        tr.appendChild(tdServidor);

        tbody.appendChild(tr);
    });
}

function DiscosQueRecebemMaisRequisicoes(dados) {
    const tbody = document.getElementById("corpo-tabela-discos-operacao");
    if (!tbody) {
        console.error("Elemento #corpo-tabela-discos-operacao não encontrado!");
        return;
    }

    // Calcula atividade total (bytes_lidos + bytes_escritos) e ordena
    const servidoresComAtividade = dados.servidores
        .map(serv => ({
            ...serv,
            atividadeTotal: (serv.bytes_lidos || 0) + (serv.bytes_escritos || 0)
        }))
        .sort((a, b) => b.atividadeTotal - a.atividadeTotal); // maior primeiro

    // Limpa a tabela
    tbody.innerHTML = "";

    // Preenche cada linha
    servidoresComAtividade.forEach(serv => {
        const tr = document.createElement("tr");

        // Coluna 1: Apelido
        const tdApelido = document.createElement("td");
        tdApelido.textContent = serv.apelidoDisco || "Desconhecido";

        // Coluna 2: Capacidade (MOCK por enquanto)
        const tdCapacidade = document.createElement("td");
        tdCapacidade.textContent = serv.capacidade; // 🔜 substitua por serv.capacidade depois

        // Coluna 3: Processos
        const tdProcessos = document.createElement("td");
        tdProcessos.textContent = serv.quantidade_processos || 0;

        // Coluna 4: Leitura (bytes_lidos → MB/s ou KB/s)
        const tdLeitura = document.createElement("td");
        const leituraMB = (serv.bytes_lidos || 0) / (1024 * 1024);
        if (leituraMB >= 1) {
            tdLeitura.textContent = `${leituraMB.toFixed(2)} MB/s`;
        } else {
            const leituraKB = leituraMB * 1024;
            tdLeitura.textContent = `${leituraKB.toFixed(2)} KB/s`;
        }

        // Coluna 5: Escrita (bytes_escritos → MB/s ou KB/s)
        const tdEscrita = document.createElement("td");
        const escritaMB = (serv.bytes_escritos || 0) / (1024 * 1024);
        if (escritaMB >= 1) {
            tdEscrita.textContent = `${escritaMB.toFixed(2)} MB/s`;
        } else {
            const escritaKB = escritaMB * 1024;
            tdEscrita.textContent = `${escritaKB.toFixed(2)} KB/s`;
        }

        // Coluna 6: Servidor
        const tdServidor = document.createElement("td");
        tdServidor.textContent = serv.nomeMaquina || `Servidor ${serv.fk_servidor}`;

        // Monta a linha
        tr.appendChild(tdApelido);
        tr.appendChild(tdCapacidade);
        tr.appendChild(tdProcessos);
        tr.appendChild(tdLeitura);
        tr.appendChild(tdEscrita);
        tr.appendChild(tdServidor);

        tbody.appendChild(tr);
    });
}

function DiscosComMaiorRiscoDeFalha(dados) {
   
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



let graficoBarras = null;

// interação com periodo e discos

document.addEventListener('click', function(e) {

    // --- SELECT DO PERÍODO ---
    if (e.target.closest('#select_display')) {
        document.getElementById('lista_opcoes').classList.toggle('visible');
        return;
    }

    if (e.target.closest('#lista_opcoes li')) {
        const li = e.target.closest('li');
        const valor = li.getAttribute('data-value');
        const texto = li.textContent;

        document.getElementById('select_value').value = valor;
        document.getElementById('select_display').innerHTML = texto + ' <span class="seta"> &#9660; </span>';

        document.getElementById('lista_opcoes').classList.remove('visible');
        atualizarGrafico();
        return;
    }

    // --- SELECT DOS DISCOS ---
    if (e.target.closest('#select_display_discos')) {
        document.getElementById('lista_opcoes_discos').classList.toggle('visible');
        return;
    }

    if (e.target.closest('#lista_opcoes_discos li')) {
        const li = e.target.closest('li');
        const valor = li.getAttribute('data-value');
        const texto = li.textContent;

        document.getElementById('select_value_disco').value = valor;
        document.getElementById('select_display_discos').innerHTML = texto + ' <span class="seta"> &#9660; </span>';

        document.getElementById('lista_opcoes_discos').classList.remove('visible');
        atualizarGrafico();
        return;
    }

    // --- FECHAR AO CLICAR FORA ---
    if (!e.target.closest('.select-grafico')) {
        document.getElementById('lista_opcoes').classList.remove('visible');
        document.getElementById('lista_opcoes_discos').classList.remove('visible');
    }
});


// tudo pra funcionamento do gráfico de linhas 
function filtrarPorPeriodo(historico, periodo) {
    const agora = new Date();
    let limite;

    switch (periodo) {
        case "1h":  limite = new Date(agora - 1 * 60 * 60 * 1000); break;
        case "24h": limite = new Date(agora - 24 * 60 * 60 * 1000); break;
        default:    limite = new Date(agora - 7 * 24 * 60 * 60 * 1000); break;
    }

    return historico.filter(item => new Date(item.timestamp) >= limite);
}

function amostrarDados(dados, maxPontos = 7) {
    if (dados.length <= maxPontos) return dados;

    const resultado = [];
    const passo = Math.floor(dados.length / (maxPontos - 1));
    
    resultado.push(dados[0]);

    for (let i = 1; i < maxPontos - 1; i++) {
        const idx = Math.min(i * passo, dados.length - 2);
        resultado.push(dados[idx]);
    }

    resultado.push(dados[dados.length - 1]);
    return resultado;
}

/* ================================
         GRÁFICO DE LINHA
================================ */
let graficoLinhas = null;
let dadosGlobais = null;

function plotarGrafico(historicoFiltrado, periodo) {
    const dadosAmostrados = amostrarDados(historicoFiltrado);

    const labels = dadosAmostrados.map(item => {
        const data = new Date(item.timestamp);
        return (periodo === "1h")
            ? data.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : `${data.getDate()}/${data.getMonth() + 1}`;
    });

    const valores = dadosAmostrados.map(item => item.disco);

    if (graficoLinhas) graficoLinhas.destroy();

    graficoLinhas = new Chart(document.getElementById('graficolinhas'), {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Uso do Disco (%)',
                data: valores,
                borderColor: '#D2B080',
                backgroundColor: 'rgba(210, 176, 128, 0.1)',
                borderWidth: 2,
                tension: 0.3,
                pointRadius: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, max: 100, ticks: { color: "white" } },
                x: { ticks: { color: "white" } }
            }
        }
    });
}

/* ================================
       FUNÇÃO CENTRAL DO GRÁFICO
================================ */
function atualizarGrafico() {
    const periodo = document.getElementById("select_value").value;
    const discoId = document.getElementById("select_value_disco").value;

    if (!dadosGlobais || !discoId) return;

    const historicoDisco = dadosGlobais.historico.filter(
        item => item.fk_servidor == discoId
    );

    const filtrado = filtrarPorPeriodo(historicoDisco, periodo);

    if (filtrado.length > 0) plotarGrafico(filtrado, periodo);
    else if (graficoLinhas) graficoLinhas.destroy();
}



window.onload = () => {
    fetch(`/dashboardDisco/obterDados/${idEmpresa}`)
        .then(res => res.json())
        .then(dados => {

            console.log("Principal:", dados);
            console.log("Histórico:", dados.historico);

            dadosGlobais = dados;

            /* --- Preenche select de discos --- */
            const lista = document.getElementById("lista_opcoes_discos");
            lista.innerHTML = "";

            dados.servidores.forEach(serv => {
                const li = document.createElement("li");
                li.textContent = `${serv.apelidoDisco || serv.nomeMaquina} (${serv.disco}%)`;
                li.dataset.value = serv.fk_servidor;
                lista.appendChild(li);
            });

            // Define o primeiro disco automaticamente
            if (dados.servidores.length > 0) {
                const primeira = dados.servidores[0];
                document.getElementById("select_value_disco").value = primeira.fk_servidor;
                document.getElementById("select_display_discos").innerHTML =
                    `${primeira.apelidoDisco || primeira.nomeMaquina} (${primeira.disco}%) <span class='seta'>&#9660;</span>`;
            }

            // Período padrão (7 dias)
            document.getElementById("select_value").value = "7d";
            document.getElementById("select_display").innerHTML =
                "7 dias <span class='seta'>&#9660;</span>";

            atualizarGrafico();

            definirStatusOperacao();
            DiscosComMaiorRiscoDeFalha(dados);
            puxarQuantidadeAlertaPorServidor();
            DiscosQueRecebemMaisRequisicoes(dados);
            kpiComparativaAlertas();
            ListagemDosDiscosEmAlerta(dados);
        })
        .catch(err => console.error("Erro:", err));
};
