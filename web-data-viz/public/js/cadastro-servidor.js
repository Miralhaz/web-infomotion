function telaCadastroServidor() {
  window.location.href = "tela-cadastro-servidor.html"
}

function listarServidor() {
  let idEmpresa = sessionStorage.idEmpresa;

  fetch(`/servidores/listarServidoresPorEmpresa/${idEmpresa}`)
    .then(function (resposta) {
      console.log("resposta: ", resposta);

      if (resposta.ok) {
        resposta.json().then(function (resposta) {
          console.log("Dados recebidos: ", JSON.stringify(resposta));

          let tabela = document.querySelector('table');
          let frase = `
                    <tr>
                        <th style="font-weight:600"> Nome </th>
                        <th style="font-weight:600"> Cargo </th>
                    </tr>`;

          for (let i = 0; i < resposta.length; i++) {
            frase += `
                        <tr>
                          <th> ${resposta[i].nome} </th>
                          <th> ${resposta[i].cargo} </th> 
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
        throw "Houve um erro ao tentar listar os funcionários!";
      }
    })
    .catch(function (resposta) {
      console.log(`#ERRO: ${resposta}`);
    });
}
