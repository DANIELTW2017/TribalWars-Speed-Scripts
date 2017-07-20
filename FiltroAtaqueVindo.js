javascript:
/* Script Escrito por Jorge :) */
function cortarString(string, fp, lp){
    return string.slice(fp, lp);
}
function adicionarElem(array, elem){
    if ($.inArray(elem, array) == -1) {
       return elem;
   }
   return false;
}

var atkComing = $('#incomings_table tbody tr');
if (atkComing.length) {
    var strAtt, strId, strSup, aux, arrayLength;
    var coords = [], coordsS = [];
    for (var i = 0; i < (atkComing.length - 2); i++) {
        strAtt = $('#incomings_table tbody tr:eq(' + (1 + i) + ') td:eq(2) a').text();
        strSup = $('#incomings_table tbody tr:eq(' + (1 + i) + ') td:eq(1) a').text();
        strId = $('#incomings_table tbody tr:eq(' + (1 + i) + ') td:eq(2) a').attr("href");
        strAtt = cortarString(strAtt, strAtt.indexOf("(") + 1, strAtt.indexOf(")"));
        strSup = cortarString(strSup, strSup.indexOf("(") + 1, strSup.indexOf(")"));
        aux = adicionarElem(coords, strAtt);
        if(aux){  
            arrayLength = coords.length;
            coords[arrayLength] = cortarString(strId, strId.indexOf("id") + 3, strId.length)+"&"+aux; 
        }
        /* Script Escrito por Jorge :) */
        strId = $('#incomings_table tbody tr:eq(' + (1 + i) + ') td:eq(1) a').attr("href");
        aux = adicionarElem(coordsS, strSup);
        if(aux){  
            arrayLength = coordsS.length;
            coordsS[arrayLength] = cortarString(strId, strId.indexOf("village") + 8, strId.indexOf("&screen"))+"&"+aux;
        }
        
    }
    
    alert("Coords Atacante:\n"+coords.join(",")+"\n\nCoords Defensor:\n"+coordsS.join(","));
}
void(0);
