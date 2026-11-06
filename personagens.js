// PARTE RENAN: exibição das toupeiras/bombas e identificação dos cliques.
(() => {
    'use strict';

    const tabuleiro = document.getElementById('tabuleiro');
    if (!tabuleiro) return;

    const parametros = new URLSearchParams(window.location.search);
    const estado = {
        ativo: false,
        modalidade: 'classica',
        tempoVisivelMs: 1500,
        intervaloMs: 400,
        personagemAtual: null,
        ultimoBuracoId: null,
        temporizadorOcultar: null,
        temporizadorProxima: null,
        temporizadoresFeedback: new Set()
    };

    // Na modalidade explosiva: 75% de chance de toupeira e 25% de bomba.
    const probabilidadeToupeira = 0.75;

    function emitir(nome, detalhe = {}) {
        document.dispatchEvent(new CustomEvent(nome, { detail: detalhe }));
    }

    function normalizarModalidade(valor) {
        const modalidade = String(valor || '').trim().toLocaleLowerCase('pt-BR')
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        if (modalidade === 'classica' || modalidade === 'classic') return 'classica';
        if (modalidade === 'explosiva' || modalidade === 'explosive') return 'explosiva';
        return null;
    }

    function listarBuracos() {
        return Array.from(tabuleiro.querySelectorAll('.buraco'));
    }

    function identificadorDoBuraco(buraco) {
        return String(buraco.dataset.buraco || buraco.id || '');
    }

    function removerPersonagem(buraco) {
        const personagem = buraco.querySelector('.buraco__personagem');
        if (personagem) personagem.remove();
        buraco.classList.remove('buraco--ocupado', 'buraco--acertado', 'buraco--bomba-clicada');
    }

    function limparTemporizadores() {
        window.clearTimeout(estado.temporizadorOcultar);
        window.clearTimeout(estado.temporizadorProxima);
        estado.temporizadoresFeedback.forEach((id) => window.clearTimeout(id));
        estado.temporizadoresFeedback.clear();
        estado.temporizadorOcultar = null;
        estado.temporizadorProxima = null;
    }

    function escolherBuraco() {
        const buracos = listarBuracos();
        const outrosBuracos = buracos.filter((buraco) => {
            return identificadorDoBuraco(buraco) !== estado.ultimoBuracoId;
        });
        const opcoes = outrosBuracos.length > 0 ? outrosBuracos : buracos;
        if (opcoes.length === 0) return null;
        return opcoes[Math.floor(Math.random() * opcoes.length)];
    }

    function criarPersonagem(tipo) {
        const area = document.createElement('span');
        area.className = 'buraco__personagem';

        if (tipo === 'toupeira') {
            const imagem = document.createElement('img');
            imagem.className = 'personagem personagem--toupeira';
            imagem.src = 'imagens/marmota-normal.png';
            imagem.alt = '';
            imagem.setAttribute('aria-hidden', 'true');
            area.appendChild(imagem);
        } else {
            const bomba = document.createElement('span');
            const pavio = document.createElement('span');
            const faísca = document.createElement('span');
            bomba.className = 'personagem personagem--bomba';
            bomba.setAttribute('aria-hidden', 'true');
            pavio.className = 'bomba__pavio';
            faísca.className = 'bomba__faisca';
            bomba.append(pavio, faísca);
            area.appendChild(bomba);
        }
        return area;
    }

    function mostrarPersonagem(buraco, tipo) {
        buraco.classList.add('buraco--ocupado');
        buraco.appendChild(criarPersonagem(tipo));
    }

    function mostrarFeedback(buraco, acertou) {
        const classe = acertou ? 'buraco--acertado' : 'buraco--bomba-clicada';
        buraco.classList.add(classe);

        if (acertou) {
            const area = document.createElement('span');
            const imagem = document.createElement('img');
            area.className = 'buraco__personagem';
            imagem.className = 'personagem personagem--acerto';
            imagem.src = 'imagens/acerto.gif';
            imagem.alt = '';
            imagem.setAttribute('aria-hidden', 'true');
            area.appendChild(imagem);
            const personagemAtual = buraco.querySelector('.buraco__personagem');
            if (personagemAtual) personagemAtual.replaceWith(area);
        }

        const temporizador = window.setTimeout(() => {
            estado.temporizadoresFeedback.delete(temporizador);
            removerPersonagem(buraco);
        }, 300);
        estado.temporizadoresFeedback.add(temporizador);
    }

    function agendarProximaAparicao() {
        if (estado.ativo) {
            estado.temporizadorProxima = window.setTimeout(aparecer, estado.intervaloMs);
        }
    }

    function registrarFimDaAparicao(personagem, foiClicado) {
        const foiAcertado = foiClicado && personagem.tipo === 'toupeira';
        emitir('jogo:personagem-escondido', {
            buracoId: personagem.buracoId,
            tipo: personagem.tipo,
            foiAcertado,
            foiClicado
        });
        if (!foiClicado && personagem.tipo === 'toupeira') {
            emitir('jogo:toupeira-escondida-sem-acerto', { buracoId: personagem.buracoId });
        }
    }

    function esconderPersonagem() {
        const personagem = estado.personagemAtual;
        if (!personagem) return;
        window.clearTimeout(estado.temporizadorOcultar);
        estado.temporizadorOcultar = null;
        estado.personagemAtual = null;
        removerPersonagem(personagem.buraco);
        registrarFimDaAparicao(personagem, false);
        agendarProximaAparicao();
    }

    function aparecer() {
        estado.temporizadorProxima = null;
        if (!estado.ativo) return;

        const buraco = escolherBuraco();
        if (!buraco) {
            estado.ativo = false;
            emitir('jogo:erro-personagens');
            return;
        }

        let tipo = 'toupeira';
        if (estado.modalidade === 'explosiva' && Math.random() >= probabilidadeToupeira) {
            tipo = 'bomba';
        }

        const personagem = {
            buraco,
            buracoId: identificadorDoBuraco(buraco),
            tipo
        };
        estado.ultimoBuracoId = personagem.buracoId;
        estado.personagemAtual = personagem;
        mostrarPersonagem(buraco, tipo);

        emitir('jogo:personagem-exibido', {
            buracoId: personagem.buracoId,
            tipo,
            modalidade: estado.modalidade
        });
        emitir(tipo === 'toupeira' ? 'jogo:toupeira-exibida' : 'jogo:bomba-exibida', {
            buracoId: personagem.buracoId,
            modalidade: estado.modalidade
        });
        estado.temporizadorOcultar = window.setTimeout(esconderPersonagem, estado.tempoVisivelMs);
    }

    function tratarClique(evento) {
        const buraco = evento.target.closest('.buraco');
        if (!buraco || !tabuleiro.contains(buraco) || !estado.ativo) return;

        const personagem = estado.personagemAtual;
        if (!personagem || personagem.buraco !== buraco) {
            emitir('jogo:buraco-vazio-clicado', { buracoId: identificadorDoBuraco(buraco) });
            return;
        }

        window.clearTimeout(estado.temporizadorOcultar);
        estado.temporizadorOcultar = null;
        estado.personagemAtual = null;
        const acertou = personagem.tipo === 'toupeira';
        emitir(acertou ? 'jogo:toupeira-acertada' : 'jogo:bomba-clicada', {
            buracoId: personagem.buracoId
        });
        mostrarFeedback(buraco, acertou);
        registrarFimDaAparicao(personagem, true);
        agendarProximaAparicao();
    }

    function definirModalidade(valor) {
        const modalidade = normalizarModalidade(valor);
        if (!modalidade) return false;
        estado.modalidade = modalidade;
        return true;
    }

    function definirTempoVisivel(valor) {
        const tempo = Number(valor);
        if (!Number.isFinite(tempo) || tempo < 200) return false;
        estado.tempoVisivelMs = Math.floor(tempo);
        return true;
    }

    function definirIntervaloEntreAparicoes(valor) {
        const tempo = Number(valor);
        if (!Number.isFinite(tempo) || tempo < 0) return false;
        estado.intervaloMs = Math.floor(tempo);
        return true;
    }

    function iniciar(opcoes = {}) {
        limparTemporizadores();
        listarBuracos().forEach(removerPersonagem);
        estado.ativo = false;
        estado.personagemAtual = null;
        estado.ultimoBuracoId = null;

        if (opcoes.modalidade && !definirModalidade(opcoes.modalidade)) return false;
        if (opcoes.tempoVisivelMs !== undefined && !definirTempoVisivel(opcoes.tempoVisivelMs)) return false;
        if (opcoes.intervaloMs !== undefined && !definirIntervaloEntreAparicoes(opcoes.intervaloMs)) return false;

        estado.ativo = true;
        emitir('jogo:personagens-iniciados', {
            modalidade: estado.modalidade,
            tempoVisivelMs: estado.tempoVisivelMs
        });
        aparecer();
        return true;
    }

    function parar() {
        const estavaAtivo = estado.ativo;
        estado.ativo = false;
        limparTemporizadores();
        estado.personagemAtual = null;
        listarBuracos().forEach(removerPersonagem);
        if (estavaAtivo) emitir('jogo:personagens-parados', { modalidade: estado.modalidade });
    }

    tabuleiro.addEventListener('click', tratarClique);
    window.addEventListener('pagehide', () => {
        estado.ativo = false;
        limparTemporizadores();
    }, { once: true });

    window.Personagens = Object.freeze({
        iniciar,
        parar,
        definirModalidade,
        definirTempoVisivel,
        definirIntervaloEntreAparicoes,
        estaAtivo: () => estado.ativo,
        modalidadeAtual: () => estado.modalidade
    });

    const modalidade = parametros.get('modalidade') || parametros.get('modo');
    if (modalidade) definirModalidade(modalidade);
    if (parametros.has('tempoVisivelMs')) definirTempoVisivel(parametros.get('tempoVisivelMs'));
    if (tabuleiro.dataset.demoAutostart !== 'false' && parametros.get('demo') !== 'false') iniciar();
})();
