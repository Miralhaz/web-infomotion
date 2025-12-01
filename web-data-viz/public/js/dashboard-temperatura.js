// pegando 'valores que estão no select personalizado de hora 
var display = document.getElementById('select_display');
var lista_opcoes = document.getElementById('lista_opcoes');
var input_escondido = document.getElementById('select_value');

// função para habilitar a animação de abrir menu
display.onclick = function () {
  lista_opcoes.classList.toggle('visible');
  display.classList.toggle('open');
}

var lista_de_li_opcoes = lista_opcoes.getElementsByTagName('li');
// lista para verificar cada uma das opções dentro do select 
for (var i = 0; i < lista_de_li_opcoes.length; i++) {
  var item = lista_de_li_opcoes[i];

  item.onclick = function () {
    var value = this.getAttribute('data-value');
    var text = this.textContent.trim();

    display.firstChild.nodeValue = text;
    input_escondido.value = value;

    const selectServidor = document.getElementById('servidores');
    const idServidor = selectServidor.value;

    if (idServidor && idServidor !== 'escolha_op') {
      recarregarGraficoLinhasComValoresAtuais(idServidor);
    }

    lista_opcoes.classList.remove('visible');
    display.classList.remove('open');
  };
}

// mesma coisa do que o de cima porém para os componentes (CPU / Disco)
var display_componentes = document.getElementById('select_display_componentes');
var lista_opcoes_componentes = document.getElementById('lista_opcoes_componentes');
var input_escondido_componente = document.getElementById('select_value_componentes');

display_componentes.onclick = function () {
  lista_opcoes_componentes.classList.toggle('visible');
  display_componentes.classList.toggle('open');
}

var lista_de_li_opcoes_componentes = lista_opcoes_componentes.getElementsByTagName('li');

for (var i = 0; i < lista_de_li_opcoes_componentes.length; i++) {
  var item = lista_de_li_opcoes_componentes[i];

  item.onclick = function () {
    var value = this.getAttribute('data-value');
    var text = this.textContent.trim();

    display_componentes.firstChild.nodeValue = text;
    input_escondido_componente.value = value;

    const selectServidor = document.getElementById('servidores');
    const idServidor = selectServidor.value;

    if (idServidor && idServidor !== 'escolha_op') {
      recarregarGraficoLinhasComValoresAtuais(idServidor);
    }

    lista_opcoes_componentes.classList.remove('visible');
    display_componentes.classList.remove('open');
  };
}

// fecha a lista de opções ao clicar fora do select
document.onclick = function (e) {
  if (!display.contains(e.target) && !lista_opcoes.contains(e.target)) {
    lista_opcoes.classList.remove('visible');
    display.classList.remove('open');
  }
  if (!display_componentes.contains(e.target) && !lista_opcoes_componentes.contains(e.target)) {
    lista_opcoes_componentes.classList.remove('visible');
    display_componentes.classList.remove('open');
  }
}

// função caso, no select da esquerda, o usuário queira trocar para outra dashboard
function trocarDePagina() {
  var select_dashboards = document.getElementById('dash');
  var select_selecionado = select_dashboards.value;

  if (select_selecionado !== '#' && select_selecionado !== '') {
    window.location.href = select_selecionado;
  }
}

function buscarParametros(idServidor) {

  fetch(`/dashboardTemperatura/buscarParametro/${idServidor}`)
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

function listarServidores() {
  let idEmpresa = sessionStorage.ID_EMPRESA;

  fetch(`/servidores/listarServidores/${idEmpresa}`)
    .then(function (resposta) {
      if (resposta.ok) {
        resposta.json().then(function (dados) {
          console.log("✅ Servidores carregados:", dados);

          const select = document.getElementById('servidores');
          let opcoes = `<option value="escolha_op">Escolha um servidor</option>`;

          for (let i = 0; i < dados.length; i++) {
            opcoes += `<option value="${dados[i].idServidor}">${dados[i].apelido}</option>`;
          }

          select.innerHTML = opcoes;

          const idServidorSelecionadoAnteriormente = sessionStorage.getItem("ID_SERVIDOR_SELECIONADO");

          if (idServidorSelecionadoAnteriormente) {
            select.value = idServidorSelecionadoAnteriormente;
            recarregarTodosGraficosComServidorSelecionado();
          }

        });
      } else {
        console.error("❌ Erro ao listar servidores");
      }
    })
    .catch(function (erro) {
      console.error("❌ Erro:", erro);
    });
}

// apenas para que, quando se troca um servidor pelo select de servidores, recarregue 
// com as informações daquele servidor selecionado
document.getElementById('servidores').addEventListener('change', () => {
  recarregarTodosGraficosComServidorSelecionado();
});

// função que recarrega a dashboard com dados daquele servidor em específico
function recarregarTodosGraficosComServidorSelecionado() {
  const selectServidor = document.getElementById('servidores');
  const idServidor = selectServidor.value;

  if (idServidor === 'escolha_op') {
    console.log('⚠️ Nenhum servidor selecionado');
    limparListaProcessos();
    return;
  }

  const nomeServidor = selectServidor.options[selectServidor.selectedIndex].text;
  const componenteAtual = document.getElementById('select_value_componentes').value;

  console.log(`🔄 Carregando dados do servidor ${idServidor}...`);

  buscarParametros(idServidor);
  recarregarGraficoLinhasComValoresAtuais(idServidor);
  carregarDadosDispersao(idServidor, componenteAtual, nomeServidor);
  carregarTop5Processos(idServidor);
}

function recarregarGraficoLinhasComValoresAtuais(idServidor) {
  const componenteAtual = document.getElementById('select_value_componentes').value;
  const periodoAtual = document.getElementById('select_value').value;

  const selectServidor = document.getElementById('servidores');
  const nomeServidor = selectServidor.options[selectServidor.selectedIndex].text;

  carregarEAtualizarGraficoLinhas(componenteAtual, periodoAtual, idServidor, nomeServidor);
  carregarDadosDispersao(idServidor, componenteAtual, nomeServidor);
}

async function carregarDadosCpu(idServidor, limiteMaximo) {
  try {
    // Busca arquivo de 7 dias para pegar o último registro
    const url = `/dados/cpu/${idServidor}/7_dias.json`;
    const resposta = await fetch(url);
    const dados = await resposta.json();

    if (!Array.isArray(dados) || dados.length === 0) {
      console.log('⚠️ Sem dados de CPU');
      return;
    }

    // Pega o último registro (mais recente)
    const ultimoRegistro = dados[dados.length - 1];
    const tempCpu = parseFloat(ultimoRegistro.temperatura_cpu);
    const usoCpu = parseFloat(ultimoRegistro.cpu_uso);

    graficoGaugeCPUTemperatura(tempCpu, limiteMaximo);
    atualizarKPIsCpu(tempCpu, usoCpu, limiteMaximo);

    console.log(`Dados CPU carregados: ${tempCpu}°C, ${usoCpu}%`);

  } catch (erro) {
    console.error('Erro ao carregar dados CPU:', erro);
  }
}

function atualizarKPIsCpu(tempCPU, usoCPU) {

  const eficienciaContainerCPU = document.querySelector('.kpi3 .container-eficiencia:nth-child(1)');

  if (eficienciaContainerCPU) {
    const infoElement = eficienciaContainerCPU.querySelector('.info-eficiencia');
    const numeroElement = eficienciaContainerCPU.querySelector('.numero-eficiencia');
    const statusElement = eficienciaContainerCPU.querySelector('.status');

    const eficiencia = tempCPU / (usoCPU || 1);
    const status = calcularStatus(eficiencia);

    if (infoElement && numeroElement && statusElement) {
      infoElement.textContent = `${tempCPU}°C • ${usoCPU}% uso`;
      numeroElement.innerHTML = `${eficiencia.toFixed(2)} <span class="unidade-eficiencia"> °C/% </span>`;
      numeroElement.style.color = status.cor;
      statusElement.textContent = status.texto;
      statusElement.style.color = status.cor;
    }
  }
}

async function carregarDadosDisco(idServidor, limiteMaximo) {
  try {
    const url = `/dados/disco/${idServidor}/7_dias.json`;
    const resposta = await fetch(url);
    const dados = await resposta.json();

    if (!Array.isArray(dados) || dados.length === 0) {
      console.log('⚠️ Sem dados de Disco');
      return;
    }

    const ultimoRegistro = dados[dados.length - 1];
    const tempDisco = parseFloat(ultimoRegistro.temperatura_disco);
    const usoDisco = parseFloat(ultimoRegistro.disco_uso);

    graficoGaugeTemperaturaDisco(tempDisco, limiteMaximo);
    atualizarKPIsDisco(tempDisco, usoDisco, limiteMaximo);

    console.log(`Dados Disco carregados: ${tempDisco}°C, ${usoDisco}%`);

  } catch (erro) {
    console.error('Erro ao carregar dados Disco:', erro);
  }
}

function atualizarKPIsDisco(tempDisco) {

  const eficienciaContainerDisco = document.querySelector('.kpi3 .container-eficiencia:nth-child(2)');

  if (eficienciaContainerDisco) {
    const infoElement = eficienciaContainerDisco.querySelector('.info-eficiencia');
    const numeroElement = eficienciaContainerDisco.querySelector('.numero-eficiencia');
    const statusElement = eficienciaContainerDisco.querySelector('.status');

    const eficiencia = tempDisco
    const status = calcularStatusDisco(eficiencia);

    if (infoElement && numeroElement && statusElement) {
      numeroElement.innerHTML = `${eficiencia.toFixed(2)} <span class="unidade-eficiencia"> °C </span>`;
      numeroElement.style.color = status.cor;
      statusElement.textContent = status.texto;
      statusElement.style.color = status.cor;
    }
  }
}

// função de calcular status apenas de CPU (kpi de eficiência)
function calcularStatus(eficiencia) {
  if (eficiencia < 1.0) {
    return { texto: 'Excelente', cor: '#4caf50' };
  } else if (eficiencia >= 1.0 && eficiencia <= 1.5) {
    return { texto: 'Adequado', cor: '#8bc34a' };
  } else if (eficiencia > 1.5 && eficiencia <= 2.0) {
    return { texto: 'Atenção', cor: '#ffc107' };
  } else {
    return { texto: 'Crítico', cor: '#f44336' };
  }
}

// função de calcular o status atual do disco (kpi de eficiencia)
function calcularStatusDisco(eficiencia) {
  if (eficiencia < 45) {
    return { texto: 'Excelente', cor: '#4caf50' };
  } else if (eficiencia >= 45 && eficiencia <= 55) {
    return { texto: 'Adequado', cor: '#8bc34a' };
  } else if (eficiencia > 55 && eficiencia <= 65) {
    return { texto: 'Atenção', cor: '#ffc107' };
  } else {
    return { texto: 'Crítico', cor: '#f44336' };
  }
}

// carregar e atualizar grafico de dispersão (antes era de linhas)
async function carregarEAtualizarGraficoLinhas(componente, periodo, idServidor, nomeServidor) {
  try {
    let nomeArquivo;
    let tituloPeriodo;

    if (periodo === '1hora') {
      nomeArquivo = 'ultima_hora.json';
      tituloPeriodo = '(na última hora)';
    } else if (periodo === '24horas') {
      nomeArquivo = '24_horas.json';
      tituloPeriodo = '(últimas 24 horas)';
    } else if (periodo === 'dias') {
      nomeArquivo = '7_dias.json';
      tituloPeriodo = '(últimos 7 dias)';
    } else {
      nomeArquivo = 'ultima_hora.json';
      tituloPeriodo = '(na última hora)';
    }

    const url = `/dados/${componente}/${idServidor}/${nomeArquivo}`;
    console.log(`📥 Buscando: ${url}`);

    const resposta = await fetch(url);
    const dados = await resposta.json();

    if (!Array.isArray(dados) || dados.length === 0) {
      console.log('Sem dados para o gráfico de linhas');
      return;
    }

    let temperaturas, usos, tituloGrafico;

    if (componente === 'cpu') {
      temperaturas = dados.map(d => parseFloat(d.temperatura_cpu));
      usos = dados.map(d => parseFloat(d.cpu_uso));
      tituloGrafico = `Uso CPU X Temperatura CPU ${tituloPeriodo}`;
    } else {
      temperaturas = dados.map(d => parseFloat(d.temperatura_disco));
      usos = dados.map(d => parseFloat(d.disco_uso));
      tituloGrafico = `Uso Disco X Temperatura Disco ${tituloPeriodo}`;
    }

    document.querySelector('.grafico-linha-hist .titulo p').textContent = tituloGrafico + ':';

    graficoLinhaHist(temperaturas, usos, componente);

    console.log(`Gráfico de linhas atualizado: ${dados.length} registros`);

  } catch (erro) {
    console.error('Erro ao carregar gráfico de linhas:', erro);
  }
}

// funcao de carregar dados do grafico de dispersao
async function carregarDadosDispersao(idServidor, componente, nomeServidor) {
  try {
    // busca url com JSON de 7 dias relacionado a certo servidor 
    const url = `/dados/${componente}/${idServidor}/7_dias.json`;
    const resposta = await fetch(url);
    const dados = await resposta.json();

    if (!Array.isArray(dados) || dados.length === 0) {
      console.log('Sem dados para dispersão');
      return;
    }

    let temperaturas;
    if (componente === 'cpu') {
      temperaturas = dados.map(d => parseFloat(d.temperatura_cpu));
    } else {
      temperaturas = dados.map(d => parseFloat(d.temperatura_disco));
    }

    const intervalos = criarIntervalosTemperatura(temperaturas);

    graficoDispersao(intervalos, componente, nomeServidor);

    console.log(`Dispersão carregada: ${dados.length} registros`);

  } catch (erro) {
    console.error('Erro ao carregar dispersão:', erro);
  }
}

// função para criar os intervalos de temperatura do gráfico de dispersão
function criarIntervalosTemperatura(temperaturas) {
  const intervalos = [
    { min: 0, max: 40, label: '0-40°C', count: 0 }, // 0-39
    { min: 40, max: 50, label: '40-50°C', count: 0 }, // 40-49
    { min: 50, max: 60, label: '50-60°C', count: 0 }, // 50-59
    { min: 60, max: 70, label: '60-70°C', count: 0 }, // 60-69
    { min: 70, max: 80, label: '70-80°C', count: 0 }, // 70-79
    { min: 80, max: 100, label: '80-100°C', count: 0 } // 80-100
  ];

  // para cada temperatura registrada do JSON, realizar um for que assim irá validar e verificar
  // qual intervalo de temperatura pertence aquela temperatura registrada, e assim da break para parar esse for para 
  // aquela captura
  temperaturas.forEach(temp => {
    for (let intervalo of intervalos) {
      if (temp >= intervalo.min && temp < intervalo.max) {
        intervalo.count++;
        break;
      }
    }
  });
  // retorna os intervalos e a quantia de temperatura em cada um
  return intervalos;
}

// função para carregar o top 5 processos do servidor em específico
async function carregarTop5Processos(idServidor) {
  try {
    // url para pegar o JSON de top 5 processos de cada servidor 
    const url = '/dados/processos/processosTop5.json';
    const resposta = await fetch(url);
    const dados = await resposta.json();

    if (!Array.isArray(dados) || dados.length === 0) {
      console.log('Sem dados de processos');
      limparListaProcessos();
      return;
    }

    // filtragem para ver qual top 5 de processos pertence ao idServidor atual
    const processosFiltrados = dados.filter(d => d.fk_servidor == idServidor);

    // se não tiver, apenas não exibe no front-end
    if (processosFiltrados.length === 0) {
      console.log(`Nenhum processo para servidor ${idServidor}`);
      limparListaProcessos();
      return;
    }

    // aqui é uma variável onde pega os processos filtrados por servidor
    // ordena através do .sort() do maior ao menor gasto de CPU e pega apenas 5
    const top5 = processosFiltrados
      .sort((a, b) => parseFloat(b.uso_cpu) - parseFloat(a.uso_cpu))
      .slice(0, 5);

    // atualiza o top 5 após essa filtragem
    atualizarListaProcessos(top5);

    console.log(`Top 5 processos carregados`);

  } catch (erro) {
    console.error('Erro ao carregar processos:', erro);
    limparListaProcessos();
  }
}

function atualizarListaProcessos(processos) {
  const lista = document.getElementById('processosLista');

  if (!lista) {
    console.error('❌ Elemento processosLista não encontrado');
    return;
  }

  lista.innerHTML = '';

  processos.forEach((processo, index) => {
    const cpuUso = parseFloat(processo.uso_cpu).toFixed(1);

    const item = document.createElement('div');
    item.className = 'processo-item';

    if (index === 0) {
      item.classList.add('top-1');
    }

    item.innerHTML = `
      <span class="col-nome" title="${processo.nome_processo}">${processo.nome_processo}</span>
      <span class="col-cpu">${cpuUso}%</span>
    `;

    lista.appendChild(item);
  });
}

function limparListaProcessos() {
  const lista = document.getElementById('processosLista');

  if (lista) {
    lista.innerHTML = `
      <div class="processo-item" style="justify-content: center; color: #999;">
        <span>Nenhum processo encontrado</span>
      </div>
    `;
  }
}

function graficoGaugeCPUTemperatura(temperaturaAtual, limiteMaximo) {
  const restante = (100 - temperaturaAtual);
  const corMinima = 120;
  const corMaxima = 0;
  let hueFinal;

  if (temperaturaAtual >= limiteMaximo) {
    hueFinal = corMaxima;
  } else {
    const pontoInicialMudanca = 60;

    if (temperaturaAtual < pontoInicialMudanca) {
      hueFinal = corMinima;
    } else {
      const rangeUso = limiteMaximo - pontoInicialMudanca;
      const rangeCor = corMinima - corMaxima;
      const fator = (temperaturaAtual - pontoInicialMudanca) / rangeUso;
      hueFinal = corMinima - (fator * rangeCor);
    }
  }

  const corUsada = `hsl(${hueFinal.toFixed(0)}, 80%, 50%)`;
  const corRestante = '#c0c0c0ff';

  const textCenter = {
    id: 'textCenter',
    beforeDatasetsDraw(chart, args, pluginOptions) {
      const { ctx, chartArea: { top, bottom, width, height } } = chart;
      ctx.save();

      const text = `${temperaturaAtual}ºC`;
      const fontSize = (height / 70).toFixed(2);
      const textX = width / 1.98;
      const textY = (bottom + top) / 1.4;

      ctx.font = `bold ${fontSize}em sans-serif`;
      ctx.fillStyle = corUsada;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, textX, textY);

      ctx.restore();
    }
  };

  const config = {
    type: 'doughnut',
    data: {
      labels: [' Atual', ' Ociosa'],
      datasets: [{
        label: 'Métrica Atual',
        data: [temperaturaAtual, restante],
        backgroundColor: [corUsada, corRestante],
        borderColor: [corUsada, corRestante],
        borderWidth: 1
      }]
    },
    options: {
      rotation: -90,
      circumference: 180,
      cutout: '75%',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => context.label + ': ' + context.formattedValue + 'ºC'
          }
        }
      },
      elements: { arc: { hoverOffset: 0 } }
    },
    plugins: [textCenter]
  };

  const canvas = document.getElementById('gaugeCPUTempChart');
  if (canvas) {
    if (Chart.getChart('gaugeCPUTempChart')) {
      Chart.getChart('gaugeCPUTempChart').destroy();
    }
    new Chart(canvas, config);
  }
}

function graficoGaugeTemperaturaDisco(temperaturaAtual, limiteMaximo) {
  const restante = (100 - temperaturaAtual);
  const corMinima = 120;
  const corMaxima = 0;
  let hueFinal;

  if (temperaturaAtual >= limiteMaximo) {
    hueFinal = corMaxima;
  } else {
    const pontoInicialMudanca = 60;

    if (temperaturaAtual < pontoInicialMudanca) {
      hueFinal = corMinima;
    } else {
      const rangeUso = limiteMaximo - pontoInicialMudanca;
      const rangeCor = corMinima - corMaxima;
      const fator = (temperaturaAtual - pontoInicialMudanca) / rangeUso;
      hueFinal = corMinima - (fator * rangeCor);
    }
  }

  const corUsada = `hsl(${hueFinal.toFixed(0)}, 80%, 50%)`;
  const corRestante = '#c0c0c0ff';

  const textCenter = {
    id: 'textCenter',
    beforeDatasetsDraw(chart, args, pluginOptions) {
      const { ctx, chartArea: { top, bottom, width, height } } = chart;
      ctx.save();

      const text = `${temperaturaAtual}ºC`;
      const fontSize = (height / 70).toFixed(2);
      const textX = width / 1.98;
      const textY = (bottom + top) / 1.4;

      ctx.font = `bold ${fontSize}em sans-serif`;
      ctx.fillStyle = corUsada;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, textX, textY);

      ctx.restore();
    }
  };

  const config = {
    type: 'doughnut',
    data: {
      labels: [' Atual', ' Ocioso'],
      datasets: [{
        label: 'Métrica Atual',
        data: [temperaturaAtual, restante],
        backgroundColor: [corUsada, corRestante],
        borderColor: [corUsada, corRestante],
        borderWidth: 1
      }]
    },
    options: {
      rotation: -90,
      circumference: 180,
      cutout: '75%',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => context.label + ': ' + context.formattedValue + 'ºC'
          }
        }
      },
      elements: { arc: { hoverOffset: 0 } }
    },
    plugins: [textCenter]
  };

  const canvas = document.getElementById('gaugeDiscoTempChart');
  if (canvas) {
    if (Chart.getChart('gaugeDiscoTempChart')) {
      Chart.getChart('gaugeDiscoTempChart').destroy();
    }
    new Chart(canvas, config);
  }
}

function graficoLinhaHist(temperaturas, uso, componente) {

  if (Chart.getChart('lineChart')) {
    Chart.getChart('lineChart').destroy();
  }

  // log apenas para ver o array de temperaturas e uso que vieram do JSON
  console.log(temperaturas, uso)

  const labelUso = componente === 'cpu' ? 'Uso da CPU (%)' : 'Uso do Disco (%)';

  // novo array que mapeia os pontos que vieram de temperatura e uso
  // cada temperatura que ta no índice 'i' ela tem um uso específico
  // assim podendo ver onde o ponto se encaixa no gráfico
  const pontos = temperaturas.map((temp, i) => ({
    x: uso[i],
    y: temp
  }));

  // cálculo das médias
    const n = pontos.length;

    // conta para descobrir a media de pontos x e y
    let somaX = 0;
    let somaY = 0;

    for(const p of pontos){
      somaX += p.x;
      somaY += p.y;
    }

    const mediaX = somaX / n;
    const mediaY = somaY / n;
  // fim da conta
  
  // cálculo da inclinação da linha de regressão linear
    // conta do numerador da fórmula de regressão linear (soma dos produtos)
    let numerador = 0;

    for(const p of pontos){
      numerador += (p.x - mediaX) * (p.y - mediaY);
    }
    // fim da conta

    // conta do denominador da fórmula de regressão linear (soma dos quadrados)
    let denominador = 0;

    for(const p of pontos){
      denominador += (p.x - mediaX) ** 2;
    }
    // fim da conta

    const inclinacao = numerador / denominador;
  // fim do cálculo da inclinação

  // cálculo do intercepto (a da função afim de y = a + bx)
    const intercepto = mediaY - inclinacao * mediaX;
  // fim do cálculo do intercepto


  // cálculo do R²
    let somaTotalQuadrados = 0;
    
    for (const p of pontos) {
      somaTotalQuadrados += (p.y - mediaY) ** 2;
    }

    let somaTotalResiduos = 0;

    for (const p of pontos) {
      const yEstimado = inclinacao * p.x + intercepto;
      somaTotalResiduos += (p.y - yEstimado) ** 2;
    }

    const rQuadrado = 1 - (somaTotalResiduos / somaTotalQuadrados);
  // fim do cálculo do R²

  document.getElementById('equacao_regressao').textContent = 
    `y = ${intercepto.toFixed(3)} + ${inclinacao.toFixed(3)}x`;
  document.getElementById('r_quadrado').textContent = 
    `R² = ${rQuadrado.toFixed(2)}`;

  const minX = Math.min(...uso);
  const maxX = Math.max(...uso);
  const linhaRegressao = [
    { x: minX, y: inclinacao * minX + intercepto },
    { x: maxX, y: inclinacao * maxX + intercepto }
  ];

  const configuracao = {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: 'Temperatura x Uso',
          data: pontos,
          backgroundColor: '#8c6f45',
          pointRadius: 5
        },
        {
          label: 'Linha de tendência',
          data: linhaRegressao,
          type: 'line',
          borderColor: '#e6e1c8',
          borderWidth: 2,
          fill: false,
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        title: {
          display: true,
          text: 'Dispersão: Temperatura x Uso',
          color: 'white',
          font: { size: 16 }
        }
      },
      scales: {
        x: {
          min: 0,
          max: 100,
          title: { display: true, text: labelUso, color: 'white' },
          ticks: { color: 'white' }
        },
        y: {
          min: 0,
          max: 140,
          title: { display: true, text: 'Temperatura (°C)', color: 'white' },
          ticks: { color: 'white' }
        }
      }
    }
  };


  const meuGrafico = new Chart(
    document.getElementById('lineChart'),
    configuracao
  );
}

function graficoDispersao(intervalos, componente, nomeServidor) {
  if (Chart.getChart('histogramChart')) {
    Chart.getChart('histogramChart').destroy();
  }

  const labels = intervalos.map(i => i.label);
  const dados = intervalos.map(i => i.count);

  const nomeComponente = componente === 'cpu' ? 'CPU' : 'Disco';
  const titulo = `Histograma Temperatura ${nomeComponente} - ${nomeServidor}`;

  document.querySelector('.grafico-dispersao-temperatura .titulo p').textContent = titulo + ':';


  const dadosDoHistograma = {
    labels: labels,
    datasets: [{
      data: dados,
      backgroundColor: componente === 'cpu'
        ? '#b89360'
        : '#fffae6',
      borderColor: componente === 'cpu'
        ? '#b89360'
        : '#fffae6',
      borderWidth: 1
    }]
  };

  const configuracao = {
    type: 'bar',
    data: dadosDoHistograma,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Frequência',
            color: 'white',
            font: {
              size: 14
            }
          },
          ticks: {
            color: 'white',
            precision: 0
          }
        },
        x: {
          title: {
            display: true,
            text: 'Temperatura (°C)',
            color: 'white',
            font: {
              size: 14
            }
          },
          ticks: {
            color: 'white'
          }
        }
      }
    }
  };

  const meuGrafico = new Chart(
    document.getElementById('histogramChart'),
    configuracao
  );
}

function popUpInfo() {
  Swal.fire({
    title: `<strong>Informações sobre Eficiência Térmica</strong>`,
    icon: false,
    html: `
      
          <div>
            <div style="text-align: left;">
              <p>A eficiência térmica da CPU representa o equilíbrio entre o desempenho do processador e o calor gerado durante seu funcionamento. Quanto menor for o aumento de temperatura em relação ao uso percentual da CPU, mais eficiente é o sistema de resfriamento.</p>
              <br>
              <p>Esse indicador é útil para avaliar se o computador está operando de forma saudável, mesmo sob alta carga de trabalho. Uma boa eficiência térmica significa que o processador consegue manter temperaturas seguras sem comprometer o desempenho.</p>
              <br>
              <p>Classificações qualitativas como "Excelente", "Bom" ou "Crítico" ajudam a interpretar rapidamente se o sistema está dentro dos padrões ideais ou se há necessidade de ajustes na ventilação ou refrigeração.</p>
            </div>
          </div>
      
    `,
    showCloseButton: true,
    showConfirmButton: false, // Escondemos o botão "OK" padrão
    focusConfirm: false
  });
}