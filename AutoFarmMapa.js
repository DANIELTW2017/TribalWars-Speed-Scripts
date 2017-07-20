javascript:

function AtaqueAS() {
/* Script Escrito por ThiioM :) */
let radius = 1005.0;
let barb_size = {
    min: 10,
    max: 12500
};
let village_size = {
    min: 10,
    max: 15
};


let coords = [];
let outputID = 'villageList';
let isEncoded = true;


function zeroPad(number, length) {
    let n = number.toString();
    while (n.length < length)
        n = '0' + n;
    return n;
}

/* Script Escrito por ThiioM :) */
function fnRefresh() {
    $('#coord_picker').draggable();
    $('#' + outputID).prop('value', coords.map(function(e) {
        return isEncoded ? '[coord]' + e + '[\/coord]' : e;
    }).join(isEncoded ? '\n' : ' '));
}


$(document).ready(function() {
    if (window.game_data.screen == 'map') {
        let col, row, coord, village, player, points;
        let home = window.game_data.village.coord.split('|').map(function(x) {
            return parseInt(x, 10);
        });
        for (row = 0; row < TWMap.size[1]; row++) {
            for (col = 0; col < TWMap.size[0]; col++) {
                coord = TWMap.map.coordByPixel(TWMap.map.pos[0] + (TWMap.tileSize[0] * col), TWMap.map.pos[1] + (TWMap.tileSize[1] * row));
                if (coord) {
                    coord = coord.map(function(e) {
                        return zeroPad(e, 3);
                    });
                    village = TWMap.villages[coord.join('')];
                    if (village) {
                        player = null;
                        if (parseInt(village.owner || '0', 10))
                            player = TWMap.players[village.owner];
                        points = parseInt(village.points.toString().replace('.', ''), 10);
                        if (player) {
                            if (village.owner != window.game_data.player.id)
                                if (player.ally != window.game_data.ally_id)
                                    if ((!village_size.min || points >= village_size.min) && (!village_size.max || points <= village_size.max))
                                        coords.push(coord.join('|'));
                        } else if ((!barb_size.min || points >= barb_size.min) && (!barb_size.max || points <= barb_size.max))
                            coords.push(coord.join('|'));
                    }
                }
            }
        }
        if (radius > 0.0) {
            coords = coords.filter(function(item, index, arr) {
                let aa = item.split('|').map(function(x) {
                    return parseInt(x, 10);
                });
                return Math.sqrt(Math.pow(home[0] - aa[0], 2) + Math.pow(home[1] - aa[1], 2)) <= radius;
            });
        }
        coords = coords.sort(function(a, b) {
            let aa = a.split('|').map(function(x) {
                return parseInt(x, 10);
            });
            let bb = b.split('|').map(function(x) {
                return parseInt(x, 10);
            });
            return Math.sqrt(Math.pow(home[0] - aa[0], 2) + Math.pow(home[1] - aa[1], 2)) - Math.sqrt(Math.pow(home[0] - bb[0], 2) + Math.pow(home[1] - bb[1], 2));
        });
        if ($('#coord_picker').length === 0) {
            let srcHTML = '<div id="coord_picker" style="display:none; padding: 3px; z-index: 99999; position: absolute; top: 90px; width: auto; height: auto; background-color:#CEBC98; background-image: url(../graphic/index/bg-tile.jpg); border:2px solid;  visibility: visible"><center><span style="color:blue;align:center;">Retirar coordenadas do mapa</span><br/><br/><center><input type="checkbox" id="cbBBEncode" onClick="isEncoded=this.checked;fnRefresh();"' + (isEncoded ? 'checked' : '') + '/>C\u00F3digos BB<br/><textarea id="' + outputID + '" cols="40" rows="10"resize="none" value="" onFocus="this.select();"/><br/><input type="button" class="btn" value="Fechar janela" onClick="window.location.reload()"></div>';
            $('body').append($(srcHTML));
        }
        fnRefresh();
    } else {
        let redirect = confirm('O script deve ser executado no Mapa\n\nRedireccionar agora?');
        if (redirect)
            window.self.location = window.game_data.link_base_pure.replace(/screen\=/i, 'screen=map');
    }
});

const aleatorio = (inferior, superior) => Math.round(parseInt(inferior) + (Math.random() * (superior - inferior)));
let ids = [];

for (let i = 0; i < coords.length; i++) {
    let xy = coords[i].split("|");;
    let x = xy[0];
    let y = xy[1];
    ids.push(TWMap.villages[x + "" + y].id);
}

let Enviar = (template, i) => {
    $.ajax({

        url: "/game.php?village=" + game_data.village.id + "&screen=am_farm&mode=farm&ajaxaction=farm&template_id=" + template + "&target=" + ids[i] + "&source=" + game_data.village.id + "&json=1&&h=" + csrf_token + "&client_time=" + Math.round(Timing.getCurrentServerTime() / 1e3),
        data: {},
        type: "GET",
        dataType: "json",
        headers: {
            "TribalWars-Ajax": 1
        }
    });
};

let AtualizarTropas = () => {
/* Script Escrito por ThiioM :) */
            $.ajax({
                url: "/game.php?village=" + game_data.village.id + "&screen=am_farm",
                type: "GET",
                headers: {
                    "Upgrade-Insecure-Requests": 1
                },
                success: (data) => {
                    let spy = parseInt(($(data).find('script').text().split('Accountmanager.farm.current_units =')[1].split('};')[0] + "}").split("spy")[1].split('",')[0].replace(/[^0-9]/g, ""));
                    let template = $(data).find('form').eq(0).attr('action').split("template_id=")[1].split("&")[0];
                    if (spy > 0 && template !== undefined) {

                        for (let i = 0; (i < spy) && (i < ids.length); i++) {
                            setTimeout(() => {

                                Enviar(template, i);

                            }, aleatorio(220, 300) + (aleatorio(220, 300) * i));
                        }
                    }
                }
            });
};
AtualizarTropas();
}
AtaqueAS();

void(0);
