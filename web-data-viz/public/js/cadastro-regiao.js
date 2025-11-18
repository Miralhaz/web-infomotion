function cadastrarRede() {
  aguardar();
  var codigoVar = codigo.value
  var paisVar = pais.value
  var cidadeVar = cidade.value
  var idEmpresaVar = sessionStorage.ID_EMPRESA

  if (
    codigoVar == "" ||
    paisVar == "" ||
    cidadeVar == "" ||
    idEmpresaVar == "" 
  ) {
    finalizarAguardar("(Mensagem de erro para todos os campos em branco)");
    return false;
  }

  fetch("/servidores/cadastrarRede", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      idServer: idEmpresaVar,
      codigoServer: codigoVar,
      cidadeServer: cidadeVar,
      paisServer: paisVar

      
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