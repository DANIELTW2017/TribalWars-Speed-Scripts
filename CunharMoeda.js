// ==UserScript==
// @name         Cunhar Moeda
// @include      https://*&screen=snob&mode=coin*
// ==/UserScript==

(function () {
/* Script Escrito por ThiioM :) */

function aleatorio (inferior, superior) {
    return Math.round(parseInt(inferior) + (Math.random() * (superior - inferior)));
}
  
function cunhar() {
        setTimeout(function () { $('#select_anchor_top').click(); }, 1000);
        setTimeout(function () { $('.mint_multi_button').eq(0).click(); }, 2000);
}

let tempo = aleatorio(70000, 120000);

setInterval(
  function() {
   window.location.assign("game.php?village={game}&screen=snob&mode=coin&group=0&");
  }, tempo);
})();
