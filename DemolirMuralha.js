javascript:

function Demolir() { 
/* Script Escrito por ThiioM :) */
	/* Lockr Script */
    !function(t,e){t.Lockr=function(t,e){"use strict";return e.prefix="",e._getPrefixedKey=function(t,e){return e=e||{},e.noPrefix?t:this.prefix+t},e.set=function(t,e,r){var a=this._getPrefixedKey(t,r);try{localStorage.setItem(a,JSON.stringify({data:e}))}catch(t){}},e.get=function(t,e,r){var a,i=this._getPrefixedKey(t,r);try{a=JSON.parse(localStorage.getItem(i))}catch(t){a=localStorage[i]?{data:localStorage.getItem(i)}:null}return null===a?e:"object"==typeof a&&void 0!==a.data?a.data:e},e}(t,{})}(this);

    /* Vê se tem Arqueiros No Mundo */
    let TemArqueiro = $.inArray('archer', game_data.units) > -1;

    /* Vê se tem Paladino No Mundo */
    let TemPaladino = $.inArray('knight', game_data.units) > -1;

    /* Minhas Aldeias */
    let Minha_ = [];

    /* Função Transformar em números */
    const apenasnumeros = string => parseInt(string.replace(/[^0-9]/g, ''));

    /* Parametro */
    let Parametro = [];

    /* Função Tempo Aleatorio */
    const aleatorio = (inferior, superior) => Math.round(parseInt(inferior) + (Math.random() * (superior - inferior)));

    /* Muralha */
    const lvlmuralha = (lvl) => {
        lvl = parseInt(lvl);
        if (lvl === 1) { return 2; }
        else if (lvl === 2) { return 4; }
        else if (lvl === 3) { return 10; }
        else if (lvl === 4) { return 10; }
        else if (lvl === 5) { return 15; }
        else if (lvl === 6) { return 20; }
        else if (lvl === 7) { return 25; }
        else if (lvl === 8) { return 33; }
        else if (lvl === 9) { return 46; }
        else if (lvl === 10) { return 55; }
        else if (lvl === 11) { return 58; }
        else if (lvl === 12) { return 65; }
        else if (lvl === 13) { return 80; }
        else if (lvl === 14) { return 95; }
        else if (lvl === 15) { return 120; }
        else if (lvl === 16) { return 130; }
        else if (lvl === 17) { return 145; }
        else if (lvl === 18) { return 170; }
        else if (lvl === 19) { return 199; }
        else if (lvl === 20) { return 230; }

    };

    /* Each Aldeia */
    $('.quickedit-label').each(function(e) {
        /* Cria objetos de minhas aldeias */
        Minha_[e] = {
            Coords_: $(this).text().match(/(\d+)\|(\d+)/)[0],
            x: $(this).text().match(/(\d+)\|(\d+)/)[1],
            y: $(this).text().match(/(\d+)\|(\d+)/)[2],
            Id_: $(this).parent().attr('href').match(/village=(\d+)/)[1]

        };

    });

    /* Terceira Requisição */
    const terceira = () => {
        let i = 0;
        /* delay para não dar erro */
        let delay = 0;
        /* For das aldeias selecionada por você */
        for (let Minha of Minha_) {

            setTimeout(() => {
                /* Terceira requisição Ajax */
                $.ajax({
                    url: "/game.php?village=" + Minha.Id_ + "&screen=place&ajaxaction=popup_command&h=" + csrf_token + "&client_time=" + Math.round(Timing.getCurrentServerTime() / 1e3),
                    data: Minha.Seriliaze,
                    type: "POST",
                    dataType: "json",
                    headers: {
                        "TribalWars-Ajax": 1
                    },
                    success: function(data) {
                        i++;
                        /* Diz que já enviou */
                        $('td#aindanao').eq(i).text("Enviado!!");
                        
                        if (i === Minha_.length) {

                            alert('Terminou');
                        }

                    }

                });
                /* Delay do SetTimeout da Requisição */
            }, aleatorio(220, 300) + (aleatorio(220, 300) * delay));
            /* Aumenta delay */
            delay++;

        }

    };

    /* Segunda Requisição */
    const segunda = () => {
        let i = 0;
        let html = [
            '<th> Minha Aldeia </th>',
            '<th> Aldeia Alvo </th>',
            '<th> Duração </th>',
            '<th id="enviar"> > Enviar < </th>'
        ];

        $('#combined_table tbody tr').eq(0).append(html.join(""));
        /* delay para não dar erro */
        let delay = 0;
        let t = 0;
        /* For das aldeias selecionada por você */
        for (let Minha of Minha_) {
            t++;
            /* Forma o Objeto da Segunda requisição pro Data do Ajax */
            if (Minha.Barbaros > 199 || Minha.Cav_Leves > 69 ||  Minha.Cav_Arqueiro > 69 ) {
            let ariete = lvlmuralha(Minha.AlvoDessa.lvl);
            let _Data = {};
            _Data[Parametro[0]] = Parametro[1];
            _Data.template_id = "";
            _Data.source_village = Minha.Id_;
            /* Se só Ataque a Deff não vai junto no ataque */
            _Data.spear = 0;
            _Data.sword = 0;
            _Data.axe = 200 > parseInt(Minha.Barbaros) ? Minha.Barbaros : 200;
            /* Se Tem Arqueiro Bota Esse Também, se não tem não coloca */
            if (TemArqueiro) {
                _Data.archer = 0;
            }
            _Data.spy = parseInt(Minha.Exploradores) < 1 ? 0 : 1;
            _Data.light = 70 > parseInt(Minha.Cav_Leves) ? Minha.Cav_Leves : 70;
            /* Se Tem Arqueiro Bota Esse Também, se não tem não coloca */
            if (TemArqueiro) {
                _Data.marcher = 70 > parseInt(Minha.Cav_Arqueiro) ? Minha.Cav_Arqueiro : 70;
            }
            _Data.heavy = 0;
            _Data.ram = parseInt(ariete) > parseInt(Minha.Arietes) ? Minha.Arietes : ariete;
            _Data.catapult = Minha.Catapultas;
            /* Se Tem Paladino Bota Esse Também, se não tem não coloca */
            if (TemPaladino) {
                _Data.knight = 0;
            }
            /* Se Quer enviar Nobre junto colocar true */
            _Data.snob = 0;
            _Data.x = Minha.AlvoDessa.coord.split("|")[0];
            _Data.y = Minha.AlvoDessa.coord.split("|")[1];
            _Data.input = "";
            /* é um l não um 1 */
            _Data.attack = "l";

            setTimeout(() => {
                /* Ajax da Segunda requisição */
                $.ajax({
                    url: "/game.php?village=" + Minha.Id_ + "&screen=place&ajax=confirm&h=" + csrf_token + "&client_time=" + Math.round(Timing.getCurrentServerTime() / 1e3),
                    data: _Data,
                    type: "POST",
                    dataType: "json",
                    headers: {
                        "TribalWars-Ajax": 1
                    },
                    success: function(data) {
                        i++;
                        if ((t - i) + i === Minha_.length) {
                            $('tr[class^="nowrap"]').find('td#aindanao').text("PRONTO PRA ENVIAR");
                            /* Insere botão para enviar terceira requisição */
                            $('#combined_table tbody tr').eq(0).find('th#enviar').text('Enviar:').append('<input id="Enviar" class="btn" name="x" type="submit" value="Enviar">');
                            /* Espera Click */
                            $('input#Enviar').click(function(e) {
                                e.preventDefault();
                                /* chama Terceira Requisição se clicar no botão */
                                terceira();
                            });
                        }
                        if (data.response !== undefined) {

                        /* duração do ataque */
                        /*let tempo = jQuery('table.vis:eq(0) tr:eq(2) td:eq(1)', data.response.dialog).text(); */
                        /*let tempo = $(data.response.dialog).find('table.vis').eq(0).find('tr').eq(2).find('td').eq(1).text(); */
                        let tempo = jQuery('table.vis:eq(0) tr:eq(2) td:eq(1)', data.response.dialog).text();

                        /* linha das alterações */

                        let html = [

                           '<td style="text-align:center">',
                                  Minha.Coords_,
                           '</td>',
                           '<td style="text-align:center">',
                                  Minha.AlvoDessa.coord,
                           '</td>',
                           '<td style="text-align:center">',
                                  tempo,
                           '</td>',
                           '<td id="aindanao" style="text-align:center">AINDA NÃO</td>'

                        ];

                        $('tr[class^="nowrap"]').eq(i).append(html.join(""));
                        /* Serialize da form da segunda requisição */
                        Minha.Seriliaze = $(data.response.dialog).serialize();
                    }
                    }

                });
                /* Delay do SetTimeout da Requisição */
            }, aleatorio(100, 150) + (aleatorio(100, 120) * delay));
            /* Aumenta delay */
            delay++;

        }
    } 
};

    /* Primeira Requisição */
    const primeira = () => {
        /* Limpeza da página para fazer alterações */
        $('#combined_table tbody tr').eq(0).find('th').remove();
        $('tr[class^="nowrap"]').find('td').remove();

        /* delay para não dar erro */
        let delay = 0;
        /* For das aldeias selecionada por você */
        let i = 0;
        for (let Minha of Minha_) {
            /* Script Escrito por ThiioM :) */
            setTimeout(() => {
                /* Primeira requisição Ajax */
                $.ajax({
                    url: "/game.php?village=" + Minha.Id_ + "&screen=place&ajax=command&target=" + Minha.AlvoDessa.id + "&client_time=" + Math.round(Timing.getCurrentServerTime() / 1e3),
                    data: {},
                    type: "GET",
                    dataType: "json",
                    headers: {
                        "TribalWars-Ajax": 1
                    },
                    success: function(data) {
                        data_ = $(data.response.dialog);
                        /* Pega parametro único da conta 1x */
                        if (!Parametro[0]) {

                            Parametro[0] = jQuery('input:eq(0)', data_).attr('name');
                            Parametro[1] = jQuery('input:eq(0)', data_).val();

                        }

                        /* Pega na data a quantidade de tropas que a aldeia tem no momento */
                        Minha.Lanceiros = apenasnumeros(jQuery('#units_entry_all_spear', data_).text());
                        Minha.Espadachins = apenasnumeros(jQuery('#units_entry_all_sword', data_).text());
                        Minha.Barbaros = apenasnumeros(jQuery('#units_entry_all_axe', data_).text());
                        /* Se Tem Arqueiro Bota Esse Também, se não tem não coloca */
                        if (TemArqueiro) {
                            Minha.Arqueiro = apenasnumeros(jQuery('#units_entry_all_archer', data_).text());
                        }
                        Minha.Exploradores = apenasnumeros(jQuery('#units_entry_all_spy', data_).text());
                        Minha.Cav_Leves = apenasnumeros(jQuery('#units_entry_all_light', data_).text());
                        /* Se Tem Arqueiro Bota Esse Também, se não tem não coloca */
                        if (TemArqueiro) {
                            Minha.Cav_Arqueiro = apenasnumeros(jQuery('#units_entry_all_marcher', data_).text());
                        }
                        Minha.Cav_Pesadas = apenasnumeros(jQuery('#units_entry_all_heavy', data_).text());
                        Minha.Arietes = apenasnumeros(jQuery('#units_entry_all_ram', data_).text());
                        Minha.Catapultas = apenasnumeros(jQuery('#units_entry_all_catapult', data_).text());
                        /* Se Tem Paladino Bota Esse Também, se não tem não coloca */
                        if (TemPaladino) {
                            Minha.Paladino = apenasnumeros(jQuery('#units_entry_all_knight', data_).text());
                        }
                        Minha.Nobre = apenasnumeros(jQuery('#units_entry_all_snob', data_).text());
                        
                        /* Quando termina as primeira requisições Começa a segunda direto */
                        
                        i++;
                        if (i === Minha_.length){
                            segunda();

                        }

                    }
                });
                /* Delay do SetTimeout da Requisição */
            }, aleatorio(100, 150) + (aleatorio(100, 120) * delay));
            /* Aumenta delay */
            delay++;
        }
    };


    /* Selecionar Alvos E Adicionar no Objeto */
    const SelecionarAlvos = () => {
        /* Alvos não atacados */
        let Alvos_ = Lockr.get("Alvos_Nao_Demolidos");
        for (let Minha of Minha_) {
            let menor = 999999;
            let aux;
            if (Alvos_.length < 1) {
                /* Se todas foram atacadas volta para primeira para ir + de um ataque por aldeia */
                let alvos_demolir = Lockr.get("Alvos_Muralha");
                Lockr.set("Alvos_Nao_Demolidos", alvos_demolir);
                Alvos_ = Lockr.get("Alvos_Nao_Demolidos");
            }
            /* for dos Alvos */
            for (let Alvo of Alvos_) {
                let Alvo_split = Alvo.split("&");
                let Alvo_x = Alvo_split[1].match(/(\d+)\|(\d+)/)[1];
                let Alvo_y = Alvo_split[1].match(/(\d+)\|(\d+)/)[2];
                let d = Math.sqrt(Math.pow((parseInt(Alvo_x) - parseInt(Minha.x)), 2) + Math.pow((parseInt(Alvo_y) - parseInt(Minha.y)), 2));
                /* distância */
                if (d < menor) {
                    menor = d;
                    aux = Alvo;
                }

            }
            /* Alvo escolhido para essa aldeia */
            Minha.AlvoDessa = {
                id: aux.split("&")[0],
                coord: aux.split("&")[1],
                lvl: parseInt(aux.split("&")[2])
            };
            /* Retira a aldeia escolhida do Vetor */
            Alvos_.splice(Alvos_.indexOf(aux), 1);

        }
        /* Quando termina autaliza os alvos não atacados */
        Lockr.set("Alvos_Nao_Demolidos", Alvos_);
        primeira();
    };


    /* Vê se tem alvos */
    if (!Lockr.get("Alvos_Muralha") || Lockr.get("Alvos_Muralha").length < 1) {

        alert('Não Tem Alvos');
/* Script Escrito por ThiioM :) */
    } else {
        if (!Lockr.get("Alvos_Nao_Demolidos")) {
            
            /* Atualiza não atacados para todas */
            let alvos_demolir = Lockr.get("Alvos_Muralha");
            Lockr.set("Alvos_Nao_Demolidos", alvos_demolir);
            SelecionarAlvos();

        }
        if (Lockr.get("Alvos_Nao_Demolidos").length > 0) {
            SelecionarAlvos();
        } else {
           /* Atualiza não atacados para todas */
            let alvos_demolir = Lockr.get("Alvos_Muralha");
            Lockr.set("Alvos_Nao_Demolidos", alvos_demolir);
            SelecionarAlvos();
        }
    }


}

/* Começa Script na página */
Demolir();
