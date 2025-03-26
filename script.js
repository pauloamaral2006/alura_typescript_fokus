const html = document.querySelector("html");

const focoBt = document.querySelector(".app__card-button--foco");
const curtobt = document.querySelector(".app__card-button--curto");
const longoBt = document.querySelector(".app__card-button--longo");

const banner = document.querySelector(".app__image");

const titulo = document.querySelector(".app__title");

const botoes = document.querySelectorAll('.app__card-button');

const temponaTela = document.querySelector('#timer');

const musicaFocoInput = document.querySelector("#alternar-musica");

const musica = new Audio('/sons/luna-rise-part-one.mp3');
const audioPlay = new Audio('/sons/play.wav');    
const audioPausa = new Audio('/sons/pause.mp3');
const audioTempoFinalizado = new Audio('/sons/beep.mp3');
        
const startPauseBt = document.querySelector("#start-pause");

const iniciarOuPausarBt = document.querySelector("#start-pause span");

const imagemIniciarOuPausar = document.querySelector(".app__card-primary-butto-icon");

let tempoDecorridoEmSegundos = 25;
let intervaloID = null;

musica.loop = true;

musicaFocoInput.addEventListener('change', () => {

    if(musica.paused){

        musica.play();

    }else{

        musica.pause();

    }

});

focoBt.addEventListener('click', () => {

    tempoDecorridoEmSegundos = 25;
    alterarContexto('foco');
    focoBt.classList.add('active');
            
})

curtobt.addEventListener('click', () => {

    tempoDecorridoEmSegundos = 5;
    alterarContexto('descanso-curto');
    curtobt.classList.add('active');
            
})

longoBt.addEventListener('click', () => {

    tempoDecorridoEmSegundos = 15;
    alterarContexto('descanso-longo');
    longoBt.classList.add('active');
            
})

function alterarContexto(contexto){
    
    mostrarTempo();
    botoes.forEach(function(contexto) {
        
        contexto.classList.remove('active');

    });
    
    html.setAttribute('data-contexto', contexto);
    banner.setAttribute('src', `./imagens/${contexto}.png`);
    iniciarOuPausarBt.textContent = 'Começar';

    switch(contexto){
        
        case "foco":
            titulo.innerHTML = `Otimize sua produtividade,<br> <strong class="app__title-strong">mergulhe no que importa.</strong>`
            break;

        case "descanso-curto":
            titulo.innerHTML = `Que tal dar uma respirada?<br> <strong class="app__title-strong">Faça uma pausa curta!.</strong>`
            break;
                
        case "descanso-longo":
            titulo.innerHTML = `Hora de voltar à superfície.<br> <strong class="app__title-strong">Faça uma pausa longa.</strong>`
            break;

        default:
            break;

    }

    zerar();
 
}

const contagemRegressiva = () => {

    if(tempoDecorridoEmSegundos <= 0) {

        audioTempoFinalizado.play();
        alert('Tempo finalizado.');
        audioTempoFinalizado.pause();

        const focoAtivo = html.getAttribute('data-contexto') == 'foco'
        if(focoAtivo){

            const evento = new CustomEvent('FocoFinalizado')
            document.dispatchEvent(evento)

        }

        zerar();
        iniciarOuPausarBt.textContent = 'Começar';
        return;
        
    }

    tempoDecorridoEmSegundos -= 1;
    mostrarTempo();
    
}

startPauseBt.addEventListener('click', iniciarOuPausar);

function iniciarOuPausar() {

    if(intervaloID){

        audioPausa.play();
        zerar();
        iniciarOuPausarBt.textContent = 'Continuar';
        return;

    }
    
    audioPlay.play();
    intervaloID = setInterval(contagemRegressiva, 1000);        
    iniciarOuPausarBt.textContent = 'Pausar';
    imagemIniciarOuPausar.setAttribute('src', "/imagens/pause.png");

}

function zerar() {

    clearInterval(intervaloID);
    intervaloID = null;
    imagemIniciarOuPausar.setAttribute('src', "/imagens/play_arrow.png");
        
}

function mostrarTempo() {

    const tempo = new Date(tempoDecorridoEmSegundos * 1000);
    const tempoFormatado = tempo.toLocaleTimeString('pt-BR', {minute: '2-digit', second: '2-digit'});
    temponaTela.innerHTML = `${tempoFormatado}`

}
mostrarTempo();