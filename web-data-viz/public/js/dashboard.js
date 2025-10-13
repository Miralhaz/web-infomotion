function listarServidores() {
    let idEmpresa = sessionStorage.ID_EMPRESA;

    fetch(`/servidores/listarServidores/${idEmpresa}`)
        .then(function (resposta) {
            console.log("resposta:", resposta);

            if (resposta.ok) {
                resposta.json().then(function (resposta) {
                    console.log("Dados recebidos: ", JSON.stringify(resposta));

                    const select = document.getElementById('servidores');

                    let frase = "";

                    for (let i = 0; i < resposta.length; i++) {
                        frase += `
                                <option value="${resposta[i].idServidor}" data-id="${resposta[i].idServidor}">${resposta[i].apelido}</option>
                        `;
                    }

                    select.innerHTML = frase;

                });

            } else {
                throw "Houve um erro ao tentar listar os servidores!";
            }
        })

        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });
}



function obterDadosKpi(idServidor) {

    fetch(`/servidores/obterDadosKpi/${idServidor}`)
        .then(function (resposta) {
            if (resposta.ok) {
                resposta.json().then(function (dados) {
                    console.log("Dados recebidos: ", JSON.stringify(dados));

                    let divs = document.querySelector('.div-kpis');
                    let frase = `
                <div class="uso-porcentagem">
                    <p>USO em % ATUAL</p>
                    <div class="div-content">
                        <div class="div-atual">
                            <p>Atual:</p>
                            <p>RAM: ${dados[0].uso_ram}</p>
                            <p>CPU: ${dados[0].uso_cpu}</p>
                            <p>DISCO: ${dados[0].uso_disco}</p>
                        </div>

                        <div class="div-atual">
                            <p>Parâmetro Máx:</p>
                            <p>RAM: %</p>
                            <p>CPU: %</p>
                            <p>DISCO: %</p>
                        </div>
                    </div>
                </div>

                <div>
                    <p>Temperatura atual:</p>
                    <div class="div-content">
                        <div class="temp-cpu">
                            <p>CPU</p>
                            <p>Máx: °C</p>
                            <p>Min: °C</p>
                            <div>
                                <p>${dados[0].temp_cpu}°C</p>
                            </div>
                        </div>

                        <div class="temp-disco">
                            <p>DISCO</p>
                            <p>Máx: °C</p>
                            <p>Min: °C</p>
                            <div>
                                <p>${dados[0].temp_disco}°C</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="qtd-proc">
                    <p>Quantidade total de processos</p>
                    <div class="div-content">
                        <p>${dados[0].qtd_processos}/1000</p>
                    </div>
                </div>

                `;

                    divs.innerHTML = frase;
                });

            } else {
                throw "Houve um erro ao tentar listar os servidores!";
            }
        })

        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });
}


window.onload = () => {
    const select = document.getElementById('servidores');
    select.addEventListener('change', (e) => {
        const opcao = e.target.selectedOptions[0];
        const idServidor = opcao.dataset.id;
        if (!idServidor) return;
        obterDadosKpi(idServidor);
    });

    listarServidores();
};

