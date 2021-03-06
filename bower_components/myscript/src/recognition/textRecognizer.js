'use strict';

(function (scope) {
    /**
     * Text recognizer interface
     *
     * @class TextRecognizer
     * @extends AbstractRecognizer
     * @param {String} [host='cloud.myscript.com'] Recognition service host
     * @constructor
     */
    function TextRecognizer(host) {
        scope.AbstractRecognizer.call(this, host);
        this.parameters = new scope.TextParameter();
        this.parameters.setLanguage('en_US');
        this.parameters.setInputMode('CURSIVE');
    }

    /**
     * Inheritance property
     */
    TextRecognizer.prototype = new scope.AbstractRecognizer();

    /**
     * Constructor property
     */
    TextRecognizer.prototype.constructor = TextRecognizer;

    /**
     * Do text recognition
     *
     * @method doSimpleRecognition
     * @param {String} applicationKey
     * @param {String} instanceId
     * @param {TextInputUnit[]} inputUnits
     * @param {String} hmacKey
     * @param {TextParameter} [parameters]
     * @returns {Promise}
     */
    TextRecognizer.prototype.doSimpleRecognition = function (applicationKey, instanceId, inputUnits, hmacKey, parameters) {
        var params = this.getParameters();
        if (parameters) {
            params = parameters;
        }
        var input = new scope.TextRecognitionInput();
        input.setParameters(params);
        input.setInputUnits(inputUnits);
        return scope.AbstractRecognizer.prototype.doRestRecognition.call(this, input, applicationKey, hmacKey, instanceId); // super
    };

    // Export
    scope.TextRecognizer = TextRecognizer;
})(MyScript);
