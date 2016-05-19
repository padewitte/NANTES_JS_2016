'use strict';

(function (scope) {
    /**
     * Represent a simple stroke input component
     *
     * @deprecated Use StrokeComponent instead
     * @class Stroke
     * @extends AbstractComponent
     * @constructor
     */
    function Stroke(obj) {
        scope.AbstractComponent.call(this);
        this.type = 'stroke';
        this.x = [];
        this.y = [];
        this.t = [];
        if (obj) {
            if (obj.x) {
                this.x = obj.x;
            }
            if (obj.y) {
                this.y = obj.y;
            }
            if (obj.t) {
                this.t = obj.t;
            }
        }
    }

    /**
     * Inheritance property
     */
    Stroke.prototype = new scope.AbstractComponent();

    /**
     * Constructor property
     */
    Stroke.prototype.constructor = Stroke;

    /**
     * Get the list of x coordinates
     *
     * @method getX
     * @returns {Number[]}
     */
    Stroke.prototype.getX = function () {
        return this.x;
    };

    /**
     * Set the list of x coordinates
     *
     * @method setX
     * @param {Number[]} x
     */
    Stroke.prototype.setX = function (x) {
        this.x = x;
    };

    /**
     * Add a x to the list of x coordinates
     *
     * @method addX
     * @param {Number} x
     */
    Stroke.prototype.addX = function (x) {
        if ((x !== null) && (x !== undefined)) {
            this.x.push(x);
        }
    };

    /**
     * Get the list of y coordinates
     *
     * @method getY
     * @returns {Number[]}
     */
    Stroke.prototype.getY = function () {
        return this.y;
    };

    /**
     * Set the list of y coordinates
     *
     * @method setY
     * @param {Number[]} y
     */
    Stroke.prototype.setY = function (y) {
        this.y = y;
    };

    /**
     * Add a y to the list of y coordinates
     *
     * @method addY
     * @param {Number} y
     */
    Stroke.prototype.addY = function (y) {
        if ((y !== null) && (y !== undefined)) {
            this.y.push(y);
        }
    };

    /**
     * Get the list of timestamps
     *
     * @method getT
     * @returns {Number[]}
     */
    Stroke.prototype.getT = function () {
        return this.t;
    };

    /**
     * Set the list of timestamps
     *
     * @method setT
     * @param {Number[]} t
     */
    Stroke.prototype.setT = function (t) {
        this.t = t;
    };

    /**
     * Add a timestamp to the list
     *
     * @method addT
     * @param {Number} t
     */
    Stroke.prototype.addT = function (t) {
        if ((t !== null) && (t !== undefined)) {
            this.t.push(t);
        }
    };

    Stroke.prototype.getLength = function () {
        return this.x.length;
    };

    /**
     * Get the boundingBox
     *
     * @method getBoundingBox
     * @returns {Rectangle}
     */
    Stroke.prototype.getBoundingBox = function () {
        var boundingBox = new scope.Rectangle();
        boundingBox.setX(Math.min.apply(Math, this.getX()));
        boundingBox.setY(Math.min.apply(Math, this.getY()));
        boundingBox.setWidth(Math.max.apply(Math, this.getX()) - boundingBox.getX());
        boundingBox.setHeight(Math.max.apply(Math, this.getY()) - boundingBox.getY());
        return boundingBox;
    };

    Stroke.prototype.toFixed = function (precision) {
        if (precision !== undefined) {
            for (var i in this.x) {
                this.x[i] = this.x[i].toFixed(precision);
                this.y[i] = this.y[i].toFixed(precision);
            }
        }
    };

    // Export
    scope.Stroke = Stroke;
})(MyScript);
