const idUsuario = sessionStorage.getItem("ID_USUARIO")

function carregarPerfil() {
  
  if (!idUsuario) {
    alert("Usuário não identificado. Faça login novamente.");
    window.location = "../login.html";
    return;
  }

  fetch(`http://localhost:3333/usuarios/${idUsuario}`)
    .then(resposta => {
      if (!resposta.ok) {
        throw new Error("Erro ao buscar os dados do usuário");
      }
      return resposta.json();
    })
    .then(usuario => {
      // Preenche os spans com as informações do usuário
      document.getElementById("usuarioNome").textContent = usuario.nome;
      document.getElementById("usuarioCargo").textContent = usuario.cargo;
      document.getElementById("usuarioEmpresa").textContent = usuario.empresa;
      document.getElementById("usuarioEmail").textContent = sessionStorage.EMAIL_USUARIO;

      // Formata a data de cadastro
      const dataFormatada = new Date(usuario.dt_cadastro).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
      document.getElementById("usuarioData").textContent = dataFormatada;
    })
    .catch(erro => {
      console.error("Erro ao carregar perfil:", erro);
    });
    var cargoUsuario = sessionStorage.getItem("USUARIO_CARGO")
    document.addEventListener("DOMContentLoaded", function () {
    if(cargoUsuario != "Gestor"){
        var elemento = document.getElementById("usuario-header");
        elemento.style.display = "none";
    }
    })
}

function carregarServidores() {
  console.log("idUsuario", idUsuario);
  
  if (!idUsuario) {
    alert("Usuário não identificado. Faça login novamente.");
    window.location = "../login.html";
    return;
  }

  fetch(`http://localhost:3333/servidores/listarServidoresPorUsuario/${idUsuario}`)
    .then(res => {
      if (!res.ok) throw new Error("Erro ao buscar servidores");
      return res.json();
    })
    .then(servidores => {
      const lista = document.getElementById("listaServidores");
      lista.innerHTML = ""; // limpa qualquer coisa anterior

      if (servidores.length === 0) {
        lista.innerHTML = "<p>Nenhum servidor encontrado.</p>";
        return;
      }

      servidores.forEach(servidor => {
        const card = document.createElement("div");
        card.classList.add("servidor-card");

        card.innerHTML = `
          <div><strong>Nome:</strong> ${servidor.apelido}</div>
          <div><strong>IP:</strong> ${servidor.ip}</div>
        `;

        lista.appendChild(card);
      });
    })
    .catch(erro => {
      console.error("Erro ao carregar servidores:", erro);
      document.getElementById("listaServidores").innerHTML =
        "<p>Erro ao carregar servidores.</p>";
    });
}

function abrirPopupEditar() {
  Swal.fire({
    title: 'Editar Perfil',
    html: `
      <input id="inputNome" class="swal2-input" placeholder="Novo nome">
      
    `,
    confirmButtonText: 'Salvar alterações',
    confirmButtonColor: '#ffc64b',
    focusConfirm: false,
    preConfirm: () => {
      const nome = document.getElementById('inputNome').value;
      return nome;
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const novoNome = result.value;
      const idUsuario = sessionStorage.ID_USUARIO;

      fetch(`http://localhost:3333/usuarios/atualizarPerfil/${idUsuario}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome: novoNome })
      })
      .then(res => {
        if (!res.ok) throw new Error('Erro ao atualizar perfil');
        return res.json();
      })
      .then(data => {
        Swal.fire({
          icon: 'success',
          title: 'Perfil atualizado!',
          text: 'Seu nome foi atualizado com sucesso.',
          confirmButtonColor: '#ffc64b',
        });

        // Atualiza o nome na tela sem recarregar
        document.getElementById("usuarioNome").textContent = novoNome;
      })
      .catch(err => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Não foi possível atualizar o perfil.',
          confirmButtonColor: '#dc3545'
        });
      });
    }
  });
}

function fotoPerfil(){
 let urlFoto = sessionStorage.URL_FOTO;
 if(urlFoto == "undefined"){
    foto_perfil.innerHTML += '<img src="../assets/imgs/undefinned_foto.jpg" id="foto-perfil" alt="Foto de perfil">';
 }else{
    foto_perfil.innerHTML += '<img src="' + urlFoto + '" id="foto-perfil" alt="Foto de perfil">';
 }
} 

window.onload = () => {
 
  carregarPerfil();
  carregarServidores()
};