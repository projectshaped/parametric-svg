[![Coveralls – test coverage
](https://img.shields.io/coveralls/parametric-svg/ast.svg?style=flat-square)
](https://coveralls.io/r/parametric-svg/ast)
 [![Travis – build status
](https://img.shields.io/travis/parametric-svg/ast/master.svg?style=flat-square)
](https://travis-ci.org/parametric-svg/ast)
 [![David – status of dependencies
](https://img.shields.io/david/parametric-svg/ast.svg?style=flat-square)
](https://david-dm.org/parametric-svg/ast)
 [![Code style: airbnb
](https://img.shields.io/badge/code%20style-airbnb-777777.svg?style=flat-square)
](https://github.com/airbnb/javascript)




parametric.svg AST
==================

**The internal format of parametric.svg**




<div                                                 id="/whats-up">&nbsp;</div>

What’s up?
----------

This repo describes the structure of objects that different parts of parametric.svg use to communicate with each other. [Here](https://github.com/parametric-svg/js/issues/2)’s some reasoning behind the idea.




<div                                                  id="/install">&nbsp;</div>

Install
-------

```sh
npm install parametric-svg-ast
```




<div                                                      id="/use">&nbsp;</div>

Use
---

```js
const ast = require('parametric-svg-ast');

const myAst = ast({
  attributes: [
    {
      address: [2, 5, 4],
      name: 'width',
      dependencies: ['a', 'b'],
      relation: (a, b) => a + b,
    },
    {
      address: [4, 8],
      name: 'height',
      dependencies: [],
      relation: () => 59,
    },
  ],

  defaults: [
    {
      identifier: 'a',
      dependencies: [],
      relation: () => 10,
    },
    {
      identifier: 'b',
      dependencies: [],
      relation: () => 20,
    },
  ]
});
//» { type: 'ParametricSvgAst',
//    version: 1,
//    attributes: [object Set],
//    defaults: [object Set] }
```




<div                                                      id="/api">&nbsp;</div>

API
---

See the API docs [in the source](./module/index.js). If you can help us render them in the readme, that would be [awesome](https://github.com/parametric-svg/ast/issues/1)!




<div                                                  id="/license">&nbsp;</div>

License
-------

[MIT][] © [Tomek Wiszniewski][]

[MIT]: ./License.md
[Tomek Wiszniewski]: https://github.com/tomekwi
