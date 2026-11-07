// PARTE MARIA: 

document.addEventListener("jogo:partida-perdida", function(evento) {

    let resumo = evento.detail;

    let parametros = new URLSearchParams(window.location.search);

    let linhas = parametros.get("linhas");
    let colunas = parametros.get("colunas");
    let modalidade = parametros.get("modalidade");

    window.location.href =
        "fim-jogo.html"
        + "?pontuacao=" + resumo.pontuacao
        + "&nivel=" + resumo.nivel
        + "&linhas=" + linhas
        + "&colunas=" + colunas
        + "&modalidade=" + modalidade;
});


let campoPontuacao = document.getElementById("resultado-pontuacao");
let campoNivel = document.getElementById("resultado-nivel");
let botaoJogarNovamente = document.getElementById("jogar-novamente");

if (
    campoPontuacao !== null &&
    campoNivel !== null &&
    botaoJogarNovamente !== null
) {

    let parametros = new URLSearchParams(window.location.search);

    let pontuacao = parametros.get("pontuacao");
    let nivel = parametros.get("nivel");
    let linhas = parametros.get("linhas");
    let colunas = parametros.get("colunas");
    let modalidade = parametros.get("modalidade");

    campoPontuacao.textContent = pontuacao;
    campoNivel.textContent = nivel;

    botaoJogarNovamente.href =
        "jogo.html"
        + "?linhas=" + linhas
        + "&colunas=" + colunas
        + "&modalidade=" + modalidade;
}

let tabuleiro = document.getElementById("tabuleiro");

if (tabuleiro !== null) {

    tabuleiro.addEventListener("mousedown", function() {
        tabuleiro.classList.add("martelo-batendo");
    });

    tabuleiro.addEventListener("mouseup", function() {
        tabuleiro.classList.remove("martelo-batendo");
    });

    tabuleiro.addEventListener("mouseleave", function() {
        tabuleiro.classList.remove("martelo-batendo");
    });

}