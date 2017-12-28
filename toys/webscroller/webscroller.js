function observe(v)
{
    console.log(v);
    return v;
}

function preloadImage(url)
{
    var img = new Image();
    img.src = url;
    preloadImage.images.push(img);
}
preloadImage.images = [];

function posmod(num, denom)
{
    var m = num % denom;
    return m < 0 ? m + denom : m;
}

function Sprite(dirname, frameCount, sequences, layer, w, h, x, y)
{
    this.dirname = dirname;
    this.sequences = sequences;
    this.layer =  layer;
    this.elt = document.createElement('img');
    this.elt.src = this.frameSrc(1);
    this.elt.style.width = this.width = w;
    this.elt.style.height = this.height = h;
    this.elt.style.display = "block";
    this.elt.style.position = "absolute";
    this.x = this.elt.style.left = x;
    this.y = this.elt.style.top = y;
    
    this.layer.elt.appendChild(this.elt);

    for(var f = 1; f <= frameCount; ++f)
        preloadImage(this.frameSrc(f));
    
    return this;
}
Sprite.prototype = {
    frameSrc: function(n) {
        return this.dirname + '/' + n + '.png';
    },
    setSequence: function(sequenceName) {
        var sequence = this.sequence = this.sequences[sequenceName];
        sequence.name = sequenceName;
        this.sequencePoint = 0;
        this.sequenceFramePoint = 0;
        this.elt.src = this.frameSrc(sequence.frames[0]);
    },
    next: function() {
        var sequence = this.sequence;
        var framePoint = ++this.sequenceFramePoint;
        if(framePoint >= sequence.frameLengths[this.sequencePoint]) {
            this.sequenceFramePoint = 0;
            if(++this.sequencePoint >= this.sequence.frames.length) {
                this.sequencePoint = this.sequence.repeatPoint;
            }
            this.elt.src = this.frameSrc(this.sequence.frames[this.sequencePoint]);
        }
    },
    moveto: function(x, y) {
        this.x = this.elt.style.left = x;
        this.y = this.elt.style.top = y;
    },
    move: function(x, y) {
        this.elt.style.left = this.x += x;
        this.elt.style.top  = this.y += y;        
    }
};

function Engine(frame, map, period, ontick)
{
    this.frame = frame;
    this.frame.style.backgroundColor = map.backdrop;
    this.frame.style.width = Engine.VIEWPORT_WIDTH;
    this.frame.style.height = Engine.VIEWPORT_HEIGHT;
    this.map = map;
    this.period = period;
    this.ontick = ontick;

    this.layers = [];
    for(var t = 0; t < map.tiles.length; ++t)
        preloadImage(map.tiles[t]);
    for(var l = 0; l < map.layers.length; ++l)
        this.layers[l] = new Layer(this, l);
        
    return this;   
}
Engine.LAYER_WIDTH = 4;
Engine.LAYER_HEIGHT = 3;
Engine.VIEWPORT_WIDTH = 640;
Engine.VIEWPORT_HEIGHT = 480;
Engine.prototype = {
    map: null,
    frame: null,
    layers: null,
    ontick: null,
    tickCount: 0,
    period: null,
    interval: null,
    tick: function() {
        this.ontick(this, this.tickCount);
        ++this.tickCount;
    },
    run: function() {
        if(this.interval)
            this.stop();
        var self = this;
        this.interval = setInterval(function() { self.tick(); }, this.period);
    },
    stop: function(engine) {
        if(this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
};

function Layer(engine, l)
{
    this.tiles = [];
    this.engine = engine;
    this.idx = l;
    var elt = this.elt = document.createElement('div');
    elt.className = "layer";
    elt.style.zIndex = 1000 - l;
    
    for(var x = 0; x < Engine.LAYER_WIDTH; ++x) {
        this.tiles[x] = [];
        for(var y = 0; y < Engine.LAYER_HEIGHT; ++y) {
            var tile = this.tiles[x][y] = document.createElement('img');
            tile.className = "tile";
            tile.style.left = x*256;
            tile.style.top  = y*256;
            
            tile.src = this.mapTile(x, y);
            tile.tileX = x;
            tile.tileY = y;
            elt.appendChild(tile);
        }
    }
    engine.frame.appendChild(this.elt);
    
    return this;
}
Layer.prototype = {
    elt: null,
    idx: null,
    engine: null,
    tiles: null,
    x: 0,
    y: 0,
    xcorner: 0,
    ycorner: 0,
    xlbound: 0,
    xubound: Engine.LAYER_WIDTH*256 - Engine.VIEWPORT_WIDTH,
    ylbound: 0,
    yubound: Engine.LAYER_HEIGHT*256 - Engine.VIEWPORT_HEIGHT,
    move: function(xdelta, ydelta) {
        var x = this.x += xdelta;
            y = this.y += ydelta;

        if(x < this.xlbound)
            this.shiftx(-1);
        else if(x >= this.xubound)
            this.shiftx( 1);
        if(y < this.ylbound)
            this.shifty(-1);
        else if(y >= this.yubound)
            this.shifty( 1);            

        this.elt.scrollLeft = x;
        this.elt.scrollTop  = y;        
    },
    shiftx: function(direction) {
        var from = direction > 0 ? this.xcorner : this.xcorner + Engine.LAYER_WIDTH - 1,
            to   = from + Engine.LAYER_WIDTH*direction;
        for(var y = 0; y < Engine.LAYER_HEIGHT; ++y) {
            var tile = this.tiles[posmod(from, Engine.LAYER_WIDTH)][y];
            tile.style.left = to*256;
            tile.src = this.mapTile(to, tile.tileY);
            tile.tileX = to;
        }
        this.xcorner += direction;
        this.xlbound += direction*256;
        this.xubound += direction*256;
    },
    shifty: function(direction) {
        var from = direction > 0 ? this.ycorner : this.ycorner + Engine.LAYER_HEIGHT - 1,
            to   = from + Engine.LAYER_HEIGHT*direction;
        for(var x = 0; x < Engine.LAYER_WIDTH; ++x) {
            var tile = this.tiles[x][posmod(from, Engine.LAYER_HEIGHT)];
            tile.style.top = to*256;
            tile.src = this.mapTile(tile.tileX, to);
            tile.tileY = to;
        }
        this.ycorner += direction;
        this.ylbound += direction*256;
        this.yubound += direction*256;
    },
    mapTile: function(x, y) {
        var map = this.engine.map,
            mapLayer = map.layers[this.idx],
            tilex = posmod(x, mapLayer[0].length),
            tiley = posmod(y, mapLayer.length);
        return map.tiles[ mapLayer[tiley][tilex] ];
    }
};

function Sound(url)
{
    var elt = document.createElement('EMBED');
    var id = elt.id = 'SoundEmbedTag' + Sound.gensymIndex++;
    elt.setAttribute('SRC', url);
    elt.setAttribute('QTSRC', url);
    elt.setAttribute('ENABLEJAVASCRIPT', 'TRUE');
    elt.setAttribute('HIDDEN', 'TRUE');
    elt.setAttribute('AUTOSTART', 'FALSE');
    
    document.body.appendChild(elt);
    this.elt = document.getElementById(id);
    
    return this;
}
Sound.gensymIndex = 0;
Sound.prototype = {
    play: function() {
        this.elt.Rewind();
        this.elt.Play();        
    },
    elt: null
};

function ControlScheme(scheme)
{
    this.scheme = scheme;
    return this;
}
ControlScheme.prototype = {
    keyCommand: function(keycode) {
        var mapping = this.scheme.keymap[keycode];
        return mapping && this.scheme.commands[mapping];
    },
    enter: function(command) {
        if(!command.active) {
            if(command.cancels) {
                for(var i = 0; i < command.cancels.length; ++i)
                    this.leave(this.scheme.commands[command.cancels[i]]);
            }
            command.onenter && command.onenter();
            command.active = true;
        }
    },
    leave: function(command) {
        if(command.active) {
            command.active = false;
            command.onleave && command.onleave();
        }
    },
    install: function() {
        var self = this;
        window.onkeydown = function(e) {
            var command = self.keyCommand(e.which);
            command && self.enter(command);
        };
        window.onkeyup = function(e) {
            var command = self.keyCommand(e.which);
            command && self.leave(command);
        };
    }
};
