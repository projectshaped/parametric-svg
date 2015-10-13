[![Coveralls – test coverage
](https://img.shields.io/coveralls/parametric-svg/patch.svg?style=flat-square)
](https://coveralls.io/r/parametric-svg/patch)
 [![Travis – build status
](https://img.shields.io/travis/parametric-svg/patch/master.svg?style=flat-square)
](https://travis-ci.org/parametric-svg/patch)
 [![David – status of dependencies
](https://img.shields.io/david/parametric-svg/patch.svg?style=flat-square)
](https://david-dm.org/parametric-svg/patch)
 [![Stability: experimental
](https://img.shields.io/badge/stability-experimental-yellow.svg?style=flat-square)
](https://nodejs.org/api/documentation.html#documentation_stability_index)
 [![Code style: airbnb
](https://img.shields.io/badge/code%20style-airbnb-777777.svg?style=flat-square)
](https://github.com/airbnb/javascript)




parametric-svg-patch
====================

**Update a parametric SVG element with new data. A low-level library.**


<a                                                 id="/example"></a>&nbsp;

```xml
<rect
  id="cool-rectangle"
  parametric:x="2 * a"
  parametric:y="b + 5"
/>
```

<p align="center"><b>➕</b></p>

```js
const parse = require('parametric-svg-parse');
const patch = require('parametric-svg-patch');
const rectangle = document.querySelector('#cool-rectangle');
const ast = parse(rectangle);

patch(rectangle, ast, {
  a: 10,
  b: 20,
});
```

<p align="center"><b>➔</b></p>

```xml
<rect
  id="cool-rectangle"
  x="20"  parametric:x="2 * a"
  y="25"  parametric:y="b + 5"
/>
```




<a                                                 id="/installation"></a>&nbsp;

Installation
------------

```sh
$ npm install parametric-svg-patch
```




<a                                                        id="/usage"></a>&nbsp;

Usage
-----

<!-- @doxie.inject start -->
<!-- Don’t remove or change the comment above – that can break automatic updates. -->
<p align="right"><sub><a href="http://jsig.biz/">JSIG SIGNATURE:</a></sub></p>

<h3><pre>
patch(
  element: DOMElement,
  ast: ParametricSvgAst,
  variables: Object
) => void
</pre></h3>

The `element` will be updated in place with bindings from the `ast` using
the `variables` you give us. The `ast` should generally come from the module
[parametric-svg-parse][]. You can also generate it yourself using
[parametric-svg-ast][].

If a parametric attribute depends on a variable you don’t give us, we won’t
update the attribute. For example, if you have
a `<rect parametric:x="a + 1" y="5" parametric:y="b + 1" />` and only
give us `{a: 10}` as `variables`, the result will be
`<rect x="11" parametric:x="a + 1" y="5" parametric:y="b + 1" />`.

[parametric-svg-parse]:  https://npmjs.com/package/parametric-svg-parse
[parametric-svg-ast]:    https://npmjs.com/package/parametric-svg-ast
<!-- Don’t remove or change the comment below – that can break automatic updates. More info at <http://npm.im/doxie.inject>. -->
<!-- @doxie.inject end -->




<a                                                      id="/license"></a>&nbsp;

License
-------

[MIT][] © [Tomek Wiszniewski][]

[MIT]: ./License.md
[Tomek Wiszniewski]: https://github.com/tomekwi
