// ==UserScript==
// @name         Relogar e redirecionar
// @include      https://www.tribalwars.com.br/*
// @include      https://*/game.php?screen=overview_villages&intro*
// ==/UserScript==

(function() {
    let grupo = 873;
    /* Script Escrito por ThiioM :) */
    if( window.location.href.match(/www/) !== null ) {
    setTimeout(function () {
        window.location.assign('/page/play/brs1');
    }, 2000);
} else {
	setTimeout(function () {
        window.location.assign("?village={game}&screen=overview_villages&mode=combined&group="+grupo+"&page=0&&");
    }, 2000);
    /* Script Escrito por ThiioM :) */
}
})();
