//-----------------------------------------------------
//
// Author: Daeren
// Site: 666.io
//
//-----------------------------------------------------

"use strict";

//-----------------------------------------------------

const zm = require("../index");

//-----------------------------------------------------

console.log(
    "%s | %s | %s | %s | %s",

    zm("gg").to.integer().string().get(),
    zm(5.9).int().str() + 10,

    zm("[1,").to.json().to.string().get(),
    zm("{}").json().string().get(),
    zm("[1,2]").to.json().get()
);


console.log(
    "%s | %s",

    zm("9.9").to.int().is.required(),
    zm().to.int().is.required()
);


console.log(
    "%s | %s | %s | %s | %s | %s",

    zm(-3.5).int().abs().get(),
    zm(3.5).float().abs().get(),
    zm(3.5).float().clamp(10, 20).get(),

    zm("hello 2 world").to.string().then.remove(/\d+/).it.required(),
    zm("hello 2 world").to.string().then.remove(/\d+/).get(),
    zm("hello 2 world").to.string().then.remove(d => d + d).get()
);


console.log(
    "%s | %s | %s | %s | %s",

    zm({x: 1, y: 2}).to.have("x"),

    zm({x: 1, y: 2}).to.json().it.has("x"),
    zm({x: 1, y: 2}).to.json().it.has("x", "y"),
    zm({x: 1, y: 2}).to.json().it.has("x", "y", "z"),

    zm("hello world").to.string().it.has("hello", "world")
);
