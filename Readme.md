<p align="right">
  <a href="./License.md"><img alt="MIT License" src="https://img.shields.io/badge/license-MIT-92a913.svg?style=flat-square"></a> <a href="#5-implementations"><img alt="No implementations yet" src="https://img.shields.io/badge/implementations-0-92a913.svg?style=flat-square"></a>
</p>

<h1 align="center">
  <img alt="parametric.svg" src="https://raw.githubusercontent.com/tomekwi/parametric.svg/master/assets/logo.png" />
</h1>

 

**A specification for full-fledged parametric SVG graphics.**

**A simple XML namespace – fully compatible with SVG 1.1 and SVG 2.0.**

   
 



1. Goals
--------


##### ✓ Fully compatible with SVG specs.

parametric.svg graphics can be viewed directly in the browser or in a simple SVG viewer. They can be edited – or even authored – in Inkscape, Adobe Illustrator, or any other program of choice.

How is that? parametric.svg is a regular XML namespace. We don't reinvent the wheel – instead, we extend the impressive capabilities of SVG, which already are built in.


##### ✓ Language-agnostic.

Tailor-cut to web technologies, but easy to implement in any programming language.


##### ✓ Ready for the future.

There already is [a specification for dynamic parameters][svg-params] in the upcoming SVG 2.0. It's not implemented in most web browsers yet – parametric.svg can be used today, as it's built upon existing technologies.

parametric.svg is fully compatible with the native SVG 2.0 specification – profiting from all its goodness, and bringing even more than that. We not only support dynamic parameters and dynamic geometry, but also logical and arithmetic relationships between them.

[svg-params]: http://www.w3.org/TR/SVGParamPrimer/ "SVG Parameters 1.0"


##### ✓ Full-fledged.

parametric.svg is designed as a complete set of tools to describe relationships between parameters and elements. For the web it could become what Grasshopper is for CAD.




2. Abstract
-----------

The purpose of this document is to outline and specify an XML namespace extending the capabilities of Scalable Vector Graphics. The described namespace provides a complete set of tools to parametrise the position, geometry and number of elements in the graphic, in a declarative way.

The parametrisation should not only provide direct access to these properties, but also allow the author to declare logical and arithmetic relationships between parameters and elements.




3. Usage
--------

parametric.svg is a regular XML namespace. In order to be used on an element, the namespace must be specified on the element or any of its ancestors by the following url: `http://github.com/parametric-svg/parametric.svg/tree/0.1.0`.

For example, the following declaration will allow using the namespace in the scope of the whole SVG document:

```xml
<?xml version="1.0"?>
<svg version="1.1"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:parametric="http://github.com/parametric-svg/parametric.svg/tree/0.1.0"
  >
  ...
</svg>
```

Once the reference is specified, the namespace can be used on all elements within the scope, like in the following example:

```xml
  <defs>
    <parametric:ref param="factor" default="5" />
  </defs>

  <circle cx="100" cy="100" r="50"
    parametric:r="10 * factor"
    />
```




4. Specification
----------------

### 4.1 Definitions


### 4.2 Attributes


### 4.3 Elements




5. Implementations
------------------

A [JavaScript implementation][on-npm] is currently being worked on.

[on-npm]: https://www.npmjs.com/package/parametric.svg




5. License
----------

[MIT][license] © [Tomek Wiszniewski][].

[license]: ./License.md
[Tomek Wiszniewski]: https://github.com/tomekwi
