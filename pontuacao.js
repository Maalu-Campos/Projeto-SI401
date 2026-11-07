//PARTE CAIO CALCULAR PONTOS E ATUALIZAR AS INFORMAÇÕES DO JOGO.


(() => {
    'use strict';

    const painel = document.querySelector('.informacoes-jogo');
    const campoAcertos = document.getElementById('acertos-jogo');
    const campoPrecisao = document.getElementById('precisao-jogo');
    const campoNivel = document.getElementById('nivel-jogo');
    const campoNecessario = document.getElementById('necessario-jogo');

    if (!painel || !campoAcertos || !campoPrecisao) {
       
        console.warn('Pontuação: elementos do painel não encontrados; window.Pontuacao não foi criado.');
        return;
    }

    // Cria o indicador de pontuação no painel.
    const blocoPontos = document.createElement('div');
    const tituloPontos = document.createElement('p');
    const campoPontos = document.createElement('p');

    tituloPontos.textContent = 'Pontuação';
    campoPontos.id = 'pontuacao-jogo';

    blocoPontos.append(tituloPontos, campoPontos);
    painel.appendChild(blocoPontos);

    // Informações da partida.
    const estado = {
        pontuacao: 0,
        nivel: 1,
        acertosNivel: 0,
        toupeirasExibidasNivel: 0,
        acertosTotais: 0,
        toupeirasExibidasTotais: 0,
        bombasClicadas: 0,
        bombasNivel: 0, // bombas clicadas só no nível atual
        percentualNecessario: null
    };

    const historicoNiveis = [];

    
    // volta tudo ao zero para começar uma partida nova.
    function zerarEstado() {
        estado.pontuacao = 0;
        estado.nivel = 1;
        estado.acertosNivel = 0;
        estado.toupeirasExibidasNivel = 0;
        estado.acertosTotais = 0;
        estado.toupeirasExibidasTotais = 0;
        estado.bombasClicadas = 0;
        estado.bombasNivel = 0;
        estado.percentualNecessario = null;
        historicoNiveis.length = 0;
    }

    // Calcula a porcentagem de acertos do nível.
    function calcularPrecisao() {
        if (estado.toupeirasExibidasNivel === 0) {
            return 0;
        }

        // multiplica antes de dividir. Com (a / b) * 100 aparecem
       
        return (estado.acertosNivel * 100) /
            estado.toupeirasExibidasNivel;
    }

    // Atualiza os números exibidos na tela.
    function atualizarPainel() {
        campoPontos.textContent = estado.pontuacao;
        
        // a precisão continua sendo calculada só com o nível atual.
        campoAcertos.textContent = estado.acertosTotais;

   
        campoPrecisao.textContent =
            Math.floor(calcularPrecisao()) + '%';

        if (campoNivel) {
            campoNivel.textContent = 'Nível ' + estado.nivel;
        }

        if (campoNecessario) {
            campoNecessario.textContent =
                estado.percentualNecessario === null
                    ? '—'
                    : estado.percentualNecessario + '%';
        }
    }

    // Conta cada toupeira que aparece.
    document.addEventListener('jogo:toupeira-exibida', () => {
        estado.toupeirasExibidasNivel++;
        estado.toupeirasExibidasTotais++;
        atualizarPainel();
    });

    // Acertar uma toupeira vale +1 ponto.
    document.addEventListener('jogo:toupeira-acertada', () => {
        estado.pontuacao++;
        estado.acertosNivel++;
        estado.acertosTotais++;
        atualizarPainel();
    });

    // Clicar em uma bomba desconta 1 ponto.
    document.addEventListener('jogo:bomba-clicada', () => {
    estado.pontuacao--;
    // A bomba também penaliza o resultado do nível.
    estado.acertosNivel--;
    estado.bombasClicadas++;
    estado.bombasNivel++;
    atualizarPainel();
});

    // Buracos vazios e toupeiras perdidas não alteram os pontos.
    // As toupeiras perdidas já foram contadas quando apareceram.

    // Prepara a pontuação para outro nível.
    function iniciarNivel(numero, percentualNecessario = null) {
        if (!Number.isInteger(numero) || numero < 1) {
            return false;
        }

        if (numero === 1) {
            // chamar iniciarNivel(1) agora significa "partida nova".
            // valendo, e um registro vazio do nível 1 entrava no histórico.
            zerarEstado();
        } else {
            historicoNiveis.push({
                nivel: estado.nivel,
                acertos: estado.acertosNivel,
                toupeirasExibidas: estado.toupeirasExibidasNivel,
                bombas: estado.bombasNivel,
                precisao: calcularPrecisao()
            });

            estado.nivel = numero;
            estado.acertosNivel = 0;
            estado.toupeirasExibidasNivel = 0;
            estado.bombasNivel = 0;
        }

        // só aceita porcentagem entre 0 e 100.
        estado.percentualNecessario =
            Number.isFinite(percentualNecessario) &&
            percentualNecessario >= 0 &&
            percentualNecessario <= 100
                ? percentualNecessario
                : null;

        // Mantém a pontuação acumulada da partida (exceto no nível 1).
        atualizarPainel();
        return true;
    }

    // Permite integração com o controle dos níveis.
    window.Pontuacao = Object.freeze({
        iniciarNivel,
        obterResumo: () => ({
            ...estado,
            precisao: calcularPrecisao(),
            //devolve cópias dos registros, assim quem chama
    
            historicoNiveis: historicoNiveis.map((nivel) => ({ ...nivel }))
        })
    });

    atualizarPainel();
})();