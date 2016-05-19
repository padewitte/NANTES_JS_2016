'use strict';

(function (scope) {
    /**
     * Represent the Analyzer Renderer. It's used to calculate the analyzer ink rendering in HTML5 canvas
     *
     * @class AnalyzerRenderer
     * @extends AbstractRenderer
     * @param {Object} context
     * @constructor
     */
    function AnalyzerRenderer(context) {
        scope.AbstractRenderer.call(this, context);
        this.shapeRenderer = new scope.ShapeRenderer(context);
    }

    /**
     * Inheritance property
     */
    AnalyzerRenderer.prototype = new scope.AbstractRenderer();

    /**
     * Constructor property
     */
    AnalyzerRenderer.prototype.constructor = AnalyzerRenderer;

    /**
     * Get shape renderer
     *
     * @method getShapeRenderer
     * @returns {ShapeRenderer}
     */
    AnalyzerRenderer.prototype.getShapeRenderer = function () {
        return this.shapeRenderer;
    };

    /**
     * Set shape renderer
     *
     * @method setShapeRenderer
     * @param {ShapeRenderer} shapeRenderer
     */
    AnalyzerRenderer.prototype.setShapeRenderer = function (shapeRenderer) {
        this.shapeRenderer = shapeRenderer;
    };

    /**
     * Draw shape recognition result on HTML5 canvas
     *
     * @method drawRecognitionResult
     * @param {AbstractComponent[]} components
     * @param {AnalyzerDocument} recognitionResult
     * @param {Object} [context] DEPRECATED, use renderer constructor instead
     * @param {PenParameters} [parameters] DEPRECATED, use setParameters instead
     */
    AnalyzerRenderer.prototype.drawRecognitionResult = function (components, recognitionResult, context, parameters) {
        if (context) {
            this._setContext(context);
        }
        if (parameters) {
            this.setParameters(parameters);
        }
        if (this.isTypesetting()) {
            this.shapeRenderer.drawShapes(components, recognitionResult.getShapes(), context, parameters);
            _drawTables(components, recognitionResult.getTables(), this.getContext(), this.getParameters());
            _drawTextLines(components, recognitionResult.getTextLines(), this.getContext(), this.getParameters());
            //_drawGroups(components, recognitionResult.getGroups(), this.getContext(), this.getParameters()); // TODO: not implemented
        } else {
            this.drawComponents(components, context, parameters);
        }
    };

    /**
     * Draw components
     *
     * @method drawComponents
     * @param {AbstractComponent[]} components
     * @param {Object} [context] DEPRECATED, use renderer constructor instead
     * @param {PenParameters} [parameters] DEPRECATED, use setParameters instead
     */
    AnalyzerRenderer.prototype.drawComponents = function (components, context, parameters) {
        for (var i in components) {
            var component = components[i];
            if (component instanceof scope.AbstractShapePrimitive) {
                this.shapeRenderer.drawShapePrimitive(component, context, parameters);
            } else if (component instanceof scope.AbstractComponent) {
                scope.AbstractRenderer.prototype.drawComponent.call(this, component, context, parameters); // super
            } else {
                throw new Error('not implemented');
            }
        }
    };

    /**
     * Draw table
     *
     * @deprecated
     * @method drawTables
     * @param {AbstractComponent[]} components
     * @param {AnalyzerTable[]} tables
     * @param {Object} [context] DEPRECATED, use renderer constructor instead
     * @param {PenParameters} [parameters] DEPRECATED, use setParameters instead
     */
    AnalyzerRenderer.prototype.drawTables = function (components, tables, context, parameters) {
        if (context) {
            this._setContext(context);
        }
        if (parameters) {
            this.setParameters(parameters);
        }
        for (var i in tables) {
            if (this.getShowBoundingBoxes()) {
                for (var j in tables[i].getCells()) {
                    _drawCell(tables[i].getCells()[j], this.getContext(), this.getParameters());
                }
            }
        }
        _drawTables(components, tables, this.getContext(), this.getParameters());
    };

    /**
     * Draw the text line
     *
     * @deprecated
     * @method drawTextLines
     * @param {AbstractComponent[]} components
     * @param {AnalyzerTextLine[]} textLines
     * @param {Object} [context] DEPRECATED, use renderer constructor instead
     * @param {PenParameters} [parameters] DEPRECATED, use setParameters instead
     */
    AnalyzerRenderer.prototype.drawTextLines = function (components, textLines, context, parameters) {
        if (context) {
            this._setContext(context);
        }
        if (parameters) {
            this.setParameters(parameters);
        }
        for (var i in textLines) {
            var textLine = textLines[i];
            var data = textLine.getData();
            if (data && this.getShowBoundingBoxes()) {
                this.drawRectangle(data.getBoundingBox(), context, parameters);
            }
        }
        _drawTextLines(components, textLines, this.getContext(), this.getParameters());
    };

    /**
     * Draw text on analyser
     *
     * @deprecated
     * @method drawText
     * @param {Rectangle} boundingBox
     * @param {String} text
     * @param {String} justificationType
     * @param {Number} textHeight
     * @param {Number} baseline
     * @param {Object} [context] DEPRECATED, use renderer constructor instead
     * @param {PenParameters} [parameters] DEPRECATED, use setParameters instead
     */
    AnalyzerRenderer.prototype.drawText = function (boundingBox, text, justificationType, textHeight, baseline, context, parameters) {
        if (context) {
            this._setContext(context);
        }
        if (parameters) {
            this.setParameters(parameters);
        }
        _drawText(boundingBox, text, justificationType, textHeight, baseline, this.getContext(), this.getParameters());
    };

    /**
     * Draw Underline
     *
     * @deprecated
     * @method drawUnderline
     * @param {Rectangle} boundingBox
     * @param {AnalyzerUnderline} underline
     * @param {String} text
     * @param {Number} textHeight
     * @param {Object} [context] DEPRECATED, use renderer constructor instead
     * @param {PenParameters} [parameters] DEPRECATED, use setParameters instead
     */
    AnalyzerRenderer.prototype.drawUnderline = function (boundingBox, underline, text, textHeight, baseline, context, parameters) {
        if (context) {
            this._setContext(context);
        }
        if (parameters) {
            this.setParameters(parameters);
        }
        _drawUnderline(boundingBox, underline, text, textHeight, baseline, this.getContext(), this.getParameters());
    };

    /**
     * Draw Groups
     *
     * @deprecated
     * @method drawGroups
     * @param {AbstractComponent[]} components
     * @param {AnalyzerGroup[]} groups
     * @param {Object} [context] DEPRECATED, use renderer constructor instead
     * @param {PenParameters} [parameters] DEPRECATED, use setParameters instead
     */
    AnalyzerRenderer.prototype.drawGroups = function (components, groups, context, parameters) { // jshint ignore:line
        _drawGroups(components, groups, this.getContext(), this.getParameters());
    };

    /**
     * Draw a cell
     *
     * @deprecated
     * @method drawCell
     * @param {AnalyzerCell} cell
     * @param {Object} [context] DEPRECATED, use renderer constructor instead
     * @param {PenParameters} [parameters] DEPRECATED, use setParameters instead
     */
    AnalyzerRenderer.prototype.drawCell = function (cell, context, parameters) {
        if (cell.getData()) {
            if (context) {
                this._setContext(context);
            }
            if (parameters) {
                this.setParameters(parameters);
            }
            _drawCell(cell, this.getContext(), this.getParameters());
        }
    };

    /**
     * Draw table
     *
     * @private
     * @method _drawTables
     * @param {AbstractComponent[]} components
     * @param {AnalyzerTable[]} tables
     * @param {Object} context
     * @param {PenParameters} parameters
     */
    var _drawTables = function (components, tables, context, parameters) {
        for (var i in tables) {
            for (var k in tables[i].getLines()) {
                var data = tables[i].getLines()[k].getData();
                _drawLine(data.getP1(), data.getP2(), context, parameters);
            }
        }
    };

    /**
     * Draw the text line
     *
     * @private
     * @method _drawTextLines
     * @param {AbstractComponent[]} components
     * @param {AnalyzerTextLine[]} textLines
     * @param {Object} context
     * @param {PenParameters} parameters
     */
    var _drawTextLines = function (components, textLines, context, parameters) {
        for (var i in textLines) {
            var textLine = textLines[i];
            var data = textLine.getData();
            if (data) {
                var text = textLine.getTextDocument().getTextSegment().getSelectedCandidate().getLabel();
                _drawText(data.getBoundingBox(), text, data.getJustificationType(), data.getTextHeight(), data.getBaselinePos(), context, parameters);

                var underlines = textLine.getUnderlineList();
                for (var j in underlines) {
                    _drawUnderline(data.getBoundingBox(), underlines[j], text, data.getTextHeight(), data.getBaselinePos() + data.getTextHeight() / 10, context, parameters);
                }
            }
        }
    };

    /**
     * Draw text on analyser
     *
     * @private
     * @method _drawText
     * @param {Rectangle} boundingBox
     * @param {String} text
     * @param {String} justificationType
     * @param {Number} textHeight
     * @param {Number} baseline
     * @param {Object} context
     * @param {PenParameters} parameters
     */
    var _drawText = function (boundingBox, text, justificationType, textHeight, baseline, context, parameters) {
        context.save();
        try {
            context.fillStyle = parameters.getColor();
            context.strokeStyle = parameters.getColor();
            context.lineWidth = 0.5 * parameters.getWidth();
            context.font = parameters.getDecoration() + ' ' + textHeight + 'px' + ' ' + parameters.getFont();
            context.textAlign = (justificationType === 'CENTER') ? 'center' : 'left';

            context.fillText(text, boundingBox.getX(), baseline);

        } finally {
            context.restore();
        }
    };

    /**
     * Draw Groups
     *
     * @private
     * @method _drawGroups
     * @param {AbstractComponent[]} components
     * @param {AnalyzerGroup[]} groups
     * @param {Object} context
     * @param {PenParameters} parameters
     */
    var _drawGroups = function (components, groups, context, parameters) { // jshint ignore:line
        throw new Error('not implemented');
    };


    /**
     * Draw Underline
     *
     * @private
     * @method _drawUnderline
     * @param {Rectangle} boundingBox
     * @param {AnalyzerUnderline} underline
     * @param {String} text
     * @param {Number} textHeight
     * @param {Object} context
     * @param {PenParameters} parameters
     */
    var _drawUnderline = function (boundingBox, underline, text, textHeight, baseline, context, parameters) {
        var topLeft = boundingBox.getTopLeftPoint();
        var firstCharacter = underline.getData().getFirstCharacter();
        var lastCharacter = underline.getData().getLastCharacter();

        context.font = parameters.getDecoration() + ' ' + textHeight + 'px' + ' ' + parameters.getFont();

        var textMetrics = context.measureText(text.substring(0, firstCharacter));
        var x1 = topLeft.x + textMetrics.width;

        textMetrics = context.measureText(text.substring(firstCharacter, lastCharacter + 1));
        var x2 = x1 + textMetrics.width;
        _drawLine(new scope.Point({x: x1, y: baseline}), new scope.Point({x: x2, y: baseline}), context, parameters);
    };

    /**
     * Draw a cell
     *
     * @private
     * @method _drawCell
     * @param {AnalyzerCell} cell
     * @param {Object} context
     * @param {PenParameters} parameters
     */
    var _drawCell = function (cell, context, parameters) {
        if (cell.getData()) {
            var rectangle = cell.getData().getBoundingBox();
            context.save();
            try {
                context.fillStyle = parameters.getRectColor();
                context.strokeStyle = parameters.getColor();
                context.lineWidth = 0.5 * parameters.getWidth();
                context.fillRect(rectangle.getX(), rectangle.getY(), rectangle.getWidth(), rectangle.getHeight());
            } finally {
                context.restore();
            }
        }
    };

    /**
     * Draw a line on context
     *
     * @private
     * @method _drawLine
     * @param {Point} p1
     * @param {Point} p2
     * @param {Object} context
     * @param {PenParameters} parameters
     */
    var _drawLine = function (p1, p2, context, parameters) {
        context.save();
        try {
            context.fillStyle = parameters.getColor();
            context.strokeStyle = parameters.getColor();
            context.lineWidth = 0.5 * parameters.getWidth();

            context.beginPath();
            context.moveTo(p1.getX(), p1.getY());
            context.lineTo(p2.getX(), p2.getY());
            context.stroke();
        } finally {
            context.restore();
        }
    };

    // Export
    scope.AnalyzerRenderer = AnalyzerRenderer;
})(MyScript);
