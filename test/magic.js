//-----------------------------------------------------
//
// Author: Daeren
// Site: 666.io
//
//-----------------------------------------------------

"use strict";

//-----------------------------------------------------

var zm = require("../index");

//-----------------------------------------------------

console.log(
    "%s | %s | %s | %s | %s",

    zm("gg").to.integer().string().get,
    zm(5.9).int().str() + 10,

    zm("[1,").to.json().to.string().get,
    zm("{}").json().string().get,
    zm("[1,2]").to.json().get
);

console.log(
    "%s | %s",

    zm("9.9").to.int().is.required(),
    zm().to.int().is.required()
);


console.log(
    "%s | %s | %s",

    zm("hello 2 world").to.string().then.remove(/\d+/).is.required(),
    zm("hello 2 world").to.string().then.remove(/\d+/).get,
    zm("hello 2 world").to.string().then.remove(d => d + d).get
);
