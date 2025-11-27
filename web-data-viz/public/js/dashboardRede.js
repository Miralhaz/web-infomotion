Chart.register(ChartDataLabels);

const tempo = 168
if (sessionStorage.getItem('TEMPO_SELECIONADO')) {
  const tempo = sessionStorage.getItem('TEMPO_SELECIONADO')
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
let parametroPacotes = 20000
let parametroPacketLoss = parametroPacotes * 0.01

let unidadeMedidaDown = '...'
let unidadeMedidaUp = '...'


let dadosConexoes = []

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
          plugins: { legend: { display: false },
            datalabels: {
              color: '#1e0f0fff', // cor do texto
              font: {
                weight: 'bold',
                size: 14
              },
              // Exibe o valor numérico da barra
              formatter: (value, context) => {
                return `${value.toFixed(1)} ${unidadeMedidaUp}`; // ou `${value} unidades`, etc.
              },
              // Posição: 'top', 'bottom', 'center', 'inside', etc.
              anchor: 'center', // fixa no topo da barra
              align: 'right',  // alinha acima da barra
              offset: -10,    // ajuste fino (negativo puxa pra dentro)
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
              color: '#ffffffff', // cor do texto
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
      const mainCtx = document.getElementById('graficoLinhaPrincipal').getContext('2d');  

  const dataMain = {
    labels: labelsData,
    datasets: [
      { 
        label: 'Pacotes enviados',
        data: dadosPacotesEnviados,
        
        backgroundColor: (context) => {
            const valor = context.raw;
            if (valor > (parametroPacotes * 2)) return '#0cff03ff'; 
            else if (valor > parametroPacotes) return '#fffb00ff';   
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
            if (valor > (parametroPacotes * 2)) return '#0cff03ff'; 
            else if (valor > parametroPacotes) return '#fffb00ff';  
            return 'red';                      
        },
        borderColor: 'fffae6', 
        segment: {
          borderColor: (ctx) => {
              
              if (!ctx.p1 || !ctx.p1.parsed) return 'gray';
              const valor = ctx.p1.parsed.y; 
              if (valor > (parametroPacotes * 2)) {
                  return '#0cff03ff'; 
              } else if (valor > parametroPacotes) {
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
      }, 
      datalabels: {
        display: false
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
        backgroundColor: (context) => {
            const valor = context.raw;
            const valorCorrespondente = ((dadosPacotesEnviados[context.dataIndex] + dadosPacotesRecebidos[context.dataIndex]) * 0.01);

            if (valor > (valorCorrespondente * 2)) return 'red'; 
            else if (valor > valorCorrespondente) return '#fffb00ff';   
            return '#0cff03ff';                      
        },
        segment: {
          borderColor: (ctx) => {
              const valorCorrespondente = ((dadosPacotesEnviados[ctx.p1DataIndex] + dadosPacotesRecebidos[ctx.p1DataIndex]) * 0.01);
              if (!ctx.p1 || !ctx.p1.parsed) return 'gray';
              const valor = ctx.p1.parsed.y; 
              if (valor > (valorCorrespondente * 2)) {
                  return 'red'; 
              } else if (valor > valorCorrespondente) {
                  return '#fffb00ff';   
              } else {
                  return '#0cff03ff';       
              }
          },},
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
    const nomeArquivoRede = `jsonRede_14_${tempo}.json`;

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
    const nomeArquivoRede = `conexoes11.json`;

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

  parametroPacotes = dados[1].parametroPacotesEnviados
  parametroPacketLoss = parametroPacotes * 0.01
  
  document.getElementById("parametroGraficoLinhaPrincipal").innerHTML = `Paramêtro minimo: ${parametroPacotes} pacotes(enviados e recebidos)`

  let stringTempo
  if(tempo == 1){
                      stringTempo = `na ultima hora`
                    } else if (tempo == 24){
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

    if(index == 0){
      download.Pico = element.downloadByte / 1048576;
      download.Minimo = element.downloadByte / 1048576;
      upload.Minimo =( element.uploadByte / 1048576);
      upload.Pico =( element.uploadByte / 1048576);
    }

    downloadSoma += (element.downloadByte / 1048576) 
    uploadSoma += (element.uploadByte / 1048576) 

    if(element.downloadByte > download.Pico){
      download.Pico = element.downloadByte / 1048576;
    } else if (element.downloadByte < download.Minimo){
      download.Minimo = element.downloadByte / 1048576;
    }

    if (element.uploadByte > upload.Pico){
      upload.Pico =( element.uploadByte / 1048576);
    } else if (element.uploadByte < upload.Minimo){
      upload.Minimo =( element.uploadByte / 1048576);
    }

  }

  download.Media = downloadSoma / tamanhoVetor
  upload.Media = uploadSoma / tamanhoVetor

  dadosDownload.push(download.Pico)
  dadosDownload.push(download.Media)
  dadosDownload.push(download.Minimo)

  if (upload.Media > 1000){
      unidadeMedidaUp = 'Gbps'
    } else if (upload.Media > 0){
      unidadeMedidaUp = 'Mbps'
    } else unidadeMedidaUp = 'Kbps'

    if (download.Media > 1000){
      unidadeMedidaDown = 'Gbps'
    } else if (download.Media > 0){
      unidadeMedidaDown = 'Mbps'
    } else unidadeMedidaDown = 'Kbps'
    
    

  let parametro_up = `...`;
  if (dados[1].parametroUp > 1000000){
    parametro_up = `Paramêtro máximo: ${(dados[1].parametroUp / 1000000).toFixed(1)}Mbps`
  } else if (dados[1].parametroUp > 1000){
    parametro_up = `Paramêtro máximo: ${(dados[1].parametroUp / 1000).toFixed(1)}Kbps`
  } else {
    parametro_up = `Paramêtro máximo: ${(dados[1].parametroUp).toFixed(1)}Bps`}

  let parametro_down = `...`;
  if (dados[1].parametroUp > 1000000){
    parametro_down = `Paramêtro máximo: ${(dados[1].parametroUp / 1000000).toFixed(1)}Mbps`
  } else if (dados[1].parametroUp > 1000){
    parametro_down = `Paramêtro máximo: ${(dados[1].parametroUp / 1000).toFixed(1)}Kbps`
  } else {
    parametro_down = `Paramêtro máximo: ${(dados[1].parametroUp).toFixed(1)}Bps`}

    
    
   

  document.getElementById('parametro_up').innerHTML = parametro_up
  document.getElementById('baixo_upload').innerHTML = `${(upload.Media).toFixed(1)} Mbps`

  document.getElementById('parametro_down').innerHTML = parametro_down
  document.getElementById('baixo_download').innerHTML = `${(download.Media).toFixed(1)} Mbps`

  dadosUpload.push(upload.Pico)
  dadosUpload.push(upload.Media)
  dadosUpload.push(upload.Minimo)

  if(sessionStorage.getItem("MEDIA_UP") && sessionStorage.getItem("MEDIA_DOWN")){

    const up = document.getElementById("seta_up")
    const down = document.getElementById("seta_down")

    if (sessionStorage.getItem("MEDIA_UP") >= upload.Media){
      up.src =  "../assets/icon/setaPior.svg"
    } else up.src = "../assets/icon/setaMelhor.svg"

    if (sessionStorage.getItem("MEDIA_DOWN") >= download.Media) {
      down.src =  "../assets/icon/setaPior.svg"
    } else down.src =  "../assets/icon/setaMelhor.svg"
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
      
      
      if (element.fields && element.fields.summary){
        const summary = removerAcentos(element.fields.summary.toUpperCase())
        const dataHoraString = element.fields.created
        
        
        
        const termoServidor = `SERVIDOR 10`.toUpperCase();
        if (summary.includes('REDE') && summary.includes(termoServidor)) {
        
          if((element.fields.status.name).toUpperCase() == "aberto".toUpperCase() || (element.fields.status.name).toUpperCase() == "reaberto".toUpperCase()){
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
    if(tempo == 1){
      tituloAlertas.innerHTML = `Ultima hora:`
    } else if (tempo == 24){
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

  Swal.fire({
    title: false,
    icon: false,
    width: '90vw',
    padding: '2rem',
    background: '#f5f5f5',
    showCloseButton: true,
    showConfirmButton: false,
    customClass: {
        popup: 'popup-tabela-conexoes',
        closeButton: 'close-button-custom'
    },
    html: `
      <style>
        .popup-tabela-conexoes {
          border-radius: 12px;
        }

        .close-button-custom {
          font-size: 2rem;
          color: #666;
        }

        .cardDashRede.tabelaRede {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        .cardDashRede .cardHeader.cardDashRedeT {
          padding: 1.5rem 2rem;
          background: white;
          border-bottom: 1px solid #e0e0e0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .cardDashRede .cardHeader p {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 500;
          color: #333;
        }

        .cardDashRede .cardHeader img {
          cursor: pointer;
          width: 20px;
          height: 20px;
          opacity: 0.6;
          transition: opacity 0.2s;
        }

        .cardDashRede .cardHeader img:hover {
          opacity: 1;
        }

        .dashboardRede .tabelaRede .tableScroll {
          max-height: 70vh;            
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }

        .dashboardRede .tabelaRede .tableScroll::-webkit-scrollbar {
          width: 8px;
        }

        .dashboardRede .tabelaRede .tableScroll::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        .dashboardRede .tabelaRede .tableScroll::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }

        .dashboardRede .tabelaRede .tableScroll::-webkit-scrollbar-thumb:hover {
          background: #555;
        }

        .dashboardRede .tabelaRede table {
          width: 100%;
          border-collapse: collapse;
          border-spacing: 0;
          margin: 0;
          font-size: 0.95rem;
        }

        .dashboardRede .tabelaRede thead th {
          position: sticky;
          top: 0;
          background: #fff;
          z-index: 5;
          padding: 1rem 1.5rem;
          text-align: left;
          font-weight: 500;
          color: #666;
          font-size: 0.9rem;
          border-bottom: 2px solid #e0e0e0;
        }

        .dashboardRede .tabelaRede tbody tr {
          background: #1a1a1a;
          transition: background 0.2s;
        }

        .dashboardRede .tabelaRede tbody tr:hover {
          background: #2a2a2a;
        }

        .dashboardRede .tabelaRede tbody td {
          padding: 1rem 1.5rem;
          color: white;
          text-align: left;
          border-bottom: 1px solid #2a2a2a;
        }

        .dashboardRede .tabelaRede tbody tr:last-child td {
          border-bottom: none;
        }
      </style>

      <div class="cardDashRede tabelaRede dashboardRede">
        <div class="cardHeader cardDashRedeT">
          <p id="tabela_conexoes">Tabela conexões (11 ativas no momento)</p>
          <img src="../assets/icon/fullscreen.svg" alt="FullScreen" onclick="popUpLista()">
        </div>
        <div class="tableScroll">
          <table>
            <thead>
              <tr class="cabecalho">
                <th>Nome</th>
                <th>Local adress</th>
                <th>Remote adress</th>
                <th>Status</th>
                <th>Proc ID</th>
              </tr>
            </thead>
            <tbody id="tableConexao">
              
            </tbody>
          </table>
        </div>
      </div>

      <script>
        carregarTabelaPopUp()
      </script>
    `,
})
}

function carregarTabelaPopUp() {
  const tamanhoVetor = dadosConexoes.length
        const tabela = document.getElementById('tableConexao')

        document.getElementById('tabela_conexoes').innerHTML = `Tabela conexões (${tamanhoVetor} ativas no momento)`
        for (let index = 0; index < dadosConexoes.length; index++) {
          const element = dadosConexoes[index];
          
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

function popUpInfo() {
  Swal.fire({
    title: `<strong>Informações da tabela de conexões</strong>`,
    icon: false,
    html: `
      
          <div>
            <div>
              Esta tabela mostra somente conexões externas atualmente ativas
            </div>
          </div>
      
    `,
    showCloseButton: true,
    showConfirmButton: false, // Escondemos o botão "OK" padrão
    focusConfirm: false
  });
}

window.onload = () => {
  listarServidores()
  carregarDadosRede()
  carregarDadosConexao()
  selecionarTempo()
  contarTicketsPorTermo('Rede')

}