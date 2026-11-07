//PARTE PEDRO: controle de níveis, tempo e transições entre níveis.
"use strict";

const DURACAO_NIVEL_MS = 20000;
const META_PRECISAO = 80;
const EXPOSICAO_INICIAL_MS = 1500;
const EXPOSICAO_MINIMA_MS = 200;
const FATOR_DIFICULDADE = 0.9;
const PAUSA_ENTRE_NIVEIS_MS = 2000;

let controleNiveis = {
    ativo: false,
    nivel: 1,
    tempoExposicaoMs: EXPOSICAO_INICIAL_MS,
    fimNivel: 0,
    intervaloCronometro: null,
    temporizadorFim: null,
    temporizadorTransicao: null
};

function obterTempoRestanteNivel() {
    if (!controleNiveis.ativo) {
        return 0;
    }

    let restante = controleNiveis.fimNivel - Date.now();

    if (restante < 0) {
        return 0;
    }

    return restante;
}

function atualizarCronometro() {
    let campoTempo = document.getElementById("tempo-restante");

    let segundosTotais = Math.ceil(
        obterTempoRestanteNivel() / 1000
    );

    let minutos = Math.floor(segundosTotais / 60);
    let segundos = segundosTotais % 60;

    let textoMinutos = String(minutos);
    let textoSegundos = String(segundos);

    if (minutos < 10) {
        textoMinutos = "0" + minutos;
    }

    if (segundos < 10) {
        textoSegundos = "0" + segundos;
    }

    campoTempo.textContent = textoMinutos + ":" + textoSegundos;
}

function cancelarTemporizadoresNivel() {
    clearInterval(controleNiveis.intervaloCronometro);
    clearTimeout(controleNiveis.temporizadorFim);
    clearTimeout(controleNiveis.temporizadorTransicao);

    controleNiveis.intervaloCronometro = null;
    controleNiveis.temporizadorFim = null;
    controleNiveis.temporizadorTransicao = null;

    document.getElementById("mensagem-transicao").hidden = true;
}

function pararControleNiveis() {
    controleNiveis.ativo = false;

    cancelarTemporizadoresNivel();
    window.Personagens.parar();

    atualizarCronometro();
}

function iniciarNivelAtual() {
    cancelarTemporizadoresNivel();

    window.Pontuacao.iniciarNivel(
        controleNiveis.nivel,
        META_PRECISAO
    );

    controleNiveis.fimNivel = Date.now() + DURACAO_NIVEL_MS;

    atualizarCronometro();

    controleNiveis.intervaloCronometro = setInterval(
        atualizarCronometro,
        100
    );

    controleNiveis.temporizadorFim = setTimeout(
        finalizarNivelAtual,
        DURACAO_NIVEL_MS
    );

    window.Personagens.iniciar({
        modalidade: modalidade,
        tempoVisivelMs: controleNiveis.tempoExposicaoMs
    });
}

function finalizarNivelAtual() {
    if (!controleNiveis.ativo ||
        controleNiveis.temporizadorTransicao !== null) {
        return;
    }

    cancelarTemporizadoresNivel();

    window.Personagens.parar();

    controleNiveis.fimNivel = 0;
    atualizarCronometro();

    let resumo = window.Pontuacao.obterResumo();

    if (resumo.precisao >= META_PRECISAO) {
        let nivelConcluido = controleNiveis.nivel;

        controleNiveis.nivel++;

        controleNiveis.tempoExposicaoMs = Math.max(
            EXPOSICAO_MINIMA_MS,
            controleNiveis.tempoExposicaoMs * FATOR_DIFICULDADE
        );

        let mensagem = document.getElementById("mensagem-transicao");
        let textoTransicao = document.getElementById("texto-transicao");
        let botaoProximoNivel = document.getElementById("botao-proximo-nivel");

        textoTransicao.textContent =
            "Nível " + nivelConcluido + " concluído! "
            + "Precisão: " + Math.floor(resumo.precisao) + "%.";

        botaoProximoNivel.textContent =
            "Começar nível " + controleNiveis.nivel;

        mensagem.hidden = false;

    } else {
        controleNiveis.ativo = false;

        document.dispatchEvent(
            new CustomEvent("jogo:partida-perdida", {
                detail: resumo
            })
        );
    }
}

function iniciarControleNiveis() {
    if (controleNiveis.ativo) {
        return false;
    }

    let erro = validarConfiguracoes(linhas, colunas, modalidade);

    if (erro !== "") {
        return false;
    }

    window.Personagens.parar();
    cancelarTemporizadoresNivel();

    controleNiveis.nivel = 1;
    controleNiveis.tempoExposicaoMs = EXPOSICAO_INICIAL_MS;
    controleNiveis.ativo = true;

    iniciarNivelAtual();

    return true;
}

let botaoProximoNivel = document.getElementById("botao-proximo-nivel");

botaoProximoNivel.addEventListener("click", function() {
    iniciarNivelAtual();
});

window.Niveis = {
    iniciarPartida: iniciarControleNiveis,
    parar: pararControleNiveis,
    obterTempoRestante: obterTempoRestanteNivel
};

window.addEventListener("pagehide", pararControleNiveis);

iniciarControleNiveis();