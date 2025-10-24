var listaServidores = []

function exibirServidor(apelido, id, ip, uso_cpu, uso_ram, uso_disco) {
  let html = `
            <div onclick="irParaDash(${id})">
              <div class="card-servidor">
                <div class="card-top">
                  <h3>${apelido}</h3>
                  <div class="acoes">
                    <a onclick="event.stopPropagation(); telaEdicaoServidor('${apelido}', '${ip}', ${id})">
                      <img src="../assets/icon/edit-icon.png" alt="Editar" class="iconeTabela">
                    </a>
                    <a onclick="event.stopPropagation(); chamarModal(${id})">
                      <img src="../assets/icon/delete-icon.png" alt="Excluir" class="iconeTabela">
                    </a>
                  </div>
                </div>

                <p class="ip">IP: ${ip}</p>

                <div class="metricas">
                  <div><span>CPU</span><strong>${uso_cpu}%</strong></div>
                  <div><span>RAM</span><strong>${uso_ram}%</strong></div>
                  <div><span>DISCO</span><strong>${uso_disco}%</strong></div>
                </div>
              </div>
            </div>`;
  return html;
}

function irParaDash(idServidor) {
    sessionStorage.ID_SERVIDOR_SELECIONADO = idServidor;
    window.location.href = 'dashboard.html'; 
}

function telaCadastroServidor() {
  window.location.href = "tela-cadastro-servidor.html"
}

function telaEdicaoServidor(apelido, ip, idServidor) {
  sessionStorage.setItem('servidorApelido', apelido);
  sessionStorage.setItem('servidorIP', ip);
  sessionStorage.setItem('servidorID', idServidor);

  window.location.href = "./tela-gerenciamento-servidor.html";
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
            let uso_cpu = listaServidores[i].uso_cpu
            let uso_ram = listaServidores[i].uso_ram
            let uso_disco = listaServidores[i].uso_disco

            html += exibirServidor(apelido, id, ip, uso_cpu, uso_ram, uso_disco);

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
      let uso_cpu = listaServidores[i].uso_cpu
      let uso_ram = listaServidores[i].uso_ram
      let uso_disco = listaServidores[i].uso_disco

      html += exibirServidor(apelido, id, ip, uso_cpu, uso_ram, uso_disco);


    }


  }
  container.innerHTML = html


}

function cadastrar() {
  aguardar();
  var nomeVar = nome.value
  var ipVar = ip.value
  var idEmpresaVar = sessionStorage.ID_EMPRESA
  var idUsuarioVar = sessionStorage.ID_USUARIO

  if (
    nomeVar == "" ||
    ipVar == "" ||
    idEmpresaVar == "" ||
    idUsuarioVar == ""
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
      idUsuarioServer: idUsuarioVar

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

function acionarFiltro() {

  // Aqui apenas aciono o menu do filtro, se caso estiver exibindo, fecha se não ele aparece ao usuário
  const menu = document.getElementById('menu')
  if (menu.classList.contains("show")) {
    menu.classList.remove("show");
  } else {
    menu.classList.add("show");
  }
}

function selecionar(opcao_filtro) {

  // Esses 3 pontos serve para copiar o vetor que esta o servidores, porque se eu usar o normal, nao vai dar para
  // reverter a ordenação depois, vai ter mudança permanente
  let servidoresFiltrados = [...listaServidores]


  // Aqui é pra galera que quer saber sobre o filtro, ele faz de ordem decrescente usando sort
  // ele ve a diferença que da entre os dois valores, e se for positivo b na frente do a se não a na frente do b
  if (opcao_filtro === 'CPU') {

    servidoresFiltrados.sort((a, b) => b.uso_cpu - a.uso_cpu)

  } else if (opcao_filtro === 'RAM') {

    servidoresFiltrados.sort((a, b) => b.uso_ram - a.uso_ram)

  } else if (opcao_filtro === 'DISCO') {

    servidoresFiltrados.sort((a, b) => b.uso_disco - a.uso_disco)

  }

  // Aqui apenas pega a classe .listagem-servidores que vou usar para mostrar os servidores na nova ordem
  let container = document.querySelector('.listagem-servidores');
  let html = "";

  // Mesmo processo do exibirServidores()
  for (let i = 0; i < servidoresFiltrados.length; i++) {
    let apelido = servidoresFiltrados[i].apelido;
    let id = servidoresFiltrados[i].id;
    let ip = servidoresFiltrados[i].ip;
    let uso_cpu = servidoresFiltrados[i].uso_cpu;
    let uso_ram = servidoresFiltrados[i].uso_ram;
    let uso_disco = servidoresFiltrados[i].uso_disco;

    html += exibirServidor(apelido, id, ip, uso_cpu, uso_ram, uso_disco);
  }

  container.innerHTML = html;

  // Aqui apenas verifica se o menu ja está exibindo, se tiver, quando o cara
  // clicar na opção, o menu vai sumir
  const menu = document.getElementById("menu")
  if (menu.classList.contains("show")) {
    menu.classList.remove("show")
  }
}