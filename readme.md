`npm install 0model`

* Examples: +
* Browser: +

#### ~

* Uses: [aigis][2]


#### Module

| Name        | Desc        | Args		  |
|-------------|-------------|-------------|
|             | -           ||
| global      | Set `$model` as Global Var (NodeJS)  				| (v [default: true]) 				|
| type        | Set/Delete custom Type (Sanitize) 					| (name (String/HashTable), [func]) ~ func(input, options) |
| rule        | Set/Delete custom Rule (Validate) 					| (name (String/HashTable), [func]) ~ func(input, options) |
| filter      | Set/Delete custom Filter (Model) 					| (name (String/HashTable), [func]) ~ func(scenario) |
|             | -           ||			
| model    	  | -								   					| (name, [schema]) 		|


#### Schema

| Name          | Desc          | Val		  |
| ------------- |:-------------:|-------------|
|               |         EVENTS                ||
| onCreate      | -  | func() |
| onChangeData  | -  | func(name, current, original) |
|               |         OTHER                 ||
| static      	| -								| String/HashTable |
| attributes    | -								| String/HashTable |
| methods       | -								| String/HashTable |
| filters    	| -								| String/HashTable |


#### Instance of model

| Name        | Desc        | Args			|
|-------------|-------------|-------------|
|             | -           ||
| data        | Always returns only the data  			| (hashTable) or (field, [value/func]) ~ function([model]) |
| validate    | - 										| (errors [default: false]) |
|             | -           ||			
| existMethod | Check existence of the method   		| (name) |
| toJSON      | -  										| ([replacer], [space]) |
| fromJSON    | -  										| (data) |
							
							
#### Browser

* Include: `//raw.githack.com/Daeren/Aigis/master/index.js`
* Include: `//raw.githack.com/Daeren/0model/master/index.js`

Global var: `$model`


#### Examples

```js
require("0model");

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

/*
//_ OUTPUT:

model: onCreate
model: onChangeData
pts was 32
pts is now 50
+----------------------+

saltSeed: 157efe#
+----------------------+

name: DT [myTest|Filter
pts: 50
data: { name: 'DT [myTest|Filter', pts: 50 }
+----------------------+

pswdSalt: undefined
model: onChangeData
pswdSalt was undefined
pswdSalt is now 157efe#19ffgk9di
pswdSalt: 157efe#19ffgk9di
+----------------------+

validate: true
status: undefined
model: onChangeData
status was undefined
status is now HP: 13
status: HP: 13
validate: true
+----------------------+

getName: User name: DT [myTest|Filter
*/
```


## License

MIT

----------------------------------
[@ Daeren Torn][1]


[1]: http://666.io
[2]: https://www.npmjs.com/package/aigis