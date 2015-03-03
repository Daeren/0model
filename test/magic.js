//-----------------------------------------------------
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

        this.data("pts", function() {
            return this + 100;
        });
    },

    "onChangeData": function(name, current, original) {
        console.log("model: onChangeData");

        console.log("%s was %s", name, original);
        console.log("%s is now %s", name, current);
    },

    //---------]>

    "attributes": {
        "name":     {"use": "string", "max": 17, "trim": true},
        "status":   {"use": "?string", "max": 60},
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

console.log(objUser.data("name"));
console.log(objUser.data("pts"));
console.log(objUser.data());
console.log(objUser.getName());
console.log(objUser.validate());