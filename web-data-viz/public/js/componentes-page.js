const params = new URLSearchParams(window.location.search);
const idServidor = params.get('id');

/*function receberIdServidor() {
  const idUsuario = sessionStorage.getItem('ID_USUARIO')
        fetch(`/servidores/listarServidores/${idUsuario}`, {
            method: "GET"
        }).then(function (resposta) {
            console.log("ESTOU NO THEN DO receberIdServidor()!")

            if (resposta.ok) {
                console.log(resposta);

                resposta.json().then(json => {
                    console.log(json);
                    console.log(JSON.stringify(json),"fetch de buscar servidores depois do stringify: ", json);
                    ids = []
                    for (let index = 0; index < json.length; index++) {
                      ids.push(json[index].fk_servidor)
                    }console.log("vetor de ids",ids);
                    sessionStorage.setItem('ID_SERVIDOR', JSON.stringify(ids))
                    console.log("primeiro id: ", JSON.parse(sessionStorage.ID_SERVIDOR)[0]);
                    console.log("segundo id: ", JSON.parse(sessionStorage.ID_SERVIDOR)[1]);
                    
                });

            } else {
                console.log("Houve um erro ao tentar receber os ids dos servidores!");

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

*/

function listarComponentes() {
  /* const listaIdServidor = sessionStorage.getItem('ID_SERVIDOR') */
  /* for (let index = 0; index < listaIdServidor.length; index++) { */
   /* const idServidor = listaIdServidor[index]; */
    
    fetch(`/componentes/listarComponentes/${idServidor}`)
      .then(function (resposta) {
        console.log("resposta: ", resposta);

        if (resposta.ok) {
          resposta.json().then(function (resposta) {
            console.log("Dados recebidos: ", JSON.stringify(resposta));

            const componenteLista = document.getElementById('listaComponentes')
            for (let i = 0; i < resposta.length; i++) {
                  let componente = `
                                    <div class="componente" id="componente">
                                        <div class="apelido">
                                            ${resposta[i].apelido}
                                        </div>  
                                        <div class="tipoNumComponente" id="tipoNumComponente">
                                            ${resposta[i].tipo}#${resposta[i].numero_serie}
                                        </div>
                                        <div class="icons">
                                            <label class="switch">
                                                <input type="checkbox">
                                                <span class="slider round"></span>
                                            </label>
                              <a href="./tela-edicao-componentes.html?id=${resposta[i].id}&servidor=${idServidor}"> 
                                            <img src="../assets/icon/editar.svg" alt="Editar" class="imgGSV" id="editar">
                                            </a>
                                            
                                        </div>  
                                    </div>  
                              `;
              componenteLista.innerHTML += componente;
            }

            
          });
        } else {
          throw "Houve um erro ao tentar listar os componentes!";
        }
      })
      .catch(function (resposta) {
        console.log(`#ERRO: ${resposta}`);
      });
 /* } */
}


window.onload = function() {
 /* receberIdServidor();*/
  listarComponentes();
}