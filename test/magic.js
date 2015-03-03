//-----------------------------------------------------
//
// Author: Daeren Torn
// Site: 666.io
//
//-----------------------------------------------------

"use strict";

//-----------------------------------------------------

require("../index");

//-----------------------------------------------------

var SUser = {
    "onCreate": function() {
        console.log("model: onCreate");

        this.data("pts", function(obj) {
            return this * obj.data("pts");
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
        "status":   {"use": "string", "min": 1, "max": 60, "on": "update"},
        "pts":      {"use": "integer", "max": 50},

        "pswdSalt": {"use": "string", "unsafe": true}
    },

    "methods": {
        "getName": function() {
            return "User name: " + this.data("name");
        }
    },

    "filters": {
        "name": [
            "myTestFilterName0",

            function myTestFilterName1(scenario) {
                return this + "|";
            },

            function myTestFilterName2(scenario) {
                return this + "FilterName]";
            }
        ]
    }
};

$model("user", SUser);

$model.filter("myTestFilterName0", function(scenario) {
    return this + " [myTest";
});

//--------------------]>

var MUser = $model("user");
var objUser = MUser({"name": "DT", "pts": "32", "pswdSalt": "+++"});


console.log("+----------------------+\n");

console.log("saltSeed:", MUser.saltSeed);
console.log("+----------------------+\n");

console.log("name:", objUser.data("name"));
console.log("pts:", objUser.data("pts"));
console.log("data:", objUser.data());
console.log("+----------------------+\n");

console.log("pswdSalt:", objUser.data("pswdSalt"));
objUser.data("pswdSalt", MUser.genSalt());
console.log("pswdSalt:", objUser.data("pswdSalt"));
console.log("+----------------------+\n");

console.log("validate:", objUser.validate());
objUser.data("status", "HP: 69");
console.log("status:", objUser.data("status"));

objUser.scenario = "update";
objUser.data("status", "HP: 13");
console.log("status:", objUser.data("status"));
console.log("validate:", objUser.validate());
console.log("+----------------------+\n");

console.log("getName:", objUser.getName());