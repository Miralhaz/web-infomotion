function cadastrarFuncionario(){ 
        aguardar();
        
        const radioSelecionado = document.querySelector('input:[name="cargo_func"]:checked')

        var nomeVar = nome.value;
        var senhaVar = senha.value;
        var emailVar = email.value;
        var cargoVar = radioSelecionado.value;


    // Verificando se há algum campo em branco
    if (
      nomeVar == "" ||
      emailVar == "" ||
      senhaVar == "" ||
      cargoVar == "" 
    ) {
      
      finalizarAguardar("(Mensagem de erro para todos os campos em branco)");

      
      return false;
    } else {
      
    }

    // Enviando o valor da nova input
    fetch("/usuarios/cadastrarFuncionario", {
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
          finalizarAguardar("Cadastro realizado com sucesso! Redirecionando para tela de login...");

          setTimeout(() => {
            window.location = "../login.html";
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
    console.log(idEmpresa);

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
                        <tr>
                          <th> ${resposta[i].nome} </th>
                          <th> ${resposta[i].cargo} </th> 
                          <th>
                              <a onclick="location.href='tela-gerenciamento-usuario.html'"> 
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

        fetch("/usuarios/excluir", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                idEmpresaServer: idEmpresa,
                idUsuarioServer: id
            }),
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