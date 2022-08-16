// Configuração do Jogo
var jogador = 'Finn';
var jogadas = 0;
var jogando = true;

var Finn = 0;
var Jake = 0;


var tipo_de_vitorias = [
    [1,2,3],
    [4,5,6],
    [7,8,9],

    [1,4,7],
    [2,5,8],
    [3,6,9],

    [1,5,9],
    [3,5,7],
]


//Configurações do BOT
var bot_jogada = 0;
var bot_jogar = 0;
var bot_rebater = 100;





// Eventso de Interface

function ProxJogador(){
    
    document.querySelectorAll(`figure[id*='player']`).forEach((icon)=>{
        
        var element_name = icon.id.substring(7, icon.id.length);
        
        if(element_name == jogador){
            icon.classList.add('person_select');
        
        }else{
            icon.classList.remove('person_select');
        }

    })

}

function AttScore(){
    document.querySelectorAll(`label[id*='score_']`).forEach((player_score)=>{
        
        var element_name = player_score.id.substring(6, player_score.id.length);
        player_score.innerHTML = '👑' + (element_name == 'Finn' ? Finn : Jake);

    })
}


// Eventos do Jogo

function Cliquei(slotID){
    var Slot = document.getElementById(slotID);

    if(checkImage(Slot) == '' && jogando){
        Slot.style.backgroundImage = `url("images/${jogador}.png")`;

        jogadas++;

        if(Ganhador()){
            return FimDeJogo(` 🥳 O "${jogador}" é o vencedor! 🥳 `)
        }

        jogador = (jogador === 'Finn' ? 'Jake' : 'Finn');
        ProxJogador();

        var bot_check = document.getElementById('_bot').checked;
        
        if(bot_check && jogador == 'Jake'){
            BOT();
        }

    }

}

function Ganhador(){
    for(let IDs of tipo_de_vitorias){

        let p0 = document.getElementById(`slot${IDs[0]}`);
        let p1 = document.getElementById(`slot${IDs[1]}`);
        let p2 = document.getElementById(`slot${IDs[2]}`);

        if(checkImage(p0) == checkImage(p1) && checkImage(p0) == checkImage(p2) && checkImage(p0) != ''){
            
            p0.classList.add('linha');
            p1.classList.add('linha');
            p2.classList.add('linha');

            if(jogador == 'Finn'){
                Finn++;

            }else{
                Jake++;
            }
            
            AttScore();

            return true;
        }
    }

    if(jogadas == 9){
        return FimDeJogo(` 😁 Empate! 😁 `)
    }

    return false;
}

function FimDeJogo(texto){
    
    jogando = false;

    document.getElementById('fim_de_jogo').style.display = 'block';

    var FimTexto = document.querySelector('#fim_de_jogo label');
    FimTexto.innerHTML = texto;
    
}

function ReiniciarJogo(){

    document.getElementById('fim_de_jogo').style.display = 'none';

    document.querySelectorAll(`td[id*="slot"]`).forEach((Slot)=>{
        Slot.style.backgroundImage = ''
        Slot.classList.remove('linha');
    })

    jogadas = 0;
    jogador = 'Finn';
    jogando = true;

    bot_jogada = 0;
    
    ProxJogador();

}

// Eventos do BOT

function BOT() {

    function mostrarJogadas() {
        // Mostrar como está sendo a escolha

        var plays = []

        for (let IDs of tipo_de_vitorias) {
            let _slot1 = document.getElementById(`slot${IDs[0]}`).style.backgroundImage;
            let _slot2 = document.getElementById(`slot${IDs[1]}`).style.backgroundImage;
            let _slot3 = document.getElementById(`slot${IDs[2]}`).style.backgroundImage;

            if ((_slot1 == '' || _slot1 == 'url("images/Jake.png")') && (_slot2 == '' || _slot2 == 'url("images/Jake.png")') && (_slot3 == '' || _slot3 == 'url("images/Jake.png")')) {
                plays.push(IDs);
            }
        }

        document.querySelectorAll('td[id*="slot"]').forEach((slot) => {
            slot.style.backgroundColor = '#000000';
        })

        for (let IDs of plays) {
            let _slot1 = document.getElementById(`slot${IDs[0]}`);
            let _slot2 = document.getElementById(`slot${IDs[1]}`);
            let _slot3 = document.getElementById(`slot${IDs[2]}`);

            _slot1.style.backgroundColor = '#ffffff';
            _slot2.style.backgroundColor = '#ffffff';
            _slot3.style.backgroundColor = '#ffffff';
        }
    }

    function randPlay(position) {

        var IDs = tipo_de_vitorias[position];
        var randPos = irandom(0, IDs.length);

        for (let pos in IDs) {

            if (pos == randPos) {
                var ID = IDs[pos];
                var slot = document.getElementById(`slot${ID}`);

                if (slot.style.backgroundImage == '') {
                    return Cliquei(`slot${ID}`)
                }

                return randPlay(position);
            }

        }
    }

    function modo() {
        var tipo = [
            ['jogar', bot_jogar],
            ['rebater', bot_rebater]
        ]

        var chance = irandom(1, 100);
        var count = 0;

        for (selec of tipo) {
            count += selec[1];

            if (chance <= count) {
                return selec[0]
            }
        }

    }

    function novaJogada() {

        function countJogadas() {
            var jogs = [];

            for (position in tipo_de_vitorias) {
                let slots = tipo_de_vitorias[position];

                let _slot1 = document.getElementById(`slot${slots[0]}`).style.backgroundImage;
                let _slot2 = document.getElementById(`slot${slots[1]}`).style.backgroundImage;
                let _slot3 = document.getElementById(`slot${slots[2]}`).style.backgroundImage;

                if ((_slot1 == '' || _slot1 == 'url("images/Jake.png")') && (_slot2 == '' || _slot2 == 'url("images/Jake.png")') && (_slot3 == '' || _slot3 == 'url("images/Jake.png")')) {
                    jogs.push(position);
                }
            }

            return jogs;
        }

        var jogadsLivre = countJogadas();

        if (jogadsLivre.length > 0) {
            var randID = irandom(0, tipo_de_vitorias.length - 1);

            if (randID != bot_jogada) {
                if (!verficJogada(randID)) {
                    return novaJogada();
                }

                return randID;
            }

            return novaJogada();

        } else {
            for (let id = 1; id <= 9; id++) {

                var slot = document.getElementById(`slot${id}`);

                if (slot.style.backgroundImage == '') {
                    return Cliquei(`slot${id}`);
                }
            }
        }
    }

    function verficJogada(position) {
        var IDs = tipo_de_vitorias[position];

        for (ID of IDs) {
            var slot = document.getElementById(`slot${ID}`);

            if (slot.style.backgroundImage != '' && slot.style.backgroundImage != 'url("images/Jake.png")') {
                return false;
            }
        }
        return true;
    }

    function movimento(modo) {
        switch (modo) {
            case 'jogar': {
                var IdClean = getSlot();
                var position = irandom(0, IdClean.length);

                function getSlot() {

                    var Slots = tipo_de_vitorias[bot_jogada];
                    var Clean = [];

                    for (ID of Slots) {

                        var slot = document.getElementById(`slot${ID}`);

                        if (slot.style.backgroundImage == '') {
                            Clean.push(ID);
                        }
                    }

                    return Clean;
                }

                return Cliquei(`slot${IdClean[position]}`);

            } break;

            case 'rebater': {

                function verificJogadPlayer() {

                    var result = [];

                    for (let position in tipo_de_vitorias) {

                        let val = [position, 0];
                        let slots = tipo_de_vitorias[position];

                        let _slot1 = document.getElementById(`slot${slots[0]}`).style.backgroundImage;
                        let _slot2 = document.getElementById(`slot${slots[1]}`).style.backgroundImage;
                        let _slot3 = document.getElementById(`slot${slots[2]}`).style.backgroundImage;

                        if (_slot1 != 'url("images/Jake.png")' && _slot2 != 'url("images/Jake.png")' && _slot3 != 'url("images/Jake.png")') {
                            for (let ID of slots) {
                                let slot = document.getElementById(`slot${ID}`)

                                if ((slot.style.backgroundImage == 'url("images/Finn.png")' && slot.style.backgroundImage != 'url("images/Jake.png")')) {
                                    val[1]++;
                                }
                            }
                        }


                        if (val[1] > 0) {
                            result.push(val);
                        }
                    }

                    return result;
                }

                function getRandPlay() {

                    console.log(verificJogadPlayer())

                    var JogadorPlay = verificJogadPlayer().sort((a, b) => b[1] - a[1])[0][0];
                    var Slots = tipo_de_vitorias[JogadorPlay];

                    randPlay(Number(JogadorPlay));
                }


                return getRandPlay();

            } break;
        }
    }

    if (bot_jogada == 0) {
        bot_jogada = novaJogada();

    } else if (!verficJogada(bot_jogada)) {
        bot_jogada = novaJogada();
    }


//     console.log('Jogado Posição: ' + bot_jogada);
//     console.log('Slots: ' + tipo_de_vitorias[bot_jogada]);
//    mostrarJogadas();

    if (bot_jogada != undefined) {
        movimento(modo());
    }
}




// Outros Eventos

function checkImage(slotElement){
    return slotElement.style.backgroundImage;
}

function irandom(min, max){
    return Math.floor(Math.random()*max + min);
}

