
function cadastrar() {
    aguardar();

    var nomeVar = nome.value;
    var senhaVar = senha.value;
    var emailVar = email.value;
    var cnpjVar = sessionStorage.CNPJ_EMPRESA;    


    // Verificando se há algum campo em branco
    if (
      nomeVar == "" ||
      cnpjVar == "" ||
      senhaVar == "" ||
      emailVar == "" 
    ) {
      cardErro.style.display = "block";
      alert("(Mensagem de erro para todos os campos em branco)");

      finalizarAguardar();
      return false;
    } else {
      setInterval(sumirMensagem, 5000);
    }

    // Enviando o valor da nova input
    fetch("/usuarios/cadastrar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nomeServer: nomeVar,
        cnpjServer: cnpjVar,
        senhaServer: senhaVar,
        emailServer: emailVar

      }),
    })
      .then(function (resposta) {
        console.log("resposta: ", resposta);

        if (resposta.ok) {
          alert("Cadastro realizado com sucesso! Redirecionando para tela de login...");

          setTimeout(() => {
            window.location = "login.html";
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

  // Listando empresas cadastradas 
  function listar() {
    fetch("/empresas/listar", {
      method: "GET",
    })
      .then(function (resposta) {
        resposta.json().then((empresas) => {
          empresas.forEach((empresa) => {
            listaEmpresasCadastradas.push(empresa);

            console.log("listaEmpresasCadastradas")
            console.log(listaEmpresasCadastradas[0].codigo_ativacao)
          });
        });
      })
      .catch(function (resposta) {
        console.log(`#ERRO: ${resposta}`);
      });
  }

  function sumirMensagem() {
    cardErro.style.display = "none";
}


