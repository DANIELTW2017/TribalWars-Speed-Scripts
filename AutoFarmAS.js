javascript: 

function _FarmarAS() {
    /* Script Escrito por ThiioM :) */
    /* Lockr Script */
    !function(t,e){t.Lockr=function(t,e){"use strict";return e.prefix="",e._getPrefixedKey=function(t,e){return e=e||{},e.noPrefix?t:this.prefix+t},e.set=function(t,e,r){var a=this._getPrefixedKey(t,r);try{localStorage.setItem(a,JSON.stringify({data:e}))}catch(t){}},e.get=function(t,e,r){var a,i=this._getPrefixedKey(t,r);try{a=JSON.parse(localStorage.getItem(i))}catch(t){a=localStorage[i]?{data:localStorage.getItem(i)}:null}return null===a?e:"object"==typeof a&&void 0!==a.data?a.data:e},e}(t,{})}(this);

    /* Vê se tem Arqueiros No Mundo */
    let TemArqueiro = $.inArray('archer', game_data.units) > -1;

    /* Vê se tem Paladino No Mundo */
    let TemPaladino = $.inArray('knight', game_data.units) > -1;

    /* Minhas Aldeias */
    let Ids = [];

    /* Minhas Aldeias */
    let i = 0;

    /* Função Transformar em números */
    const apenasnumeros = string => parseInt(string.replace(/[^0-9]/g, ''));

    /* Função tempo aleatorio */
    const aleatorio = (inferior, superior) => Math.round(parseInt(inferior) + (Math.random() * (superior - inferior)));


    /* Pegar ID das Aldeias */
        $.ajax({

            url: "/game.php?village=" + game_data.village.id + "&screen=info_player&id=" + game_data.player.id,
            data: {},
            type: "GET",
            headers: {
                "Upgrade-Insecure-Requests": 1
            },
            success: (data) => {
                let _ids = data.match(/(data-id="(\d+)")+/g);
                for (let x of _ids) {
                    x = x.replace(/[^0-9]/g, '');
                    Ids.push(x);
                }
                if (data.match(/Player\.getAllVillages/)) {

                    $.ajax({

                        url: "/game.php?village=" + game_data.village.id + "&screen=info_player&ajax=fetch_villages&player_id=" + game_data.player.id,
                        data: {},
                        type: "GET",
                        dataType: "json",
                        success: (data) => {
                            let _ids_ = data.villages.match(/(data-id="(\d+)")+/g);
                            for (let r of _ids_) {
                                r = r.replace(/[^0-9]/g, '');
                                Ids.push(r);
                            }

                        }
                    });
                }
            }
        });

    /* Função Enviar Atk Botão C - AS */
    const EnviarAtaque_ = (Relatorio_id_, id_) => {

        $.ajax({

            url: "/game.php?village=" + id_ + "&screen=am_farm&mode=farm&ajaxaction=farm_from_report&json=1&&h=" + csrf_token + "&client_time=" + Math.round(Timing.getCurrentServerTime() / 1e3),
            data: {
                report_id: Relatorio_id_
            },
            type: "POST",
            dataType: "json",
            headers: {
                "TribalWars-Ajax": 1
            }
        });

    };

    /* Classe Para Criar Alvos */
    class Alvo {
        constructor(Relatorio_id_, Madeira, Argila, Ferro) {
            this.Relatorio_id_ = Relatorio_id_;
            this.Madeira = Madeira;
            this.Argila = Argila;
            this.Ferro = Ferro;
        }
        /* Soma dos recursos */
        get Recursos() {
            return this.Madeira + this.Argila + this.Ferro;
        }

    }

    /* Chamar Proxima Aldeia Para farmar */
    const PuxarAS = () => {

        if (i < Ids.length) {

            let id_ = Ids[i];

            $.ajax({
                url: "/game.php?village=" + id_ + "&screen=am_farm",
                type: "GET",
                headers: {
                    "Upgrade-Insecure-Requests": 1
                },
                success: (data) => {

                    /* Ver nas linhas das aldeias */
                    let Alvos = [];

                    if (!Lockr.get('Alvos_Muralha')) {
                          Lockr.set('Alvos_Muralha', []);
                    }

                    let array = Lockr.get('Alvos_Muralha');

                    $(data).find('tr[id^=village_]').each(
                        function(e) {
                            let id = $(this).attr('id').match(/village_(\d+)/)[1];
                            let coord = $(this).find('td').eq(3).text().match(/(\d+)\|(\d+)/g);
                            let Relatorio_id_ = $(this).find('td').eq(3).find('a').attr('href').match(/view=(\d+)/)[1];
                            let Madeira = apenasnumeros($(this).find('td').eq(5).find('span.nowrap').eq(0).text());
                            let Argila = apenasnumeros($(this).find('td').eq(5).find('span.nowrap').eq(1).text());
                            let Ferro = apenasnumeros($(this).find('td').eq(5).find('span.nowrap').eq(2).text());
                            let Muralha = apenasnumeros($(this).find('td').eq(6).text());
                            /* Script Escrito por ThiioM :) */
                            if( $(this).find('td').eq(5).find('span').eq(0).text() !== "?" ) {
                            if ($(this).find('a.farm_icon.farm_icon_c').attr('class').match(/farm_icon_disabled/) === null) {

                                if (Muralha > 0) {
                                    let aux = [
                                        id, "&", coord, "&", Muralha
                                    ];
                                    if(array.indexOf(aux.join('')) === -1 ) {

                                        array.push(aux.join(''));
                                    }
                                    

                                }


                                Alvos.push(new Alvo(Relatorio_id_, Madeira, Argila, Ferro));
                            }
                            }
                        });

                    Lockr.set('Alvos_Muralha', array);

        if (Alvos.length !== 0) {

                    /* Inciar Os Ataques */
                    let Enviou = 0;
                    
                        for (let t = 0; t < Alvos.length; t++) {
                            if (Alvos[t].Recursos > 300000 && Enviou === 0) {
                                Enviou++;
                                EnviarAtaque_(Alvos[t].Relatorio_id_, id_);
                                setTimeout(function () { PuxarAS(); }, aleatorio(100, 150) );
                            }
                        }

                        if (Enviou) {

                            i++;

                        } else {
                            for (let t = 0; t < Alvos.length; t++) {
                                if (Alvos[t].Recursos > 200000 && Enviou === 0) {
                                    Enviou++;
                                    EnviarAtaque_(Alvos[t].Relatorio_id_, id_);
                                    setTimeout(function () { PuxarAS(); }, aleatorio(100, 150) );
                                }
                            }

                            if (Enviou) {

                                i++;

                            } else {
                                for (let t = 0; t < Alvos.length; t++) {
                                    if (Alvos[t].Recursos > 100000 && Enviou === 0) {
                                        Enviou++;
                                        EnviarAtaque_(Alvos[t].Relatorio_id_, id_);
                                        setTimeout(function () { PuxarAS(); }, aleatorio(100, 150) );
                                    }
                                }
                                if (Enviou) {

                                    i++;

                                } else {
                                    for (let t = 0; t < Alvos.length; t++) {
                                        if (Alvos[t].Recursos > 50000 && Enviou === 0) {
                                            Enviou++;
                                            EnviarAtaque_(Alvos[t].Relatorio_id_, id_);
                                            setTimeout(function () { PuxarAS(); }, aleatorio(100, 150) );
                                        }
                                    }
                                    if (Enviou) {

                                        i++;

                                    } else {

                                        i++;
                                        setTimeout(function () { PuxarAS(); }, aleatorio(100, 150) );

                                    }
                                }
                            }

                        }

                } else {
                    i++;
                    setTimeout(function () { PuxarAS(); }, aleatorio(100, 150) );
                }
                }
            });

        } else {

            i = 0;
            setTimeout(function () { PuxarAS(); }, aleatorio(100, 150) );

        }
    };

    const __ids = () => {

        if (Ids[0] !== undefined) {

            setTimeout(function () { PuxarAS(); }, aleatorio(100, 150) );

        } else {

            /* Já tem meus IDS? */
            setTimeout(() => {
                __ids();
            }, 1000);

        }

    };

    setTimeout(() => {
        __ids();
    }, 2000);

}

_FarmarAS();
