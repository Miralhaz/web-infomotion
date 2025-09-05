// sessão
function validarSessao() {
    var email = sessionStorage.EMAIL_USUARIO;
    var nome = sessionStorage.NOME_USUARIO;

    var b_usuario = document.getElementById("b_usuario");

    if (email != null && nome != null) {
        b_usuario.innerHTML = nome;
    } else {
        window.location = "../login.html";
    }
}

function limparSessao() {
    sessionStorage.clear();
    window.location = "../login.html";
}

// carregamento (loading)

function aguardar() {
    var sectionAguardar = document.getElementById("section_aguardar");
    sectionAguardar.style.display = "flex";
}

function finalizarAguardar(texto) {
    var sectionAguardar = document.getElementById("section_aguardar"); 
    var sectionErrosLogin = document.getElementById("section_erros_login");


    if (texto) {
        sectionErrosLogin.style.display = "flex";
        sectionErrosLogin.innerHTML = texto;

        setTimeout(() => {
            sectionErrosLogin.style.display = 'none';
        }, 5000);
    }

    setTimeout(() => {
            sectionAguardar.style.display = "none";
    }, 5000);
}