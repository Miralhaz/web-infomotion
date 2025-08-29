function confereRegex(){
    const campo = document.getElementById("cnpj").value;

    if(campo.includes(".")){
        let regex = /\b\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}\b/g;
        let formatado = campo.match(regex);

        if(formatado != null){
            return true;
        } else {
            return false;
        }

    } else{
        let regex = /\d{14}/g;
        let formatado = campo.match(regex);

        if(formatado != null){
            return true;
        } else {
            return false;
        }
    }
}

function printarTamanhoTela() {
    console.log(innerWidth)
    console.log(innerHeight);
}

let print = setInterval(printarTamanhoTela(), 1000)
