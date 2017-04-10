'use strict';

var Direction = Object.freeze({
    LEFT: 'left',
    RIGHT: 'right',
    UP: 'up',
    DOWN: 'down'
});

// 39 right
// 37 left
// 38 up
// 40 down
// 87 w
// 65 a
// 83 s
// 68 d
// 27 esc
// 13 enter
// 19 pause
// 32 space
var Action = Object.freeze({
    DIRECTION: [37, 65, 39, 68, 38, 87, 40, 83],
    LEFT: [37, 65],
    RIGHT: [39, 68],
    UP: [38, 87],
    DOWN: [40, 83],
    PAUSE: [27, 19],
    CONTINUE: [13, 32]
});

var Status = Object.freeze({
    START: 'start',
    PLAYING: 'playing',
    PAUSE: 'pause',
    DEAD: 'dead'
});

function Dot(x, y) {
    this.x = x || -1;
    this.y = y || -1;
}

function Snake(options) {
    this.direction = options.startDirection;
    this.body = [];
    this.startLength = options.startLength;
    
    this.init = function(field) {
        dimensions = field.dimensions;
        dotsTotal = dimensions.x * dimensions.y;
        if (startLength > dotsTotal) {
            throw new Error('field is too small for starting length!');
        }
        middleX = Math.floor(field.dimensions.x / 2);
        middleY = Math.floor(field.dimensions.y / 2);
    }
}

function Engine(options) {
    
    var snake = options.snake || {};
    var interval;
    
    var getActionFromKey = function(code) {
        var action = null;
        for (var act in Action) {
            if (!!Action[act].indexOf(code)) {
                action = 
            }
        }
        return action;
    }
    
    var getDirectionFromKey = function(code) {
        var direction = null;
        if (!!Action.LEFT.indexOf(code)) {
            direction = Direction.LEFT;
        } else if (!!Action.RIGHT.indexOf(code)) {
            direction = Direction.RIGHT;
        } else if (!!Action.UP.indexOf(code)) {
            direction = Direction.UP;
        } else if (!!Action.DOWN.indexOf(code)) {
            direction = Direction.DOWN;
        }
        return direction;
    }
    
    var renderFrame = function() {
        console.log('render');
        console.log(snake);
    };
    
    var startRendering = function() {
        interval = setInterval(renderFrame, options.interval);
    };
    
    var stopRendering = function() {
        clearInterval(interval);
    };
    
    var start = function() {
        console.log('start()');
        startRendering();
        game.status = Status.PLAYING;
    };
    
    var pause = function() {
        console.log('pause()');
        stopRendering();
        game.status = Status.PAUSE;
    };
    
    window.onkeydown = function (e) {
        var code = e.keyCode ? e.keyCode : e.which;
        var action = getActionFromKey(code);
        console.log(action);
        if (action == Action.DIRECTION) {
            direction = getDirectionFromKey(code);
            if (direction !== null) {
                snake.direction = direction;
            }
        }
        console.log(snake.direction);
        switch (game.status) {
            case Status.START:
                if (direction !== null || !!Action.CONTINUE.indexOf(code)) {
                    start();
                }
                break;
            case Status.PLAYING:
                if (!!Action.PAUSE.indexOf(code)) {
                    pause();
                }
                break;
            case Status.PAUSE:
                break;
            case Status.DEAD:
                break;
        }
        
        console.log(code)
    };
}

function Dimension(options) {
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.z = options.z || 0;
}

function Field(options) {
    this.dimensions = new Dimension(options.dimensions || {});
}

function Game(options) {
    this.status = Status.START;
    this.field = new Field(options.field || {});
    this.interval = options.interval || 500;
    this.bonus = options.bonus || 1;
    this.snake = new Snake({
        startLength: options.startLength || 3,
        startDirection: options.startDirection || Direction.RIGHT
    });
    
    this.engine = new Engine({
        interval: this.interval,
        snake: this.snake
    });
}

var game = new Game({
    interval: 3000
});
