function telaCadastroServidor() {
  window.location.href = "tela-cadastro-servidor.html"
}

function listarServidoresPorEmpresa() {
  var idEmpresa = sessionStorage.ID_EMPRESA
   console.log(idEmpresa)

  fetch(`/servidores/listarServidoresPorEmpresa/${idEmpresa}`)
    .then(function (resposta) {
      console.log("resposta:", resposta);

      if (resposta.ok) {
        resposta.json().then(function (resposta) {
          console.log("Dados recebidos: ", JSON.stringify(resposta));

          let tabela = document.querySelector('table');
          let frase = `
                    <tr>
                        <th style="font-weight:600"> Apelido </th>
                        <th style="font-weight:600"> IP </th>
                    </tr>`;

          for (let i = 0; i < resposta.length; i++) {
            frase += `
                        <tr>
                          <th> ${resposta[i].apelido} </th>
                          <th> ${resposta[i].ip} </th> 
                          <th>
                              <a onclick="alertaSalvar(${resposta[i].id})"> 
                                  <img src="../assets/icon/edit-icon.png" alt="Icone de edição" class="iconeTabela"> 
                              </a>
                              <a onclick="excluirFuncionario(${resposta[i].id})"> 
                                  <img src="../assets/icon/delete-icon.png" alt="Icone de excluir" class="iconeTabela"> 
                              </a>
                          </th>
                        </tr>`;
          }

          tabela.innerHTML = frase;
        });
      } else {
        throw "Houve um erro ao tentar listar os servidores!";
      }
    })
    .catch(function (resposta) {
      console.log(`#ERRO: ${resposta}`);
    });
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

