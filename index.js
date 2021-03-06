﻿//-----------------------------------------------------
//
// Author: Daeren
// Site: 666.io
//
//-----------------------------------------------------

var zm = (function createInstance() {
    "use strict";

    //-----------------------------------------------]>

    var gReStrIsEmpty   = /^[\s\t\r\n]*$/;

    var gObjHas         = Object.prototype.hasOwnProperty,
        gObjToStr       = Object.prototype.toString;

    //------------------------]>

    function CType(v) {
        this.to = this.then = this.is = this.it = this;
        this.set(v);
    }


    CType.prototype = {};


    CType.prototype.bool        =
    CType.prototype.boolean     = toBool;

    CType.prototype.str         =
    CType.prototype.string      = toStr;

    CType.prototype.int         =
    CType.prototype.integer     = toInt;

    CType.prototype.float       =
    CType.prototype.number      = toFloat;

    CType.prototype.date        = toDate;
    CType.prototype.symbol      = toSymbol;

    CType.prototype.hashTable   =
    CType.prototype.table       = toHashTable;

    CType.prototype.array       = toArray;
    CType.prototype.json        = toJson;


    CType.prototype.remove      = modRemove;
    CType.prototype.abs         = modAbs;
    CType.prototype.clamp       = modClamp;


    CType.prototype.required    = isRequired;
    CType.prototype.empty       = isEmpty;

    CType.prototype.has         =
    CType.prototype.have        = isHave;


    CType.prototype.between     = isBetween;


    CType.prototype.set = function(v) {
        if(typeof(v) === "function") {
            return this.set(v(this.value));
        }

        this.value = (v instanceof(CType) ? v.get() : v);

        return this;
    };

    CType.prototype.get = function(v) {
        if(typeof(v) === "function") {
            v(this.value);
        }

        return this.value;
    };

    CType.prototype.valueOf = function() { return this.value; };
    CType.prototype.toString = function() { return this.string(); };

    //-----------------------------------------------]>

    return function createCType(v) {
        return new CType(v);
    };

    //-----------------------------------------------]>

    function toBool() {
        var r, input = this.value;

        switch(typeof(input)) {
            case "boolean":
                r = input;
                break;

            case "string":
                r = input === "true" || input === "on" || input === "yes" || input === "1";
                break;

            default:
                r = input ? true : false;
        }

        this.value = r;

        return this;
    }

    function toStr() {
        var r, input = this.value;

        if(input === null) {
            r = "";
        }
        else {
            switch(typeof(input)) {
                case "undefined":
                    r = "";
                    break;

                case "string":
                    r = input;
                    break;

                case "number":
                    r = isNaN(input) ? "" : (input + "");
                    break;

                case "symbol":
                    r = input.toString();
                    break;

                default:
                    r = typeof(input.toString) === "function" ? input.toString() : gObjToStr.call(input);
            }
        }

        this.value = r;
        this.length = r.length;

        return this;
    }

    function toInt(radix) {
        var r       = NaN,
            input   = this.value;

        if(input !== null) {
            switch(typeof(input)) {
                case "undefined":
                    break;

                case "object":
                    if(input instanceof(Date)) {
                        r = typeof(input.valueOf) === "function" ? input.valueOf() : NaN;
                    }

                    break;

                default:
                    r = parseInt(input, radix || 10);
            }
        }

        this.value = r;

        return this;
    }

    function toFloat() {
        var r, input = this.value;

        if(input === null) {
            r = NaN;
        }
        else {
            switch(typeof(input)) {
                case "undefined":
                    r = NaN;
                    break;

                case "number":
                    r = input;
                    break;

                case "object":
                    if(input instanceof(Date)) {
                        r = typeof(input.valueOf) === "function" ? input.valueOf() : NaN;
                    }
                    else {
                        r = NaN;
                    }

                    break;

                default:
                    r = parseFloat(input);
            }
        }

        this.value = r;

        return this;
    }

    function toDate() {
        var r, input = this.value;

        if(input && input instanceof(Date)) {
            r = input;
        }
        else {
            r = new Date(input);
        }

        this.value = r;

        return this;
    }

    function toSymbol() {
        var r, input = this.value;

        if(input && typeof(input) === "symbol") {
            r = input;
        }
        else {
            r = Symbol(this.value);
        }

        this.value = r;

        return this;
    }

    function toHashTable(notParse) {
        var input = this.value;

        if(!notParse && input && typeof(input) === "string") {
            try {
                input = JSON.parse(input);
            } catch(e) {
                this.lastError = e;
            }
        }

        this.value = input && typeof(input) === "object" && !Array.isArray(input) ? input : {};

        return this;
    }

    function toArray(notParse) {
        var input = this.value;

        if(!notParse && input && typeof(input) === "string") {
            try {
                input = JSON.parse(input);
            } catch(e) {
                this.lastError = e;
            }
        }

        this.value = input && Array.isArray(input) ? input : [];
        this.length = this.value.length;

        return this;
    }

    function toJson(reviver) {
        var r       = null,
            input   = this.value,
            type    = typeof(input);

        if(type === "string") {
            try {
                r = input ? JSON.parse(input, reviver) : r; // <-- RFC 4627
            } catch(e) {
                this.lastError = e;
            }
        }
        else if(input && input instanceof(Date)) {
            r = JSON.stringify(input);
        }
        else if(type !== "undefined" && type !== "symbol" && !(type === "number" && isNaN(input))) {
            r = input;
        }

        this.value = r;

        return this;
    }

    //----------------]>

    function modRemove(t) {
        var r, input = this.value;

        switch(typeof(t)) {
            case "string":
                r = input.replace(t, "");
                break;

            case "function":
                r = t(input);
                break;

            case "object":
                if(t instanceof(RegExp)) {
                    r = input.replace(t, "");
                }
                else {
                    r = input;
                }

                break;

            default:
                r = input;
        }

        this.value = r;

        return this;
    }

    function modAbs() {
        var input = this.value;

        if(input < 0) {
            this.value = Math.abs(input);
        }

        return this;
    }

    function modClamp(min, max) {
        this.value = Math.max(min, Math.min(max, this.value));
        return this;
    }

    //----------------]>

    function isRequired() {
        var input = this.value;

        switch(typeof(input)) {
            case "number":
                return !isNaN(input);

            default:
                return this.between(1, Infinity);
        }
    }

    function isEmpty() {
        var input = this.value;

        switch(typeof(input)) {
            case "string":
                return !input.length || !!input.match(gReStrIsEmpty);

            default:
                return !this.required();
        }
    }

    function isHave() {
        var input = this.value;

        if(!input) {
            return false;
        }

        //---------]>

        var argLen  = arguments.length;
        var type    = typeof(input);

        if(type === "string" || Array.isArray(input)) {
            while(argLen--) {
                if(input.indexOf(arguments[argLen]) === -1) {
                    return false;
                }
            }

            return true;
        }

        //---------]>

        if(type === "object") {
            while(argLen--) {
                if(!gObjHas.call(input, arguments[argLen])) {
                    return false;
                }
            }

            return true;
        }

        //---------]>

        return false;
    }

    function isBetween(min, max) {
        var input = this.value;
        var type = typeof(input);

        if(max <= min) {
            throw new Error("isBetween(min, max) | max <= min");
        }

        switch(type) {
            case "number":
                break;

            case "string":
                input = input.length;
                break;

            default:
                if(input) {
                    if(Array.isArray(input)) {
                        input = input.length;
                    }
                    else if(input instanceof(Date)) {
                        input = input.getTime();
                    }
                    else if(input instanceof(Map)) {
                        input = input.size();
                    }
                    else if(type === "object") {
                        input = Object.keys(input).length;
                    }
                }
        }

        return !isNaN(input) && input >= min && input <= max;
    }
})();

//-----------------------------------------------------

if(module && typeof(module) === "object") {
    module.exports = zm;
}