<a                                                             id="/"></a>&nbsp;

[![Travis CI
](https://img.shields.io/travis/parametric-svg/element/master.svg?style=flat-square)
](https://travis-ci.org/parametric-svg/element)
 [![David DM
](https://img.shields.io/david/parametric-svg/element.svg?style=flat-square)
](http://david-dm.org/parametric-svg/element)
 [![Stability: experimental
](https://img.shields.io/badge/stability-experimental-yellow.svg?style=flat-square)
](https://nodejs.org/api/documentation.html#documentation_stability_index)
 [![Code style: airbnb
](https://img.shields.io/badge/code%20style-airbnb-777777.svg?style=flat-square)
](https://github.com/airbnb/javascript)




<h1 align="center">
  <img
    alt="&gt;parametric-svg&lt;"
    src="https://cdn.rawgit.com/parametric-svg/identity/v1.1.0/logo/html.svg"
    width="680"
    height="190"
  />
</h1>

**Parametric 2D graphics. As a custom HTML element.**




<a                                                 id="/example"></a>&nbsp;

```html
<svg>
  <rect parametric:width="2 * (a + 3)"/>
</svg>
```

<p align="center"><b>➔</b></p>

```html
<parametric-svg a="5"><svg>
  <rect parametric:width="2 * (a + 3)"
                   width="16" />
</svg></parametric-svg>
```

<p align="center"><b>➔</b></p>

```html
<parametric-svg a="50"><svg>
  <rect parametric:width="2 * (a + 3)"
                   width="106" />
</svg></parametric-svg>
```

<p align="center"><a href="http://jsbin.com/legito/edit?html,output"><img alt="❤ CHECK IT OUT LIVE!" height="32" src="https://img.shields.io/badge/%E2%9D%A4-CHECK%20IT%20OUT%20LIVE!-555555.svg?style=flat-square" /></a></p>




<a                                              id="/getting-started"></a>&nbsp;

Getting started
---------------

If you’re building your app with *[webpack][]* or something:

```sh
$ npm install parametric-svg-element
```

```js
require('parametric-svg-element');
```

Otherwise you can drop our `<script>` from the fantastic *[wzrd.in][]* CDN anywhere in your HTML document:

```html
<script src="https://wzrd.in/standalone/parametric-svg-element@latest"></script>
```

If you’re going the `<script>` way, remember to swap `latest` with a concrete version number in production. You can also download the script from https://wzrd.in/standalone/parametric-svg-element@latest and serve it yourself.

If it still doesn’t work, have a look at our [note about browser support](#/browser-support).

[webpack]:  http://webpack.github.io
[wzrd.in]:  http://wzrd.in




<a                                                        id="/usage"></a>&nbsp;

Usage
-----

Wrap an `<svg>` with a `<parametric-svg>` element – all parametric attributes within the `<svg>` will be [immediately][] resolved and updated.

See the [example](#/example) to get a general idea what a parametric SVG is. You can read up on the syntax in the [spec][].

You can define variables by setting attributes on the `<parametric-svg>` element. Any time you update an attribute, your drawing will be updated. Lightening-fast!

[immediately]:  http://devdocs.io/dom/window/setimmediate
[spec]:         https://github.com/parametric-svg/spec#/




<a                                              id="/browser-support"></a>&nbsp;

Browser support
---------------

Any browser which supports [ES5 and][] [custom elements][] will do. You can make custom elements work in any browser using the great *[document-register-element][]* polyfill.

[ES5 and]:                    http://caniuse.com/#feat=es5
[custom elements]:            http://caniuse.com/#feat=custom-elements
[document-register-element]:  https://github.com/WebReflection/document-register-element



<a                                                          id="/api"></a>&nbsp;

API
---
<div align="right"><sup>FUNCTION SIGNATURES USE JSIG <a href="http://jsig.biz/">(?)</a></sup></div>

<!-- @doxie.inject start -->
<!-- Don’t remove or change the comment above – that can break automatic updates. -->

#####  Register the `<parametric-svg>` element with custom settings

```js
register(options: {
  logger?       : {warn: Function},
  document?     : Document,
  HTMLElement?  : Function,
}) => void
```

In most cases you’ll just import the main module and be fine with the
default settings (see [getting started](#/getting-started)). But if you want
fine control, you can `require('parametric-svg-element/register')`. The
function you get back takes a single argument `options` with the following
properties:

- `logger` – A custom logger. Default: `window.console`.

- `document` – A custom implementation of `document` – for headless tests
  or something. Default: `window.document`

- `HTMLElement` – A custom HTMLElement constructor. If you’re passing
  a `document`, you’ll probably want to pass this as well. Default:
  `window.HTMLElement`.

<!-- Don’t remove or change the comment below – that can break automatic updates. More info at <http://npm.im/doxie.inject>. -->
<!-- @doxie.inject end -->




<a                                                      id="/license"></a>&nbsp;

License
-------

[MIT][] © [Tomek Wiszniewski][]

[MIT]: ./License.md
[Tomek Wiszniewski]: https://github.com/tomekwi
