﻿//-----------------------------------------------------
//
// Author: Daeren
// Site: 666.io
//
//-----------------------------------------------------

var zm = (function createInstance() {
    "use strict";

    //-----------------------------------------------]>

    var gReStrIsEmpty = /^[\s\t\r\n]*$/;

    //------------------------]>

    function CType(v) {
        this.to     = this;
        this.then   = this;
        this.is     = this;
        this.it     = this;

        this.get    = v;
    }

    CType.prototype = {};

    CType.prototype.bool    =
    CType.prototype.boolean = toBool;

    CType.prototype.str     =
    CType.prototype.string  = toStr;

    CType.prototype.int     =
    CType.prototype.integer = toInt;

    CType.prototype.float   =
    CType.prototype.number  = toFloat;

    CType.prototype.date = toDate;

    CType.prototype.hashTable = toHashTable;
    CType.prototype.array = toArray;
    CType.prototype.json = toJson;


    CType.prototype.remove = modRemove;


    CType.prototype.required = isRequired;
    CType.prototype.empty = isEmpty;

    CType.prototype.has     =
    CType.prototype.have    = isHave;


    CType.prototype.valueOf     =
    CType.prototype.toString    = function() { return this.get; };

    //-----------------------------------------------]>

    return function createCType(v) {
        return new CType(v);
    };

    //-----------------------------------------------]>

    function toBool() {
        var r, input = this.get;

        switch(typeof(input)) {
            case "boolean":
                r = input;
                break;

            case "string":
                r = input === "true" || input === "on" || input === "yes" || input === "1";
                break;

            default:
                r = input === 1;
        }

        this.get = r;

        return this;
    }

    function toStr() {
        var r, input = this.get;

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

                default:
                    r = typeof(input.toString) === "function" ? input.toString() : Object.prototype.toString.call(input);
            }
        }

        this.get = r;

        return this;
    }

    function toInt(radix) {
        var r, input = this.get;

        if(input === null) {
            r = NaN
        }
        else {
            switch(typeof(input)) {
                case "undefined":
                    r = NaN;
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
                    r = parseInt(input, radix || 10);
            }
        }

        this.get = r;

        return this;
    }

    function toFloat() {
        var r, input = this.get;

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

        this.get = r;

        return this;
    }

    function toDate() {
        var r, input = this.get;

        if(input && input instanceof(Date)) {
            r = input;
        }
        else {
            r = new Date(input);
        }

        this.get = r;

        return this;
    }

    function toHashTable() {
        var input = this.get;

        if(input && typeof(input) === "string") {
            try {
                input = JSON.parse(input);
            } catch(e) { }
        }

        this.get = input && typeof(input) === "object" && !Array.isArray(input) ? input : {};

        return this;
    }

    function toArray() {
        var input = this.get;

        if(input && typeof(input) === "string") {
            try {
                input = JSON.parse(input);
            } catch(e) { }
        }

        this.get = Array.isArray(input) ? input : [];

        return this;
    }

    function toJson() {
        var r, input = this.get;

        switch(typeof(input)) {
            case "object":
                r = input;
                break;

            case "string":
                if(!input) {
                    r = null;
                }
                else {
                    try {
                        r = JSON.parse(input);
                    } catch(e) { }
                }

                break;

            default:
                r = null;
                break;
        }

        this.get = r;

        return this;
    }

    //----------------]>

    function modRemove(t) {
        var r, input = this.get;

        switch(typeof(t)) {
            case "string":
                r = input.replace(t, "");
                break;

            case "function":
                r = t(input);
                break;

            case "object":
                if(t instanceof RegExp) {
                    r = input.replace(t, "");
                }
                else {
                    r = input;
                }

                break;

            default:
                r = input;
        }

        this.get = r;

        return this;
    }

    //----------------]>

    function isRequired() {
        var input = this.get;

        switch(typeof(input)) {
            case "number":
                return !isNaN(input);

            case "string":
                return input.length > 0;

            default:
                if(input) {
                    if(Array.isArray(input)) {
                        return input.length > 0;
                    }
                    else if(input instanceof(Date)) {
                        return !!input.getTime();
                    }
                }
        }

        return false;
    }

    function isEmpty() {
        return !!this.get.match(gReStrIsEmpty);
    }

    function isHave() {
        var input = this.get;

        if(!input) {
            return false;
        }

        //---------]>

        var argLen = arguments.length;

        if(typeof(input) === "string" || Array.isArray(input)) {
            while(argLen--) {
                if(input.indexOf(arguments[argLen]) === -1) {
                    return false;
                }
            }

            return true;
        }

        //---------]>

        var has = Object.prototype.hasOwnProperty;

        while(argLen--) {
            if(!has.call(input, arguments[argLen])) {
                return false;
            }
        }

        //---------]>

        return true;
    }
})();

//-----------------------------------------------------

if(module && typeof(module) === "object") {
    module.exports = zm;
}