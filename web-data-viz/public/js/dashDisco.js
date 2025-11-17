// nessa function quero listar os discos na  <div class="exibir_disco" id="exibirDiscos">
// esses dados virão do meu banco mysql atráves da api e pretendo transformar em json para
// tratar esses dados. o usuario poderá selecionar clicando um desses servidores e 
// eu criei o botão com o onclick AnalisarEmGrafico, que for acionado se tiver algum servidor selecionado 
// ele vai exibir no gráfico o crescimento constante que aquele disco foi enchendo conforme o período desejar
// pretendo colocar no meu gráfico a permissão de três périodos, 1 Mês, 3 mêses, 6 mêses.

// function Listardiscos(){
    
// }

// function criarGrafico() {
//     chartcontainer.innerHTML = `<div class="grafico_linha">
//   <canvas id="myChart"></canvas>
// </div>
// `

//         const labels = typeof Utils !== 'undefined' && Utils.months ? Utils.months({ count: 7 }) : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
//     const data = {
//         labels: labels,
//         datasets: [{
//             label: 'My First Dataset',
//             data: [65, 59, 80, 81, 56, 55, 40],
//             fill: false,
//             borderColor: 'rgb(75, 192, 192)',
//             tension: 0.1
//         }]
//     };
//     const ctx = document.getElementById('myChart');
//     new Chart(ctx, {
//         type: 'line',
//         data: data
//     })
// }

// criarGrafico()

// function VerDiscoNoGrafico(){}
//
