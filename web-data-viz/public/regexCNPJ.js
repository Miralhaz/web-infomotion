// Script das mascaras de texto 
  document.getElementById('cnpj').addEventListener('input', function (e) /* e é o objeto do evento, nesse caso o input*/
  {
    let valor = e.target.value.replace(/\D/g, '');
    valor = valor.replace(/^(\d{2})(\d)/, '$1.$2')
    valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    valor = valor.replace(/\.(\d{3})(\d)/, '.$1/$2');
    valor = valor.replace(/(\d{4})(\d)/, '$1-$2');
    e.target.value = valor;
  })

  document.getElementById('telefoneResponsavel_input').addEventListener('input', function(e) 
    {
    let valor = e.target.value.replace(/\D/g, '');
    valor = valor.replace(/^(\d{2})(\d)/, '($1) $2')
    valor = valor.replace(/^(\d{2})\) (\d{5})(\d)/, '($1) $2-$3');
    valor = valor.replace(/\) (\d{5})(\d)/, ') $1-$2');
    e.target.value = valor;
  })
