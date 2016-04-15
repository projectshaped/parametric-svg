<h1 align="center" id="/">
  <img alt="parametric.svg" src="https://cdn.rawgit.com/parametric-svg/identity/v1.0.0/logo/basic.svg" />
</h1>

[![Implementations: 3
](https://img.shields.io/badge/implementations-3-9eab05.svg?style=flat-square)
](#/implementations)
 [![SEE IT IN ACTION! ➔
](https://img.shields.io/badge/SEE%20IT%20IN%20ACTION!-%E2%9E%94-555555.svg?style=flat-square)
](http://parametric-svg.js.org)

**Parametric drawings in pure SVG.**




<a id="/goals"></a>&nbsp;

## Goals

#### ✓ Fully compatible with SVG specs.

*parametric.svg* graphics can be viewed directly in the browser or in a simple SVG viewer. They can be edited and authored in your favorite program – be it *Inkscape*, *Adobe Illustrator*, *vim* or any other.

How is that? *parametric.svg* is just an XML namespace. We don't reinvent the wheel – instead, we extend the impressive capabilities of SVG, which are already built in.


#### ✓ Language-agnostic.

Tailor-cut for the web, but easy to implement in any programming language.


#### ✓ Ready for the future.

There is [a specification for dynamic parameters][svg-params] in the upcoming SVG 2.0. *parametric.svg* [aims to be](https://github.com/parametric-svg/-/issues/2) backwards compatible with it – profiting from all its goodness, and bringing even more than that. We not only support dynamic parameters – but also logical and arithmetic relationships between them and geometry.

SVG 2.0 isn't yet fully standardized and implemented. But *parametric.svg* is built upon existing, stable technologies – ready to be used today.

[svg-params]: http://www.w3.org/TR/SVGParamPrimer/ "SVG Parameters 1.0"


#### ✓ Full-fledged.

*parametric.svg* is a complete set of tools to describe relationships between parameters and elements. For the web it could become what Grasshopper is for CAD.




<a id="/implementations"></a>&nbsp;

## Implementations

* *[\<parametric-svg\>][]* – A custom HTML element.
* *[parametric-svg][]* – A JS library with an easy-to-use API.
* *[@parametric-svg/patch][]* and *[@parametric-svg/parse][]* – A tandem of low-level libraries.

[\<parametric-svg\>]:     https://www.npmjs.com/package/@parametric-svg/element
[parametric-svg]:         https://www.npmjs.com/package/parametric-svg
[@parametric-svg/patch]:   https://www.npmjs.com/package/@parametric-svg/patch
[@parametric-svg/parse]:   https://www.npmjs.com/package/@parametric-svg/parse
