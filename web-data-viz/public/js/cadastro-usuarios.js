let vetorUsuarios = [];
let vetorServidores = [];

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
          window.location = "tela-usuarios.html";
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

          document.getElementById('ipt_pesquisar_server').style.display = 'none';
          document.getElementById('label_pesquisar_server').style.display = 'none';

          let tabela = document.querySelector('#tabela1');
          let frase = ``;

          for (let i = 0; i < resposta.length; i++) {
            frase += `
                        <div class="div-colunas">
                          <div class="editar-coluna">
                            <p>Editar</p>
                            <a onclick="listarUmFuncionario(${resposta[i].id})"> 
                                  <img src="../assets/icon/edit-icon.png" alt="Icone de edição" class="iconeTabela"> 
                            </a>
                            <img src="../assets/imgs/av1.png" alt="Foto de perfil" class="foto-perfil">
                          </div>
                          <div class="info-user">
                            <p>ID: ${resposta[i].id} </p>
                            <p>Nome: ${resposta[i].nome} </p>
                            <p>Cargo: ${resposta[i].cargo} </p>
                          </div>
                        </div>

                      `;

            vetorUsuarios.push({
              id: resposta[i].id,
              nome: resposta[i].nome,
              cargo: resposta[i].cargo
            });
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

  return fetch(`/usuarios/listarUm/${id}/${idEmpresa}`)
    .then(function (resposta) {
      console.log("resposta: ", resposta);

      if (resposta.ok) {
        resposta.json().then(function (resposta) {
          console.log("Dados recebidos: ", JSON.stringify(resposta));

          document.getElementById('editar-funcionario-container').style.display = 'flex';

          let editarCard = document.getElementById('editar-funcionario-card');

          editarCard.innerHTML = `
            <div class="editar-coluna">
              <a onclick="alertaSalvar()"> 
                <img src="../assets/icon/check-icon.png" alt="Salvar" class="iconeTabela"> 
              </a>
              <a onclick="excluirFuncionario(${resposta[0].id})"> 
                <img src="../assets/icon/delete-icon.png" alt="Deletar" class="iconeTabela"> 
              </a>
              <img src="../assets/imgs/av1.png" alt="Foto de perfil" class="foto-perfil">
            </div>
            <div class="info-user">
              <p>ID: ${resposta[0].id}</p>
              <p>Nome: ${resposta[0].nome}</p>
              <p>Cargo: ${resposta[0].cargo}</p>
            </div>
          `;

          document.getElementById('ipt_pesquisar_server').style.display = 'block';
          document.getElementById('label_pesquisar_server').style.display = 'block';

          listarServidoresFuncionario(resposta[0].id);
        });
      } else {
        throw "Houve um erro ao tentar listar o funcionário!";
      }
    })
    .catch(function (resposta) {
      console.log(`#ERRO: ${resposta}`);
    });

}

function listarServidoresFuncionario(id) {
  let idEmpresa = sessionStorage.ID_EMPRESA;

  fetch(`/usuarios/listarServidores/${idEmpresa}`)
    .then(function (resposta) {
      console.log("resposta: ", resposta);

      if (resposta.ok) {
        resposta.json().then(function (resposta) {
          console.log("Dados recebidos: ", JSON.stringify(resposta));


          let tabela = document.getElementById('tabela2');
          let frase = ``;

          for (let i = 0; i < resposta.length; i++) {
            const checkedAttr = (resposta[i].idFuncionario === id) ? "checked" : "";

            frase += `
                      <tr>
                          <td>ID: ${resposta[i].idServidor} </td>
                          <td>Apelido: ${resposta[i].apelido} </td>
                          <td>
                            <label class="switch">
                                <input type="checkbox" ${checkedAttr} onchange="editarServidorFuncionario(${id}, ${resposta[i].idServidor}, this)">
                                <span class="slider round"></span>
                            </label>
                          </td>
                        </tr>`;

            vetorServidores.push({
              id: resposta[i].idServidor,
              apelido: resposta[i].apelido
            });
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

function editarServidorFuncionario(id, idServidor, checkbox) {
  var id = sessionStorage.ID_USUARIO;

  if (checkbox.checked) {
    console.log('Toggle ligado');

    fetch(`/usuarios/adicionarServidor/${id}/${idServidor}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(function (resposta) {
        console.log("resposta: ", resposta);

        if (resposta.ok) {
          finalizarAguardar("Cadastro de servidor por funcionário realizado com sucesso!!...");
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


  } else {
    console.log('Toggle desligado');

    fetch(`/usuarios/desassociarServidor/${id}/${idServidor}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(function (resposta) {
        console.log("resposta: ", resposta);

        if (resposta.ok) {
          document.getElementById("section_erros_login").style.backgroundColor = '#069006';

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
}


/* Sweet Alerts */

function alertaSalvar() {
  swal.fire({
    title: "Você deseja salvar as alterações?",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "Salvar",
    confirmButtonColor: 'rgba(200, 156, 0, 1)',
    denyButtonText: "Não salvar",
    denyButtonColor: 'rgba(148, 0, 0, 1)',
    cancelButtonText: "Cancelar",
    cancelButtonColor: '#222'

  }).then((result) => {

    if (result.isConfirmed) {
      swal.fire("Salvo!", "", "success");
      listarFuncionarios();

      document.querySelector('#tabela2').style.display = 'none';
      document.getElementById('editar-funcionario-container').style.display = 'none';

    } else if (result.isDenied) {
      swal.fire("As alterações não foram salvas", "", "info");
      listarFuncionarios();

      document.querySelector('#tabela2').style.display = 'none';
      document.getElementById('editar-funcionario-container').style.display = 'none';
    }

  });
}

function excluirFuncionario(id) {
  Swal.fire({
    title: "Tem certeza que deseja deletar?",
    text: "Você não poderá reverter as alterações!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "rgba(200, 156, 0, 1)",
    cancelButtonColor: "rgba(148, 0, 0, 1)",
    confirmButtonText: "Sim, quero deletar!",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {

      document.querySelector('#tabela2').style.display = 'none';
      document.getElementById('editar-funcionario-container').style.display = 'none';

      document.getElementById('ipt_pesquisar_server').style.display = 'none';
      document.getElementById('label_pesquisar_server').style.display = 'none';

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

            listarFuncionarios();

            document.getElementById("section_erros_login").style.backgroundColor = '#069006';

            finalizarAguardar(
              Swal.fire({
                title: "Deletado!",
                text: "O usuário foi deletado com sucesso!",
                icon: "success"
              })
            );

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


function pesquisarFuncionario() {
  let iptPesquisar = document.getElementById('ipt_pesquisar_user');
  let pesquisaDigitada = iptPesquisar.value.toLowerCase();

  let tabela = document.querySelector('#tabela1');
  let frase = ``;

  for (let i = 0; i < vetorUsuarios.length; i++) {
    if (vetorUsuarios[i].nome.toLowerCase().includes(pesquisaDigitada)) {
      frase += `
        <div class="div-colunas">
          <div class="editar-coluna">
            <p>Editar</p>
            <a onclick="listarUmFuncionario(${vetorUsuarios[i].id})"> 
              <img src="../assets/icon/edit-icon.png" alt="Icone de edição" class="iconeTabela"> 
            </a>
            <img src="../assets/imgs/av1.png" alt="Foto de perfil" class="foto-perfil">
          </div>
          <p>ID: ${vetorUsuarios[i].id} </p>
          <p>Nome: ${vetorUsuarios[i].nome} </p>
          <p>Cargo: ${vetorUsuarios[i].cargo} </p> 
        </div>`;
    }
  }

  tabela.innerHTML = frase;
}


function pesquisarServidor() {
  let iptPesquisar = document.getElementById('ipt_pesquisar_server');
  let pesquisaDigitada = iptPesquisar.value.toLowerCase();


  let tabela = document.querySelector('#tabela2');
  let frase = ``;

  for (let i = 0; i < vetorServidores.length; i++) {
    if (vetorServidores[i].apelido.toLowerCase().includes(pesquisaDigitada)) {
      frase += `
        <tr>
          <td>ID: ${vetorServidores[i].id} </td>
          <td>Apelido: ${vetorServidores[i].apelido} </td>
          <td>
              <label class="switch">
                <input type="checkbox" onchange="editarServidorFuncionario(${vetorServidores[i].id})">
              <span class="slider round"></span>
              </label>
          </td>
        </tr>`;
    }
  }

  tabela.innerHTML = frase;
}