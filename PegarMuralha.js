javascript:
/* Script Escrito por ThiioM :) */
function Muralha () {
    let Coords = [];
$('tr[id^=village_]').each(
   function(e) {
       let Muralhas = parseInt($(this).find('td').eq(6).text());
       if (Muralhas > 0) {
      let Coord = $(this).find('td').eq(3).text().match(/(\d+)\|(\d+)/g)[0];
      Coords.push(Coord);
       }
   });

   let x = Coords.toString().replace(/\,/g, " ");
   alert(x);
}
/* Script Escrito por ThiioM :) */
Muralha();
void(0);
