const params = new URLSearchParams(window.location.search);
const idEspecifico_Componente = params.get('id');
const idServidor = params.get('servidor');
const nomeTipo = params.get('tipocomp');

function puxandoCamposPreenchidos(unidade_medida) {

  fetch(`/componentes/puxandoColunasPreenchidas/${idEspecifico_Componente}/${idServidor}/${nomeTipo}/${unidade_medida}`)
    .then(function (resposta) {
      console.log("resposta: ", resposta);

      if (resposta.ok) {
        resposta.json().then(function (resposta) {
          console.log("Dados recebidos: ", JSON.stringify(resposta));

          const inputTipo = document.getElementById('ipt_tipo_componente');
          const inputApelido = document.getElementById('ipt_apelido_componente');
          const inputMaximo = document.getElementById('ipt_parametro1_componente');
          for (let i = 0; i < resposta.length; i++) {




            inputTipo.value = resposta[i].tipo

            inputApelido.value = resposta[i].apelido

            inputMaximo.value = resposta[i].max

            break
          }
        });
      } else {
        throw "Houve um erro ao tentar listar os componentes!";
      }
    })
    .catch(function (resposta) {
      console.log(`#ERRO: ${resposta}`);
    });
}


function editarComponente() {

  var tipo_componente = ipt_tipo_componente.value
  var apelidoComp = ipt_apelido_componente.value
  var unidadeMedidaCompCodificada = unidade_medida.value
  var unidadeMedidaComp = decodeURIComponent(unidadeMedidaCompCodificada)
  var parametro1Comp = ipt_parametro1_componente.value
  var statusComp = ipt_status_componente.checked


  // Enviando o valor da nova input
  fetch(`/componentes/editarComponente/${idEspecifico_Componente}/${idServidor}/${nomeTipo}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tipoComponente: tipo_componente,
      apelidoComponente: apelidoComp,
      unidadeMedidaComponente: unidadeMedidaComp,
      parametro1Componente: parametro1Comp,
      statusComponente: statusComp

    }),
  })
    .then(function (resposta) {
      console.log("resposta: ", resposta);

      if (resposta.ok) {
        setTimeout(() => {
          window.location.href = `./tela-gerenciamento-servidor.html?id=${idServidor}`
        }, 500);

      } else {
        throw "Houve um erro ao tentar realizar a edição de componente!";
      }
    })
    .catch(function (resposta) {
      console.log(`#ERRO: ${resposta}`);
    });
}

function atualizarParametro(unidadeMedida){
 puxandoCamposPreenchidos(unidadeMedida)
}

function optionSelect(){
  const unidade = "%"
  const unidadeCodificada = encodeURIComponent(unidade)

  document.getElementById("unidade_medida").innerHTML =`<option value="${unidadeCodificada}" selected >%</option>
  <option value="C">°C</option>`
  puxandoCamposPreenchidos(unidadeCodificada);
}

window.onload = function () {
  optionSelect();
  
}