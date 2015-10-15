[![Stability: experimental
](https://img.shields.io/badge/stability-experimental-yellow.svg?style=flat-square)
](https://nodejs.org/api/documentation.html#documentation_stability_index)
 [![Code style: airbnb
](https://img.shields.io/badge/code%20style-airbnb-777777.svg?style=flat-square)
](https://github.com/airbnb/javascript)




parametric-svg-expression-to-mathjs
===================================

**Convert a parametric.svg expression to a mathjs expression**




<div                                                  id="/install">&nbsp;</div>

Install
-------

```sh
$ npm install parametric-svg-expression-to-mathjs
```




<div                                                      id="/use">&nbsp;</div>

Use
---

```js
const convert = require('parametric-svg-expression-to-mathjs');

convert('`1 + 2 = ${1 + 2}`');
//» 'concat("1 + 2 = ", string(1 + 2))'
```




<div                                                  id="/license">&nbsp;</div>

License
-------

[MIT][] © [Tomek Wiszniewski][]

[MIT]: ./License.md
[Tomek Wiszniewski]: https://github.com/tomekwi
