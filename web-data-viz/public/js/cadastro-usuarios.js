function telaCadastroFuncionario() {
  window.location.href = "tela-cadastro-usuario.html"
}


function cadastrarFuncionario() {
  aguardar();

  const radioSelecionado = document.querySelector('input[name="cargo_func"]:checked')

  var nomeVar = nome.value;
  var senhaVar = senha.value;
  var emailVar = email.value;
  var confirmarSenhaVar = confirmar_senha.value;
  var cargoVar = radioSelecionado.value;


  // Verificando se há algum campo em branco
  if (
    nomeVar == "" ||
    emailVar == "" ||
    senhaVar == "" ||
    cargoVar == ""
  ) {

    finalizarAguardar("Algum campo está em branco!!");
    return false

  } else if (senhaVar.length < 8) {

    finalizarAguardar("A senha deve conter pelo menos 8 caracteres")
    return false

  } else if (emailVar.indexOf('@') === -1 || emailVar.indexOf('.') === -1) {

    finalizarAguardar("O email deve conter @ e .")
    return false

  } else if (senhaVar !== confirmarSenhaVar) {

    finalizarAguardar("A senha deve coincidir com a confirmação de senha")
    return false

  }

  let idEmpresa = sessionStorage.ID_EMPRESA;

  // Enviando o valor da nova input
  fetch(`/usuarios/cadastrarFuncionario/${idEmpresa}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nomeServer: nomeVar,
      emailServer: emailVar,
      senhaServer: senhaVar,
      cargoServer: cargoVar

    }),
  })
    .then(function (resposta) {
      console.log("resposta: ", resposta);

      if (resposta.ok) {
        finalizarAguardar("Cadastro de funcionário realizado com sucesso!!...");

        setTimeout(() => {
          window.location = "tela-usuario.html";
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



function listarFuncionarios() {
  let idEmpresa = sessionStorage.ID_EMPRESA;

  fetch(`/usuarios/listar/${idEmpresa}`)
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
                        <tr id="row_${resposta[i].id}">
                          <th> ${resposta[i].nome} </th>
                          <th> ${resposta[i].cargo} </th> 
                          <th>
                              <a onclick="listarUmFuncionario(${resposta[i].id})"> 
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


function listarUmFuncionario(id) {
  let idEmpresa = sessionStorage.ID_EMPRESA;
  console.log("Chamando listarUmFuncionario com id:", id, "e idEmpresa:", idEmpresa);

    fetch(`/usuarios/listarUm/${id}/${idEmpresa}`)
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
                    </tr>

                      <tr id="row_${resposta[0].id}">
                          <th> ${resposta[0].nome} </th>
                          <th> ${resposta[0].cargo} </th> 
                          <th>
                              <a onclick="editarFuncionario(${resposta[0].id})"> 
                                  <img src="../assets/icon/check-icon.png" alt="Icone de edição" class="iconeTabela"> 
                              </a>
                              <a onclick="excluirFuncionario(${resposta[0].id})"> 
                                  <img src="../assets/icon/delete-icon.png" alt="Icone de excluir" class="iconeTabela"> 
                              </a>
                          </th>
                        </tr>
                        
                        <table class="table" onload="listarServidoresFuncionario(${resposta[0].id})"></table>`;
          
                      tabela.innerHTML = frase;

                });
            } else {
                throw "Houve um erro ao tentar listar o funcionário!";
            }
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });

}

listarServidoresFuncionario(id){
  let idEmpresa = sessionStorage.ID_EMPRESA;

    fetch(`/usuarios/listarServidores/${id}/${idEmpresa}`)
        .then(function (resposta) {
            console.log("resposta: ", resposta);

            if (resposta.ok) {
                resposta.json().then(function (resposta) {
                    console.log("Dados recebidos: ", JSON.stringify(resposta));

                    let tabela = document.querySelector('.table');

                  for (let i = 0; i < resposta.length; i++) {
                    let frase = `
                      <tr id="row_${resposta[i].id}">
                          <th> ${resposta[i].nome} </th>
                          <th>
                              <label class="switch">
                                <input type="checkbox">
                                <span class="slider round"></span>
                            </label>
                          </th>
                        </tr>`;
                  }
                      tabela.innerHTML = frase;

                });
            } else {
                throw "Houve um erro ao tentar listar os servidores do funcionario!";
            }
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });
    }


/* Sweet Alerts */

function alertaSalvar() {
  swal.fire({
    title: "Você deseja salvar as alterações?",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "Salvar",
    denyButtonText: "Não salvar",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      swal.fire("Salvo!", "", "success");
    } else if (result.isDenied) {
      swal.fire("As alterações não foram salvas", "", "info");
    }
  });
}

function excluirFuncionario(id) {
  Swal.fire({
    title: "Tem certeza que deseja deletar?",
    text: "Você não poderá reverter as alterações!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sim, quero deletar!",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {

      var idEmpresa = sessionStorage.ID_EMPRESA;

      fetch(`/usuarios/excluir/${id}/${idEmpresa}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(function (resposta) {
          console.log("resposta: ", resposta);

          if (resposta.ok) {
            var sectionErrosLogin = document.getElementById("section_erros_login");
            sectionErrosLogin.style.backgroundColor = '#069006';

            finalizarAguardar(
              Swal.fire({
                title: "Deletado!",
                text: "O usuário foi deletado com sucesso!",
                icon: "success"
              })
            );

            setTimeout(() => "2000");
          } else {
            throw "Houve um erro ao tentar realizar a exclusão!";
          }
        })
        .catch(function (resposta) {
          console.log(`#ERRO: ${resposta}`);
          finalizarAguardar();
        });

      return false;
    }
  });
}
