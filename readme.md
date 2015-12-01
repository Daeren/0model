[![Codacy][cod_b]][cod_l]

`npm -g install 0model`

* Browser: +


#### Instance 

| Attribute         | Type                          | Note                                                                      |
|-------------------|-------------------------------|---------------------------------------------------------------------------|
|                   | -                             |                                                                           |
| to                | object                        | this                                                                      |
| then              | object                        | this                                                                      |
| is                | object                        | this                                                                      |
| it                | object                        | this                                                                      |
|                   | -                             |                                                                           |
| get               | -                             | current value                                                             |
|                   | [T]                           |                                                                           |
| bool, boolean     | function                      | (true, on, yes, 1) = true                                                 |
| str, string       | function                      | (NaN, null, undefined, []) = ""                                           |
| int, integer      | function(radix)               |                                                                           |
| float, number     | function                      |                                                                           |
|                   | -                             |                                                                           |
| date              | function                      |                                                                           |
|                   | -                             |                                                                           |
| hashTable         | function                      |                                                                           |
| array             | function                      |                                                                           |
| json              | function                      |                                                                           |
|                   | [M]                           |                                                                           |
| remove            | function(t)                   | t: regEx (string), function (custom)                                      |
|                   | [V]                           |                                                                           |
| required          | function                      | not: NaN, [], null, undefined, "", Invalid Date                           |
| empty             | function                      | if string not empty                                                       |
| has, have         | function(...)                 | for: string, array, hashTable                                             |



#### Browser

* Include: `//raw.githack.com/Daeren/0model/master/index.js`

Global var: `zm`



#### Examples

```js
var zm = require("0model");


zm(data).string().get.trim();
zm(data).to.int().it.is.required();

zm({x: 1, y: 2}).to.have("x", "z");


zm("[1,2]").to.json().get;
zm("[1,").to.json().to.string().get;
zm("[1,").json().string().get;

zm(5.9).int().str() + 10;
zm(5.9).to.integer() + " num";


zm("hello 2 world").to.string().then.remove(/\d+/).it.is.required();
zm("hello 2 world").to.string().then.remove(/\d+/).get;
zm("hello 2 world").to.string().then.remove(d => d.substr(2)) + "!";
```


## License

MIT

----------------------------------
[@ Daeren][1]


[1]: http://666.io

[cod_b]: https://img.shields.io/codacy/88b55f71c45a47838d24ed1e5fd2476c.svg
[cod_l]: https://www.codacy.com/app/daeren/0model/dashboard