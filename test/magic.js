﻿//-----------------------------------------------------
//
// Author: Daeren Torn
// Site: 666.io
//
//-----------------------------------------------------

"use strict";

//-----------------------------------------------------

var rZM = require("../index");

//-----------------------------------------------------

var SUser = {
    "onCreate": function() {
        console.log("model: onCreate");

        this.data("pts", function(model) {
            return this + 100;
        });
    },

    "onChangeData": function(name, current, original) {
        console.log("model: onChangeData");

        console.log("%s was %s", name, original);
        console.log("%s is now %s", name, current);
    },

    //---------]>

    "static": {
        "saltSeed": "157efe#",

        "genSalt": function() {
            return this.saltSeed + Date.now().toString(32);
        }
    },

    //---------]>

    "attributes": {
        "name":     {"use": "string", "max": 17, "trim": true},
        "status":   {"use": "?string", "max": 60, "scenario": "update"},
        "pts":      {"use": "integer", "max": 50}
    },

    "methods": {
        "getName": function() {
            return "User name: " + this.data("name");
        }
    },

    "filters": {
        "name": [
            function myTestFilterName1() {
                return this + " [myTest";
            },
            function myTestFilterName2() {
                return this + "FilterName]";
            }
        ]
    }
};

rZM.model("user", SUser);

//--------------------]>

var MUser = rZM.model("user");
var objUser = MUser({"name": "DT", "pts": "32"});


console.log(MUser.saltSeed);
console.log(MUser.genSalt());

console.log("name:", objUser.data("name"));
console.log("pts:", objUser.data("pts"));
console.log(objUser.data());

objUser.data("status", "HP: 69");
console.log("status:", objUser.data("status"));
objUser.scenario = "update";
objUser.data("status", "HP: 13");
console.log("status:", objUser.data("status"));

console.log("getName:", objUser.getName());
console.log("validate:", objUser.validate());