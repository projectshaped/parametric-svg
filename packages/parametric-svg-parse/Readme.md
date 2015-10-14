[![Coveralls – test coverage
](https://img.shields.io/coveralls/parametric-svg/parse.svg?style=flat-square)
](https://coveralls.io/r/parametric-svg/parse)
 [![Travis – build status
](https://img.shields.io/travis/parametric-svg/parse/master.svg?style=flat-square)
](https://travis-ci.org/parametric-svg/parse)
 [![David – status of dependencies
](https://img.shields.io/david/parametric-svg/parse.svg?style=flat-square)
](https://david-dm.org/parametric-svg/parse)
 [![Stability: experimental
](https://img.shields.io/badge/stability-experimental-yellow.svg?style=flat-square)
](https://nodejs.org/api/documentation.html#documentation_stability_index)
 [![Code style: airbnb
](https://img.shields.io/badge/code%20style-airbnb-777777.svg?style=flat-square)
](https://github.com/airbnb/javascript)




parametric-svg-parse
====================

**A JS-based parser for parametric.svg graphics**

Works in node and in browsers.




<div                                                  id="/install">&nbsp;</div>

Install
-------

```sh
$ npm install parametric-svg-parse
```




<div                                                      id="/use">&nbsp;</div>

Use
---

```js
const parse = require('parametric-svg-parse');

// In the browser:
  const domify = require('domify');
  const svg = domify('<svg><rect parametric:width="a + 5" /></svg>');

// …or in node:
  const svg = document.querySelect('#my-svg');

const ast = parse(svg);
ast;
//» { type: 'ParametricSvgAst',
//    version: 1,
//    parameters: [object Set],
//    defaults: [object Set] }
```

You can now pass the `ast` to **[parametric-svg-patch](https://www.npmjs.com/package/parametric-svg-patch)**.




<div                                                  id="/license">&nbsp;</div>

License
-------

[MIT][] © [Tomek Wiszniewski][]

[MIT]: ./License.md
[Tomek Wiszniewski]: https://github.com/tomekwi
