function selectFlower(type){
    // remove from the display class and add to hidden class 
    document.getElementById("div_rose").classList.remove("d-block");
    document.getElementById("div_rose").classList.add("d-none"); 

    document.getElementById("div_tulip").classList.remove("d-block");
    document.getElementById("div_tulip").classList.add("d-none"); 

    document.getElementById("div_pansy").classList.remove("d-block");
    document.getElementById("div_pansy").classList.add("d-none"); 

    document.getElementById("div_cosmos").classList.remove("d-block");
    document.getElementById("div_cosmos").classList.add("d-none"); 

    document.getElementById("div_lily").classList.remove("d-block");
    document.getElementById("div_lily").classList.add("d-none"); 

    document.getElementById("div_hyacinth").classList.remove("d-block");
    document.getElementById("div_hyacinth").classList.add("d-none"); 

    document.getElementById("div_windflower").classList.remove("d-block");
    document.getElementById("div_windflower").classList.add("d-none"); 

    document.getElementById("div_mum").classList.remove("d-block");
    document.getElementById("div_mum").classList.add("d-none"); 


    if (type == 'tulip'){
        document.getElementById("div_tulip").classList.add("d-block");
    }
    else if (type == 'pansy'){
        document.getElementById("div_pansy").classList.add("d-block");
    }
    else if (type == 'cosmos'){
        document.getElementById("div_cosmos").classList.add("d-block");
    }
    else if (type == 'lily'){
        document.getElementById("div_lily").classList.add("d-block");
    }
    else if (type == 'hyacinth'){
        document.getElementById("div_hyacinth").classList.add("d-block");
    }
    else if (type == 'windflower'){
        document.getElementById("div_windflower").classList.add("d-block");
    }
    else if (type == 'mum'){
        document.getElementById("div_mum").classList.add("d-block");
    }
    else {
        document.getElementById("div_rose").classList.add("d-block");
    }
}

// packs 3 values in range [0, 2] to format 0bxxxxxx. 2 is mapped to 0b11
function pack(r, y, w) {
    r = (r == 2) ? 3 : r;
    y = (y == 2) ? 3 : y;
    w = (w == 2) ? 3 : w;
    return ((r << 4) | (y << 2) | w);
}

function pack4(a, r, y, w) {
    a = (a == 2) ? 3 : a;
    r = (r == 2) ? 3 : r;
    y = (y == 2) ? 3 : y;
    w = (w == 2) ? 3 : w;
    return ((a << 6) | ((r << 4) | (y << 2) | w));
}

// reverse of pack
function unpack(g) {
    var r = g >> 4 & 3;
    var y = g >> 2 & 3;
    var w = g & 3;
    r = (r == 3) ? 2 : r;
    y = (y == 3) ? 2 : y;
    w = (w == 3) ? 2 : w;
    return [r, y, w];
}

function unpack4(g) {
    var a = g >> 6 & 3;
    var r = g >> 4 & 3;
    var y = g >> 2 & 3;
    var w = g & 3;
    a = (a == 3) ? 2 : a;
    r = (r == 3) ? 2 : r;
    y = (y == 3) ? 2 : y;
    w = (w == 3) ? 2 : w;
    return [a, r, y, w];
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

// counts all the child genotypes and their frequencies
// used for all flowers but roses
function fillBuckets3(d, whiten, yellown, redn) {
    var cnt = 0;
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
    return cnt;
}

function fillBuckets4(d, whiten, yellown, redn, opacityn) {
    var cnt = 0;
    for (var i = 0; i < whiten.length; i++) {
        for (var j = 0; j < yellown.length; j++) {
            for (var k = 0; k < redn.length; k++) {
                for (var l = 0; l < opacityn.length; l++) {
                    cnt++;
                    var g = pack4(opacityn[l], redn[k], yellown[j], whiten[i]);
                    if (d[g]) d[g] += 1;
                    else d[g] = 1;
                }
            }
        }
    }
    return cnt;
}

// remove all entries in table and insert results in dictionary d
// cnt: sum of frequencies
function injectTable(table, d, cnt, color_map) {
    while(table.rows.length > 0) {
        table.deleteRow(0);
    }

    for (var key in d){
        var l = unpack(key);
        r = l[0]; y = l[1]; w = l[2]; 
        var t = r.toString() + "/" + y.toString() + "/" + w.toString();
        
        var newrow = table.insertRow(-1);
        var gene  = document.createTextNode(t);
        var color = document.createTextNode(color_map[key]);
        var chance  = document.createTextNode((d[key]/cnt*100) + "%");

        var newcell = newrow.insertCell();
        newcell.appendChild(color);
        newcell = newrow.insertCell();
        newcell.appendChild(gene);
        newcell = newrow.insertCell();
        newcell.appendChild(chance);
    }
}

function injectTable4(table, d, cnt, color_map) {
    while(table.rows.length > 0) {
        table.deleteRow(0);
    }

    for (var key in d){
        var l = unpack4(key);
        a = l[0]; r = l[1]; y = l[2]; w = l[3]; 
        var t = a.toString() + "/" + r.toString() + "/" + y.toString() + "/" + w.toString();
        
        var newrow = table.insertRow(-1);
        var gene  = document.createTextNode(t);
        var color = document.createTextNode(color_map[key]);
        var chance  = document.createTextNode((d[key]/cnt*100) + "%");

        var newcell = newrow.insertCell();
        newcell.appendChild(color);
        newcell = newrow.insertCell();
        newcell.appendChild(gene);
        newcell = newrow.insertCell();
        newcell.appendChild(chance);
    }
}



function calculateRoses() {
    var e = document.getElementById("roseRed1");
    var red1 = Number(e.options[e.selectedIndex].value);
    e = document.getElementById("roseRed2");
    var red2 = Number(e.options[e.selectedIndex].value);
    e = document.getElementById("roseYellow1");
    var yellow1 = Number(e.options[e.selectedIndex].value);
    e = document.getElementById("roseYellow2");
    var yellow2 = Number(e.options[e.selectedIndex].value);
    e = document.getElementById("roseWhite1");
    var white1 = Number(e.options[e.selectedIndex].value);
    e = document.getElementById("roseWhite2");
    var white2 = Number(e.options[e.selectedIndex].value);   
    e = document.getElementById("roseOpacity1");
    var opacity1 = Number(e.options[e.selectedIndex].value);
    e = document.getElementById("roseOpacity2");
    var opacity2 = Number(e.options[e.selectedIndex].value);   

    var gene1 = pack4(opacity1, red1, yellow1, white1);
    var gene2 = pack4(opacity2, red2, yellow2, white2);
    
    var whiten = shufflePair(gene1 & 3, gene2 & 3);
    var yellown = shufflePair((gene1 >> 2) & 3, (gene2 >> 2) & 3);
    var redn = shufflePair((gene1 >> 4) & 3, (gene2 >> 4) & 3);
    var opacityn = shufflePair((gene1 >> 6) & 3, (gene2 >> 6) & 3);

    var d = {};
    var cnt = fillBuckets4(d, whiten, yellown, redn, opacityn);
    var table = document.getElementById("table_rose").getElementsByTagName('tbody')[0];
    injectTable4(table, d, cnt, rose_dict);
    
    return false;
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

    var d = {};
    var cnt = fillBuckets3(d, whiten, yellown, redn);
    var table = document.getElementById("table_tulip").getElementsByTagName('tbody')[0];
    injectTable(table, d, cnt, tulip_dict);
    
    return false;
}

function calculatePansies() {
    var e = document.getElementById("pansyRed1");
    var red1 = Number(e.options[e.selectedIndex].value);
    e = document.getElementById("pansyRed2");
    var red2 = Number(e.options[e.selectedIndex].value);
    e = document.getElementById("pansyYellow1");
    var yellow1 = Number(e.options[e.selectedIndex].value);
    e = document.getElementById("pansyYellow2");
    var yellow2 = Number(e.options[e.selectedIndex].value);
    e = document.getElementById("pansyWhite1");
    var white1 = Number(e.options[e.selectedIndex].value);
    e = document.getElementById("pansyWhite2");
    var white2 = Number(e.options[e.selectedIndex].value);   

    var gene1 = pack(red1, yellow1, white1);
    var gene2 = pack(red2, yellow2, white2);
    
    var whiten = shufflePair(gene1 & 3, gene2 & 3);
    var yellown = shufflePair((gene1 >> 2) & 3, (gene2 >> 2) & 3);
    var redn = shufflePair((gene1 >> 4) & 3, (gene2 >> 4) & 3);

    var d = {};
    var cnt = fillBuckets3(d, whiten, yellown, redn);
    var table = document.getElementById("table_pansy").getElementsByTagName('tbody')[0];
    injectTable(table, d, cnt, pansy_dict);
    
    return false;
}

function calculateCosmoses() {
    var e = document.getElementById("cosmosRed1");
    var red1 = Number(e.options[e.selectedIndex].value);
    e = document.getElementById("cosmosRed2");
    var red2 = Number(e.options[e.selectedIndex].value);
    e = document.getElementById("cosmosYellow1");
    var yellow1 = Number(e.options[e.selectedIndex].value);
    e = document.getElementById("cosmosYellow2");
    var yellow2 = Number(e.options[e.selectedIndex].value);
    e = document.getElementById("cosmosWhite1");
    var white1 = Number(e.options[e.selectedIndex].value);
    e = document.getElementById("cosmosWhite2");
    var white2 = Number(e.options[e.selectedIndex].value);   

    var gene1 = pack(red1, yellow1, white1);
    var gene2 = pack(red2, yellow2, white2);
    
    var whiten = shufflePair(gene1 & 3, gene2 & 3);
    var yellown = shufflePair((gene1 >> 2) & 3, (gene2 >> 2) & 3);
    var redn = shufflePair((gene1 >> 4) & 3, (gene2 >> 4) & 3);

    var d = {};
    var cnt = fillBuckets3(d, whiten, yellown, redn);
    var table = document.getElementById("table_cosmos").getElementsByTagName('tbody')[0];
    injectTable(table, d, cnt, cosmos_dict);
    
    return false;
}

function calculateLilies() {
    var e = document.getElementById("lilyRed1");
    var red1 = Number(e.options[e.selectedIndex].value);
    e = document.getElementById("lilyRed2");
    var red2 = Number(e.options[e.selectedIndex].value);
    e = document.getElementById("lilyYellow1");
    var yellow1 = Number(e.options[e.selectedIndex].value);
    e = document.getElementById("lilyYellow2");
    var yellow2 = Number(e.options[e.selectedIndex].value);
    e = document.getElementById("lilyWhite1");
    var white1 = Number(e.options[e.selectedIndex].value);
    e = document.getElementById("lilyWhite2");
    var white2 = Number(e.options[e.selectedIndex].value);   

    var gene1 = pack(red1, yellow1, white1);
    var gene2 = pack(red2, yellow2, white2);
    
    var whiten = shufflePair(gene1 & 3, gene2 & 3);
    var yellown = shufflePair((gene1 >> 2) & 3, (gene2 >> 2) & 3);
    var redn = shufflePair((gene1 >> 4) & 3, (gene2 >> 4) & 3);

    var d = {};
    var cnt = fillBuckets3(d, whiten, yellown, redn);
    var table = document.getElementById("table_lily").getElementsByTagName('tbody')[0];
    injectTable(table, d, cnt, lily_dict);
    
    return false;
}

function calculateHyacinths() {
    var e = document.getElementById("hyacinthRed1");
    var red1 = Number(e.options[e.selectedIndex].value);
    e = document.getElementById("hyacinthRed2");
    var red2 = Number(e.options[e.selectedIndex].value);
    e = document.getElementById("hyacinthYellow1");
    var yellow1 = Number(e.options[e.selectedIndex].value);
    e = document.getElementById("hyacinthYellow2");
    var yellow2 = Number(e.options[e.selectedIndex].value);
    e = document.getElementById("hyacinthWhite1");
    var white1 = Number(e.options[e.selectedIndex].value);
    e = document.getElementById("hyacinthWhite2");
    var white2 = Number(e.options[e.selectedIndex].value);   

    var gene1 = pack(red1, yellow1, white1);
    var gene2 = pack(red2, yellow2, white2);
    
    var whiten = shufflePair(gene1 & 3, gene2 & 3);
    var yellown = shufflePair((gene1 >> 2) & 3, (gene2 >> 2) & 3);
    var redn = shufflePair((gene1 >> 4) & 3, (gene2 >> 4) & 3);

    var d = {};
    var cnt = fillBuckets3(d, whiten, yellown, redn);
    var table = document.getElementById("table_hyacinth").getElementsByTagName('tbody')[0];
    injectTable(table, d, cnt, hyacinth_dict);
    
    return false;
}

function calculateWindflowers() {
    var e = document.getElementById("windflowerRed1");
    var red1 = Number(e.options[e.selectedIndex].value);
    e = document.getElementById("windflowerRed2");
    var red2 = Number(e.options[e.selectedIndex].value);
    e = document.getElementById("windflowerYellow1");
    var yellow1 = Number(e.options[e.selectedIndex].value);
    e = document.getElementById("windflowerYellow2");
    var yellow2 = Number(e.options[e.selectedIndex].value);
    e = document.getElementById("windflowerWhite1");
    var white1 = Number(e.options[e.selectedIndex].value);
    e = document.getElementById("windflowerWhite2");
    var white2 = Number(e.options[e.selectedIndex].value);   

    var gene1 = pack(red1, yellow1, white1);
    var gene2 = pack(red2, yellow2, white2);
    
    var whiten = shufflePair(gene1 & 3, gene2 & 3);
    var yellown = shufflePair((gene1 >> 2) & 3, (gene2 >> 2) & 3);
    var redn = shufflePair((gene1 >> 4) & 3, (gene2 >> 4) & 3);

    var d = {};
    var cnt = fillBuckets3(d, whiten, yellown, redn);
    var table = document.getElementById("table_windflower").getElementsByTagName('tbody')[0];
    injectTable(table, d, cnt, windflower_dict);
    
    return false;
}

function calculateMums() {
    var e = document.getElementById("mumRed1");
    var red1 = Number(e.options[e.selectedIndex].value);
    e = document.getElementById("mumRed2");
    var red2 = Number(e.options[e.selectedIndex].value);
    e = document.getElementById("mumYellow1");
    var yellow1 = Number(e.options[e.selectedIndex].value);
    e = document.getElementById("mumYellow2");
    var yellow2 = Number(e.options[e.selectedIndex].value);
    e = document.getElementById("mumWhite1");
    var white1 = Number(e.options[e.selectedIndex].value);
    e = document.getElementById("mumWhite2");
    var white2 = Number(e.options[e.selectedIndex].value);   

    var gene1 = pack(red1, yellow1, white1);
    var gene2 = pack(red2, yellow2, white2);
    
    var whiten = shufflePair(gene1 & 3, gene2 & 3);
    var yellown = shufflePair((gene1 >> 2) & 3, (gene2 >> 2) & 3);
    var redn = shufflePair((gene1 >> 4) & 3, (gene2 >> 4) & 3);

    var d = {};
    var cnt = fillBuckets3(d, whiten, yellown, redn);
    var table = document.getElementById("table_mum").getElementsByTagName('tbody')[0];
    injectTable(table, d, cnt, mum_dict);
    
    return false;
}



// mappings from genotypes to phenotypes
var rose_dict = {
    //////G4 = 0///////
    0b00000000: "white",
    0b00000001: "white",
    0b00000011: "purple",
    
    0b00000100: "yellow",
    0b00000101: "white",
    0b00000111: "purple",

    0b00001100: "yellow",
    0b00001101: "yellow",
    0b00001111: "white",

    0b00010000: "red",
    0b00010001: "red",
    0b00010011: "red",

    0b00010100: "orange",
    0b00010101: "red",
    0b00010111: "red",

    0b00011100: "orange",
    0b00011101: "orange",
    0b00011111: "red",

    0b00110000: "black",
    0b00110001: "black",
    0b00110011: "black",

    0b00110100: "orange",
    0b00110101: "red",
    0b00110111: "black",

    0b00111100: "orange",
    0b00111101: "orange",
    0b00111111: "blue", 

    //////G4 = 1///////
    0b01000000: "white",
    0b01000001: "white",
    0b01000011: "purple",
    
    0b01000100: "yellow",
    0b01000101: "white",
    0b01000111: "purple",

    0b01001100: "yellow",
    0b01001101: "yellow",
    0b01001111: "white",

    0b01010000: "pink",
    0b01010001: "pink",
    0b01010011: "pink",

    0b01010100: "yellow",
    0b01010101: "pink",
    0b01010111: "pink",

    0b01011100: "yellow",
    0b01011101: "yellow",
    0b01011111: "pink",

    0b01110000: "red",
    0b01110001: "red",
    0b01110011: "red",

    0b01110100: "orange",
    0b01110101: "red",
    0b01110111: "red",

    0b01111100: "orange",
    0b01111101: "orange",
    0b01111111: "red",


    /////G4 = 2///////
    0b11000000: "white",
    0b11000001: "white",
    0b11000011: "purple",
    
    0b11000100: "yellow",
    0b11000101: "white",
    0b11000111: "purple",

    0b11001100: "yellow",
    0b11001101: "yellow",
    0b11001111: "white",

    0b11010000: "white",
    0b11010001: "white",
    0b11010011: "purple",

    0b11010100: "yellow",
    0b11010101: "white",
    0b11010111: "purple",

    0b11011100: "yellow",
    0b11011101: "yellow",
    0b11011111: "white",

    0b11110000: "pink",
    0b11110001: "pink",
    0b11110011: "pink",

    0b11110100: "yellow",
    0b11110101: "white",
    0b11110111: "purple",

    0b11111100: "yellow",
    0b11111101: "yellow",
    0b11111111: "white"
}

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

var pansy_dict = {
    0b000000: "white",
    0b000001: "white",
    0b000011: "blue",
    
    0b000100: "yellow",
    0b000101: "yellow",
    0b000111: "blue",

    0b001100: "yellow",
    0b001101: "yellow",
    0b001111: "yellow",

    0b010000: "red",
    0b010001: "red",
    0b010011: "blue",

    0b010100: "orange",
    0b010101: "orange",
    0b010111: "orange",

    0b011100: "yellow",
    0b011101: "yellow",
    0b011111: "yellow",

    0b110000: "red",
    0b110001: "red",
    0b110011: "purple",

    0b110100: "red",
    0b110101: "red",
    0b110111: "purple",

    0b111100: "orange",
    0b111101: "orange",
    0b111111: "purple"
}

var cosmos_dict = {
    0b000000: "white",
    0b000001: "white",
    0b000011: "white",
    
    0b000100: "yellow",
    0b000101: "yellow",
    0b000111: "white",

    0b001100: "yellow",
    0b001101: "yellow",
    0b001111: "yellow",

    0b010000: "pink",
    0b010001: "pink",
    0b010011: "pink",

    0b010100: "orange",
    0b010101: "orange",
    0b010111: "pink",

    0b011100: "orange",
    0b011101: "orange",
    0b011111: "orange",

    0b110000: "red",
    0b110001: "red",
    0b110011: "red",

    0b110100: "orange",
    0b110101: "orange",
    0b110111: "red",

    0b111100: "black",
    0b111101: "black",
    0b111111: "red"
}

var lily_dict = {
    0b000000: "white",
    0b000001: "white",
    0b000011: "white",
    
    0b000100: "yellow",
    0b000101: "white",
    0b000111: "white",

    0b001100: "yellow",
    0b001101: "yellow",
    0b001111: "white",

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
    0b110011: "pink",

    0b110100: "black",
    0b110101: "red",
    0b110111: "pink",

    0b111100: "orange",
    0b111101: "orange",
    0b111111: "white"
}

var hyacinth_dict = {
    0b000000: "white",
    0b000001: "white",
    0b000011: "blue",
    
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

    0b110000: "red",
    0b110001: "red",
    0b110011: "red",

    0b110100: "blue",
    0b110101: "red",
    0b110111: "red",

    0b111100: "purple",
    0b111101: "purple",
    0b111111: "purple"
}

var windflower_dict = {
    0b000000: "white",
    0b000001: "white",
    0b000011: "blue",
    
    0b000100: "orange",
    0b000101: "orange",
    0b000111: "blue",

    0b001100: "orange",
    0b001101: "orange",
    0b001111: "orange",

    0b010000: "red",
    0b010001: "red",
    0b010011: "blue",

    0b010100: "pink",
    0b010101: "pink",
    0b010111: "pink",

    0b011100: "orange",
    0b011101: "orange",
    0b011111: "orange",

    0b110000: "red",
    0b110001: "red",
    0b110011: "purple",

    0b110100: "red",
    0b110101: "red",
    0b110111: "purple",

    0b111100: "pink",
    0b111101: "pink",
    0b111111: "purple"
}
