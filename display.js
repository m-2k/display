function Display() {
    this.canvas = undefined;
    this.drawing = undefined;
    this.pageName = 'Page-1'
    this.bounds = undefined;
    this.analyserMatrix = undefined;
    this.onLoadUserFun = undefined;
    
    this.analyser = undefined;
    this.dataArray = [];
    
    this.MODES = { OFF: 0, ANALYSER: 1, SCAN: 2 };
    this.mode;
    this.modeType;
};
Display.prototype.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                          window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
Display.prototype.init = function(canvas,path,fun) {
    this.canvas = canvas;
    this.bounds = new paper.Rectangle(0,0,canvas.clientWidth,canvas.clientHeight);
    this.onLoadUserFun = fun;
    var options = { expandShapes: undefined, onLoad: this.onLoad.bind(this) };
    
    paper.setup(canvas);
    paper.project.importSVG(path, options);
};
Display.prototype.onLoad = function(e,svgString) {
    this.drawing = e;
    e.fitBounds(this.bounds);

    this.createAnalyserMatrix();
    this.resetAnalyser();
    this.resetText();
    typeof this.onLoadUserFun === "function" && this.onLoadUserFun(this);
};

// TEXT
Display.prototype.mapping = {
    ' ':    [0, 0,0,0,0,0, 0,0, 0,0,0,0,0, 0],
    '-':    [0, 0,0,0,0,0, 1,1, 0,0,0,0,0, 0],
    '+':    [0, 0,0,1,0,0, 1,1, 0,0,1,0,0, 0],
    '0':    [1, 1,0,0,0,1, 0,0, 1,0,0,0,1, 1],
    '1':    [0, 0,0,0,0,1, 0,0, 0,0,0,0,1, 0],
    '2':    [1, 0,0,0,0,1, 1,1, 1,0,0,0,0, 1],
    '3':    [1, 0,0,0,0,1, 1,1, 0,0,0,0,1, 1],
    '4':    [0, 1,0,0,0,1, 1,1, 0,0,0,0,1, 0],
    '5':    [1, 1,0,0,0,0, 1,1, 0,0,0,0,1, 1],
    '6':    [1, 1,0,0,0,0, 1,1, 1,0,0,0,1, 1],
    '7':    [1, 0,0,0,0,1, 0,0, 0,0,0,0,1, 0],
    '8':    [1, 1,0,0,0,1, 1,1, 1,0,0,0,1, 1],
    '9':    [1, 1,0,0,0,1, 1,1, 0,0,0,0,1, 1],
    'A':    [1, 1,0,0,0,1, 1,1, 1,0,0,0,1, 0],  'a':    [0, 0,0,0,0,0, 1,1, 1,0,1,0,0, 1],
    'B':    [1, 0,0,1,0,1, 0,1, 0,0,1,0,1, 1],  'b':    [0, 1,0,0,0,0, 1,1, 1,0,0,0,1, 1],
    'C':    [1, 1,0,0,0,0, 0,0, 1,0,0,0,0, 1],  'c':    [0, 0,0,0,0,0, 1,1, 1,0,0,0,0, 1],
    'D':    [1, 0,0,1,0,1, 0,0, 0,0,1,0,1, 1],  'd':    [0, 0,0,0,0,1, 1,1, 1,0,0,0,1, 1],
    'E':    [1, 1,0,0,0,0, 1,1, 1,0,0,0,0, 1],  'e':    [0, 0,0,0,0,0, 1,0, 1,1,0,0,0, 1],
    'F':    [1, 1,0,0,0,0, 1,1, 1,0,0,0,0, 0],  'f':    [0, 0,0,0,1,0, 1,1, 0,0,1,0,0, 0],
    'G':    [1, 1,0,0,0,0, 0,1, 1,0,0,0,1, 1],  'g':    [0, 0,0,0,0,0, 0,1, 0,0,0,1,1, 1],
    'H':    [0, 1,0,0,0,1, 1,1, 1,0,0,0,1, 0],  'h':    [0, 1,0,0,0,0, 1,1, 1,0,0,0,1, 0],
    'I':    [1, 0,0,1,0,0, 0,0, 0,0,1,0,0, 1],  'i':    [0, 0,0,0,0,0, 1,1, 0,0,1,0,0, 1],
    'J':    [0, 0,0,0,0,1, 0,0, 0,0,0,0,1, 1],  'j':    [0, 0,0,0,0,0, 0,1, 0,0,0,0,1, 1],
    'K':    [0, 1,0,0,1,0, 1,0, 1,0,0,1,0, 0],  'k':    [0, 1,0,0,0,0, 1,1, 1,0,0,1,0, 0],
    'L':    [0, 1,0,0,0,0, 0,0, 1,0,0,0,0, 1],  'l':    [0, 0,0,1,0,0, 0,0, 0,0,1,0,0, 0],
    'M':    [0, 1,1,0,1,1, 0,0, 1,0,0,0,1, 0],  'm':    [0, 0,0,0,0,0, 1,1, 1,0,1,0,1, 0],
    'N':    [0, 1,1,0,0,1, 0,0, 1,0,0,1,1, 0],  'n':    [0, 0,0,0,0,0, 1,1, 1,0,0,0,1, 0],
    'O':    [1, 1,0,0,0,1, 0,0, 1,0,0,0,1, 1],  'o':    [0, 0,0,0,0,0, 1,1, 1,0,0,0,1, 1],
    'P':    [1, 1,0,0,0,1, 1,1, 1,0,0,0,0, 0],  'p':    [0, 0,0,0,0,0, 1,0, 1,1,0,0,0, 0],
    'Q':    [1, 1,0,0,0,1, 0,0, 1,0,0,1,1, 1],  'q':    [0, 0,0,0,0,0, 1,1, 1,0,0,1,1, 1],
    'R':    [1, 1,0,0,0,1, 1,1, 1,0,0,1,0, 0],  'r':    [0, 0,0,0,0,0, 1,1, 1,0,0,0,0, 0],
    'S':    [1, 1,0,0,0,0, 1,1, 0,0,0,0,1, 1],  's':    [0, 0,0,0,0,0, 0,1, 0,0,0,1,0, 1],
    'T':    [1, 0,0,1,0,0, 0,0, 0,0,1,0,0, 0],  't':    [0, 1,0,0,0,0, 1,1, 1,0,0,0,0, 1],
    'U':    [0, 1,0,0,0,1, 0,0, 1,0,0,0,1, 1],  'u':    [0, 0,0,0,0,0, 0,0, 1,0,0,0,1, 1],
    'V':    [0, 1,0,0,1,0, 0,0, 1,1,0,0,0, 0],  'v':    [0, 0,0,0,0,0, 0,0, 1,1,0,0,0, 0],
    'W':    [0, 1,0,0,0,1, 0,0, 1,1,0,1,1, 0],  'w':    [0, 0,0,0,0,0, 0,0, 1,0,1,0,1, 1],
    'X':    [0, 0,1,0,1,0, 0,0, 0,1,0,1,0, 0],  'x':    [0, 0,0,0,0,0, 1,1, 0,1,0,1,0, 0],
    'Y':    [0, 0,1,0,1,0, 0,0, 0,0,1,0,0, 0],  'y':    [0, 0,0,0,0,0, 0,0, 0,0,0,1,1, 1],
    'Z':    [1, 0,0,0,1,0, 0,0, 0,1,0,0,0, 1],  'z':    [0, 0,0,0,0,0, 1,0, 0,1,0,0,0, 1],
    
    'А':    [1, 1,0,0,0,1, 1,1, 1,0,0,0,1, 0],
    'Б':    [1, 1,0,0,0,0, 1,1, 1,0,0,0,1, 1],
    'В':    [1, 0,0,1,0,1, 0,1, 0,0,1,0,1, 1],
    'Г':    [1, 1,0,0,0,0, 0,0, 1,0,0,0,0, 0],
    'Д':    [0, 0,0,0,1,1, 1,1, 1,0,0,0,1, 0],
    'Е':    [1, 1,0,0,0,0, 1,1, 1,0,0,0,0, 1],
    'Ё':    [1, 1,0,0,0,0, 1,1, 1,0,0,0,0, 1],
    'Ж':    [0, 0,1,1,1,0, 0,0, 0,1,1,1,0, 0],
    'З':    [1, 0,0,0,0,1, 0,1, 0,0,0,0,1, 1],
    'И':    [0, 1,0,0,1,1, 0,0, 1,1,0,0,1, 0],
    'Й':    [0, 1,0,0,1,1, 0,0, 1,1,0,0,1, 0],
    'К':    [0, 1,0,0,1,0, 1,0, 1,0,0,1,0, 0],
    'Л':    [0, 0,0,0,1,1, 0,0, 0,1,0,0,1, 0],
    'М':    [0, 1,1,0,1,1, 0,0, 1,0,0,0,1, 0],
    'Н':    [0, 1,0,0,0,1, 1,1, 1,0,0,0,1, 0],
    'О':    [1, 1,0,0,0,1, 0,0, 1,0,0,0,1, 1],
    'П':    [1, 1,0,0,0,1, 0,0, 1,0,0,0,1, 0],
    'Р':    [1, 1,0,0,0,1, 1,1, 1,0,0,0,0, 0],
    'С':    [1, 1,0,0,0,0, 0,0, 1,0,0,0,0, 1],
    'Т':    [1, 0,0,1,0,0, 0,0, 0,0,1,0,0, 0],
    'У':    [0, 1,0,0,0,1, 1,1, 0,0,0,0,1, 1],
    'Ф':    [1, 1,0,1,0,1, 1,1, 0,0,1,0,0, 0],
    'Х':    [0, 0,1,0,1,0, 0,0, 0,1,0,1,0, 0],
    'Ц':    [0, 1,0,0,0,1, 0,0, 1,0,0,1,1, 1],
    'Ч':    [0, 1,0,0,0,1, 1,1, 0,0,0,0,1, 0],
    'Ш':    [0, 1,0,1,0,1, 0,0, 1,0,1,0,1, 1],
    'Щ':    [0, 1,0,1,0,1, 0,0, 1,0,1,1,1, 1],
    'Ъ':    [0, 1,0,0,0,0, 1,1, 1,0,0,0,1, 1],
    'Ы':    [0, 1,0,0,0,1, 1,0, 1,0,0,1,1, 1],
    'Ь':    [0, 1,0,0,0,0, 1,1, 1,0,0,0,1, 1],
    'Э':    [1, 0,0,0,0,1, 0,1, 0,0,0,0,1, 1],
    'Ю':    [0, 1,0,0,1,1, 1,0, 1,0,0,1,1, 0],
    'Я':    [1, 1,0,0,0,1, 1,1, 0,1,0,0,1, 0]
};
Display.prototype.getSymbols = function() { return this.drawing.children[this.pageName].children; }
Display.prototype.getTextSymbols = function() { return this.getSymbols()['text'].children; }
Display.prototype.getSymbolCount = function() { return this.getTextSymbols().length; }
Display.prototype.getSymbol = function(position) { return this.getTextSymbols()['c'+ ++position]; }
Display.prototype.getMap = function(char) {
    var m = this.mapping[char];
    m = m ? m : this.mapping[(char+"").toUpperCase()];
    m = m ? m : this.mapping[' '];
    return m;
};
Display.prototype.setChar = function(char,position) { this.applyMap(this.getSymbol(position),this.getMap(char)); };
Display.prototype.applyMap = function(item,map) {
    for(var i = 0; i < map.length; i++) {
        item.children['x'+(i+1)].opacity = map[i] ? 1 : 0.08;
    }
};
Display.prototype.setText = function(text) {
    var c = this.getSymbolCount();
    for(var i = 0; i < c; i++) {
        this.applyMap(this.getSymbol(i),this.getMap(text[i]));
    }
};
Display.prototype.resetText = function(text) { this.setText(''); };

// ANALYSER
Display.prototype.attachStream = function(audioElement) {

    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.analyser = audioCtx.createAnalyser();
    
    this.analyser.minDecibels = -70;
    this.analyser.maxDecibels = -10;
    this.analyser.smoothingTimeConstant = 0.45;
    this.analyser.fftSize = 64;

    var source = audioCtx.createMediaElementSource(audioElement);
    source.connect(this.analyser);
    source.connect(audioCtx.destination);

    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    
    this.draw();
}
Display.prototype.draw = function(timestamp) {
    requestAnimationFrame(this.draw.bind(this));
    
    switch(this.mode) {
        case this.MODES.OFF: break;
        case this.MODES.SCAN: break;
        default:
            this.analyser.getByteFrequencyData(this.dataArray);
            this.setAnalyserData(this.dataArray);
    }
};
Display.prototype.getAnalyser = function() { return this.getSymbols()['analyser'].children; }
Display.prototype.createAnalyserMatrix = function() {
    var a = this.getAnalyser();
    this.analyserMatrix = new Array(a.length)
    
    for(var i = 0; i < a.length; i++) {
        var lineGroup = a['line-'+(i+1)].children;
        this.analyserMatrix[i] = new Array(lineGroup.length);
        
        for(var j = 0; j < lineGroup.length; j++) {
            this.analyserMatrix[i][j] = lineGroup['a'+(j+1)];
        }
    }
};
Display.prototype.setAnalyserData = function(dataArray) {
    if(this.analyserMatrix === undefined) return;
    
    var ranges = this.analyserMatrix.length, //17,
        levels = this.analyserMatrix[0].length, //7,
        ampl;
    var i, j, c, p = (255/levels), o, cmap = {
            32: {
                 0:0,   1:0,   2:1,   3:3,   4:5,   5:7,
                 6:10,  7:11,  8:12,  9:13, 10:13,  11:14,  12:15, 13:16,
                14:19, 15:21, 16:23, 17:25, 18:26, 19:26
            }
        };

    for(i = 0; i < ranges; i++) {
        c = cmap[dataArray.length][i];
        ampl = dataArray[c] * ((c + 1) / ranges + 1 );
        ampl = ampl > 255 ? 255 : ampl;
        ampl = Math.floor(ampl/p);
        for(j = 0; j < levels; j++) {
            o = this.modeType == 0 ? (ampl > j ? 1 : 0.02) : (ampl-1 == j ? 1 : 0.02);
            this.analyserMatrix[i][j].opacity = o;
        }

    }
};
Display.prototype.resetAnalyser = function() {
    this.setMode("analyser");
    this.setAnalyserData([0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0]);
};

// MODES
Display.prototype.setMode = function(mode) {
    switch(mode) {
        case "off":         this.resetAnalyser(); this.mode = this.MODES.OFF;      this.modeType = 0; break;
        case "scan":        this.resetAnalyser(); this.mode = this.MODES.SCAN;     this.modeType = 0; break;
        case "analyser-2":  this.mode = this.MODES.ANALYSER; this.modeType = 1; break;
        default:            this.mode = this.MODES.ANALYSER; this.modeType = 0;
    }
};
