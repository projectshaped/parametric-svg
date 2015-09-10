<p align="right">
  <a href="./License.md"><img alt="MIT License" src="https://img.shields.io/badge/license-MIT-9eab05.svg?style=flat-square"></a> <img alt="version 0.2.0" src="https://img.shields.io/badge/version-0.2.0-9eab05.svg?style=flat-square"></a> <a href="#5-implementations"><img alt="1 implementation" src="https://img.shields.io/badge/implementations-1-9eab05.svg?style=flat-square"></a>
</p>

<h1 align="center">
  <img alt="parametric.svg" src="https://cdn.rawgit.com/parametric-svg/identity/v1.0.0/logo/basic.svg" />
</h1>

 

**A specification for full-fledged parametric graphics. In pure SVG.**

**A simple XML namespace – fully compatible with SVG 1.1 and SVG 2.0.**

See it in action at [parametric-svg.js.org](http://parametric-svg.js.org)!

   
 



Goals
-----

####  ✓ Fully compatible with SVG specs.  ####

*parametric.svg* graphics can be viewed directly in the browser or in a simple SVG viewer. They can be edited and authored in your favorite program – be it *Inkscape*, *Adobe Illustrator*, *vim* or any other.

How is that? *parametric.svg* is just an XML namespace. We don't reinvent the wheel – instead, we extend the impressive capabilities of SVG, which are already built in.


####  ✓ Language-agnostic.  ####

Tailor-cut for the web, but easy to implement in any programming language.


####  ✓ Ready for the future.  ####

There is [a specification for dynamic parameters][svg-params] in the upcoming SVG 2.0. *parametric.svg* is backwards compatible with it – profiting from all its goodness, and bringing even more than that. We not only support dynamic parameters – but also logical and arithmetic relationships between them and geometry.

SVG 2.0 isn't yet fully standardized and implemented. But *parametric.svg* is built upon existing, stable technologies – ready to be used today.

[svg-params]: http://www.w3.org/TR/SVGParamPrimer/ "SVG Parameters 1.0"


####  ✓ Full-fledged.  ####

*parametric.svg* is a complete set of tools to describe relationships between parameters and elements. For the web it could become what Grasshopper is for CAD.




<div                                                    id="/usage">&nbsp;</div>

Usage
-----

*parametric.svg* is a regular XML namespace. To use it on an element, first set the attribute `xmlns:parametric="//parametric-svg.js.org/v1"` on the element or any of its ancestors. It’s often most convenient to set that on the whole SVG document:

```xml
<svg version="1.1"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:parametric="//parametric-svg.github.io/v1"
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

###  A note about HTML5  ###

HTML5 is not namespace-aware. Prefixing your parametric attribute or element with `parametric:` is enough – you don’t need to declare the `xmlns:parametric` thing beforehand.

Just keep in mind that while XML will allow you to bind our namespace to another prefix like `p:` (through `xmlns:p="//parametric-…"`), you’ll have to stick with `parametric:` in HTML5.




4. Specification
----------------

###  4.1 Attributes  ###

Any attribute valid for a given SVG element in the SVG namespace (no prefix) has its counterpart in the [parametric namespace][parametric-namespace]. For example – since the attribute `fill` is valid for a `<circle>` element – the attribute `parametric:fill` is a valid paremetric attribute for it.

A reference of valid attributes in SVG 1.1 can be found [here][svg-attributes].

[svg-attributes]: http://www.w3.org/TR/SVG/propidx.html


####  Attribute value  ####

The value of a [parametric attribute][parametric] should be a valid [expression][].


####  Evaluation of parametric attributes  ####

The [expression][] declared in the [parametric][] attribute should be evaluated upon loading the SVG document, and upon any change in parameter values. The resulting value should be cast to a string and replace the value of the [counterpart attribute][counterpart-attribute]. If the [counterpart attribute][counterpart-attribute] doesn't exist, it should be created.

If evaluation of an [expression][] results in an [error][], the value of the [counterpart attribute][counterpart-attribute] should be left unchanged. If no [counterpart attribute][counterpart-attribute] is present at the time of evaluation, it shouldn't be created. The rendering of the SVG document should proceed normally, but the [error][] message may be logged.

If evaluation of the [expression][] results in [null][], the [counterpart attribute][counterpart-attribute] should be removed.

The order of evaluating [parametric attributes][parametric] is not defined.




###  4.2 Elements  ###

####  `<parametric:ref>`  ####

The only element defined by this specification is `<parametric:ref>`. It's designed as a polyfill for the [`<ref>`][ref] element defined in a working draft of SVG 2.0. It accepts two attributes:

- `param` – the name of a [parameter][];
- `default` – (a valid [literal][]) the default value of the [parameter][] referenced by `param`.

[ref]: http://www.w3.org/TR/2009/WD-SVGParam-20090430/#ref-element
[parametric-ref]: #parametric-ref




###  4.3 Definitions  ###


####  counterpart attribute  ####

The counterpart attribute of a [parametric attribute][parametric] is an attribute of the same `localName` in the SVG namespace. For example, in the SVG element `<circle fill="red" parametric:fill="green" />` the counterpart attribute of `parametric:fill` is the attribute `fill`.

[counterpart-attribute]: #counterpart-attribute


####  error  ####

An exception encountered while parsing or evaluating an [expression][]. It may result from incorrect syntax – and from abuse of rules outlined or referenced by this specification.

Whenever an error is encountered, it shouldn't block parsing, evaluation or rendering of the rest of the document. A description of the error may be logged.

[error]: #error


####  expression  ####

A valid ECMAScript 6 expression consisting only of the [literals][literal], [operators][operator] and [parameter references][parameter reference] allowed by this specification.

If an expression is invalid, it should result in an [error][] upon evaluation.

If evaluating part of an expression or a whole expression requires type conversion, any value should be cast to a `String`. The result of casting should keep in line with the specification of ECMAScript 6.

[expression]: #expression


####  literal  ####

A valid ECMAScript 6 global object, constructed through the literal form – without invoking a constructor function – for example `"abc"` in contrast to the invalid `new String("abc")`. Only the following object types are supported:

- `Number`
- `Boolean`
- `String`
- `null`

An informative reference of global objects and their literal forms can be found on [MDN][mdn-literals].

[mdn-literals]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects
[literal]: #literal


####  null  ####

A value which is valid, but explicitly empty – in contrast to an [error][].

[null]: #null


####  operator  ####

A valid ECMAScript 6 operator. Only the following operators are supported:

- Arithmetic operators:
    - Addition operator (`+`)
    - Substraction operator (`-`)
    - Division operator (`/`)
    - Multiplication operator (`*`)
    - Remainder operator (`%`)
- Unary operators:
    - Unary plus operator (`+`)
    - Unary minus operator (`-`)
- Relational operators:
    - Less than operator (`<`)
    - Greater than operator (`>`)
    - Less than or equal operator (`<=`)
    - Greater than or equal operator (`>=`)
- Equality operators:
    - Identity operator (`===`)
    - Nonidentity operator (`!==`)
- Binary logical operators:
    - Logical AND (`&&`)
    - Logical OR (`||`)
- Other:
    - String concatenation operator (`+`)
    - Conditional (ternary) operator (`condition ? ifTrue : ifFalse`)

An informative reference of operators in ECMAScript can be found on [MDN][mdn-operators].

[mdn-operators]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators
[operator]: #operator


####  parameter  ####

A parameter is a unique name associated with a dynamic value. It is a semantic equivalent of an ECMAScript variable. The value assigned to the parameter can be referred to through a [parameter reference][parameter-reference].

The way of assigning a value to a parameter is implementation-specific. A common way, also supported in SVG 2.0, is passing parameters through a URL query string. Thus, if we wanted to assign the value `10` to a parameter named `factor` within a graphic located at `http://example.com/circle.svg`, we could retrieve it through the following URL: `http://example.com/circle.svg?factor=10`.

A parameter may have a default value declared through the [`<ref>`][ref] or [`<parametric:ref>`][parametric-ref] element with its attribute `param` matching the parameter's name. The [literal][] declared in the attribute `default` should then be used as a fallback value in case no value is assigned to the parameter. For example, if a document contains the element `<parametric:ref param="factor" value="20">` and the parameter named `factor` has no value assigned, `20` should be used as its fallback value.

Both the string describing a default value of a parameter – and that describing a value being assigned to it – should be valid [literals][literal]. If it's not valid, parsing the value should result in an [error][] and the value should be marked as not defined.

[parameter]: #parameter


####  parameter reference  ####

A parameter reference is an equivalent of an ECMAScript variable identifier – both syntactically and semantically. It represents the value of a [parameter][] of the same name.

If no value is assigned to the referenced [parameter][], the default value should be used as a fallback. If the [parameter][] has neither a value assigned nor a default value declared, evaluation of its reference should result in an [error][].

For example, in the declaration `<circle parametric:r="10 * factor" />`, `factor` is a parameter reference. If the [parameter][] `factor` is assigned a value of `5`, the [expression][] `10 * factor` will evalute to `50`.

[parameter reference]: #parameter-reference


####  parametric  ####

An attribute or element in the [parametric namespace][parametric-namespace] is referred to as a parametric attribute or element.

[parametric]: #parametric


####  parametric namespace  ####

The parametric namespace is the XML namespace identified by the URI `https://parametric-svg.github.io/v0.2`.

[parametric-namespace]: #parametric-namespace






5. Implementations
------------------

A [JavaScript implementation][on-npm] is currently being worked on.

[on-npm]: http://npm.im/parametric-svg




6. License
----------

[MIT][license] © [Tomek Wiszniewski][tomekwi].

[license]: ./License.md
[tomekwi]: https://github.com/tomekwi
