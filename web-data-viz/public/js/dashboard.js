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
                    let div_temp = document.querySelector('.div-temp');

                    //div_temp.style.backgroundColor = dados[0].temp_cpu > 60 ? '#940000' : '#C89C00';
                    //div_temp.style.backgroundColor = dados[0].temp_disco > 60 ? '#940000' : '#C89C00';

                    

                    let frase = `
                <div class="div-dados">
                    <p>USO em % ATUAL</p>
                    <div class="div-content">
                        <div class="div-atual">
                            <a class="titulo">Atual:</a>
                            <p>RAM: <a class="dados-uso">${Math.round(dados[0].uso_ram)}%</a></p>
                            <p>CPU: <a class="dados-uso">${Math.round(dados[0].uso_cpu)}%</a></p>
                            <p>DISCO: <a class="dados-uso">${Math.round(dados[0].uso_disco)}%</a></p>
                        </div>

                        <div class="div-parametro">
                            <a class="titulo">Parâmetro Máx:</a>
                            <p>RAM: <a class="dados-uso">%</a></p>
                            <p>CPU: <a class="dados-uso">%</a></p>
                            <p>DISCO: <a class="dados-uso">%</a></p>
                        </div>
                    </div>
                </div>

                <div class="div-dados">
                    <p>Temperatura atual:</p>
                    <div class="div-content">
                        <div class="temp-atual">
                            <div class="div-graph"></div>
                            <div>
                                <p>CPU</p>
                                <p class="titulo">Máx: °C</p>
                                <p class="titulo">Min: °C</p>
                                <div class="div-temp">
                                    <p>${dados[0].temp_cpu}°C</p>
                                </div>
                            </div>
                        </div>

                        <div class="temp-atual">
                            <div>
                                <p>DISCO</p>
                                <p class="titulo">Máx: °C</p>
                                <p class="titulo">Min: °C</p>
                                <div class="div-temp">
                                    <p>${dados[0].temp_disco}°C</p>
                                </div>
                            </div>
                            <div class="div-graph"></div>
                        </div>
                    </div>
                </div>

                <div class="div-dados">
                    <p>Quantidade total de processos</p>
                    <div class="div-proc">
                        <div class="div-graph"></div>
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

