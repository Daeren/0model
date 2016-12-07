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

let obj = zm(), x, t;

//-----------------------------------------------------

t = 1000 * 1000 * 1;

console.time("parseInt");
while(t--) {
    x = parseInt(5.9) + 10;
}
console.timeEnd("parseInt");

//---------]>

console.log("");

//---------]>

t = 1000 * 1000 * 1;

console.time("new.int().get()");
while(t--) {
    x = zm(5.9).int().get() + 10;
}
console.timeEnd("new.int().get()");

//---------]>

t = 1000 * 1000 * 1;

console.time("new.int() + C");
while(t--) {
    x = zm(5.9).int() + 10;
}
console.timeEnd("new.int() + C");

//---------]>

console.log("");

//---------]>

t = 1000 * 1000 * 1;

console.time("obj.set().int().get()");
while(t--) {
    x = obj.set(5.9).int().get() + 10;
}
console.timeEnd("obj.set().int().get()");

//---------]>

t = 1000 * 1000 * 1;

console.time("obj.set().int() + C");
while(t--) {
    x = obj.set(5.9).int() + 10;
}
console.timeEnd("obj.set().int() + C");
