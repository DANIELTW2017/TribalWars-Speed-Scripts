javascript:

let delay = 0;
/* Script Escrito por ThiioM :) */
function aleatorio(inferior, superior) {
    numPossibilidades = superior - inferior;
    aleat = Math.random() * numPossibilidades;
    return Math.round(parseInt(inferior) + aleat);
}

    $('.quickedit-vn').each(function() {
        let id = $(this).data('id');
        setTimeout(function () {$.ajax({
            type: "GET",
            url: window.location.origin + "/game.php?village=" + id + "&screen=train&action=cancel_all&mode=train&h="+ csrf_token +"&building=barracks",
            headers: {
                "Upgrade-Insecure-Requests": 1
            }
        });}, (aleatorio(200, 250) + (delay * 200)));
        delay++;
        setTimeout(function () {$.ajax({
            type: "GET",
            url: window.location.origin + "/game.php?village=" + id + "&screen=train&action=cancel_all&mode=train&h="+ csrf_token +"&building=stable",
            headers: {
                "Upgrade-Insecure-Requests": 1
            }
        });}, (aleatorio(200, 250) + (delay * 200)));
        delay++;
        /* Script Escrito por ThiioM :) */
        setTimeout(function () {$.ajax({
            type: "GET",
            url: window.location.origin + "/game.php?village=" + id + "&screen=train&action=cancel_all&mode=train&h="+ csrf_token +"&building=garage",
            headers: {
                "Upgrade-Insecure-Requests": 1
            }
        });}, (aleatorio(200, 250) + (delay * 200)));
        delay++;
    });

void(0);
