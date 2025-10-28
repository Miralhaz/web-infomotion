const idServidor = sessionStorage.getItem('servidorID');

/*function receberIdServidor() {
  const idUsuario = sessionStorage.getItem('ID_USUARIO')
        fetch(`/servidores/listarServidores/${idUsuario}`, {
            method: "GET"
        }).then(function (resposta) {
            console.log("ESTOU NO THEN DO receberIdServidor()!")

            if (resposta.ok) {
                console.log(resposta);

                resposta.json().then(json => {
                    console.log(json);
                    console.log(JSON.stringify(json),"fetch de buscar servidores depois do stringify: ", json);
                    ids = []
                    for (let index = 0; index < json.length; index++) {
                      ids.push(json[index].fk_servidor)
                    }console.log("vetor de ids",ids);
                    sessionStorage.setItem('ID_SERVIDOR', JSON.stringify(ids))
                    console.log("primeiro id: ", JSON.parse(sessionStorage.ID_SERVIDOR)[0]);
                    console.log("segundo id: ", JSON.parse(sessionStorage.ID_SERVIDOR)[1]);
                    
                });

            } else {
                console.log("Houve um erro ao tentar receber os ids dos servidores!");

                resposta.text().then(texto => {
                    console.error(texto);
                    finalizarAguardar(texto);
                });
            }

        }).catch(function (erro) {
            console.log(erro);
        })

        return false;
    
}

*/
var cargoUsuario = sessionStorage.getItem("USUARIO_CARGO")
document.addEventListener("DOMContentLoaded", function () {
  if (cargoUsuario != "Gestor") {
    var elemento = document.getElementById("usuario-header");
    elemento.style.display = "none";
  }
})

let componentesEstatico = []
function listarComponentes() {
  /* const listaIdServidor = sessionStorage.getItem('ID_SERVIDOR') */
  /* for (let index = 0; index < listaIdServidor.length; index++) { */
  /* const idServidor = listaIdServidor[index]; */

  fetch(`/componentes/listarComponentes/${idServidor}`)
    .then(function (resposta) {
      console.log("resposta: ", resposta);

      if (resposta.ok) {
        resposta.json().then(function (resposta) {
          console.log("Dados recebidos: ", JSON.stringify(resposta));

          const componenteLista = document.getElementById('listaComponentes')
          for (let i = 0; i < resposta.length; i++) {
            let componente = `
                                    <div class="componente" id="componente">
                                        <div class="apelido">
                                            ${resposta[i].apelido}
                                        </div>  
                                        <div class="tipoNumComponente" id="tipoNumComponente">
                                            ${resposta[i].tipo}#${resposta[i].numero_serie}
                                        </div>
                                        <div class="icons">
                              <a href="./tela-edicao-componentes.html?id=${resposta[i].id}&servidor=${idServidor}&tipocomp=${resposta[i].tipo}"> 
                                            <img src="../assets/icon/editar-amarelo.svg" alt="Editar" class="imgGSV" id="editar">
                                            </a>
                                            
                                        </div>  
                                    </div>  
                              `;
            componenteLista.innerHTML += componente;
            componentesEstatico.push({
              idServidor: idServidor,
              idComponente: resposta[i].id,
              apelido: resposta[i].apelido,
              tipo: resposta[i].tipo,
              numero_serie: resposta[i].numero_serie
            })
          }
          console.log("componentesEstatico: ", componentesEstatico);






        });
      } else {
        throw "Houve um erro ao tentar listar os componentes!";
      }
    })
    .catch(function (resposta) {
      console.log(`#ERRO: ${resposta}`);
    });
  /* } */
}

function pesquisar() {
  // pega o apelido e o numero de serie dos componentes
  const componenteLista = document.getElementById("listaComponentes")

  const barraPesquisa = document.getElementById("pesquisa-componente")
  barraPesquisa.addEventListener("input", (e) => {
    componenteLista.innerHTML = ''
    const stringPesquisa = e.target.value.toLowerCase()

    for (let i = 0; i < componentesEstatico.length; i++) {
      if (componentesEstatico[i].apelido.toLowerCase().includes(stringPesquisa) || componentesEstatico[i].tipo.toLowerCase().includes(stringPesquisa)) {
        let componente = `
                                    <div class="componente" id="componente">
                                        <div class="apelido">
                                            ${componentesEstatico[i].apelido}
                                        </div>  
                                        <div class="tipoNumComponente" id="tipoNumComponente">
                                            ${componentesEstatico[i].tipo}#${componentesEstatico[i].numero_serie}
                                        </div>
                                        <div class="icons">
                                        
                              <a href="./tela-edicao-componentes.html?id=${componentesEstatico[i].idComponente}&servidor=${componentesEstatico[i].idServidor}&tipocomp=${componentesEstatico[i].tipo}"> 
                                            <img src="../assets/icon/editar-amarelo.svg" alt="Editar" class="imgGSV" id="editar">
                                            </a>
                                            
                                        </div>  
                                    </div>  
                              `;
        componenteLista.innerHTML += componente;
      }

    }
  })
}

function acionarFiltro() {
  const menu = document.getElementById("wrapperMenu")
  console.log("menu", menu);
  if (menu.classList.contains("show")) {
    menu.classList.remove("show");
  } else {
    menu.classList.add("show");
  }
}

function selecionar(opcao_filtro) {

  // pega o apelido e o numero de serie dos componentes
  const componenteLista = document.getElementById("listaComponentes")
  componenteLista.innerHTML = ''
  for (let i = 0; i < componentesEstatico.length; i++) {

    if (componentesEstatico[i].tipo.toLowerCase().includes(opcao_filtro.toLowerCase())) {
      let componente = `
                                    <div class="componente" id="componente">
                                        <div class="apelido">
                                            ${componentesEstatico[i].apelido}
                                        </div>  
                                        <div class="tipoNumComponente" id="tipoNumComponente">
                                            ${componentesEstatico[i].tipo}#${componentesEstatico[i].numero_serie}
                                        </div>
                                        <div class="icons">
                                            <label class="switch">
                                                <input type="checkbox">
                                                <span class="slider round"></span>
                                            </label>
                              <a href="./tela-edicao-componentes.html?id=${componentesEstatico[i].idComponente}&servidor=${componentesEstatico[i].idServidor}&tipocomp=${componentesEstatico[i].tipo}"> 
                                            <img src="../assets/icon/editar-amarelo.svg" alt="Editar" class="imgGSV" id="editar">
                                            </a>
                                            
                                        </div>  
                                    </div>  
                              `;
      componenteLista.innerHTML += componente;
    }

  }

}

function chamarModal() {
  let id = sessionStorage.getItem('servidorID')
  if (cargoUsuario === "Gestor") {
    const modal = document.querySelector('.container-modal')
    const btn_excluir = document.getElementById('btn_excluir');
    btn_excluir.innerHTML = `<button class="btn-add" onclick="excluirServidor(${id})">excluir</button>   <button class="btn-add" onclick="fecharModal()">voltar</button>`
    modal.classList.add('active-modal')
  }
}

function fecharModal() {
  const modal = document.querySelector('.container-modal')
  modal.classList.remove('active-modal')
}


function excluirServidor(idServidor) {
  let iptExcluir = ipt_excluir.value;
  iptExcluir.toLowerCase();
  if (iptExcluir == "excluir") {
    fetch(`/servidores/excluirServidor/${idServidor}`, {
      method: "GET"
    })
      .then(function (resposta) {
        console.log("resposta:", resposta);
        location.reload()
        fecharModal()
        if (resposta.ok) {
          resposta.json().then(function (resposta) {
            console.log("Dados recebidos: ", JSON.stringify(resposta));
          });
        } else {
          throw "Houve um erro ao tentar listar os servidores!";
        }
      })
      .catch(function (resposta) {
        console.log(`#ERRO: ${resposta}`);
      });
    window.location = 'tela-servidores.html'
  } else {
    fecharModal()
  }
}

function editarApelidoServidor() {
  const modalEditar = document.getElementById('modal-editar');
  const apelidoAtual = sessionStorage.getItem('servidorApelido');

  document.getElementById('novo_apelido').value = apelidoAtual || '';
  modalEditar.classList.add('active-modal');
}

function fecharModalEditar() {
  const modalEditar = document.getElementById('modal-editar');
  modalEditar.classList.remove('active-modal');
}

function salvarNovoApelido() {
  const novoApelido = document.getElementById('novo_apelido').value.trim();
  const idServidor = sessionStorage.getItem('servidorID');
  const mensagemModal = document.getElementById('mensagem-modal');

  if (!novoApelido) {
    mensagemModal.textContent = "Digite um apelido válido!";
    mensagemModal.style.color = "orange";
    return;
  }

  fetch(`/servidores/editarApelido/${idServidor}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apelido: novoApelido })
  })
    .then(resposta => {
      if (resposta.ok) {
        mensagemModal.textContent = "Apelido alterado com sucesso!";
        mensagemModal.style.color = "limegreen";

        document.getElementById('nome').textContent = novoApelido;
        sessionStorage.setItem('servidorApelido', novoApelido);
        setTimeout(() => {
          fecharModalEditar();
        }, 3000);
      } else {
        mensagemModal.textContent = "Erro ao alterar apelido. Tente novamente.";
        mensagemModal.style.color = "red";
      }
    })
    .catch(erro => console.error("Erro:", erro));
}


window.onload = function () {
  /* receberIdServidor();*/
  listarComponentes();
  pesquisar();
}