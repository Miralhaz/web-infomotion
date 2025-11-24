

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

function kpiInternet()  {
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
            data: dadosDownload,
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
    };


function graficoLinhaPrincipal() {
      const mainCtx = document.getElementById('graficoLinhaPrincipal').getContext('2d');  

  const dataMain = {
    labels: labelsData,
    datasets: [
      { 
        label: 'Pacotes enviados',
        data: dadosPacotesEnviados,
        
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
        data: dadosPacotesRecebidos,
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
              if (valor > 20000) {
                  return '#0cff03ff'; 
              } else if (valor > 10000) {
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
          color: '#E2E1DE',
          font: { size: 12 },     // <- diminuir aqui (ex: 12)
          boxWidth: 24,
          padding: 8,
          generateLabels: function(chart) {
            const defaults = Chart.defaults.plugins.legend.labels.generateLabels(chart);
            return defaults.map(item => ({ ...item, fillStyle: 'transparent' }));
          }
        }
      },
      title: { display: false },
      tooltip: {
        titleFont: { size: 11 },
        bodyFont: { size: 11 }
      }
    },
    scales: {
      x: {
        ticks: {display: false}
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
      const SecondCtx = document.getElementById('graficoLinhaSecundario').getContext('2d');

  

  const dataSecond = {
    labels: labelsData,
    datasets: [
      {
        label: 'Quantidade de pacotes perdidos',
        data: dadosPacketLoss,
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
        labels: { font: { size: 11 }, color: '#E2E1DE' } // menor legenda
      },
      title: { display: false }
    },
    scales: {
      x: { display: false },
      y: { ticks: { font: { size: 9 }, color: '#E2E1DE' } }
    }
  },
};


  new Chart(SecondCtx, configSecondLineChart)
  
  
};

function listarServidores() {
  
    
    let idServidor = null
    let idEmpresa = sessionStorage.ID_EMPRESA;

    fetch(`/servidores/listarServidores/${idEmpresa}`)
        .then(function (resposta) {

            if (resposta.ok) {
                resposta.json().then(function (resposta) {

                    for (let index = 0; index < resposta.length; index++) {
                      if (resposta[index].idServidor == idServidorSelecionado) {
                        idServidor = index
                        break;
                      }}

                    const select = document.getElementById('select_servidores');
                    
                    let frase = `<option value="escolha_op">Escolha um servidor</option>`;
                    if (idServidor != null){
                      frase += `<option value="" selected disabled>${resposta[idServidor].apelido}</option>`
                    }

                    for (let i = 0; i < resposta.length; i++) {
                        frase += `
                                <option value="${resposta[i].idServidor}" data-id="${resposta[i].idServidor}">${resposta[i].apelido}</option>
                        `;
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

async function carregarDadosRede() {
    const nomeArquivoRede = `jsonRede11.json`;

    const resposta = await fetch(`/dashboardRede/${nomeArquivoRede}`);
    if (!resposta.ok) {
      const txt = await resposta.text();
      console.error('Erro ao carregar arquivo:', resposta.status, txt);
      return; // aborta
    }
    const data = await resposta.json();

    if (!Array.isArray(data) || data.length === 0) return;

    console.log(data);
  
    carregarGraficosLinha(data)
}

async function carregarDadosConexao() {
    const nomeArquivoRede = `conexoes11.json`;

    const resposta = await fetch(`/dashboardRede/${nomeArquivoRede}`);
    if (!resposta.ok) {
      const txt = await resposta.text();
      console.error('Erro ao carregar arquivo:', resposta.status, txt);
      return; // aborta
    }
    const data = await resposta.json();

    if (!Array.isArray(data) || data.length === 0) return;

    console.log(data);
  
    carregarTabelaConexoes(data)
}

function carregarGraficosLinha(dados) {

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

  for (let index = 0; index < tamanhoVetor; index++) {
    
    const element = dados[index];
    labelsData.push(element.timeStamp)
    dadosPacotesEnviados.push(element.packetSent)
    dadosPacotesRecebidos.push(element.packetReceived)
    let packetLoss = element.packetLossSent + element.packetLossReceived
    dadosPacketLoss.push(packetLoss)

    downloadSoma += element.downloadByte
    uploadSoma += element.uploadByte

    if(element.downloadByte > download.Pico){
      download.Pico = element.downloadByte;
    } else if (element.downloadByte < download.Minimo){
      download.Minimo = element.downloadByte;
    }

    if (element.uploadByte > upload.Pico){
      upload.Pico = element.uploadByte;
    } else if (element.uploadByte < upload.Minimo){
      upload.Minimo = element.uploadByte;
    }

  }

  download.Media = downloadSoma / tamanhoVetor
  upload.Media = uploadSoma / tamanhoVetor

  dadosDownload.push(download.Pico)
  dadosDownload.push(download.Media)
  dadosDownload.push(download.Minimo)

  dadosUpload.push(upload.Pico)
  dadosUpload.push(upload.Media)
  dadosUpload.push(upload.Minimo)


  console.log('labels', labelsData );
  
  graficoLinhaPrincipal()
  graficoLinhaSecundario()
}

function carregarTabelaConexoes(dados) {

  const tamanhoVetor = dados.length
  const tabela = document.getElementById('tableConexao')

  for (let index = 0; index < tamanhoVetor.length; index++) {
    const element = array[index];
    
    let row = `
              <tr>
                <td>${element.nomeConexao}</td>
                <td>2.34.43.21:5343</td>
                <td>2.34.43.21:5343</td>
                <td>Ouvindo</td>
                <td>734</td>
              </tr>
    `
  }
  
  

}


async function contarTicketsPorTermo(termo) {
  try {
    const res = await fetch(`/dashboardRede/jira/count?term=${encodeURIComponent(termo)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    
    console.log('Tickets ativos no momento:', json);
  
    return json.total;
  } catch (err) {
    console.error('Erro ao contar tickets:', err);
    return null;
  }
}


function receberAlertasPorServidor() {

    const idServidor = idServidorSelecionado;
    const tipo = 'REDE'
    const tempo = sessionStorage.getItem('TEMPO_SELECIONADO')
    console.log('tempo: ', tempo);
    
    
    

    fetch(`/servidores/receberAlertasPorServidor/${idServidor}/${tipo}/${tempo}`)
        .then(function (resposta) {
            if (resposta.ok) {
                resposta.json().then(function (dados) {
                    document.getElementById('alertasTotais').innerHTML =dados[0].total_alertas
                });

            } else {
                throw "Houve um erro ao tentar receber os alertas por servidor e tipo!";
            }
        })

        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });
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

window.onload = () => {
  //listarServidores()
  //carregarDadosRede()
  //carregarDadosConexao()
  //ticketsAtivos()
  receberAlertasPorServidor()
  //kpiInternet()
  selecionarTempo()
  contarTicketsPorTermo('Rede')

}