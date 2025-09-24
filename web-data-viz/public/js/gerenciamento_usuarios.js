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

function alertaDeletar() {
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
            Swal.fire({
                title: "Deletado!",
                text: "O usuário foi deletado com sucesso!",
                icon: "success"
            });
        }
    });
}
