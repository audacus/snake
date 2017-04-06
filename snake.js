'use strict';

function Dimension(options) {
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.z = options.z || 0;
}

function Field(options) {
    this.dimensions = new Dimension(options.dimensions);
}

function Snake(options) {
    this.field = new Field(options.field);
    this.interval = options.interval || 500;
    this.bonus = options.bonus || 1;
}
