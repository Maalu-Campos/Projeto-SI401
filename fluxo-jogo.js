// PARTE MARIA: controle de fluxo do jogo, incluindo início, pausa, reinício e fim de partida.

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

    let martelo = document.createElement("img");

    martelo.src = "imagens/martelo_normal.png";
    martelo.className = "cursor-martelo";

    document.body.appendChild(martelo);


    tabuleiro.addEventListener("mousemove", function(evento) {

        martelo.style.display = "block";

        martelo.style.left = (evento.clientX - 20) + "px";
        martelo.style.top = (evento.clientY - 20) + "px";
    });


    tabuleiro.addEventListener("mousedown", function() {

        martelo.src = "imagens/martelo_batendo.png";
    });


    tabuleiro.addEventListener("mouseup", function() {

        martelo.src = "imagens/martelo_normal.png";
    });


    tabuleiro.addEventListener("mouseleave", function() {

        martelo.style.display = "none";
        martelo.src = "imagens/martelo_normal.png";
    });

}