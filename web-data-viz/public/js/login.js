
function entrar() {
        aguardar();

        var emailVar = email.value;
        var senhaVar = senha.value;

        if (emailVar == "" || senhaVar == "") {
            finalizarAguardar("(Mensagem de erro para todos os campos em branco)");
            return false;
        }
        else {
        }

        console.log("FORM LOGIN: ", emailVar);
        console.log("FORM SENHA: ", senhaVar);

        fetch("/usuarios/autenticar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                emailServer: emailVar,
                senhaServer: senhaVar
            })
        }).then(function (resposta) {
            console.log("ESTOU NO THEN DO entrar()!")

            if (resposta.ok) {
                console.log(resposta);

                resposta.json().then(json => {
                    console.log(json);
                    console.log(JSON.stringify(json));
                    sessionStorage.USUARIO_CARGO = json.cargo;
                    sessionStorage.EMAIL_USUARIO = json.email;
                    sessionStorage.NOME_USUARIO = json.nome;
                    sessionStorage.ID_USUARIO = json.id;
                    sessionStorage.ID_EMPRESA = json.idEmpresa;

                    setTimeout(function () {
                        window.location = "../dashboard/dashboard.html";
                    }, 1000); // apenas para exibir o loading

                });

            } else {
                console.log("Houve um erro ao tentar realizar o login!");

                resposta.text().then(texto => {
                    console.error(texto);
                    finalizarAguardar(texto);
                });
            }

        }).catch(function (erro) {
            console.log(erro);
        })

        return false;
    }


