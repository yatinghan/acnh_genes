var tulip_dict = {
    0b000000: "white",
    0b000001: "white",
    0b000011: "white",
    
    0b000100: "yellow",
    0b000101: "yellow",
    0b000111: "white",

    0b001100: "yellow",
    0b001101: "yellow",
    0b001111: "yellow",

    0b010000: "red",
    0b010001: "pink",
    0b010011: "white",

    0b010100: "orange",
    0b010101: "yellow",
    0b010111: "yellow",

    0b011100: "orange",
    0b011101: "yellow",
    0b011111: "yellow",

    0b110000: "black",
    0b110001: "red",
    0b110011: "red",

    0b110100: "black",
    0b110101: "red",
    0b110111: "red",

    0b111100: "purple",
    0b111101: "purple",
    0b111111: "purple"
}


function selectFlower(type){
    // remove from the display class and add to hidden class 
    document.getElementById("table_rose").classList.remove("d-block");
    document.getElementById("table_rose").classList.add("d-none"); 

    document.getElementById("table_tulip").classList.remove("d-block");
    document.getElementById("table_tulip").classList.add("d-none"); 

    document.getElementById("table_pansy").classList.remove("d-block");
    document.getElementById("table_pansy").classList.add("d-none"); 

    document.getElementById("table_cosmos").classList.remove("d-block");
    document.getElementById("table_cosmos").classList.add("d-none"); 

    document.getElementById("table_lily").classList.remove("d-block");
    document.getElementById("table_lily").classList.add("d-none"); 

    document.getElementById("table_hyacinth").classList.remove("d-block");
    document.getElementById("table_hyacinth").classList.add("d-none"); 

    document.getElementById("table_windflower").classList.remove("d-block");
    document.getElementById("table_windflower").classList.add("d-none"); 

    document.getElementById("table_mum").classList.remove("d-block");
    document.getElementById("table_mum").classList.add("d-none"); 


    if (type == 'tulip'){
        document.getElementById("table_tulip").classList.add("d-block");
    }
    else if (type == 'pansy'){
        document.getElementById("table_pansy").classList.add("d-block");
    }
    else if (type == 'cosmos'){
        document.getElementById("table_cosmos").classList.add("d-block");
    }
    else if (type == 'lily'){
        document.getElementById("table_lily").classList.add("d-block");
    }
    else if (type == 'hyacinth'){
        document.getElementById("table_hyacinth").classList.add("d-block");
    }
    else if (type == 'windflower'){
        document.getElementById("table_windflower").classList.add("d-block");
    }
    else if (type == 'mum'){
        document.getElementById("table_mum").classList.add("d-block");
    }
    else {
        document.getElementById("table_rose").classList.add("d-block");
    }
}

function calculateRoses() {
    var e = document.getElementById("roseRed1");
    var red1 = e.options[e.selectedIndex].value;
    e = document.getElementById("roseRed2");
    var red2 = e.options[e.selectedIndex].value;
    e = document.getElementById("roseYellow1");
    var yellow1 = e.options[e.selectedIndex].value;
    e = document.getElementById("roseYellow2");
    var yellow2 = e.options[e.selectedIndex].value;
    e = document.getElementById("roseWhite1");
    var white1 = e.options[e.selectedIndex].value;
    e = document.getElementById("roseWhite2");
    var white2 = e.options[e.selectedIndex].value;   
}

function pack(r, y, w) {
    r = (r == 2) ? 3 : r;
    y = (y == 2) ? 3 : y;
    w = (w == 2) ? 3 : w;
    return ((r << 4) | (y << 2) | w);
}

// pair1, pair2 : one of 0b00, 0b01, 0b11
function shufflePair(pair1, pair2) {

    var a1 = pair1&1;
    var a2 = (pair1 >> 1) & 1;
    var b1 = pair2&1;
    var b2 = (pair2 >> 1) & 1;

    var c1 = a1 << 1 | b1;
    c1 = (c1 == 2) ? 1 : c1; // don't want 10; use 01 instead
    var c2 = a1 << 1 | b2;
    c2 = (c2 == 2) ? 1 : c2;
    var c3 = a2 << 1 | b1;
    c3 = (c3 == 2) ? 1 : c3;
    var c4 = a2 << 1 | b2;
    c4 = (c4 == 2) ? 1 : c4;
    
    return [c1, c2, c3, c4];
}


function calculateTulips() {
    var e = document.getElementById("tulipRed1");
    var red1 = Number(e.options[e.selectedIndex].value);
    e = document.getElementById("tulipRed2");
    var red2 = Number(e.options[e.selectedIndex].value);
    e = document.getElementById("tulipYellow1");
    var yellow1 = Number(e.options[e.selectedIndex].value);
    e = document.getElementById("tulipYellow2");
    var yellow2 = Number(e.options[e.selectedIndex].value);
    e = document.getElementById("tulipWhite1");
    var white1 = Number(e.options[e.selectedIndex].value);
    e = document.getElementById("tulipWhite2");
    var white2 = Number(e.options[e.selectedIndex].value);   

    var gene1 = pack(red1, yellow1, white1);
    var gene2 = pack(red2, yellow2, white2);
    
    var whiten = shufflePair(gene1 & 3, gene2 & 3);
    var yellown = shufflePair((gene1 >> 2) & 3, (gene2 >> 2) & 3);
    var redn = shufflePair((gene1 >> 4) & 3, (gene2 >> 4) & 3);

    var cnt = 0;
    var d = {}
    for (var i = 0; i < whiten.length; i++) {
        for (var j = 0; j < yellown.length; j++) {
            for (var k = 0; k < redn.length; k++) {
                cnt++;
                var g = pack(redn[k], yellown[j], whiten[i]);
                if (d[g]) d[g] += 1;
                else d[g] = 1;
            }
        }
    }

    for (var key in d){
        t = (key >> 4 & 3).toString() + "/" + (key >> 2 & 3).toString() + "/" + (key & 3).toString();
        console.log(t, tulip_dict[key], (d[key]/cnt*100) + "%");
    }
    // alert(shufflePair(gene1, gene2))
    // alert(gene1.toString(2) + "; " + gene2.toString(2) + "; " + shufflePair(gene1, gene2))
    // alert(gene1.toString(2) + "; " + gene2.toString(2));
    return false;
}