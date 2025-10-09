var listaServidores = {}

function exibirServidor(apelido, id, ip) {
  let html = `
              <div class="card-servidor">
                <div class="card-top">
                  <h3>${apelido}</h3>
                  <div class="acoes">
                    <a href="./tela-gerenciamento-servidor.html?id=${id}">
                      <img src="../assets/icon/edit-icon.png" alt="Editar" class="iconeTabela">
                    </a>
                    <a onclick="chamarModal(${id})">
                      <img src="../assets/icon/delete-icon.png" alt="Excluir" class="iconeTabela">
                    </a>
                  </div>
                </div>

                <p class="ip">IP: ${ip}</p>

                <div class="metricas">
                  <div><span>CPU</span><strong>13%</strong></div>
                  <div><span>RAM</span><strong>63%</strong></div>
                  <div><span>DISCO</span><strong>52%</strong></div>
                </div>
              </div>`;
  return html;
}


function telaCadastroServidor() {
  window.location.href = "tela-cadastro-servidor.html"
}

function listarServidoresPorUsuario() {
  var idUsuario = sessionStorage.ID_USUARIO

  fetch(`/servidores/listarServidoresPorUsuario/${idUsuario}`)
    .then(function (resposta) {
      console.log("resposta:", resposta);

      if (resposta.ok) {
        resposta.json().then(function (resposta) {
          console.log("Dados recebidos: ", JSON.stringify(resposta));
          listaServidores = resposta;
          sessionStorage.ID_SERVIDORES = resposta.map(resposta => resposta.id)



          let container = document.querySelector('.listagem-servidores');


          let html = ""
          for (let i = 0; i < listaServidores.length; i++) {
            let apelido = listaServidores[i].apelido
            let id = listaServidores[i].id
            let ip = listaServidores[i].ip

            html += exibirServidor(apelido, id, ip);

          }
          container.innerHTML = html


        });
      } else {
        throw "Houve um erro ao tentar listar os servidores!";
      }
    })
    .catch(function (resposta) {
      console.log(`#ERRO: ${resposta}`);
    });
}


function pesquisarServidores() {
  let pesquisa = ipt_pesquisarServidor.value
  let container = document.querySelector('.listagem-servidores');
  let html = ""
  for (let i = 0; i < listaServidores.length; i++) {
    if (listaServidores[i].apelido.toLowerCase().includes(pesquisa)) {
      let apelido = listaServidores[i].apelido
      let id = listaServidores[i].id
      let ip = listaServidores[i].ip

      html += exibirServidor(apelido, id, ip);


    }


  }
  container.innerHTML = html


}

function cadastrar() {
  aguardar();
  var nomeVar = nome.value
  var ipVar = ip.value
  var idEmpresaVar = sessionStorage.ID_EMPRESA

  if (
    nomeVar == "" ||
    ipVar == "" ||
    idEmpresaVar == ""
  ) {
    finalizarAguardar("(Mensagem de erro para todos os campos em branco)");
    return false;
  }

  fetch("/servidores/cadastrar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nomeServer: nomeVar,
      ipServer: ipVar,
      idServer: idEmpresaVar,

    }),
  })
    .then(function (resposta) {
      console.log("resposta: ", resposta);

      if (resposta.ok) {
        finalizarAguardar("Cadastro realizado com sucesso! Redirecionando para tela de login...");

        setTimeout(() => {
          window.location = "tela-servidores.html";
        }, "2000");

        limparFormulario();
        finalizarAguardar();
      } else {
        throw "Houve um erro ao tentar realizar o cadastro!";
      }
    })
    .catch(function (resposta) {
      console.log(`#ERRO: ${resposta}`);
      finalizarAguardar();
    });

  return false;
}

function chamarModal(id) {
  const modal = document.querySelector('.container-modal')
  const btn_excluir = document.getElementById('btn_excluir');

  btn_excluir.innerHTML = `<button class="btn-add" onclick="excluirServidor(${id})">excluir</button>   <button class="btn-add" onclick="fecharModal()">voltar</button>`
  modal.classList.add('active-modal')
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

  } else {
    fecharModal()
  }


}

