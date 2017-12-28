window.onload = function() {
    var demoMap = {
        backdrop: '#ccc',
        tiles: [
            'tiles/empty.png',
            'tiles/ground.png',
            'tiles/solidground.png',
            'tiles/sky.png',
            'tiles/skylow.png',
            'tiles/watertop.png',
            'tiles/water.png',
            'tiles/waterback.png',
            'tiles/waterback1.png',
            'tiles/waterback2.png',
            'tiles/waterback3.png',
            'tiles/ground2.png'
        ],
        layers: [
            [[0],   // Water
             [0],
             [5],
             [6]],
            [[0, 0,  0],   // Foreground
             [1, 1, 11],
             [2, 2,  2]],
            [[0, 0, 0],  // BG 1
             [8, 7, 7]],
            [[0, 0, 0, 0],  // BG 2
             [7, 9, 7, 7]],
            [[0, 0,  0, 0],     // BG 3
             [7, 7, 10, 7]],
            [[0],     // BG 4
             [7]],
            [[3],     // Sky Backdrop
             [4]]
        ],
        scrollFactors: [0, 1, 0.75, 0.5, 0.375, 0, 0],
        scroll: function(engine, distance) {
            for(var i = 0; i < this.scrollFactors.length; ++i) {
                if(this.scrollFactors[i] == 0)
                    continue;
                engine.layers[i].move(distance * this.scrollFactors[i], 0);
            }
        },
        groundLevel: function(x) {
            x = posmod(x + 15, 256 * 3);
            return x < 532 ? 446                                         :
                   x < 580 ? 446 + (x - 532) * (455 - 446) / (580 - 532) :
                   x < 624 ? 455                                         :
                   x < 701 ? 455 + (x - 624) * (435 - 455) / (701 - 624) :
                   x < 736 ? 435 + (x - 701) * (446 - 435) / (736 - 701) : 446;
        }
    };

    var FPS = 30;
    var GRAVITY = 0.7;
    var MAX_JUMP_STRENGTH = 7;
    var JUMP_STRENGTH_PER_FRAME = 1;
    var BASE_JUMP_STRENGTH = 3;
    var WALK_SPEED = 4;
    var SCROLL_DISTANCE = 200;
    var LAND_STRENGTH = 5;

    var demoEngine = new Engine(
        document.getElementById('frame'),
        demoMap,
        1000.0/FPS
    );
    demoEngine.layers[6].move(0, 186);
    demoEngine.layers[5].move(0, 100);
    demoEngine.layers[4].move(0,  95);
    demoEngine.layers[3].move(0,  92);
    demoEngine.layers[2].move(0,  77);
    demoEngine.layers[1].move(0, 140);
    demoEngine.layers[0].move(0, 265);

    var shelly = {
        sprite: new Sprite(
            "shelly", 24,
            {
                stationaryRight: {
                    frames:       [ 1, 3],
                    frameLengths: [50, 4],
                    repeatPoint: 0
                },
                stationaryLeft: {
                    frames:       [ 2, 4],
                    frameLengths: [50, 4],
                    repeatPoint: 0
                },
                preJumpingRight: {
                    frames:       [ 5],
                    frameLengths: [10],
                    repeatPoint: 0
                },
                preJumpingLeft: {
                    frames:       [ 6],
                    frameLengths: [10],
                    repeatPoint: 0
                },
                jumpingRight: {
                    frames:       [7, 9],
                    frameLengths: [2, 2],
                    repeatPoint: 0
                },
                jumpingLeft: {
                    frames:       [8, 10],
                    frameLengths: [2,  2],
                    repeatPoint: 0
                },
                fallingRight: {
                    frames:       [11, 13, 15],
                    frameLengths: [ 4,  2,  2],
                    repeatPoint: 1
                },
                fallingLeft: {
                    frames:       [12, 14, 16],
                    frameLengths: [ 4,  2,  2],
                    repeatPoint: 1
                },
                walkingRight: {
                    frames:       [19, 21, 23, 21],
                    frameLengths: [ 4,  4,  4,  4],
                    repeatPoint: 0
                },
                walkingLeft: {
                    frames:       [20, 22, 24, 22],
                    frameLengths: [ 4,  4,  4,  4],
                    repeatPoint: 0
                },
                landingRight: {
                    frames:       [17],
                    frameLengths: [10],
                    repeatPoint: 0
                },
                landingLeft: {
                    frames:       [18],
                    frameLengths: [10],
                    repeatPoint: 0
                }
            },
            demoEngine.layers[1],
            30, 26,
            290, 200
        ),
        face: 1,
        jumpStrength: 0,
        landed: 0,
        dx: 0,
        dy: 0,
        inAir: function() {
            return this.sprite.y < demoMap.groundLevel(this.sprite.x) || this.dy < 0;
        },
        preJumping: false,
        updateSequence: function() {
            var sequenceName = (this.inAir()
                ? (this.dy < 0 ? 'jumping' : 'falling')
                : (this.preJumping ? 'preJumping' :
                   this.landed > 0 ? 'landing'    :
                   this.dx == 0    ? 'stationary' : 'walking')
            ) + (this.face > 0 ? 'Right' : 'Left');
            
            if(sequenceName != this.sprite.sequence.name)
                this.sprite.setSequence(sequenceName);
            else 
                this.sprite.next();
        },
        jump: function() {
            this.preJumping = false;
            this.dy = -this.jumpStrength;
        },
        tick: function() {
            this.updateSequence();
            var inAir = this.inAir();
            var x = this.sprite.x + (this.preJumping || this.landed ? 0 : this.dx),
                y = this.sprite.y + this.dy,
                groundLevel = demoMap.groundLevel(x);
            this.sprite.moveto(x, y > groundLevel ? groundLevel : y);
            if(this.preJumping) {
                this.jumpStrength += JUMP_STRENGTH_PER_FRAME;
                if(this.jumpStrength > MAX_JUMP_STRENGTH)
                    this.jump();
            }
            else if(inAir) {
                this.dy += GRAVITY;
                this.wasInAir = true;
            }
            else {
                this.sprite.moveto(this.sprite.x, demoMap.groundLevel(this.sprite.x));
                this.dy = 0;
                if(this.wasInAir) {
                    this.wasInAir = false;
                    this.landed = LAND_STRENGTH;
                }
            }
            
            if(this.landed > 0) --this.landed;
        },
    };
    
    var demoControls = new ControlScheme({
        keymap: {
            37: 'left',
            39: 'right',
            32: 'jump'
        },
        commands: {
            left: {
                onenter: function() {
                    shelly.face = -1;
                    shelly.dx = -WALK_SPEED;
                },
                onleave: function() {
                    shelly.dx = 0;
                },
                cancels: ['right']
            },
            right: {
                onenter: function() {
                    shelly.face = 1;
                    shelly.dx = WALK_SPEED;
                },
                onleave: function() {
                    shelly.dx = 0;
                },
                cancels: ['left']
            },
            jump: {
                onenter: function() {
                    if(!shelly.inAir()) {
                        shelly.preJumping = true;
                        shelly.landed = 0;
                        shelly.jumpStrength = BASE_JUMP_STRENGTH;
                    }
                },
                onleave: function() {
                    if(shelly.preJumping)
                        shelly.jump();
                }
            }
        }
    });

    shelly.sprite.setSequence('stationaryRight');
    demoEngine.ontick = function(engine, tickCount) {
        demoEngine.layers[0].move(10, Math.sin(tickCount / FPS * 0.3 * Math.PI) * 0.3);
        shelly.tick();
        
        var leftdistance = shelly.sprite.x - demoEngine.layers[1].x;
        if(leftdistance < SCROLL_DISTANCE)
            demoMap.scroll(demoEngine, leftdistance - SCROLL_DISTANCE);
        var rightdistance = demoEngine.layers[1].x + Engine.VIEWPORT_WIDTH - shelly.sprite.x - shelly.sprite.width;
        if(rightdistance < SCROLL_DISTANCE)
            demoMap.scroll(demoEngine, SCROLL_DISTANCE - rightdistance);
    };
    demoControls.install();
    demoEngine.run();
};
