
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
            const numeroHoje = document.getElementById('saidaAlertasHoje');
            numeroHoje.className = 'alertas-numero';
            var dadosOntem = dados.length
            let calculo = 0
            console.log(`total de alertas ontem ${dadosOntem}`)
            if (dadosHoje < dadosOntem) {
                calculo = (dadosOntem - dadosHoje)
                saidaAlertasOntem.innerHTML = `${calculo} a menos que ontem`;
                numeroHoje.classList.add('melhor');
            } else if (dadosHoje > dadosOntem) {
                calculo = (dadosHoje - dadosOntem)
                saidaAlertasOntem.innerHTML = `${calculo} a mais que ontem`;
                numeroHoje.classList.add('pior');
            } else if (dadosHoje == dadosOntem) {
                calculo = dadosHoje
                saidaAlertasOntem.innerHTML = `${calculo} mesma quantidade que ontem`;
            }
        })
        .catch(erro => console.error("Erro:", erro));
}


function definirStatusOperacao(dados) {
    let temAlertaDisco = false;
    let temAlertaTemperatura = false;
    
    for (let i = 0; i < dados.servidores.length; i++) {
        const servidor = dados.servidores[i];
        const parametro = dados.parametrosAlerta[servidor.fk_servidor];
        if (parametro) {
            if (servidor.disco > parametro.limiteDisco) {
                temAlertaDisco = true;
            }
            if (servidor.temperatura_disco > parametro.limiteTemperatura) {
                temAlertaTemperatura = true;
            }
        }
    }
    
    let status;
    if (temAlertaDisco && temAlertaTemperatura) {
        status = "Há discos com uso e temperatura acima do parâmetro";
    } else if (temAlertaDisco) {
        status = "Há discos com uso acima do parâmetro";
    } else if (temAlertaTemperatura) {
        status = "Há discos com temperatura acima do parâmetro";
    } else {
        status = "Operação normal";
    }
    
    txt_status_operacao.innerHTML = status;
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

function ListagemDosDiscosEmAlerta(dados) {
    const tbody = document.getElementById("corpo-tabela-discos");
    if (!tbody) {
        console.error("Elemento #corpo-tabela-discos não encontrado!");
        return;
    }

    // 1. Categoriza e ordena servidores por gravidade
    const servidoresComGravidade = [];

    for (let i = 0; i < dados.servidores.length; i++) {
        const servidor = dados.servidores[i];
        const parametro = dados.parametrosAlerta[servidor.fk_servidor];
        const limiteDisco = parametro ? parametro.limiteDisco : 80;

        let gravidade;
        if (servidor.disco > limiteDisco) {
            gravidade = 3; // Ultrapassou (vermelho)
        } else if (servidor.disco > limiteDisco * 0.9) {
            gravidade = 2; // Próximo (amarelo)
        } else {
            gravidade = 1; // Normal
        }

        servidoresComGravidade.push({
            servidor: servidor,
            limite: limiteDisco,
            gravidade: gravidade,
            diferenca: limiteDisco - servidor.disco // para ordenar dentro da mesma gravidade
        });
    }

    // 2. Ordena por: gravidade (desc) → diferença (asc)
    for (let i = 0; i < servidoresComGravidade.length; i++) {
        for (let j = i + 1; j < servidoresComGravidade.length; j++) {
            const a = servidoresComGravidade[i];
            const b = servidoresComGravidade[j];

            if (a.gravidade !== b.gravidade) {
                // Ordena por gravidade (3 > 2 > 1)
                if (a.gravidade < b.gravidade) {
                    // Troca
                    const temp = servidoresComGravidade[i];
                    servidoresComGravidade[i] = servidoresComGravidade[j];
                    servidoresComGravidade[j] = temp;
                }
            } else {
                // Mesma gravidade: ordena por quem está mais próximo do limite
                if (a.diferenca > b.diferenca) {
                    // Troca
                    const temp = servidoresComGravidade[i];
                    servidoresComGravidade[i] = servidoresComGravidade[j];
                    servidoresComGravidade[j] = temp;
                }
            }
        }
    }

    // 3. Limpa a tabela
    tbody.innerHTML = "";

    // 4. Preenche com `for` tradicional
    for (let i = 0; i < servidoresComGravidade.length; i++) {
        const item = servidoresComGravidade[i];
        const servidor = item.servidor;
        const limiteDisco = item.limite;
        const estaEmAlerta = item.gravidade === 3;
        const estaProximo = item.gravidade === 2;

        // Cria a linha
        const tr = document.createElement("tr");
        if (estaEmAlerta) {
            tr.className = "linha-alerta"; // vermelho de fundo
        } else if (estaProximo) {
            tr.className = "linha-proximo"; // fundo amarelo suave (você cria no CSS)
        }

        // Coluna 1: Apelido
        const tdApelido = document.createElement("td");
        tdApelido.textContent = servidor.apelidoDisco || "Desconhecido";

        // Coluna 2: Capacidade
        const tdCapacidade = document.createElement("td");
        tdCapacidade.textContent = servidor.capacidade || "Desconhecido";

        // Coluna 3: Uso atual
        const tdUso = document.createElement("td");
        tdUso.textContent = `${servidor.disco.toFixed(2)}%`;
        if (estaEmAlerta) {
            tdUso.classList.add("texto-alerta"); // vermelho
        } else if (estaProximo) {
            tdUso.classList.add("texto-proximo"); // amarelo (você cria no CSS)
        }

        // Coluna 4: Parâmetro
        const tdParametro = document.createElement("td");
        tdParametro.textContent = `${limiteDisco.toFixed(2)}%`;
        if (estaEmAlerta) {
            tdParametro.classList.add("texto-alerta");
        } else if (estaProximo) {
            tdParametro.classList.add("texto-proximo");
        }

        // Coluna 5: Servidor
        const tdServidor = document.createElement("td");
        tdServidor.textContent = servidor.nomeMaquina || `Servidor ${servidor.fk_servidor}`;
        if (estaEmAlerta) {
            tdServidor.classList.add("texto-alerta");
        } else if (estaProximo) {
            tdServidor.classList.add("texto-proximo");
        }

        // Monta a linha
        tr.appendChild(tdApelido);
        tr.appendChild(tdCapacidade);
        tr.appendChild(tdUso);
        tr.appendChild(tdParametro);
        tr.appendChild(tdServidor);

        tbody.appendChild(tr);
    }
}

function DiscosQueRecebemMaisRequisicoes(dados) {
    const tbody = document.getElementById("corpo-tabela-discos-operacao");
    if (!tbody) {
        console.error("Elemento #corpo-tabela-discos-operacao não encontrado!");
        return;
    }

    const PESO_OPERACAO = 10000; // 1 operação = 10 KB
    const servidoresComScore = [];

    // 1. Calcula score para cada servidor
    for (let i = 0; i < dados.servidores.length; i++) {
        const serv = dados.servidores[i];
        const bytesTotal = (serv.bytes_lidos || 0) + (serv.bytes_escritos || 0);
        const operacoesTotal = (serv.numero_leituras || 0) + (serv.numero_escritas || 0);
        const score = bytesTotal + (operacoesTotal * PESO_OPERACAO);

        servidoresComScore.push({
            servidor: serv,
            score: score
        });
    }

    // 2. Ordena com bubble sort (maior score primeiro)
    for (let i = 0; i < servidoresComScore.length; i++) {
        for (let j = i + 1; j < servidoresComScore.length; j++) {
            if (servidoresComScore[i].score < servidoresComScore[j].score) {
                const temp = servidoresComScore[i];
                servidoresComScore[i] = servidoresComScore[j];
                servidoresComScore[j] = temp;
            }
        }
    }

    // 3. Limpa e preenche a tabela
    tbody.innerHTML = "";
 const limite = Math.min(5, servidoresComScore.length);
for (let i = 0; i < limite; i++) {
        const item = servidoresComScore[i];
        const serv = item.servidor;

        const tr = document.createElement("tr");
        // Destaque para alto score (ex: > 100 GB em equivalente)
        if (item.score > 100 * 1024 * 1024 * 1024) {
            tr.className = "linha-alta-atividade";
        }

        // Apelido
        const tdApelido = document.createElement("td");
        tdApelido.textContent = serv.apelidoDisco || "Desconhecido";

        // Capacidade
        const tdCapacidade = document.createElement("td");
        tdCapacidade.textContent = serv.capacidade || "Desconhecido";

        // Processos
        const tdProcessos = document.createElement("td");
        tdProcessos.textContent = serv.quantidade_processos || 0;

        // Leitura (formatação honesta: só MB/KB, sem "/s")
        const tdLeitura = document.createElement("td");
        const leituraMB = (serv.bytes_lidos || 0) / (1024 * 1024);
        if (leituraMB >= 1) {
            tdLeitura.textContent = `${leituraMB.toFixed(2)} MB`;
        } else {
            tdLeitura.textContent = `${(leituraMB * 1024).toFixed(2)} KB`;
        }

        // Escrita
        const tdEscrita = document.createElement("td");
        const escritaMB = (serv.bytes_escritos || 0) / (1024 * 1024);
        if (escritaMB >= 1) {
            tdEscrita.textContent = `${escritaMB.toFixed(2)} MB`;
        } else {
            tdEscrita.textContent = `${(escritaMB * 1024).toFixed(2)} KB`;
        }

        // Servidor
        const tdServidor = document.createElement("td");
        tdServidor.textContent = serv.nomeMaquina || `Servidor ${serv.fk_servidor}`;

        tr.append(tdApelido, tdCapacidade, tdProcessos, tdLeitura, tdEscrita, tdServidor);
        tbody.appendChild(tr);
    }
}

function DiscosComMaiorRiscoDeFalha(dados) {
    // 1. Prepara lista com distância do parâmetro
    const discosComDistancia = [];

    for (let i = 0; i < dados.servidores.length; i++) {
        const servidor = dados.servidores[i];
        const parametro = dados.parametrosAlerta[servidor.fk_servidor];
        const limiteTemp = parametro ? parseFloat(parametro.limiteTemperatura) : 45.0;

        // Calcula distância (pode ser negativa se ultrapassou)
        const distancia = limiteTemp - servidor.temperatura_disco;

        discosComDistancia.push({
            apelido: servidor.apelidoDisco || servidor.nomeMaquina,
            temperatura: servidor.temperatura_disco,
            parametro: limiteTemp,
            distancia: distancia // negativo = já ultrapassou
        });
    }

    // 2. Ordena por distância (menor primeiro)
    // Quem tem distância negativa (ultrapassou) vem primeiro
    // Depois quem está mais próximo (distância pequena positiva)
    for (let i = 0; i < discosComDistancia.length; i++) {
        for (let j = i + 1; j < discosComDistancia.length; j++) {
            const distA = discosComDistancia[i].distancia;
            const distB = discosComDistancia[j].distancia;

            // Se A ultrapassou e B não, A vem primeiro
            if (distA < 0 && distB >= 0) {
                continue; // A já está na frente
            }
            // Se B ultrapassou e A não, troca
            else if (distB < 0 && distA >= 0) {
                const temp = discosComDistancia[i];
                discosComDistancia[i] = discosComDistancia[j];
                discosComDistancia[j] = temp;
            }
            // Se ambos ultrapassaram ou ambos não, ordena por distância (menor primeiro)
            else if (distA > distB) {
                const temp = discosComDistancia[i];
                discosComDistancia[i] = discosComDistancia[j];
                discosComDistancia[j] = temp;
            }
        }
    }

    // 3. Atualiza os elementos
    const elementos = [discotemp1, discotemp2, discotemp3];

    // Limpa
    for (let i = 0; i < elementos.length; i++) {
        elementos[i].innerHTML = "Sem dados";
        elementos[i].className = "";
    }

    // Preenche top 3
    for (let i = 0; i < Math.min(3, discosComDistancia.length); i++) {
        const disco = discosComDistancia[i];
        const ultrapassou = disco.distancia < 0;

        elementos[i].innerHTML =
            `${disco.apelido}: ${disco.temperatura.toFixed(1)}°C max: ${disco.parametro.toFixed(1)}°C`;

        if (ultrapassou) {
            elementos[i].className = "temperatura-alerta";
        }
    }
}


function puxarQuantidadeAlertaPorServidor() {
    fetch(`/dashboardDisco/alertasPorServidor/${idEmpresa}`)
        .then(resposta => {
            if (!resposta.ok) throw "Erro na requisição";
            return resposta.json();
        })
        .then(alertas => {

            const contagem = {};
            alertas.forEach(alerta => {
                const servidor = alerta.apelido;
                contagem[servidor] = (contagem[servidor] || 0) + 1;
            });


            const dadosGrafico = Object.entries(contagem)
                .map(([nome, qtd]) => ({ nome, quantidade: qtd }))
                .sort((a, b) => b.quantidade - a.quantidade)
                .slice(0, 5);


            atualizarGraficoBarras(dadosGrafico);
        })
        .catch(erro => {
            console.error("Erro ao carregar alertas:", erro);
        });
}

function atualizarGraficoBarras(dados) {

    const labels = [];
    const valores = [];
    const cores = [];

    for (let i = 0; i < dados.length; i++) {
        const d = dados[i];

        labels.push(d.nome);
        valores.push(d.quantidade);

        if (d.quantidade > 10) cores.push("#ff3b30");
        else if (d.quantidade > 5) cores.push("#ff9500");
        else cores.push("#ffd966");
    }

    if (window.graficoBarras) window.graficoBarras.destroy();

    window.graficoBarras = new Chart(document.getElementById('graficobarras'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Quantidade de Alertas (Hoje)',
                data: valores,
                backgroundColor: cores,
                borderColor: "#333",
                maxBarThickness: 30,
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
                    ticks: {
                        color: "white",
                        stepSize: 1   
                    },
                    title: {
                        display: true,
                        text: 'Número de Alertas',
                        color: 'white',
                        font: {
                            size: 18,
                            weight: "bold"
                        }
                    }
                },
                y: { ticks: { color: "white" } }
            }
        }
    });
}



let graficoBarras = null;

document.addEventListener('click', function (e) {

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
    if (!e.target.closest('.select-grafico')) {
        document.getElementById('lista_opcoes').classList.remove('visible');
        document.getElementById('lista_opcoes_discos').classList.remove('visible');
    }
});


// tudo pra funcionamento do gráfico de linhas 
function filtrarPorPeriodo(historico, periodo) {

    const agora = new Date();
    let limite;

    if (periodo === "1h") {
        limite = new Date(agora - (1 * 60 * 60 * 1000));
    } else if (periodo === "24h") {
        limite = new Date(agora - (24 * 60 * 60 * 1000));
    } else {
        limite = new Date(agora - (7 * 24 * 60 * 60 * 1000)); // 7 dias
    }

    const filtrado = [];

    for (let i = 0; i < historico.length; i++) {
        const dataItem = new Date(historico[i].timestamp);
        if (dataItem >= limite) {
            filtrado.push(historico[i]);
        }
    }

    return filtrado;
}


function amostrarDados(lista, maxPontos = 7) {

    if (lista.length <= maxPontos) return lista;

    const resultado = [];

    const passo = Math.floor(lista.length / (maxPontos - 1));

    resultado.push(lista[0]); // primeiro ponto

    for (let i = 1; i < maxPontos - 1; i++) {
        const indice = i * passo;
        resultado.push(lista[indice]);
    }

    resultado.push(lista[lista.length - 1]); // último ponto

    return resultado;
}


let graficoLinhas = null;

function plotarGrafico(listaFiltrada, periodo) {

    const dados = amostrarDados(listaFiltrada);

    const labels = [];
    const valores = [];

    for (let i = 0; i < dados.length; i++) {
        const item = dados[i];
        const data = new Date(item.timestamp);

        if (periodo === "1h") {
            labels.push(
                data.getHours().toString().padStart(2, "0") + ":" +
                data.getMinutes().toString().padStart(2, "0")
            );
        } else {
            labels.push(data.getDate() + "/" + (data.getMonth() + 1));
        }

        valores.push(item.disco);
    }

    if (graficoLinhas) graficoLinhas.destroy();

    graficoLinhas = new Chart(document.getElementById("graficolinhas"), {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Uso do Disco (%)",
                data: valores,
                borderColor: "#D2B080",
                backgroundColor: "rgba(210,176,128,0.1)",
                borderWidth: 2,
                tension: 0.3,
                pointRadius: 2
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


function atualizarGrafico() {

    const periodo = document.getElementById("select_value").value;
    const discoId = document.getElementById("select_value_disco").value;

    if (!dadosGlobais || !discoId) return;

    const historicoDisco = [];

    for (let i = 0; i < dadosGlobais.historico.length; i++) {
        if (dadosGlobais.historico[i].fk_servidor == discoId) {
            historicoDisco.push(dadosGlobais.historico[i]);
        }
    }

    const filtrado = filtrarPorPeriodo(historicoDisco, periodo);

    if (filtrado.length > 0) {
        plotarGrafico(filtrado, periodo);
    } else if (graficoLinhas) {
        graficoLinhas.destroy();
    }
}



document.addEventListener("click", (e) => {

    // SELECT PERÍODO
    if (e.target.closest("#select_display")) {
        document.getElementById("lista_opcoes").classList.toggle("hidden");
        return;
    }

    if (e.target.closest("#lista_opcoes li")) {

        const li = e.target.closest("li");

        // converte texto → valor usado no JS
        const conversion = {
            "1hora": "1h",
            "24horas": "24h",
            "dias": "7d"
        };

        const valor = li.dataset.value;
        const periodoConvertido = conversion[valor];

        document.getElementById("select_value").value = periodoConvertido;

        document.getElementById("select_display").innerHTML =
            li.textContent + " <span class='seta'>&#9660;</span>";

        document.getElementById("lista_opcoes").classList.add("hidden");
        atualizarGrafico();
        return;
    }


    // SELECT DISCO
    if (e.target.closest("#select_display_discos")) {
        document.getElementById("lista_opcoes_discos").classList.toggle("hidden");
        return;
    }

    if (e.target.closest("#lista_opcoes_discos li")) {

        const li = e.target.closest("li");

        document.getElementById("select_value_disco").value = li.dataset.value;

        document.getElementById("select_display_discos").innerHTML =
            li.textContent + " <span class='seta'>&#9660;</span>";

        document.getElementById("lista_opcoes_discos").classList.add("hidden");
        atualizarGrafico();
        return;
    }

    if (!e.target.closest(".select-grafico")) {
        document.getElementById("lista_opcoes").classList.add("hidden");
        document.getElementById("lista_opcoes_discos").classList.add("hidden");
    }
});


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

            // Primeira renderização
            atualizarGrafico();

            // Seus outros métodos continuam funcionando:
            definirStatusOperacao(dados);
            DiscosComMaiorRiscoDeFalha(dados);
            puxarQuantidadeAlertaPorServidor();
            DiscosQueRecebemMaisRequisicoes(dados);
            kpiComparativaAlertas();
            ListagemDosDiscosEmAlerta(dados);
        })
        .catch(err => console.error("Erro:", err));
};
