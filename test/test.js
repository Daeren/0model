//-----------------------------------------------------
//
// Author: Daeren Torn
// Site: 666.io
//
//-----------------------------------------------------

"use strict";

//-----------------------------------------------------

var rA  = require("assert");
require("../index");

//-----------------------------------------------------

rA.strictEqualNumber = function(actual, expected, message) {
    if(typeof(actual) != "undefined" && isNaN(expected)) {
        if(!isNaN(actual))
            throw (message || "");
    } else if(actual !== expected)
        throw (message || "");
};

rA.strictEqualDate = function(actual, expected, message) {
    if(actual === expected || isNaN(actual) == isNaN(expected))
        return;

    if(typeof(actual) != "object" || typeof(expected) != "object")
        throw (message || "");

    var at = actual.getTime();
    var et = expected.getTime();

    if((at !== et && !isNaN(at) && !isNaN(et)) || isNaN(at) != isNaN(at))
        throw (message || "");
};

//-------------------]>

var count = {
    "v": 0,
    "s": 0
};

function testS(exp, data) {
    count.s++;

    var result = true,
        args = Array.prototype.slice.call(arguments, 1);

    try {
        if(typeof(exp) === "number")
            rA.strictEqualNumber($sanitize.apply(null, args), exp);
        else if(exp instanceof Date)
            rA.strictEqualDate($sanitize.apply(null, args), exp);
        else if(typeof(exp) === "object" || exp !== null)
            rA.deepEqual($sanitize.apply(null, args), exp);
        else
            rA.strictEqual($sanitize.apply(null, args), exp);
    } catch(e) {
        result = false;

        console.log(args);
        console.log(e);
        console.log("\n");
    }

    if(!result)
        console.log("|%s|> T%s ", result ? "+" : "-", count.s);
}

function testV(exp, data) {
    count.v++;

    var result = true,
        args = Array.prototype.slice.call(arguments, 1);

    try {
        rA.deepEqual($validate.apply(null, args), exp);
    } catch(e) {
        result = false;

        console.log(args);
        console.log(e);
        console.log("\n");
    }

    if(!result)
        console.log("|%s|> T%s ", result ? "+" : "-", count.v);
}

//-------------------------]>

var date = new Date(),
    dateNow = Date.now(),
    regex = /\s+/g;

//-------------------------]>

console.log("+-------------------------+");
console.log("|");
console.log("| Sanitize");

{
    testS(false, "boolean", undefined);
    testS(false, "boolean", null);
    testS(false, "boolean",  NaN);
    testS(true, "boolean", true);
    testS(false, "boolean", false);
    testS(true, "boolean", "true");
    testS(false, "boolean", "false");
    testS(false, "boolean", "on1");
    testS(true, "boolean", "on");
    testS(true, "boolean", "yes");
    testS(true, "boolean", "1");

    testS("", "string", undefined);
    testS("", "string", null);
    testS("NaN", "string",  NaN);
    testS("10", "string", 10);
    testS("10", "string", "10");
    testS(date.toString(), "string", date);
    testS(regex.toString(), "string", regex);

    testS(NaN, "integer", undefined);
    testS(NaN, "integer", null);
    testS(NaN, "integer",  NaN);
    testS(10, "integer", 10);
    testS(10, "integer", 10.5);
    testS(10, "integer", "10");
    testS(NaN, "integer", "");

    testS(NaN, "float", undefined);
    testS(NaN, "float", null);
    testS(NaN, "float",  NaN);
    testS(10, "float", 10);
    testS(10.5, "float", 10.5);
    testS(10, "float", "10");
    testS(NaN, "float", "");

    testS(new Date(NaN), "date", undefined);
    testS(new Date(NaN), "date", null);
    testS(new Date(NaN), "date",  NaN);
    testS(new Date(10), "date", 10);
    testS(new Date(NaN), "date", new Date(NaN));
    testS(date, "date", date);
    testS(new Date(dateNow), "date", Date.now());
    testS(new Date("23/25/2014"), "date", "23/25/2014");
    testS(new Date("2014-25-23"), "date", "2014-25-23");
    testS(new Date(""), "date", "");
    testS(new Date("Thu, 01 Jan 1970 00:00:00 GMT-0400"), "date", "Thu, 01 Jan 1970 00:00:00 GMT-0400");

    testS({}, "hashTable", undefined);
    testS({}, "hashTable", null);
    testS({}, "hashTable",  NaN);
    testS({'x': 1}, "hashTable", {'x': 1});
    testS({}, "hashTable", "{'x': 1");
    testS({}, "hashTable", "[1,2]");
    testS({'x': 1}, "hashTable", JSON.stringify({'x': 1}));

    testS([], "array", undefined);
    testS([], "array", null);
    testS([], "array",  NaN);
    testS([1,2], "array", [1,2]);
    testS([], "array", "[1,2");
    testS([1,2], "array", "[1,2]");
    testS([], "array", {x:1});
    testS([], "array", "{'x': 1}");

    testS(null, "json", undefined);
    testS(null, "json", null);
    testS(null, "json",  NaN);
    testS(null, "json", null);
    testS({'x': 1}, "json", {'x': 1});
    testS([1,2], "json", [1,2]);
    testS(null, "json", undefined);
    testS(null, "json", NaN);
    testS(null, "json", "{'x': 1");
    testS(null, "json", "{'x': 1}");
    testS({'x': 1}, "json", JSON.stringify({'x': 1}));
    testS([1,2], "json", "[1,2]");
    testS(null, "json", "[1,2");
}

console.log("+-------------------------+");

//-------------------------]>

console.log("+-------------------------+");
console.log("|");
console.log("| Validate");

{
    [
        "finite",
        "boolean", "string", "integer", "float", "date", "hashTable", "array",
        "required", "notEmpty", "lowercase", "uppercase",
        "alphanumeric", "alpha", "numeric", "hexadecimal", "email", "url", "mongoId",
        "hexColor", "creditcard", "phone", "uuid", "ip", "ascii", "base64"
    ]
        .forEach(function(e) {
            testV(false, e, undefined);
            testV(false, e, null);
            testV(false, e, NaN);
        });

    testV(true, "null", null);
    testV(false, "null", undefined);
    testV(false, "null", 10);
    testV(false, "null", "");
    testV(false, "null", NaN);

    testV(true, "nan", NaN);
    testV(false, "nan", undefined);
    testV(false, "nan", "");
    testV(false, "nan", null);

    testV(true, "finite", 10);
    testV(false, "finite", "");
    testV(false, "finite", "10");
    testV(false, "finite", +1 / 0);
    testV(false, "finite", -1 / 0);

    testV(true, "boolean", true);
    testV(true, "boolean", false);
    testV(false, "boolean", "true");

    testV(false, "string", 10);
    testV(true, "string", "10");
    testV(true, "string", "10", {"max": 2});
    testV(false, "string", "100", {"max": 2});
    testV(true, "string", "10", {"min": 2});
    testV(false, "string", "1", {"min": 2});
    testV(true, "string", "10", {"min": 2, "max": 2});
    testV(false, "string", "1", {"min": 2, "max": 2});
    testV(false, "string", "100", {"min": 2, "max": 2});

    testV(true, "integer", 10);
    testV(false, "integer", 10.5);
    testV(false, "integer", "10");
    testV(false, "integer", "");

    testV(true, "float", 10);
    testV(true, "float", 10.5);
    testV(false, "float", "10");
    testV(false, "float", "");
    testV(true, "float", 10, {"max": 20});
    testV(false, "float", 100, {"max": 20});
    testV(true, "float", 10, {"min": 10});
    testV(false, "float", 1, {"min": 20});
    testV(true, "float", 10, {"min": 10, "max": 20});
    testV(false, "float", 1, {"min": 20, "max": 20});
    testV(false, "float", 100, {"min": 20, "max": 20});

    testV(false, "date", 10);
    testV(false, "date", new Date(NaN));
    testV(true, "date", new Date());
    testV(true, "date", new Date(), {"min": new Date("Thu, 01 Jan 1970 00:00:00 GMT-0400")});
    testV(false, "date", new Date(), {"max": new Date("Thu, 01 Jan 1970 00:00:00 GMT-0400")});
    testV(false, "date", Date.now());
    testV(false, "date", "23/25/2014");
    testV(false, "date", "2014-25-23");
    testV(false, "date", "");
    testV(false, "date", "Thu, 01 Jan 1970 00:00:00 GMT-0400");

    testV(true, "hashTable", {'x': 1});
    testV(false, "hashTable", "{'x': 1");
    testV(false, "hashTable", "{'x': 1}");
    testV(false, "hashTable", "[1,2]");
    testV(false, "hashTable", JSON.stringify({'x': 1}));

    testV(true, "array", [1,2]);
    testV(false, "array", "[1,2");
    testV(false, "array", "[1,2]");
    testV(false, "array", {x:1});
    testV(false, "array", "{'x': 1}");

    testV(true, "json", null);
    testV(true, "json", {'x': 1});
    testV(true, "json", [1,2]);
    testV(false, "json", undefined);
    testV(false, "json", NaN);
    testV(false, "json", "{'x': 1");
    testV(false, "json", "{'x': 1}");
    testV(false, "json", JSON.stringify({'x': 1}));
    testV(false, "json", "[1,2]");
    testV(false, "json", "[1,2");

    testV(false, "required", "");
    testV(false, "required", new Date(NaN));

    testV(false, "notEmpty", "                  ");
    testV(false, "notEmpty", "\n\n");
    testV(true, "notEmpty", "        1          ");
    testV(true, "notEmpty", "\n2\n");
    testV(false, "notEmpty", "\t\t");
    testV(true, "notEmpty", "\t3\t");

    testV(true, "lowercase", "0drootpop");
    testV(false, "lowercase", "0DROOTPOP");

    testV(true, "uppercase", "0DROOTPOP");
    testV(false, "uppercase", "0drootpop");

    testV(false, "wordchar", 10);
    testV(false, "wordchar", "0d@root.pop");
    testV(false, "wordchar", "10@");
    testV(false, "wordchar", "1 0");
    testV(true, "wordchar", "10_");
    testV(true, "wordchar", "10");

    testV(false, "alphanumeric", 10);
    testV(true, "alphanumeric", "0drootpop");
    testV(false, "alphanumeric", "0d@root.pop");

    testV(true, "alpha", "rootpop");
    testV(false, "alpha", "d@root.pop");
    testV(false, "alpha", "0");
    testV(false, "alpha", "0d@root.pop");

    testV(false, "numeric", 10);
    testV(false, "numeric", "0drootpop");
    testV(false, "numeric", "0d@root.pop");
    testV(false, "numeric", "drootpop");
    testV(true, "numeric", "10");

    testV(false, "hexadecimal", "XA");
    testV(true, "hexadecimal", "FA");
    testV(true, "hexadecimal", "fA");
    testV(true, "hexadecimal", "fa0");

    testV(true, "email", "0d@root.pop");
    testV(false, "email", "0d-root.pop");
    testV(false, "email", 10);

    testV(false, "url", "");
    testV(true, "url", "666.io");
    testV(false, "url", "httpsx://666.io");
    testV(false, "url", "http://666");
    testV(false, "url", "ht://666");
    testV(true, "url", "http://666.io");
    testV(true, "url", "ssh://666.io");
    testV(true, "url", "ws://666.io");
    testV(true, "url", "https://666.io");
    testV(true, "url", "ftp://666.io");

    testV(true, "mongoId", "507f191e810c19729de860ea");
    testV(false, "mongoId", "");
    testV(false, "mongoId", "507f191e810c19729de860ex");
    testV(false, "mongoId", "507f191e810c19729de860eax");
    testV(false, "mongoId", "507f191e810c19729de860e");

    testV(true, "hexColor", "#FFF");
    testV(false, "hexColor", "#FFFF");
    testV(true, "hexColor", "#FFFFFF");
    testV(false, "hexColor", "#XFFFFF");
    testV(false, "hexColor", "#XFF");

    testV(false, "creditcard", "");
    testV(true, "creditcard", "4539705911256127");
    testV(true, "creditcard", "5112136511738516");
    testV(true, "creditcard", "6011875460215667");
    testV(true, "creditcard", "374931102531716");
    testV(false, "creditcard", "453970591125612");
    testV(false, "creditcard", "511213651173851");
    testV(false, "creditcard", "601187546021566");
    testV(false, "creditcard", "37493110253171");

    testV(false, "phone", "");
    testV(false, "phone", "95885");
    testV(true, "phone", "+7 888 788 99");
    testV(true, "phone", "8 888 788 99");
    testV(true, "phone", "888 788 99");

    testV(false, "uuid", "");
    testV(true, "uuid", "550e8400-e29b-41d4-a716-446655440000");
    testV(false, "uuid", "550e8400-e29b-41d4-a716-4466554400000");
    testV(false, "uuid", "550e8400-e29b-41d4-a716-446655440000x");


    testV(false, "ip", "");
    testV(false, "ip", "100.005.055.");
    testV(false, "ip", "100.005.055.x");
    testV(false, "ip", "100.005.055.x88");
    testV(true, "ip", "100.005.055.88");
    testV(true, "ip", "3FFF:FFFF:FFFF:FFFF:FFFF:FFFF:FFFF:FFFF");
    testV(true, "ip", "2001:db8::7");
    testV(false, "ip", "2001:xb8::7");

    testV(false, "ascii", "");
    testV(true, "ascii", "testV 99");
    testV(false, "ascii", "тест 99");

    testV(false, "base64", "");
    testV(false, "base64", "994");
    testV(true, "base64", "RFQ=");
}

console.log("+-------------------------+");