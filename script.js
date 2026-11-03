// PARTE DA PESSOA 1: configuração e criação do tabuleiro.

// Estas variáveis também poderão ser utilizadas pelos colegas.
let linhas = 0;
let colunas = 0;
let modalidade = "";


// Verifica se as configurações estão corretas.
// Retorna uma mensagem de erro ou um texto vazio.
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


// Executada quando o jogador envia o formulário.
function enviarConfiguracoes(evento) {
    // Impede que o formulário saia da página antes da verificação.
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

    // Se existir um erro, não continua.
    if (erro !== "") {
        return;
    }

    // Abre o jogo levando as configurações no endereço.
    window.location.href = "jogo.html?linhas=" + linhas
        + "&colunas=" + colunas
        + "&modalidade=" + modalidade;
}


// Cria os buracos do tabuleiro.
function criarTabuleiro() {
    let tabuleiro = document.getElementById("tabuleiro");

    if (tabuleiro === null) {
        return;
    }

    // Apaga os buracos anteriores para não duplicar o tabuleiro.
    tabuleiro.innerHTML = "";

    // Define quantas colunas serão desenhadas.
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

        buraco.appendChild(imagem);
        tabuleiro.appendChild(buraco);
    }
}


// Recebe as configurações quando a página do jogo é aberta.
function carregarConfiguracoes() {
    let parametros = new URLSearchParams(window.location.search);

    linhas = Number(parametros.get("linhas"));
    colunas = Number(parametros.get("colunas"));
    modalidade = parametros.get("modalidade");

    // Verifica novamente, pois o endereço pode ser alterado.
    let erro = validarConfiguracoes(linhas, colunas, modalidade);

    document.getElementById("mensagem-erro").textContent = erro;

    if (erro !== "") {
        document.getElementById("voltar-configuracao").hidden = false;
        return;
    }

    // Mostra a modalidade escolhida no painel.
    if (modalidade === "classica") {
        document.getElementById("modalidade-jogo").textContent =
            "Clássica";
    } else {
        document.getElementById("modalidade-jogo").textContent =
            "Explosiva";
    }

    criarTabuleiro();
}


// Conecta o formulário à função de envio.
// Só executa esta parte na página de configuração.
let formulario = document.getElementById("form-configuracao");

if (formulario !== null) {
    formulario.addEventListener("submit", enviarConfiguracoes);
}


// Só carrega o tabuleiro quando estiver na página do jogo.
if (document.getElementById("tabuleiro") !== null) {
    carregarConfiguracoes();
}