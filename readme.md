[![Codacy][cod_b]][cod_l]



`npm -g install 0model`

* Coverage: +
* Browser: +



#### Browser

* Include: `//raw.githack.com/Daeren/0model/master/index.js`

Global var: `zm`



#### Examples

```js
var zm = require("0model");


zm(" D ").string().get().trim();            // <-- "D"
zm(" 13.").to.int().it.is.required();       // <-- true

zm({x: 1, y: 2}).to.have("x", "z");         // <-- false
zm({}).it.is.empty();                       // <-- true
zm("hi").str().between(1, 16);              // <-- true

zm("[1,2]").to.json().get();                // <-- [1, 2]
zm("[1,").to.json().to.string().get();      // <-- ''
zm("[1,").json().string().get();            // <-- ''

zm(5.9).int().str() + 10;                   // <-- '510'
zm(5.9).to.integer() + " num";              // <-- '5 num'
zm(zm('d0' / 1)).empty();                   // <-- true


zm([1, 2, 3]).set(x => x.reduce((a, b) => a + b)).get(console.log);
zm({x: 1, y: 2}).set(JSON.stringify).get(console.log);
zm(3.14159).set(x => x.toFixed(0)).str().get(console.log);


zm("hello 2 world").to.string().then.remove(/\d+/).it.is.required();
zm("hello 2 world").to.string().then.remove(/\d+/).get();
zm("hello 2 world").to.string().then.remove(d => d.substr(2)) + "!";
```



#### Instance 

| Attribute         | Type                          | Note                                                                      |
|-------------------|-------------------------------|---------------------------------------------------------------------------|
|                   | -                             |                                                                           |
| to, then, is, it  | object                        | this                                                                      |
|                   | -                             |                                                                           |
| set               | function(v)                   | return: this                                                              |
| get               | function([callback])          | return: current value                                                     |
|                   | -                             |                                                                           |
| lastError         | -                             |                                                                           |
| value             | -                             | current value                                                             |
| length            | -                             | string(), array()                                                         |
|                   | [T]                           |                                                                           |
| bool, boolean     | function                      | (true, on, yes, 1) = true                                                 |
| str, string       | function                      | (NaN, null, undefined, []) = ""                                           |
| int, integer      | function(radix)               |                                                                           |
| float, number     | function                      |                                                                           |
|                   | -                             |                                                                           |
| date              | function                      |                                                                           |
| symbol            | function                      |                                                                           |
|                   | -                             |                                                                           |
| table, hashTable  | function(notParse)            |                                                                           |
| array             | function(notParse)            |                                                                           |
| json              | function                      |                                                                           |
|                   | [M]                           |                                                                           |
| remove            | function(t)                   | t: string, regEx (string), function(elem)                                 |
| abs               | function                      |                                                                           |
| clamp             | function(min, max)            |                                                                           |
|                   | [V]                           |                                                                           |
| required          | function                      | false: NaN, [], null, undefined, "", Invalid Date, {}                     |
| empty             | function                      | true: NaN, [], null, undefined, "", Invalid Date, {}                      |
| has, have         | function(...)                 | string, array, object                                                     |
| between           | function(min, max)            | number, string, array, object, date, map                                  |



## License

MIT

----------------------------------
[@ Daeren][1]


[1]: http://666.io

[cod_b]: https://img.shields.io/codacy/12d7cf4ff0b8466ca74cd504e689b779.svg
[cod_l]: https://www.codacy.com/app/daeren/0model/dashboard

