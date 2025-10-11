function abrirPopupEditar() {
  Swal.fire({
    title: 'Editar perfil',
    html: `
      <div style="display:flex;flex-direction:column;gap:12px;align-items:center;padding-top:6px;">
        <input id="inputNome" class="swal2-input" placeholder="Novo nome" style="width:80%;margin:0 auto;">
        <input id="inputFoto" type="file" accept="image/*" style="width:80%; margin:0 auto;">
        <img id="previewFoto" src="" alt="Prévia" style="display:none;width:100px;height:100px;border-radius:50%;object-fit:cover;">
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Salvar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#f1c40f',
    cancelButtonColor: '#999',
    didOpen: () => {
      const popup = Swal.getPopup();
      const inputFoto = popup.querySelector('#inputFoto');
      const preview = popup.querySelector('#previewFoto');

      // Mostra a prévia da foto ao selecionar
      inputFoto.addEventListener('change', () => {
        const file = inputFoto.files[0];
        if (!file) {
          preview.style.display = 'none';
          preview.src = '';
          return;
        }
        const reader = new FileReader();
        reader.onload = e => {
          preview.src = e.target.result;
          preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
      });
    },
    preConfirm: () => {
      const popup = Swal.getPopup();
      const nome = popup.querySelector('#inputNome').value.trim();
      const fotoFile = popup.querySelector('#inputFoto').files[0];

      if (!nome && !fotoFile) {
        Swal.showValidationMessage('Informe ao menos um campo para editar');
        return false;
      }

      return { nome, fotoFile };
    }
  }).then(result => {
    if (!result.isConfirmed) return;

    const { nome, fotoFile } = result.value;

    // Atualiza nome na tela, se existir
    if (nome) {
      const nomeParagrafo = document.querySelector('.dados-usuario p');
      if (nomeParagrafo) nomeParagrafo.innerHTML = `<strong>Nome:</strong> ${nome}`;
    }

    // Atualiza foto de perfil localmente, se existir
    if (fotoFile) {
      const reader = new FileReader();
      reader.onload = e => {
        const img = document.querySelector('.foto-perfil img');
        if (img) img.src = e.target.result;
      };
      reader.readAsDataURL(fotoFile);
    }

    // Mensagem final de sucesso
    Swal.fire({
      icon: 'success',
      title: 'Perfil atualizado!',
      text: 'As alterações foram aplicadas com sucesso.',
      confirmButtonColor: '#f1c40f'
    });
  });
}
