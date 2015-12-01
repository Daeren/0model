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

        "has", "have",

        "valueOf", "toString"
    ];

    [
        "date",
        "hashTable",
        "array",
        "json",

        "remove",
        "abs",
        "clamp",

        "required",
        "empty",

        "set",
        "get"
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

    it("boolean", function() {
        const zm = rZm();

        test(true, true);
        test(false, false);

        test("true", true);
        test("on", true);
        test("yes", true);
        test("1", true);

        test(1, true);

        test(NaN, false);
        test(null, false);
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

    it("json", function() {
        const zm = rZm();

        test(true, true);
        test(false, false);

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

        function test(a, b) {
            expect(zm.set(a).json().get()).to.deep.equal(b);
        }
    });
});