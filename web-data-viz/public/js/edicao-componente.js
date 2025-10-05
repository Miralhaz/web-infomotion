const params = new URLSearchParams(window.location.search);
const idEspecifico_Componente = params.get('id');
const idServidor = params.get('servidor');
function puxandoCamposPreenchidos(){
    
    fetch(`/componentes/puxandoColunasPreenchidas/${idEspecifico_Componente}`)
      .then(function (resposta) {
        console.log("resposta: ", resposta);

        if (resposta.ok) {
          resposta.json().then(function (resposta) {
            console.log("Dados recebidos: ", JSON.stringify(resposta));
            
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
    var tipoComp = ipt_tipo_componente.value
    var apelidoComp = ipt_apelido_componente.value
    var unidadeMedidaComp = ipt_unidade_medida_componente.value
    var parametro1Comp = ipt_parametro1_componente.value
    var parametro2Comp = ipt_parametro2_componente.value
    var statusComp = ipt_status_componente.value

    // Enviando o valor da nova input
    fetch(`/componentes/editarComponente/${idEspecifico_Componente}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            tipoComponente: tipoComp,
            apelidoComponente: apelidoComp,
            unidadeMedidaComponente: unidadeMedidaComp,
            parametro1Componente: parametro1Comp,
            parametro2Componente: parametro2Comp,
            statusComponente: statusComp

        }),
    })
        .then(function (resposta) {
            console.log("resposta: ", resposta);

            if (resposta.ok) {
                finalizarAguardar("Edição de Componente realizada com sucesso!!...");

                setTimeout(() => {
                    window.location = "tela-edicao-componente.html";
                }, "2000");

                limparFormulario();
                finalizarAguardar();
            } else {
                throw "Houve um erro ao tentar realizar a edição de componente!";
            }
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
            finalizarAguardar();listarComponentes
        });
}

window.onload = function() {
  puxandoCamposPreenchidos();
}