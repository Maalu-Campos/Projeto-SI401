// PARTE ANA JÚLIA SANTOS: configuração e criação do tabuleiro.

let linhas = 0;
let colunas = 0;
let modalidade = "";


function validarConfiguracoes(linhas, colunas, modalidade) {
    if (!Number.isInteger(linhas) || !Number.isInteger(colunas)) {
        return "Informe números inteiros para linhas e colunas.";
    }

    if (linhas < 1 || colunas < 1) {
        return "Preencha linhas e colunas com números maiores que zero.";
    }

    let totalBuracos = linhas * colunas;

    if (totalBuracos < 4 || totalBuracos > 64) {
        return "O tabuleiro precisa ter entre 4 e 64 buracos.";
    }

    if (modalidade !== "classica" && modalidade !== "explosiva") {
        return "Escolha a modalidade Clássica ou Explosiva.";
    }

    return "";
}


function enviarConfiguracoes(evento) {
    evento.preventDefault();

    linhas = Number(document.getElementById("linhas").value);
    colunas = Number(document.getElementById("colunas").value);

    let opcao = document.querySelector(
        'input[name="modalidade"]:checked'
    );

    modalidade = "";

    if (opcao !== null) {
        modalidade = opcao.value;
    }

    let erro = validarConfiguracoes(linhas, colunas, modalidade);

    document.getElementById("mensagem-erro").textContent = erro;

    if (erro !== "") {
        return;
    }

    window.location.href = "jogo.html?linhas=" + linhas
        + "&colunas=" + colunas
        + "&modalidade=" + modalidade;
}


function criarTabuleiro() {
    let tabuleiro = document.getElementById("tabuleiro");

    if (tabuleiro === null) {
        return;
    }

    tabuleiro.innerHTML = "";

    tabuleiro.style.gridTemplateColumns =
        "repeat(" + colunas + ", minmax(44px, 1fr))";

    let totalBuracos = linhas * colunas;

    for (let numero = 0; numero < totalBuracos; numero++) {
        let buraco = document.createElement("button");

        buraco.type = "button";
        buraco.className = "buraco";
        buraco.id = "buraco-" + numero;

        buraco.setAttribute(
            "aria-label",
            "Buraco " + (numero + 1)
        );

        let imagem = document.createElement("img");
        imagem.src = "imagens/buraco-vazio.png";
        imagem.alt = "";
        imagem.className = "buraco__base";
        
        buraco.appendChild(imagem);
        tabuleiro.appendChild(buraco);
    }
}


function carregarConfiguracoes() {
    let parametros = new URLSearchParams(window.location.search);

    linhas = Number(parametros.get("linhas"));
    colunas = Number(parametros.get("colunas"));
    modalidade = parametros.get("modalidade");

    let erro = validarConfiguracoes(linhas, colunas, modalidade);

    document.getElementById("mensagem-erro").textContent = erro;

    if (erro !== "") {
        document.getElementById("voltar-configuracao").hidden = false;
        return;
    }

    if (modalidade === "classica") {
        document.getElementById("modalidade-jogo").textContent =
            "Clássica";
    } else {
        document.getElementById("modalidade-jogo").textContent =
            "Explosiva";
    }

    criarTabuleiro();
}


let formulario = document.getElementById("form-configuracao");

if (formulario !== null) {
    formulario.addEventListener("submit", enviarConfiguracoes);
}


if (document.getElementById("tabuleiro") !== null) {
    carregarConfiguracoes();
}
