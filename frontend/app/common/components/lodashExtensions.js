/**
 * Please note! These are extensions on top of:
 * Lodash:              http://lodash.com/docs
 * Underscore String:   https://github.com/epeli/underscore.string
 */
(function () {

    'use strict';

    angular.module('olaf.components.lodashExtensions', []);

    var ZERO_THROUGH_NINE = _.range(10),
        MUST_BE_A_FUNCTION = ' must be a function',
        _isString = _.isString;

    _.templateSettings = {
        interpolate: /\{\{(.+?)\}\}/g
    };

    _.mixin({
        apply: apply,
        copyValues: copyValues,

        /**
         * Executes every function in the passed array of functions
         * @param {Function[]} queue
         * @returns {Undefined}
         *
         * @example
         * var fns = [console.log.bind(console, 'Hello World!')];
         * _.execute(fns); // => 'Hello World!'
         */
        execute: function (queue) {
            _.each(queue, function (fn) {
                fn();
            });
        },

        /**
         * Creates a function that when called will call every function passed into the creator.
         * @param {Function[]} queue
         * @returns {Function}
         *
         * @example
         * var fns = [console.log.bind(console, 'Hello World!')];
         * var executor = _.executor(fns);
         * executor(); // => 'Hello World!'
         */
        executor: function (queue) {
            return function () {
                _.execute(queue);
            };
        },

        /**
         * Adds one (1) to the passed number
         * @param {Number} value
         * @returns {Number}
         */
        increment: function (value) {
            return value + 1;
        },

        inherit: inherit,

        /**
         * Checks if the passed value is a string, and optionally, of a minimum length.
         * @param {*} value
         * @param {number} [minLength]
         * @override
         * @returns {Boolean}
         */
        isString: function (value, minLength) {
            if (Number.isFinite(minLength) && minLength > 0) {
                return _isString(value) && value.length >= minLength;
            }
            return _isString(value);
        },

        /**
         * Checks if the passed value is null or undefined.
         * @param {*} value
         * @returns {Boolean}
         */
        isNullOrUndefined: function (value) {
            return _.isNull(value) || _.isUndefined(value);
        },

        /**
         * Converts a date string (in yyyy-MM-ddTHH:mm:ss.ff format) into a Date object
         * @param {String} date
         * @returns {Date}
         */
        toDate: function (date) {
            return date ? new Date(Date.parse(date)) : null;
        },

        /**
         * Masks a credit-card number
         * @param {String} cardNumber
         * @returns {String}
         */
        maskCreditCardNumber: function (cardNumber) {
            return cardNumber && cardNumber.length > 12 ? '**** **** **** ' + cardNumber.slice(-4) : cardNumber;
        },

        /**
         * Masks a Neteller account number.
         * @param {String} netellerAccountId
         * @returns {String}
         */
        maskNetellerNumber: function (netellerAccountId) {
            return netellerAccountId ? '**** **** **** ' + netellerAccountId.slice(-4) : netellerAccountId;
        },

        /**
         * Adds a leading zero in front of a value.
         * @param {Number} value
         * @returns {String}
         */
        zeroPad: function (value) {
            return _.contains(ZERO_THROUGH_NINE, value) ? '0' + value : String(value);
        },

        /**
         * Truncates a number to a two decimal format without rounding it
         * @param {Number} value
         * @returns {Number}
         */
        truncateNumber: function (value) {
            return Math.floor(value * 100) / 100;
        },

        /**
         * Checks if every value of the input is falsy
         * @param collection
         * @param [callback=identity] function called per iteration
         * @param [thisArg] the this binding of the callback
         * @returns true if all elements resulted in false in the callback
         */
        none: function (collection, callback, thisArg) {
            return !_.some(collection, callback, thisArg);
        }
    });


    /**
     * Invokes the method named by `methodName` and applies the passed arguments
     * returning the result of the invoked method.
     *
     * @param {Array} array The array to modify.
     * @param {String} methodName The _ method to invoke.
     * @param {Array} args Arguments to invoke the method with.
     * @returns {Array} Returns `array`.
     *
     * @example
     * var array = [1, 2, 3, 1, 2, 3];
     * _.apply(array, 'pull', [2, 3]); // => [1, 1]
     */
    function apply(array, methodName, args) {
        var wrapped = _(array);
        return wrapped[methodName].apply(wrapped, args).value();
    }


    /**
     * Copies values from one source object to a subject object ONLY if the destination already has that property.
     * @param {Object} destination
     * @param {Object} source
     * @returns {*} destination
     */
    function copyValues(destination, source) {
        if (_.isObject(source)) {
            _.forOwn(destination, function (value, key) {
                var sourceValue = source[key];
                if (!_.isUndefined(sourceValue)) {
                    destination[key] = sourceValue;
                }
            });
        }
        return destination;
    }


    /**
     * TODO: Build in support for supers of type objects
     * TODO: Build in support for super’s static methods
     * @param {Function} Constructor
     * @param {Function} Super
     * @param {Object} [properties] - An object with properties to add to the Constructor’s prototype
     * @returns {Function}
     */
    function inherit(Constructor, Super, properties) {
        if (!_.isFunction(Constructor)) {
            throw new TypeError('Constructor' + MUST_BE_A_FUNCTION);
        }
        if (!_.isFunction(Super)) {
            throw new TypeError('Super' + MUST_BE_A_FUNCTION);
        }
        //Inherit from Super
        Constructor.prototype = Object.create(Super.prototype);
        Object.defineProperties(Constructor.prototype, {
            //Rebind the `constructor` property
            'constructor': { value: Constructor },
            //Create the `super` method
            'super': {
                value: function superFn() {
                    return Super.apply(this, arguments);
                }
            }
        });
        //Extend with prototype properties
        _.forOwn(properties, function (value, key) {
            Constructor.prototype[key] = value;
        });
        return Constructor;
    }

}());
