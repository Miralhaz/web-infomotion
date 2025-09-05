function validar_cadastrar(){
    if(confereRegex()){
        cadastrar()
    } else {
        alert('CNPJ inválido, ele precisa ter 14 digitos')
    }
}
  
function cadastrar() {
     aguardar();

    var nomeVar = nome_empresa.value;
    var cnpjVar = cnpj.value;    
    if(cnpjVar.includes("-")){
      cnpjVar = cnpjVar.replace(/[-./]/g, "");
    }          

    sessionStorage.CNPJ_EMPRESA = cnpjVar;
    console.log(nomeVar, cnpjVar)

    // Verificando se há algum campo em branco
    if (
      nomeVar == "" ||
      cnpjVar == "" 
    ) {
      cardErro.style.display = "block";
      alert("(Mensagem de erro para todos os campos em branco)");

      finalizarAguardar();
      return false;
    } else {
      setInterval(sumirMensagem, 5000);
    }

    // Enviando o valor da nova input
    fetch("/empresas/cadastrar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // crie um atributo que recebe o valor recuperado aqui
        // Agora vá para o arquivo routes/usuario.js
        nomeServer: nomeVar,
        cnpjServer: cnpjVar
      }),
    })
      .then(function (resposta) {
        console.log("resposta: ", resposta);

        if (resposta.ok) {
          alert("Cadastro realizado com sucesso! Redirecionando para tela de cadastro de gestor...");

          setTimeout(() => {
            window.location = "cadastro-gestor.html";
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

function confereRegex(){
    const campo = document.getElementById("cnpj").value;

    if(campo.includes(".")){
        let regex = /\b\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}\b/g;
        let formatado = campo.match(regex);

        if(formatado != null){
            return true;
        } else {
            return false;
        }

    } else{
        let regex = /\d{14}/g;
        let formatado = campo.match(regex);

        if(formatado != null){
            return true;
        } else {
            return false;
        }
    }
}


