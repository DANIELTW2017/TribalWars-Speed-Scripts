javascript:

(function () {

	!function(t,e){t.Lockr=function(t,e){"use strict";return e.prefix="",e._getPrefixedKey=function(t,e){return e=e||{},e.noPrefix?t:this.prefix+t},e.set=function(t,e,r){let a=this._getPrefixedKey(t,r);try{localStorage.setItem(a,JSON.stringify({data:e}))}catch(t){}},e.get=function(t,e,r){let a,i=this._getPrefixedKey(t,r);try{a=JSON.parse(localStorage.getItem(i))}catch(t){a=localStorage[i]?{data:localStorage.getItem(i)}:null}return null===a?e:"object"==typeof a&&void 0!==a.data?a.data:e},e}(t,{})}(this);

	let temArqueiro = $.inArray('archer', game_data.units) > -1;
    let temPaladino = $.inArray('knight', game_data.units) > -1;
    let minhas = [];
    let parametro = [];

  function apenasnumeros (string) {
  	return parseInt(string.replace(/[^0-9]/g, ''));
  } 

  function removerOnError (arr, attr, value) {
    let i = arr.length;
    while(i--){
       if( arr[i] 
           && arr[i].hasOwnProperty(attr) 
           && (arguments.length > 2 && arr[i][attr] === value ) ){ 

           arr.splice(i,1);

       }
    }
  }

  function aleatorio (inferior, superior) {
  	return Math.round(parseInt(inferior) + (Math.random() * (superior - inferior)));
  }

  function resErro () {
  	let alvosDefesa = Lockr.get("Alvos_Apoio");
    Lockr.set("Alvos_Nao_Apoiados", alvosDefesa);
  }

  function selecionarAlvos () {
  	let alvos = Lockr.get("Alvos_Nao_Apoiados");

        for (let minha of minhas) {
            let menor = 999999, aux;
            let auxOk = false;

            	if (alvos.length < 1) {
                resErro();
                alvos = Lockr.get("Alvos_Nao_Apoiados");
            	}

            for (let alvo of alvos) {
            	if (alvo.match(/(\d+)\&(\d+)\|(\d+)/)) {
        			let alvoSplit = alvo.split("&")[1].match(/(\d+)\|(\d+)/);
        			let alvoX= alvoSplit[1];
        			let alvoY = alvoSplit[2];
        			let d = Math.sqrt(Math.pow((parseInt(alvoX) - parseInt(minha.x)), 2) + Math.pow((parseInt(alvoY) - parseInt(minha.y)), 2));
					
					if (d < menor) { menor = d; aux = alvo; }
				}
     	           	
            }

            minha.alvoDessa = {
                id: aux.split("&")[0],
                c: aux.split("&")[1]
            };

            alvos.splice(alvos.indexOf(aux), 1);
        }

            Lockr.set("Alvos_Nao_Apoiados", alvos);
        	primeira();
        
}
  
  function primeira() {
	$('#combined_table tbody tr').eq(0).find('th').remove();
	$('tr[class^="nowrap"]').find('td').remove();

        let delay = 0;
        let i = 0;
        
        for (let minha of minhas) {
            setTimeout(() => {

                $.ajax({
                    url:  "/game.php?village=" + minha.id + "&screen=place&ajax=command&target=" + minha.alvoDessa.id + "&client_time=" + Math.round(Timing.getCurrentServerTime() / 1e3),
                    data: {},
                    type: "GET",
                    dataType: "json",
                    headers: {
                        "TribalWars-Ajax": 1
                    },
                    success: function(data) {

                    	if (!data.error) {
                        data_ = $(data.response.dialog);
                        if (!parametro[0]) {
						parametro[0] = jQuery('input:eq(0)', data_).attr('name');
						parametro[1] = jQuery('input:eq(0)', data_).val();
				    	}
						minha.lanceiros = apenasnumeros(jQuery('#units_entry_all_spear', data_).text());
				        minha.espadachins = apenasnumeros(jQuery('#units_entry_all_sword', data_).text());
				        minha.barbaros = apenasnumeros(jQuery('#units_entry_all_axe', data_).text());
				        if (temArqueiro) {
				        	minha.arqueiro = apenasnumeros(jQuery('#units_entry_all_archer', data_).text());
				        }
				        minha.exploradores = apenasnumeros(jQuery('#units_entry_all_spy', data_).text());
				        minha.cavLeves = apenasnumeros(jQuery('#units_entry_all_light', data_).text());
				        if (temArqueiro) {
				        	minha.cavArqueiro = apenasnumeros(jQuery('#units_entry_all_marcher', data_).text());
				        }
				        minha.cavPesadas = apenasnumeros(jQuery('#units_entry_all_heavy', data_).text());
				        minha.arietes = apenasnumeros(jQuery('#units_entry_all_ram', data_).text());
				        minha.catapultas = apenasnumeros(jQuery('#units_entry_all_catapult', data_).text());
				        if (temPaladino) {
				        	minha.paladino = apenasnumeros(jQuery('#units_entry_all_knight', data_).text());
				        }
				        minha.nobre = apenasnumeros(jQuery('#units_entry_all_snob', data_).text());
                    	} else {
                            if(data.error === "A sua sess\u00e3o expirou. Por favor, acesse novamente.") {
                                window.location.reload(true);
                            }
                    		removerOnError(minhas, 'id', minha.id);
                    		i--;
                    	}
                        
                  
                        i++;
                        if (i === minhas.length){
                            segunda();
                        }
                    
                    },
                    error: function () {
                        window.location.reload(true);
                    }
                });
            }, aleatorio(200, 220) + (aleatorio(200, 220) * delay));
            delay++;
        }

  }

  
  function segunda() {
	
    let html = [
            '<th> Minha Aldeia </th>',
            '<th> Aldeia Alvo </th>',
            '<th> Duração </th>',
            '<th id="enviar"> > Enviar < </th>'
        ];

    $('#combined_table tbody tr').eq(0).append(html.join(""));

    let delay = 0;
    let i = 0;

        for (let minha of minhas) {

            let _Data = {};
            _Data[parametro[0]] = parametro[1];
            _Data.template_id = "";
            _Data.source_village = minha.id;
            _Data.spear = parseInt(Lockr.get('Tropas_Defesa_Lanceiro')) < parseInt(minha.lanceiros) ? Lockr.get('Tropas_Defesa_Lanceiro') : minha.lanceiros;
            _Data.sword = parseInt(Lockr.get('Tropas_Defesa_Espadachim')) < parseInt(minha.espadachins) ? Lockr.get('Tropas_Defesa_Espadachim') : minha.espadachins;
            _Data.axe = parseInt(Lockr.get('Tropas_Defesa_Barbaro')) < parseInt(minha.barbaros) ? Lockr.get('Tropas_Defesa_Barbaro') : minha.barbaros;
            if (temArqueiro) {
                _Data.archer = parseInt(Lockr.get('Tropas_Defesa_Arqueiro')) < parseInt(minha.arqueiro) ? Lockr.get('Tropas_Defesa_Arqueiro') : minha.arqueiro;
            }
            _Data.spy = parseInt(Lockr.get('Tropas_Defesa_Explorador')) < parseInt(minha.exploradores) ? Lockr.get('Tropas_Defesa_Explorador') : minha.exploradores;
            _Data.light =  parseInt(Lockr.get('Tropas_Defesa_Cavalaria_leve:')) < parseInt(minha.cavLeves) ? Lockr.get('Tropas_Defesa_Cavalaria_leve:') : minha.cavLeves;
            if (temArqueiro) {
                _Data.marcher = parseInt(Lockr.get('Tropas_Defesa_Arqueiro_a_cavalo')) < parseInt(minha.cavArqueiro) ? Lockr.get('Tropas_Defesa_Arqueiro_a_cavalo') : minha.cavArqueiro;
            }
            _Data.heavy = parseInt(Lockr.get('Tropas_Defesa_Cavalaria_pesada')) < parseInt(minha.cavPesadas) ? Lockr.get('Tropas_Defesa_Cavalaria_pesada') : minha.cavPesadas;
            _Data.ram = parseInt(Lockr.get('Tropas_Defesa_Ariete')) < parseInt(minha.arietes) ? Lockr.get('Tropas_Defesa_Ariete') : minha.arietes;
            _Data.catapult = parseInt(Lockr.get('Tropas_Defesa_Catapulta')) < parseInt(minha.catapultas) ? Lockr.get('Tropas_Defesa_Catapulta') : minha.catapultas;
            if (temPaladino) {
                _Data.knight = parseInt(Lockr.get('Tropas_Defesa_Paladino')) < parseInt(minha.paladino) ? Lockr.get('Tropas_Defesa_Paladino') : minha.paladino;
            }
            _Data.snob = parseInt(Lockr.get('Tropas_Defesa_Nobre')) < parseInt(minha.nobre) ? Lockr.get('Tropas_Defesa_Nobre') : minha.nobre;
            _Data.x = minha.alvoDessa.c.split("|")[0];
            _Data.y = minha.alvoDessa.c.split("|")[1];
            _Data.input = "";
            _Data.support = "l";

            setTimeout(() => {
                $.ajax({
                    url:  "/game.php?village=" + minha.id + "&screen=place&ajax=confirm&h=" + csrf_token + "&client_time=" + Math.round(Timing.getCurrentServerTime() / 1e3),
                    data: _Data,
                    type: "POST",
                    dataType: "json",
                    headers: {
                        "TribalWars-Ajax": 1
                    },
                    success: function(data) {
                    	if (!data.error) {
                    	let tempo = jQuery('table.vis:eq(0) tr:eq(3) td:eq(1)', data.response.dialog).text();
                        let html = [
                           '<td style="text-align:center">', minha.c,
                           '</td>', '<td style="text-align:center">', minha.alvoDessa.c,
                           '</td>', '<td style="text-align:center">', tempo,
                           '</td>', '<td id="aindanao" style="text-align:center">AINDA NÃO</td>'
                        ];

                        $('tr[class^="nowrap"]').eq(i).append(html.join(""));

                        minha.seriliaze = $(data.response.dialog).serialize();
                    	} else {
                            if(data.error === "A sua sess\u00e3o expirou. Por favor, acesse novamente.") {
                                window.location.reload(true);
                            }
                    		removerOnError(minhas, 'id', minha.id);
                    		i--;
                    	}

                    	i++;
                        if (i === minhas.length) {
                            $('tr[class^="nowrap"]').find('td#aindanao').text("PRONTO PRA ENVIAR");
                            $('#combined_table tbody tr').eq(0).find('th#enviar').text('Enviar:').append('<input id="Enviar" class="btn" name="x" type="submit" value="Enviar">');
                            $('input#Enviar').click(function(e) {
                                e.preventDefault();
                                terceira();
                            });
                        }
                    
                    },
                    error: function () {
                        window.location.reload(true);
                    }

                });
            }, aleatorio(200, 220) + (aleatorio(200, 220) * delay));
            delay++;

        }

    }

  function terceira() {
  	let i = 0;
    let delay = 0;
    
        for (let minha of minhas) {
        	let u = [
        		"/game.php?village=", minha.id,
        		"&screen=place&ajaxaction=popup_command&h=", csrf_token,
        		"&client_time=", Math.round(Timing.getCurrentServerTime() / 1e3)
        	];
            setTimeout(() => {
                $.ajax({
                    url: u.join(''),
                    data: minha.seriliaze,
                    type: "POST",
                    dataType: "json",
                    headers: {
                        "TribalWars-Ajax": 1
                    },
                    success: function(data) {
                       if (!data.error) {
                        $('td#aindanao').eq(i).text("Enviado!!");
                        } else {
                            $('td#aindanao').eq(i).text("!ERRO!");
                            if(data.error === "A sua sess\u00e3o expirou. Por favor, acesse novamente.") {
                                window.location.reload(true);
                            }
                        }
                        i++;
                        if (i === minhas.length) {
                            alert('Terminou');
                        }
                    },
                    error: function () {
                         window.location.reload(true);
                    }

                });
            }, aleatorio(200, 250) + (aleatorio(200, 250) * delay));
            delay++;

        }
  }

	$('.quickedit-label').each(function(e) {
    	let x = $(this).text().match(/(\d+)\|(\d+)/);
        minhas[e] = {
            c: x[0],
            x: x[1],
            y: x[2],
            id: $(this).parent().attr('href').match(/village=(\d+)/)[1]
        };
    });

    if (!Lockr.get("Alvos_Apoio") || Lockr.get("Alvos_Apoio") === 'Coloque Aqui As Coordenadas E IDS De Defesa') {
       	    alert('Não Tem Alvos');
    } else {
        if (!Lockr.get("Alvos_Nao_Apoiados")) {
            resErro();
            selecionarAlvos();
        } else {
        	if (Lockr.get("Alvos_Nao_Apoiados").length > 0) {
            selecionarAlvos();
        } else {
            resErro();
            selecionarAlvos();
        }
	  }
    }


})();
