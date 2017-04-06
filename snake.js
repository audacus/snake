'use strict';

var Direction = Object.freeze({
    LEFT: 'left',
    RIGHT: 'right',
    UP: 'up',
    DOWN: 'down'
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
    window.onkeydown = function (e) {
        var code = e.keyCode ? e.keyCode : e.which;
        
        console.log(game.status);
        switch (game.status) {
            case Status.START:
                break;
            case Status.PLAYING:
                break;
            case Status.PAUSE:
                break;
            case Status.DEAD:
                break;
        }
        
        console.log(code)
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
    };
    
    this.renderFrame = function() {
        // console.log('render');
    };
    
    this.interval = setInterval(this.renderFrame, options.interval);
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
    this.engine = new Engine({
        interval: this.interval
    });
    this.snake = new Snake({
        startLength: options.startLength || 3,
        startDirection: options.startDirection || Direction.RIGHT
    });
}

var game = new Game({});
