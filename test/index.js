//-----------------------------------------------------
//
// Author: Daeren
// Site: 666.io
//
//-----------------------------------------------------

/*jshint expr: true*/
/*global describe, it*/

"use strict";

//-----------------------------------------------------

const rChai     = require("chai");

const expect    = rChai.expect;

const rZm       = require("./../index");

//-----------------------------------------------------

expect(rZm).to.be.a("function");

//-----------------------------------------------------

describe("Attributes", function() {
    const zm = rZm();

    [
        "to",
        "then",
        "is",
        "it"
    ]
        .forEach(function(attr) {
            it(attr, function() {
                expect(zm[attr]).to.equal(zm);
            });
        });
});

describe("Methods", function() {
    const zm = rZm();

    const methodsEqual = [
        "bool", "boolean",
        "str", "string",
        "int", "integer",
        "float", "number",

        "table", "hashTable",

        "has", "have"
    ];

    [
        "date",
        "symbol",

        "table",
        "array",
        "json",

        "remove",
        "abs",
        "clamp",

        "required",
        "empty",

        "set",
        "get",

        "valueOf",
        "toString"
    ]
        .concat(methodsEqual)
        .forEach(function(method) {
            it(method, function() {
                expect(zm).to.have.property(method).that.is.an("function");
            });
        });

    while(methodsEqual.length) {
        const a = methodsEqual.pop(),
              b = methodsEqual.pop();

        it(a + " == " + b, function() {
            expect(zm[a]).to.equal(zm[b]);
        });
    }
});

describe("~", function() {
    it("set-get", function() {
        const zm = rZm(6);

        expect(zm.value).to.equal(6);
        expect(zm.get()).to.equal(6);

        expect(zm.set(13)).to.equal(zm);

        expect(zm.value).to.equal(13);
        expect(zm.get()).to.equal(13);
    });


    it("valueOf", function() {
        expect(rZm("6").to.int() + 7).to.equal(13);
    });

    it("toString", function() {
        expect(rZm("6").to.int() + "7").to.equal("67");
    });


    it("boolean", function() {
        const zm = rZm();

        test(true, true);
        test(false, false);

        test("true", true);
        test("on", true);
        test("yes", true);
        test("1", true);

        test(1, true);
        test(-1, true);

        test(0, false);
        test(NaN, false);
        test(null, false);
        test(undefined, false);
        test("", false);
        test("0xDEADBEEF", false);

        function test(a, b) {
            expect(zm.set(a).bool().get()).to.equal(b);
        }
    });

    it("string", function() {
        const zm = rZm();
        const dt = new Date();

        test(true, "true");
        test(false, "false");

        test("true", "true");
        test(13, "13");
        test(dt, dt.toString());
        test([], [].toString());
        test([1,2,3], "1,2,3");
        test({}, {} + "");

        test(NaN, "");
        test(null, "");
        test(undefined, "");

        function test(a, b) {
            expect(zm.set(a).str().get()).to.equal(b);
        }
    });

    it("integer", function() {
        const zm = rZm();
        const dt = new Date();

        test(true, NaN);
        test(false, NaN);

        test("true", NaN);
        test("13.6", 13);
        test(dt, dt * 1);
        test([], NaN);
        test({}, NaN);

        test(NaN, NaN);
        test(null, NaN);
        test(undefined, NaN);

        function test(a, b) {
            a = zm.set(a).int().get();

            if(!isNaN(a) && isNaN(b) || !isNaN(b)) {
                expect(a).to.equal(b);
            }
        }
    });

    it("float", function() {
        const zm = rZm();
        const dt = new Date();

        test(true, NaN);
        test(false, NaN);

        test("true", NaN);
        test("13.6", 13.6);
        test(dt, dt * 1);
        test([], NaN);
        test({}, NaN);

        test(NaN, NaN);
        test(null, NaN);
        test(undefined, NaN);

        function test(a, b) {
            a = zm.set(a).float().get();

            if(!isNaN(a) && isNaN(b) || !isNaN(b)) {
                expect(a).to.equal(b);
            }
        }
    });

    it("array", function() {
        test(rZm("[1,2]").array(true), []);
        test(rZm("[1,2]").array(false), [1,2]);

        function test(a, b) {
            expect(a.get()).to.deep.equal(b);
        }
    });

    it("table", function() {
        test(rZm('{"x": 1}').table(true), {});
        test(rZm('{"x": 1}').table(false), {x: 1});

        function test(a, b) {
            expect(a.get()).to.deep.equal(b);
        }
    });

    it("json", function() {
        const zm = rZm();
        const date = new Date();

        test(true, true);
        test(false, false);

        test(date === date.toString(), false);
        test(date, JSON.stringify(date));

        test("true", true);
        test('"true"', "true");
        test(13, 13);
        test([], []);
        test({}, {});
        test([1,2], [1,2]);
        test({x:1, z:2}, {x:1, z:2});

        test("[1,2]", [1,2]);
        test(JSON.stringify({x:1, z:2}), {x:1, z:2});

        test(NaN, null);
        test(null, null);
        test(undefined, null);

        testEmpty({}, true);
        testEmpty({x:1}, false);

        function test(a, b) {
            expect(zm.set(a).json().get()).to.deep.equal(b);
        }

        function testEmpty(a, b) {
            expect(zm.set(a).empty()).to.equal(b);
        }
    });

    it("symbol", function() {
        const symX = Symbol("X");
        const zmSymX = rZm("X").symbol();

        const refSymX = rZm(symX).symbol();
        const zmRefSymX = rZm(zmSymX).symbol();

        test(symX, refSymX.valueOf());
        test(zmSymX.valueOf(), zmRefSymX.valueOf());

        function test(a, b) {
            expect(a).to.equal(b);
        }
    });
});