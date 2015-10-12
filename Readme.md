<h1 align="center"                                                       id="/">
  <img alt="parametric.svg" src="https://cdn.rawgit.com/parametric-svg/identity/v1.0.0/logo/basic.svg" />
</h1>

[![Version: 0.2.0
](https://img.shields.io/badge/version-0.2.0-9eab05.svg?style=flat-square)
](https://www.npmjs.com/package/parametric-svg-spec)
 [![Implementations: 3
](https://img.shields.io/badge/implementations-3-9eab05.svg?style=flat-square)
](#/implementations)
 [![SEE IT IN ACTION! ➔
](https://img.shields.io/badge/SEE%20IT%20IN%20ACTION!-%E2%9E%94-555555.svg?style=flat-square)
](http://parametric-svg.js.org)

**A specification for full-fledged parametric graphics. In pure SVG.**




<a                                                        id="/goals"></a>&nbsp;

Goals
-----

####  ✓ Fully compatible with SVG specs.  ####

*parametric.svg* graphics can be viewed directly in the browser or in a simple SVG viewer. They can be edited and authored in your favorite program – be it *Inkscape*, *Adobe Illustrator*, *vim* or any other.

How is that? *parametric.svg* is just an XML namespace. We don't reinvent the wheel – instead, we extend the impressive capabilities of SVG, which are already built in.


####  ✓ Language-agnostic.  ####

Tailor-cut for the web, but easy to implement in any programming language.


####  ✓ Ready for the future.  ####

There is [a specification for dynamic parameters][svg-params] in the upcoming SVG 2.0. *parametric.svg* [aims to be](https://github.com/parametric-svg/spec/issues/2) backwards compatible with it – profiting from all its goodness, and bringing even more than that. We not only support dynamic parameters – but also logical and arithmetic relationships between them and geometry.

SVG 2.0 isn't yet fully standardized and implemented. But *parametric.svg* is built upon existing, stable technologies – ready to be used today.

[svg-params]: http://www.w3.org/TR/SVGParamPrimer/ "SVG Parameters 1.0"


####  ✓ Full-fledged.  ####

*parametric.svg* is a complete set of tools to describe relationships between parameters and elements. For the web it could become what Grasshopper is for CAD.




<a                                                        id="/usage"></a>&nbsp;

Usage
-----

*parametric.svg* is a regular XML namespace. To use it on an element, first set the attribute `xmlns:parametric="//parametric-svg.js.org/v1"` on the element or any of its ancestors. It’s often most convenient to set that on the whole SVG document:

```xml
<svg version="1.1"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:parametric="//parametric-svg.js.org/v1"
  >
  ...
</svg>
```

Once you’ve set the `xmlns:parametric` thing, you can use the namespace on attributes:

```xml
<circle
  parametric:r="10 * factor"
             r="50"
/>
```


###                                                    <a id="/usage/html5"></a> A note about HTML5                                                               ###

HTML5 is not namespace-aware. Prefixing your parametric attribute or element with `parametric:` is enough – you don’t need to declare the `xmlns:parametric` thing beforehand.

While XML will allow you to bind our namespace to another prefix like `p:` (through `xmlns:p="//parametric-…"`), it’s normally a bad idea. Only the prefix `parametric:` will work if your SVG is injected into a HTML5 document.




<a                                        id="/parametric-attributes"></a>&nbsp;

Parametric attributes
---------------------

Whenever you set an attribute with the prefix `parametric:` on an element, we’ll bind it to a regular attribute of the same name, without the prefix. For example, the attribute `parametric:height` will be bound to `height`. We’ll call `parametric:height` a *parametric attribute* and `height` its *bound attribute*.

When your parametric attribute gets an [update](#/update), the bound attribute is changed – or created, if it doesn’t exist.




<a                                                       id="/syntax"></a>&nbsp;

Syntax
------

A parametric attribute works like a calculated spreadsheet cell (one with a `=` in front). It can contain any mathematical expression, as long as it keeps to the rules below.


###                                               <a id="/syntax/operators"></a> Operators                                                                        ###

We have operators for all common arithmetic operations such as addition and multiplication. We use conventional infix notation for operators: an operator is placed between its arguments.

```svg
<circle parametric:r="2 + 3" />
  <!-- → r="5" -->

<circle parametric:r="2 * 3" />
  <!-- → r="6" -->
```

You can use round parentheses to override the default precedence of operators.

```svg
<circle parametric:r="2 + 3 * 4" />
  <!-- → r="14" -->

<circle parametric:r="(2 + 3) * 4" />
  <!-- → r="20" -->
```

The following operators are available:

Operator    | Name                    | Syntax      | Associativity | Example                    | Result
----------- | ----------------------- | ----------  | ------------- | -------------------------- | ---------------
`(`, `)`    | Parentheses             | `(x)`       | None          | `2 * (3 + 4)`              | `14`
`,`         | Parameter separator     | `x, y`      | Left to right | `max(2, 1, 5)`             | `5`
`+`         | Add                     | `x + y`     | Left to right | `4 + 5`                    | `9`
`-`         | Subtract                | `x - y`     | Left to right | `7 - 3`                    | `4`
`-`         | Unary minus             | `-y`        | Right to left | `-4`                       | `-4`
`*`         | Multiply                | `x * y`     | Left to right | `2 * 3`                    | `6`
`/`         | Divide                  | `x / y`     | Left to right | `6 / 2`                    | `3`
`%`         | Modulus                 | `x % y`     | Left to right | `8 % 3`                    | `2`
`^`         | Power                   | `x ^ y`     | Right to left | `2 ^ 3`                    | `8`
`!`         | Factorial               | `y!`        | Left to right | `5!`                       | `120`
`and`       | Logical and             | `x and y`   | Left to right | `true and false  ? 1 : 0`  | `0`
`not`       | Logical not             | `not y`     | Right to left | `not true        ? 1 : 0`  | `0`
`or`        | Logical or              | `x or y`    | Left to right | `true or false   ? 1 : 0`  | `1`
`xor`       | Logical xor             | `x xor y`   | Left to right | `true xor true   ? 1 : 0`  | `0`
`?` `:`     | Conditional expression  | `x ? y : z` | Right to left | `false ? 1 : -1`           | `-1`
`==`        | Equal                   | `x == y`    | Left to right | `2 == 4 - 2      ? 1 : 0`  | `1`
`!=`        | Unequal                 | `x != y`    | Left to right | `2 != 3          ? 1 : 0`  | `1`
`<`         | Smaller                 | `x < y`     | Left to right | `2 < 3           ? 1 : 0`  | `1`
`>`         | Larger                  | `x > y`     | Left to right | `2 > 3           ? 1 : 0`  | `0`
`<=`        | Smallereq               | `x <= y`    | Left to right | `4 <= 3          ? 1 : 0`  | `0`
`>=`        | Largereq                | `x >= y`    | Left to right | `2 + 4 >= 6      ? 1 : 0`  | `1`


###                                               <a id="/syntax/variables"></a> Variables                                                                        ###

A variable is like a spreadsheet cell with a static value (without a `=` in front). You can set your own variables and reference them from parametric attributes – much like you reference a value from a spreadsheet cell.

There is one difference between a spreadsheet cell and a variable. While a cell has an *address* (like `B1`) – you must give each variable a *name* using lower- and uppercase letters (for example, `baseLength`). You can later use this name to reference a value. This makes your parametric attributes more readable – instead of `(B1 + 3) * 2` you would `(baseLength + 3) * 2`. When you look at the file two weeks later, you’ll still know what’s going on.

If an expression in a parametric attribute contains a variable which doesn’t have any value, the bound attribute won’t be updated.

How you assign values to your variables depends on the implementation you’re using. For example, the *[&lt;parametric-svg&gt;][]* custom element takes variables as attributes:

```html
<parametric-svg
  x="5"
  color="'green'"
  ><svg>
  <rect
    parametric:x="x + 2"
    parametric:fill="color"
  />
</svg></parametric-svg>
```

[&lt;parametric-svg&gt;]:  https://github.com/parametric-svg/element




###                                                 <a id="/syntax/credits"></a> Credits                                                                          ###

The original parametric.svg parser uses [mathjs][] under the hood. We’ve ripped a lot of this specification off their specs. All credits go to the fine [developers of mathjs][].


[mathjs]:                http://mathjs.org
[developers of mathjs]:  https://github.com/josdejong/mathjs/graphs/contributors




<a                                              id="/implementations"></a>&nbsp;

Implementations
---------------

* *[&lt;parametric-svg&gt;][]* – A custom HTML element.
* *[parametric-svg][]* – A JS library with an easy-to-use API.
* *[parametric-svg-patch][]* and *[parametric-svg-parse][]* – A tandem of low-level libraries.

[parametric-svg]:         https://www.npmjs.com/package/parametric-svg
[parametric-svg-patch]:   https://www.npmjs.com/package/parametric-svg-patch
[parametric-svg-parse]:   https://www.npmjs.com/package/parametric-svg-parse





<a                                                      id="/license"></a>&nbsp;

License
-------

[MIT][] © [Tomek Wiszniewski][].

[MIT]: ./License.md
[Tomek Wiszniewski]: https://github.com/tomekwi
