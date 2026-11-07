// PARTE MARIA: integração entre início, fim da partida e nova partida.


// Quando o jogador perde, leva o resultado para fim-jogo.html.
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


// Parte executada apenas na página fim-jogo.html.
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