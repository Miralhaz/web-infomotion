var regiao = "";

listarRegioes()

function listarRegioes() {
  const empresaId = sessionStorage.getItem('ID_EMPRESA')
  console.log("Empresa ID= " + empresaId)
  const select = document.getElementById("select_regiao")

  fetch(`/servidores/listarRegioes/${empresaId}`)
    .then(res => res.json())
    .then(regioes => {
      let listarRegioesDaEmpresa = regioes.map(item => item);
      console.log(listarRegioesDaEmpresa)
      criarListaRegiao(listarRegioesDaEmpresa)
      
    })
    .catch(err => {
      console.error("Erro ao carregar regiões:", err);
      select.innerHTML = "<option>Erro ao carregar regiões</option>";
    });
}

function criarListaRegiao(lista){
html = ""
for(i = 0; i < lista.length; i++){
  regiao = lista[i];
  nome =  regiao.nome
  pais = regiao.pais
  id = regiao.id
  html+= `
<div class="container-card-regiao" onclick="buscarParametros(${id})">
<div class="card-regiao">
<p>${nome}<b> / </b>${pais}<b> / </b>${id}</p>    
</div>    
</div>
`

}
buscarParametros(lista[0].id) 
id_lista_regiao.innerHTML = html
}

 function buscarParametros(idRegiao) {
 lerArquivoPrevisao(idRegiao)
 lerArquivoHorario(idRegiao)
 lerArquivoKpi(idRegiao)
}

async function lerArquivoHorario(idRegiao) {
   try {
    const url = `/dashboardRegiao/lerArquivoHorario/${idRegiao}`;
    const resposta = await fetch(url);
    
    const dados = await resposta.json();

    let horas = dados.map(dados => dados.Hora)
    let requisicoes = dados.map(dados => dados.Requsicoes)

    criarGraficoDeHorario(horas,requisicoes)


  } catch (erro) {
    console.error('Erro ao carregar dados CPU:', erro);
  }
}

async function lerArquivoPrevisao(idRegiao) {
try {
    const url = `/dashboardRegiao/lerArquivoPrevisao/${idRegiao}`;
    const resposta = await fetch(url);
    console.log(resposta + "resposta")
    const dados = await resposta.json();
    let data = dados.map(dados => dados.Data)
    let chance = dados.map(dados => dados.ChanceDeAlteracao)
    let qtdReq = dados.map(dados => dados.Requsicoes)
    let porcentagem = dados.map(dados => dados.PorcentagemDeAumento)

    criarGraficoBarrasPrevisao(data,qtdReq)
    criarGraficoLinhasPrevisao(data,porcentagem,chance)
   

  } catch (erro) {
    console.error('Erro :', erro);
  }
}

async function lerArquivoKpi(idRegiao) {
try {
    const url = `/dashboardRegiao/lerArquivoKpi/${idRegiao}`;
    const resposta = await fetch(url);
    const dados = await resposta.json();

   let data = dados.map(dados => dados.Data)
    let chance = dados.map(dados => dados.ChanceDeAlteracao)
    let qtdReq = dados.map(dados => dados.Requsicoes)
    let porcentagem = dados.map(dados => dados.PorcentagemDeAumento)
    let maiorPrevisaoDeRam = dados.map(dados => dados.UsoDeRam)



  } catch (erro) {
    console.error('Erro ao carregar dados CPU:', erro);
  }
}

function criarGraficoBarrasPrevisao(datas,dados) {  
  const ctx = document.getElementById('grafico-barra-previsao').getContext('2d');
  new Chart(ctx, {   
    type: 'bar',
    data: {
      labels: datas,
      datasets: [
        {
          label: 'Requisições',
          data: dados,
          backgroundColor: ['#ffe09cff'],
          color: '#ffffff',
          yAxisID: 'y',
          xAxisID: 'x'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          title: {
            display: true,
            text: 'Quantidade de requisições previstas nos próximos 16 dias',
            color: '#ffffff',
            font: {
              size: 24
            }
          },
          labels: {
            usePointStyle: true,
          color: '#ffffff',
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          bounds: 'data',
          color: '#ffffff'
        },
        y: {
          type: 'linear',
          position: 'left',
          beginAtZero: true,
          color: '#ffffff',
          grid: { color: '#ffffffb7' }
        }
      }
    }
  }); 
} 

function criarGraficoLinhasPrevisao(datas,previsao,chance) {
  const ctx = document.getElementById('grafico-linha-previsao');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: datas,
      datasets: [
        {
          label: 'Estimativa percentual de aumento nas requisições',
          data: previsao,
          borderWidth: 3,
          borderColor: '#fdf076ff',
          backgroundColor: 'transparent',
          pointBackgroundColor: 'black',
          pointHitRadius: 5,
          yAxisID: 'y'
        },
        {
          label: 'Probabilidade de interferência climática nas requisições %',
          data: chance,
          borderWidth: 3,
          borderColor: '#5dabdfff',
          backgroundColor: 'rgba(72, 185, 219, 0.3)', 
          fill: true,
          pointBackgroundColor: 'a1a1a1b7',
          pointHitRadius: 5,
          yAxisID: 'y'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
         
          labels: {
            usePointStyle: true,
            color: 'white',

          },
          title: {
            display: true,
            text: 'Probabilidade de aumento no número de requisições nos próximos 16 dias',
            color: '#ffffff',
            font: {
              size: 24
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            offset: false,
            color: '#a1a1a1b7'
          },
          bounds: 'data',
          ticks: {
            color: '#a1a1a1b7',
            font: { size: 12 }
          }
        },
        y: {
          type: 'linear',
          position: 'left',
          beginAtZero: true,
          grid: {
            color: '#a1a1a1b7'
          }
        }
      }
    }
  });
}

function criarGraficoDeHorario(horarios,req){
  const ctxPico = document.getElementById('grafico-barra-horarioDePico');

  new Chart(ctxPico, graficoPico = {
    type: 'bar',
    data: {
      labels: horarios,
      datasets: [
        {
          type: 'bar',
          label: 'Requisições',
          data: req,
          backgroundColor: ['#ffe09cff'],
          yAxisID: 'y',
          xAxisID: 'x'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
          scales: false,
          position: 'bottom',
          labels: {
            usePointStyle: true,
            color: 'white'
          }
        }
      },
      scales: {
        x: {
          grid: {
            offset: false
          },
          bounds: 'data'
        },
        y: {
          type: 'linear',
          position: 'left',
          display: true,
          beginAtZero: true,
          grid: {
            color: '#a1a1a1b7'
          },
          color: '#ffffff',
          font: {
            size: 24
          }
        }
      }
    }
  });
}

