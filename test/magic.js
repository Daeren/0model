﻿//-----------------------------------------------------
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
    zm(5.9).to.integer().string().get,
    zm("[1,").to.json().to.string().get,
    zm("{}").json().string().get,
    zm("[1,2]").to.json().get
);
