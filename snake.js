(function() {
    'use strict';
})();

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
    PAUSE: [27, 19],
    CONTINUE: [13, 32]
});

var ActionDirection = Object.freeze({
    LEFT: [37, 65],
    RIGHT: [39, 68],
    UP: [38, 87],
    DOWN: [40, 83],
});

var Status = Object.freeze({
    START: 'start',
    PLAYING: 'playing',
    PAUSE: 'pause',
    DEAD: 'dead'
});

function Dot(x = -1, y = -1, z = -1) {
    this.x = x;
    this.y = y;
    this.z = z;
}

function Snake(options) {
    this.direction = options.startDirection;
    this.desiredDirection = this.direction;
    this.body = [];
    this.startLength = options.startLength;
}

function Engine(options = {}) {

    var snake = options.snake || {};
    var field = options.field || {};
    var interval;

    var getActionFromKey = function(code) {
        var action = null;
        for (var act in Action) {
            if (Action[act].indexOf(code) > -1) {
                action = Action[act];
                break;
            }
        }
        return action;
    };

    var getDirectionFromKey = function(code) {
        var direction = null;
        for (act in ActionDirection) {
            if (ActionDirection[act].indexOf(code) > -1) {
                direction = Direction[act];
            }
        }
        return direction;
    };

    // prevents going in oposite direction
    var checkOpositeDirection = function(directionNew, directionOld) {
        var direction = directionOld;
        if (directionOld == Direction.LEFT && directionNew != Direction.RIGHT
            || directionOld == Direction.RIGHT && directionNew != Direction.LEFT
            || directionOld == Direction.UP && directionNew != Direction.DOWN
            || directionOld == Direction.DOWN && directionNew != Direction.UP) {
            direction = directionNew;
        }
        return direction;
    };

    var doStep = function() {
        snake.direction = snake.desiredDirection;
        var body = snake.body;
        for (var i = body.length - 1; i >= 0; i--) {
            var oldX = body[i].x;
            var oldY = body[i].y;
            if (i > 0) {
                body[i].x = body[i - 1].x;
                body[i].y = body[i - 1].y;
            } else {
                switch (snake.direction) {
                    case Direction.LEFT:
                        body[i].x = oldX - 1;
                        break;
                    case Direction.RIGHT:
                        body[i].x = oldX + 1;
                        break;
                    case Direction.UP:
                        body[i].y = oldY - 1;
                        break;
                    case Direction.DOWN:
                        body[i].y = oldY + 1;
                        break;
                }
            }
            var newX = body[i].x;
            var newY = body[i].y;
            // render
            var divSnake = document.getElementById('snake-' + i);
            divSnake.style.left = newX * scaling + "px";
            divSnake.style.top = newY * scaling + "px";
            divSnake.setAttribute('x', newX);
            divSnake.setAttribute('y', newY);
        }
    };

    var startEngine = function() {
        doStep();
        interval = setInterval(doStep, options.interval);
    };

    var stopEngine = function() {
        clearInterval(interval);
    };

    var start = function() {
        console.log('start()');
        startEngine();
        game.status = Status.PLAYING;
    };

    var pause = function() {
        console.log('pause()');
        stopEngine();
        game.status = Status.PAUSE;
    };

    window.onkeydown = function (e) {
        var code = e.keyCode ? e.keyCode : e.which;
        var action = getActionFromKey(code);
        var direction = null;
        if (action == Action.DIRECTION) {
            direction = getDirectionFromKey(code);
            if (direction !== null) {
                snake.desiredDirection = checkOpositeDirection(direction, snake.direction);
            }
        }
        switch (game.status) {
            case Status.START:
                if (direction !== null || action == Action.CONTINUE) {
                    start();
                }
                break;
            case Status.PLAYING:
                if (action == Action.PAUSE) {
                    pause();
                }
                break;
            case Status.PAUSE:
                if (action == Action.DIRECTION) {
                    start();
                }
                break;
            case Status.DEAD:
                if (action == Action.CONTINUE || action == Action.PAUSE) {
                    // new game
                }
                break;
        }
    };
}

function Dimension(options = {}) {
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.z = options.z || 0;
}

function Field(options = {}) {
    this.dimensions = new Dimension(options.dimensions || {});
    this.scaling = options.scaling || 10;
}

function Game(options = {}) {
    this.status = Status.START;
    this.field = new Field(options.field || {
        dimensions: {
            x: 15,
            y: 15
    }});
    this.interval = options.interval || 750;
    this.bonus = options.bonus || 1;
    this.snake = new Snake({
        startLength: options.startLength || 3,
        startDirection: options.startDirection || Direction.RIGHT
    });

    this.engine = new Engine({
        interval: this.interval,
        snake: this.snake,
        field: this.field
    });

    var error = function(message = 'error') {
        console.error(message);
        message(message);
    }

    var message = function(message = 'message') {
        document.getElementById('message').innerHTML = message;
    }

    var initSnake = function(field, snake) {
        startLength = snake.startLength;
        dimensions = field.dimensions;
        dotsTotal = dimensions.x * dimensions.y;
        if (startLength > dotsTotal) {
            throw new Error('field < snake');
        }
        // center
        var centerX = Math.floor(dimensions.x / 2);
        var centerY = Math.floor(dimensions.y / 2);
        var x = centerX;
        var y = centerY;
        for (var i = 0; i < startLength; i++) {
            switch (snake.direction) {
                case Direction.LEFT:
                    x = centerX + i;
                    break;
                case Direction.RIGHT:
                    x = centerX - i;
                    break;
                case Direction.UP:
                    y = centerY + i;
                    break;
                case Direction.DOWN:
                    y = centerY - i;
                    break;
            }
            snake.body.push(new Dot(x, y));
        }
    };

    var init = function(field, snake) {
        dimensions = field.dimensions;
        scaling = field.scaling;
        // div#game
        var divGame = document.getElementById('game');
        // div#controls
        var divControls = document.createElement('div');
        divControls.id = 'controls';
        divGame.appendChild(divControls);
        // div#field
        var divField = document.createElement('div');
        divField.id ='field';
        var fieldWidth = scaling * dimensions.x + "px";
        var fieldHeight = scaling * dimensions.y + "px";
        divField.style.width = fieldWidth;
        divField.style.height = fieldHeight;
        divGame.appendChild(divField);
        //div#message
        var divMsg = document.createElement('div');
        divMsg.id ='message';
        divMsg.style.width = fieldWidth;
        divMsg.style.height = fieldHeight;
        divField.appendChild(divMsg);
        // div.snake
        try {
            initSnake(field, snake);
        } catch (error) {
            message(error.message);
        }
        var body = snake.body;
        for (var i = body.length - 1; i >= 0; i--) {
            var dot = body[i];
            var x = dot.x;
            var y = dot.y;
            var divSnake = document.createElement('div');
            divSnake.id = 'snake-'+i;
            divSnake.className = (i == 0 ? 'snake head' : 'snake');
            // scaling - 1 because of 1px border
            divSnake.style.width = scaling - 1 + "px";
            divSnake.style.height = scaling - 1 + "px";
            divSnake.style.left = x * scaling + "px";
            divSnake.style.top = y * scaling + "px";
            divSnake.setAttribute('x', x);
            divSnake.setAttribute('y', y);
            divField.appendChild(divSnake);
        }
    };

    // init game
    init(this.field, this.snake);
}

// testing
var game = new Game();
