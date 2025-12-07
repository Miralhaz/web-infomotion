Chart.register(ChartDataLabels);

let tempo = 168
if (sessionStorage.getItem('TEMPO_SELECIONADO')) {
  tempo = sessionStorage.getItem('TEMPO_SELECIONADO')
} 

const JIRA_BASE_URL = "https://sentinela-grupo-3.atlassian.net";
const API_EMAIL = "lucas.silva051@sptech.school";
const API_TOKEN = '';
const PROJECT_KEY = "INF";

let idServidorSelecionado = sessionStorage.getItem('ID_SERVIDOR_SELECIONADO')

let labelsData = []
let dadosPacotesEnviados = []
let dadosPacotesRecebidos = []
let dadosUpload = []
let dadosDownload = []
let dadosPacketLoss = []
let parametroPacotesRecebidos = 20000
let parametroPacotesEnviados = 20000
let parametroPacketLoss = (parametroPacotesRecebidos / parametroPacotesEnviados) * 0.01
let parametro_down = 50000
let parametro_up = 0

let unidadeMedidaDown = '...'
let unidadeMedidaUp = '...'


let dadosConexoes = []

function kpiInternet()  {

      if (Chart.getChart("chartLeft")) {
        Chart.getChart("chartLeft").destroy();
      }

      const leftCtx = document.getElementById('chartLeft').getContext('2d');
      const rightCtx = document.getElementById('chartRight').getContext('2d');

      
      const leftConfig = {
        type: 'bar',
        data: {
          labels: ['MAX', 'MÉD', 'MIN'],
          datasets: [{
            label: 'Métricas',
            data: dadosUpload,
            backgroundColor: ['#fff','#fffae6','#e6e1c8']
          }]
        },
        options: {
          indexAxis: 'y', 
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false },
            datalabels: {
              color: (context) => {
                const value = context.dataset.data[context.dataIndex];
                console.log('value', value * 1000000);
                console.log('parametro_up', parametro_up);
                console.log('true or false', Boolean(value * 1000000 < parametro_down));
                
                
                if (value * 1000000 < parametro_up ) {
                  return 'red'
                } else if (value * 1000000 < parametro_up * 2){
                  return '#f59e0b'
                } else return 'green'
              }, 

              font: {
                weight: 'bold',
                size: 14
              },
              
              formatter: (value, context) => {
                return `${value.toFixed(1)} ${unidadeMedidaUp}`; 
              },
              anchor: 'center', 
              align: 'right',  
              offset: -10,    
            }
          },
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
            data: dadosDownload,
            backgroundColor: ['#d9b98a','#b89360','#8c6f45']
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false },
          datalabels: {
              color: (context) => {
                const value = context.dataset.data[context.dataIndex];
                console.log('value', value * 1000000);
                console.log('parametro_down', parametro_down, 'a');
                console.log('true or false', Boolean(value * 1000000 < parametro_down));
                
                
                
                if (value * 1000000 < parametro_down) {
                  return 'red'
                } else if ( value * 1000000 < parametro_down   * 2){
                  return 'yellow'
                } else return 'green'
              }, 
              font: {
                weight: 'bold',
                size: 14
              },
              
              formatter: (value, context) => {
              
                return `${value.toFixed(1)} ${unidadeMedidaDown}`; 
              },
              
              anchor: 'center', 
              align: 'right',  
              offset: -10,    
            }
        },
          scales: {
            x: { beginAtZero: true },
            y: { ticks: { color: '#fff' } }
          }
        }
      };

  new Chart(leftCtx, leftConfig);
  new Chart(rightCtx, rightConfig);
};


function graficoLinhaPrincipal() {

  if (Chart.getChart("graficoLinhaPrincipal")) {
    Chart.getChart("graficoLinhaPrincipal").destroy();
  }

  const mainCtx = document.getElementById('graficoLinhaPrincipal').getContext('2d');

  const dataMain = {
    labels: labelsData,
    datasets: [
      {
        label: 'Pacotes enviados',
        data: dadosPacotesEnviados,

        backgroundColor: (context) => {
          const valor = context.raw;
          if (valor > (parametroPacotesEnviados * 2)) return '#0cff03ff';
          else if (valor > parametroPacotesEnviados) return '#fffb00ff';
          return 'red';
        },
        borderColor: 'fffae6',
        segment: {
          borderColor: (ctx) => {

            if (!ctx.p1 || !ctx.p1.parsed) return 'gray';
            const valor = ctx.p1.parsed.y;
            if (valor > parametroPacotesEnviados * 2) {
              return '#0cff03ff';
            } else if (valor > parametroPacotesEnviados) {
              return '#fffb00ff';
            } else {
              return 'red';
            }
          },
        },
        borderDash: [20, 5],
        borderWidth: 2
      },
      {
        label: 'Pacotes recebidos',
        data: dadosPacotesRecebidos,
        backgroundColor: (context) => {
          const valor = context.raw;
          if (valor > (parametroPacotesRecebidos * 2)) return '#0cff03ff';
          else if (valor > parametroPacotesRecebidos) return '#fffb00ff';
          return 'red';
        },
        borderColor: 'fffae6',
        segment: {
          borderColor: (ctx) => {

            if (!ctx.p1 || !ctx.p1.parsed) return 'gray';
            const valor = ctx.p1.parsed.y;
            if (valor > (parametroPacotesRecebidos * 2)) {
              return '#0cff03ff';
            } else if (valor > parametroPacotesRecebidos) {
              return '#fffb00ff';
            } else {
              return 'red';
            }
          },
        },
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
            color: '#E2E1DE',
            font: { size: 12 },
            boxWidth: 24,
            padding: 8,
            generateLabels: function (chart) {
              const defaults = Chart.defaults.plugins.legend.labels.generateLabels(chart);
              return defaults.map(item => ({ ...item, fillStyle: 'transparent' }));
            }
          }
        },
        title: { display: false },
        tooltip: {
          titleFont: { size: 11 },
          bodyFont: { size: 11 }
        },
        datalabels: {
          display: false
        }
      },
      scales: {
        x: {
          ticks: { display: true }
        },
        y: {
          ticks: { color: '#E2E1DE', font: { size: 10 } }
        }
      }
    },
  };

  new Chart(mainCtx, configMainLineChart)

};


function graficoLinhaSecundario() {

  if (Chart.getChart("graficoLinhaSecundario")) {
    Chart.getChart("graficoLinhaSecundario").destroy();
  }

  const SecondCtx = document.getElementById('graficoLinhaSecundario').getContext('2d');

  const dataSecond = {
    labels: labelsData,
    datasets: [
      {
        label: 'Quantidade de pacotes perdidos',
        data: dadosPacketLoss,
        borderColor: '#ccc',
        backgroundColor: (context) => {
          const valor = context.raw;
          const valorCorrespondente = ((dadosPacotesEnviados[context.dataIndex] + dadosPacotesRecebidos[context.dataIndex]) * 0.01);
          const parametroCorrespondente = valorCorrespondente * 0.01

          if (valor > parametroCorrespondente) return 'red';
          else if (valor > (parametroCorrespondente * 2)) return '#fffb00ff';
          return '#0cff03ff';
        },
        segment: {
          borderColor: (ctx) => {
            const valorCorrespondente = ((dadosPacotesEnviados[ctx.p1DataIndex] + dadosPacotesRecebidos[ctx.p1DataIndex]) * 0.01);
            const parametroCorrespondente = valorCorrespondente * 0.01
            if (!ctx.p1 || !ctx.p1.parsed) return 'gray';
            const valor = ctx.p1.parsed.y;
            if (valor > parametroCorrespondente) {
              return 'red';
            } else if (valor > (parametroCorrespondente * 2)) {
              return '#fffb00ff';
            } else {
              return '#0cff03ff';
            }
          },
        },
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
          labels: { font: { size: 11 }, color: '#E2E1DE' } // menor legenda
        },
        title: { display: false },
        datalabels: {
          display: false
        }
      },
      scales: {
        x: { display: true },
        y: { ticks: { font: { size: 9 }, color: '#E2E1DE' } }
      }
    },
  };

  new Chart(SecondCtx, configSecondLineChart)

};

function listarServidores() {

  let ID_USUARIO = sessionStorage.getItem('ID_USUARIO');

  fetch(`/servidores/listarServidoresPorUsuario/${ID_USUARIO}`)
    .then(function (resposta) {

      if (resposta.ok) {
        resposta.json().then(function (resposta) {

          const select = document.getElementById('select_servidores');

          let frase = ''
          let servidorAtual;

          for (let i = 0; i < resposta.length; i++) {
            if (resposta[i].id === Number(idServidorSelecionado)) {
              servidorAtual = resposta[i].apelido
              break
            }
          }

          if (servidorAtual) {
            frase += `<option value="" selected disabled>${servidorAtual}</option>`;
          } else {
            frase += `<option value="" selected disabled>Selecione o servidor</option>`;
          }

          for (let i = 0; i < resposta.length; i++) {
            if (String(resposta[i].id) !== idServidorSelecionado) {
              frase += `
                        <option value="${resposta[i].id}" data-id="${resposta[i].id}">${resposta[i].apelido}</option>
                        `;
            }
          }

          select.innerHTML = frase;

        });

      } else {
        throw "Houve um erro ao tentar listar os servidores!";
      }
    })

    .catch(function (resposta) {
      console.log(`#ERRO: ${resposta}`);
    });
}

function atualizarDadosServidorSelecionado() {
  const select = document.getElementById('select_servidores');

  if (select) {
    select.addEventListener('change', function () {

      const novoIdServidor = this.value;

      sessionStorage.setItem('ID_SERVIDOR_SELECIONADO', novoIdServidor);

      idServidorSelecionado = novoIdServidor

      window.location.reload()
      
    })
  }
}

async function carregarDadosRede() {

    let nomeArquivoRede = `jsonRede_${idServidorSelecionado}_${tempo}.json`;
    if (idServidorSelecionado == 5) {
      nomeArquivoRede = `jsonRede_${tempo}.json`
    }
    console.log('nomeArquivoRede', nomeArquivoRede);
    

  const resposta = await fetch(`/dashboardRede/rede/${nomeArquivoRede}`);
  if (!resposta.ok) {
    const txt = await resposta.text();
    console.error('Erro ao carregar arquivo:', resposta.status, txt);
    return; // aborta
  }
  const data = await resposta.json();

  if (!Array.isArray(data) || data.length === 0) return;


  carregarGraficosLinha(data)
}

async function carregarDadosConexao() {
  const nomeArquivoRede = `conexoes${idServidorSelecionado}.json`;

  const resposta = await fetch(`/dashboardRede/conexoes/${nomeArquivoRede}`);
  if (!resposta.ok) {
    const txt = await resposta.text();
    console.error('Erro ao carregar arquivo:', resposta.status, txt);
    return; // aborta
  }
  const data = await resposta.json();

  if (!Array.isArray(data) || data.length === 0) return;

  dadosConexoes = data
  carregarTabelaConexoes(data)
}

function carregarGraficosLinha(dados) {
  console.log('dados', dados);
  

  const tamanhoVetor = dados.length
  let downloadSoma = 0
  let uploadSoma = 0

  let download = {
    'Pico': 0,
    'Media': 0,
    'Minimo': 0
  }
  let upload = {
    'Pico': 0,
    'Media': 0,
    'Minimo': 0
  }

  parametroPacotesEnviados = dados[0].parametroPacotesEnviados
  parametroPacotesRecebidos = dados[0].parametroPacotesRecebidos
  parametroPacketLoss = parametroPacotesEnviados * 0.01
  
  document.getElementById("parametroGraficoLinhaPrincipal").innerHTML = `Paramêtros minimo de pacotes: enviados: ${parametroPacotesEnviados}, recebidos: ${parametroPacotesRecebidos}`

  let stringTempo
  if (tempo == 1) {
    stringTempo = `na ultima hora`
  } else if (tempo == 24) {
    stringTempo = `nas ultimas 24 horas`
  } else stringTempo = `nos ultimos 7 dias`
  document.getElementById("headerMainGraph").innerHTML = `Quantidade de pacotes enviados e recebidos ${stringTempo}`
  document.getElementById("headerSecGraph").innerHTML = `Quantidade de pacotes perdidos ${stringTempo}`


  for (let index = 0; index < tamanhoVetor; index++) {

    const element = dados[index];

    labelsData.push(element.timeStamp)
    dadosPacotesEnviados.push(element.packetSent)
    dadosPacotesRecebidos.push(element.packetReceived)
    let packetLoss = element.packetLossSent + element.packetLossReceived
    dadosPacketLoss.push(packetLoss)

    if (index == 0) {
      download.Pico = element.downloadByte / 1048576;
      download.Minimo = element.downloadByte / 1048576;
      upload.Minimo = (element.uploadByte / 1048576);
      upload.Pico = (element.uploadByte / 1048576);
    }

    downloadSoma += (element.downloadByte / 1048576)
    uploadSoma += (element.uploadByte / 1048576)

    if(element.downloadByte / 1048576 > download.Pico){
      download.Pico = element.downloadByte / 1048576;
    } else if (element.downloadByte / 1048576 < download.Minimo){
      download.Minimo = element.downloadByte / 1048576;
    }

    if (element.uploadByte / 1048576 > upload.Pico){
      upload.Pico =( element.uploadByte / 1048576);
    } else if (element.uploadByte / 1048576 < upload.Minimo){
      upload.Minimo =( element.uploadByte / 1048576);
    }

  }

  download.Media = downloadSoma / tamanhoVetor
  upload.Media = uploadSoma / tamanhoVetor

  dadosDownload.push(download.Pico)
  dadosDownload.push(download.Media)
  dadosDownload.push(download.Minimo)

  if (upload.Media > 1000) {
    unidadeMedidaUp = 'Gbps'
  } else if (upload.Media > 0) {
    unidadeMedidaUp = 'Mbps'
  } else unidadeMedidaUp = 'Kbps'

  if (download.Media > 1000) {
    unidadeMedidaDown = 'Gbps'
  } else if (download.Media > 0) {
    unidadeMedidaDown = 'Mbps'
  } else unidadeMedidaDown = 'Kbps'

  parametro_down = dados[0].parametroDown
  parametro_up = dados[0].parametroUp

  let parametro_upString = `...`;
  if (dados[0].parametroUp > 1000000) {
    parametro_upString = `Paramêtro máximo: ${(dados[0].parametroUp / 1000000).toFixed(1)}Mbps`
  } else if (dados[0].parametroUp > 1000) {
    parametro_upString = `Paramêtro máximo: ${(dados[0].parametroUp / 1000).toFixed(1)}Kbps`
  } else {
    parametro_upString = `Paramêtro máximo: ${(dados[0].parametroUp).toFixed(1)}Bps`
  }

  let parametro_downString = `...`;
  if (dados[0].parametroUp > 1000000) {
    parametro_downString = `Paramêtro máximo: ${(dados[0].parametroUp / 1000000).toFixed(1)}Mbps`
  } else if (dados[0].parametroUp > 1000) {
    parametro_downString = `Paramêtro máximo: ${(dados[0].parametroUp / 1000).toFixed(1)}Kbps`
  } else {
    parametro_downString = `Paramêtro máximo: ${(dados[0].parametroUp).toFixed(1)}Bps`
  }





  document.getElementById('parametro_up').innerHTML = parametro_upString
  document.getElementById('baixo_upload').innerHTML = `${(upload.Media).toFixed(1)} Mbps`
  document.getElementById('baixo_upload').style.fontWeight = `1000`
  if (upload.Media * 1000000 < parametro_up * 2) {
    document.getElementById('baixo_upload').style.color = `#f59e0b`
  } else if (upload.Media * 1000000 < parametro_up) {
    document.getElementById('baixo_upload').style.color = `red`
  } else document.getElementById('baixo_upload').style.color = `green`


  document.getElementById('parametro_down').innerHTML = parametro_downString
  document.getElementById('baixo_download').innerHTML = `${(download.Media).toFixed(1)} Mbps`
  document.getElementById('baixo_download').style.fontWeight = `1000`
  if (download.Media * 1000000 < parametro_down * 2) {
    document.getElementById('baixo_download').style.color = `#f59e0b`
  } else if (download.Media * 1000000 < parametro_down) {
    document.getElementById('baixo_download').style.color = `red`
  } else document.getElementById('baixo_download').style.color = `green`

  dadosUpload.push(upload.Pico)
  dadosUpload.push(upload.Media)
  dadosUpload.push(upload.Minimo)

  if (sessionStorage.getItem("MEDIA_UP") && sessionStorage.getItem("MEDIA_DOWN")) {

    const up = document.getElementById("seta_up")
    const down = document.getElementById("seta_down")

    if (sessionStorage.getItem("MEDIA_UP") >= upload.Media) {
      up.src = "../assets/icon/setaPior.svg"
    } else up.src = "../assets/icon/setaMelhor.svg"

    if (sessionStorage.getItem("MEDIA_DOWN") >= download.Media) {
      down.src = "../assets/icon/setaPior.svg"
    } else down.src = "../assets/icon/setaMelhor.svg"
  }


  sessionStorage.setItem("MEDIA_DOWN", download.Media)
  sessionStorage.setItem("MEDIA_UP", upload.Media)




  graficoLinhaPrincipal()
  graficoLinhaSecundario()
  kpiInternet()
}

function carregarTabelaConexoes(dados) {

  const tamanhoVetor = dados.length
  const tabela = document.getElementById('tableConexao')

  document.getElementById('tabela_conexoes').innerHTML = `Tabela conexões (${tamanhoVetor} ativas no momento)`
  for (let index = 0; index < dados.length; index++) {
    const element = dados[index];


    tabela.innerHTML += `
              <tr>
                <td>${element.nome_processo}</td>
                <td>${element.laddr}</td>
                <td>${element.raddr}</td>
                <td>${element.status}</td>
                <td>${element.idProcessoConexao}</td>
              </tr>
    `
  }



}


async function contarTicketsPorTermo(termo) {
  const tempo = sessionStorage.getItem('TEMPO_SELECIONADO')
  try {
    const res = await fetch(`/dashboardRede/jira/${termo}/2/${tempo}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();

    function removerAcentos(str) {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }


    let qtdAlertas = 0;
    let qtdAlertasAtivos = 0;
    for (let index = 0; index < json.issues.length; index++) {
      const element = json.issues[index]


      if (element.fields && element.fields.summary) {
        const summary = removerAcentos(element.fields.summary.toUpperCase())
        const dataHoraString = element.fields.created



        const termoServidor = `SERVIDOR ${idServidorSelecionado}`.toUpperCase();
        if (summary.includes('REDE') && summary.includes(termoServidor)) {

          if ((element.fields.status.name).toUpperCase() == "aberto".toUpperCase() || (element.fields.status.name).toUpperCase() == "reaberto".toUpperCase()) {
            qtdAlertasAtivos++
          }
          const data = new Date(dataHoraString)
          const agora = new Date();

          const diferencaMs = agora - data;
          const diferencaHoras = diferencaMs / (1000 * 60 * 60);

          if (diferencaHoras <= tempo) {
            qtdAlertas++
          }
        }
      }
    }

    const tituloAlertas = document.getElementById('totalHoras')
    if (tempo == 1) {
      tituloAlertas.innerHTML = `Ultima hora:`
    } else if (tempo == 24) {
      tituloAlertas.innerHTML = `Ultimas 24 horas:`
    } else tituloAlertas.innerHTML = `Ultimos 7 dias:`
    document.getElementById('alertasTotais').innerHTML = qtdAlertas

    document.getElementById("alertasAtivos").innerHTML = qtdAlertasAtivos

    return json.total;
  } catch (err) {
    console.error('Erro ao contar tickets:', err);
    return null;
  }
}

function refresh(x) {

  sessionStorage.setItem("TEMPO_SELECIONADO", x); // salva antes do reload
  location.reload()
}

function selecionarTempo() {
  const tempo = sessionStorage.getItem("TEMPO_SELECIONADO");
  if (tempo) {
    document.getElementById("selectTempo").value = tempo;
  }
}

function popUpLista() {
  const tamanhoVetor = typeof dadosConexoes !== 'undefined' ? dadosConexoes.length : 0;

  Swal.fire({
    title: false,
    icon: false,
    width: '50vw',
    padding: '0', // Removi o padding do container principal para o card ocupar tudo
    background: 'transparent', // Fundo transparente para deixar o border-radius do card mandar
    showCloseButton: true,
    showConfirmButton: false,
    customClass: {
      popup: 'swal2-popup-custom', // Classe customizada para não afetar outros alerts
      closeButton: 'swal2-close-custom'
    },
    html: `
      <style>
        /* Estilos EXCLUSIVOS do PopUp - Isolados do CSS principal */
        
        /* Container principal do card no popup */
        .popup-tabela-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          display: flex;
          flex-direction: column;
          height: 80vh; /* Altura fixa grande para o popup */
        }

        /* Cabeçalho do Card */
        .popup-tabela-header {
          padding: 1.5rem 2rem;
          background: white;
          border-bottom: 2px solid #f0f0f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .popup-tabela-header h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #333;
          font-family: "Poppins", sans-serif;
        }

        .popup-tabela-header .btn-close-fake {
            cursor: pointer;
            font-size: 1.5rem;
            color: #999;
        }

        /* Área de Scroll da Tabela */
        .popup-table-scroll {
          flex: 1; /* Ocupa todo o espaço restante */
          overflow-y: auto;
          overflow-x: hidden;
        }

        /* Estilização da Scrollbar */
        .popup-table-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .popup-table-scroll::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .popup-table-scroll::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 4px;
        }
        .popup-table-scroll::-webkit-scrollbar-thumb:hover {
          background: #999;
        }

        /* A Tabela em si */
        .popup-tabela {
          width: 100%;
          border-collapse: collapse;
          font-family: "Poppins", sans-serif;
        }

        /* Cabeçalho da Tabela (Sticky) */
        .popup-tabela thead th {
          position: sticky;
          top: 0;
          background: white;
          z-index: 10;
          text-align: start;
          padding: 1rem 2rem;
          font-weight: 600;
          color: #555;
          font-size: 0.95rem;
          border-bottom: 2px solid #e0e0e0;
          box-shadow: 0 2px 2px -1px rgba(0,0,0,0.1); /* Sombra sutil ao rolar */
        }

        /* Linhas do Corpo */
        .popup-tabela tbody tr {
          background-color: #1c1c1c; /* Fundo ESCURO conforme sua imagem de referência */
          transition: background 0.2s;
          border-bottom: 1px solid #333;
        }

        .popup-tabela tbody tr:hover {
          background-color: #2a2a2a; /* Hover ligeiramente mais claro */
        }

        .popup-tabela tbody td {
          padding: 0.5rem 1.25rem;
          color: #fff; /* Texto BRANCO */
          font-size: 0.9rem;
          vertical-align: middle;
        }

        /* Ajuste fino para a primeira coluna (Nome) */
        .popup-tabela tbody td:first-child {
          font-weight: 500;
          color: #fff;
        }
        
        /* Ajuste do botão de fechar nativo do SweetAlert */
        .swal2-close-custom {
            z-index: 20 !important;
            color: #333 !important;
        }
        
        .swal2-popup-custom {
            border-radius: 12px !important;
        }

      </style>

      <div class="popup-tabela-card">
        <div class="popup-tabela-header">
          <h3>Tabela conexões (${tamanhoVetor} ativas no momento)</h3>
          </div>
        
        <div class="popup-table-scroll">
          <table class="popup-tabela">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Local adress</th>
                <th>Remote adress</th>
                <th>Status</th>
                <th>Proc ID</th>
              </tr>
            </thead>
            <tbody id="popupTableBody">
              </tbody>
          </table>
        </div>
      </div>
    `,
    didOpen: () => {
      // Função do Swal que roda assim que o popup abre
      // Aqui injetamos os dados sem precisar de função externa
      const tbody = document.getElementById('popupTableBody');

      if (typeof dadosConexoes !== 'undefined' && dadosConexoes.length > 0) {
        dadosConexoes.forEach(element => {
          tbody.innerHTML += `
                    <tr>
                      <td>${element.nome_processo || '-'}</td>
                      <td>${element.laddr || '-'}</td>
                      <td>${element.raddr || '-'}</td>
                      <td>${element.status || '-'}</td>
                      <td>${element.idProcessoConexao || '-'}</td>
                    </tr>
                `;
        });
      } else {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 2rem;">Nenhuma conexão ativa encontrada.</td></tr>`;
      }
    }
  });
}

function popUpInfo() {
  Swal.fire({
    title: `<span style="font-size: 1.2rem">Escopo da Tabela de Conexões</span>`,
    icon: 'info',
    iconColor: '#ffc47b',
    width: '500px', // Largura ajustada para este conteúdo
    html: `
      <style>
        .info-tab-container {
          text-align: left;
          font-family: 'Poppins', sans-serif;
          font-size: 0.95rem;
          line-height: 1.6;
          color: #333;
        }
        .highlight {
          font-weight: 600;
          color: #000;
        }
        .info-note {
            margin-top: 15px;
            font-size: 0.85rem;
            color: #555;
            background-color: #f8f9fa;
            padding: 10px;
            border-left: 4px solid #17a2b8; /* Cor azul informativa */
            border-radius: 4px;
        }
      </style>

      <div class="info-tab-container">
        <p>
          Esta tabela foi projetada para oferecer visibilidade sobre a comunicação do servidor com o ambiente externo.
        </p>
        
        <p>
          Ela exibe exclusivamente as <span class="highlight">conexões de rede externas</span> geradas por processos que estão <span class="highlight">ativos</span> no momento exato da consulta.
        </p>

        <div class="info-note">
            <b>Filtro Aplicado:</b> Processos inativos ou conexões puramente locais (localhost) são ocultados para facilitar o diagnóstico de tráfego.
        </div>
      </div>
    `,
    showCloseButton: true,
    showConfirmButton: false,
    focusConfirm: false
  });
}

const selectElement = document.getElementById('dash');

selectElement.addEventListener('change', function () {
  const url = this.value;
  if (url) {
    window.location.href = url;
  }
});

function popUpInfoGraf() {
  Swal.fire({
    title: `<span style="font-size: 1.2rem">Metodologia de Exibição de Dados</span>`,
    icon: 'info',
    iconColor: '#ffc47b', 
    width: '600px', 
    html: `
      <style>
        .info-graf-container {
          text-align: left;
          font-family: 'Poppins', sans-serif; /* Ou a fonte do seu projeto */
          font-size: 0.95rem;
          line-height: 1.6;
          color: #333;
        }
        .info-graf-subtitle {
          font-weight: 600;
          color: #222;
          margin-top: 15px;
          display: block;
          margin-bottom: 5px;
        }
        .info-graf-list {
          margin: 0;
          padding-left: 20px;
          margin-bottom: 15px;
        }
        .info-graf-list li {
          margin-bottom: 5px;
        }
        .highlight {
          font-weight: 600;
          color: #000;
        }
      </style>

      <div class="info-graf-container">
        <p>
          Este gráfico utiliza uma lógica de <b>amostragem inteligente</b> fundamentada em práticas de <i>Site Reliability Engineering (SRE)</i> do Google, visando reduzir o ruído visual e focar em tendências reais.
        </p>

        <span class="info-graf-subtitle">Granularidade Padrão:</span>
        <ul class="info-graf-list">
          <li><span class="highlight">1 Hora:</span> 1 registro por minuto (mín. 60 pontos).</li>
          <li><span class="highlight">24 Horas:</span> 1 registro a cada 15 min (mín. 96 pontos).</li>
          <li><span class="highlight">7 Dias:</span> 1 registro por hora (mín. 168 pontos).</li>
        </ul>

        <span class="info-graf-subtitle">Exceção de Criticidade:</span>
        <p>
          Para garantir a rastreabilidade de incidentes, qualquer variação superior a <span class="highlight">20%</span> (pico ou queda abrupta) entre capturas ignora a amostragem e é registrada imediatamente. Isso assegura que anomalias críticas jamais sejam ocultadas.
        </p>
      </div>
    `,
    showCloseButton: true,
    showConfirmButton: false, 
    focusConfirm: false
  });
}

window.onload = () => {
  listarServidores()
  carregarDadosRede()
  carregarDadosConexao()
  selecionarTempo()
  contarTicketsPorTermo('Rede')
  atualizarDadosServidorSelecionado()
}