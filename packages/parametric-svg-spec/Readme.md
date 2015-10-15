<h1 align="center"                                                       id="/">
  <img alt="parametric.svg" src="https://cdn.rawgit.com/parametric-svg/identity/v1.0.0/logo/basic.svg" />
</h1>

[![SEE IT IN ACTION! ➔
](https://img.shields.io/badge/SEE%20IT%20IN%20ACTION!-%E2%9E%94-555555.svg?style=flat-square)
](http://parametric-svg.js.org)

**A specification for full-fledged parametric graphics. In pure SVG.**




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

How you assign values to your variables depends on the implementation you’re using. For example, the *[\<parametric-svg\>][]* custom element takes variables as attributes:

```html
<parametric-svg
  x="5"
  color="`green`"
  ><svg>
  <rect
    parametric:x="x + 2"
               x="7"
    parametric:fill="color"
               x="green"
  />
</svg></parametric-svg>
```

[\<parametric-svg\>]:  https://www.npmjs.com/package/parametric-svg-element


###                                                   <a id="/syntax/types"></a> Data types                                                                       ###

A parametric attributes can result in two types of values:

* **number** – A floating-point number like `3` or `29.3`. For example, `parametric:x="3 + 5.4"` will result in `x="8.4"`.

* **string** – A sequence of characters enclosed in backticks (``` `` ```). For example, ``parametric:fill="`green`"`` will result in `fill="green"`. Your string can contain any whitespace inside. There are some characters you may need to escape:

Escape sequence   | Result
---               | ---
`` \` ``          | `` ` `` – backtick
`\$`              | `$` – dollar sign (See [Template strings][] for more info.)
`\\`              | `\` – backslash

In addition, you can use one more type of value internally in your variables and calculations:

* **boolean** – `true` or `false`. For example, `parametric:r="true ? 5 : 10"` will result in `r="5"`. Keep in mind that the result of a parametric attribute can’t be a boolean – so `parametric:r="true"` is invalid.

[Template strings]:   #/syntax/template-strings


###                                        <a id="/syntax/template-strings"></a> Template strings                                                                 ###

You can embed any expression in your string. Just put it between a `${` and a `}` – we’ll evaluate it and insert the result into your string. You may know this syntax [from ES 2015][].

For example, if you write ``parametric:d="`M ${1 + 2}, ${3 + 4}`"``, we’ll render it as `d="M 3, 7"`.

If you ever need to display the raw sequence of characters `${` in your string and don’t want that to be treated as the start of an expression, remember to escape the `$` with a backslash: `\${`.

[from ES 2015]:   https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/template_strings


###                                      <a id="/syntax/built-in-functions"></a> Built-in functions                                                               ###

There are a couple of functions built into *parametric.svg*.

**Trigonometry:**
- `cos(x: Angle) => Number`
- `sin(x: Angle) => Number`
- `tan(x: Angle) => Number`

`Angle` is an angle in radians.

To calculate the result of a function, wrap your arguments with parentheses, separate them by commas and place the bulk right after the function’s identifier. Sounds complicated? How about an example:

Whenever you write `parametric:x="cos(1)"`, we’ll render it as `x="0.54030230586814"`. Of course you can also combine function results with other expressions. So ``parametric:y="`777${1 + cos(1)}`"`` will be displayed as `y="7771.54030230586814"`.

At the moment we only include a minimal set of functions. If you need more functionality, you should be able to create a custom function using our [operators][] and the built-in functions we’ve listed above. If you need something that we haven’t covered, don’t hesitate to [open an issue][] though.

[operators]:      #/syntax/operators/
[open an issue]:  https://github.com/parametric-svg/-/issues


###                                                 <a id="/syntax/credits"></a> Credits                                                                          ###

The original parametric.svg parser uses [mathjs][] under the hood. We’ve ripped a lot of this specification off their specs. All credits go to the fine [developers of mathjs][].


[mathjs]:                http://mathjs.org
[developers of mathjs]:  https://github.com/josdejong/mathjs/graphs/contributors




<a                                                      id="/license"></a>&nbsp;

License
-------

[MIT][] © [Tomek Wiszniewski][].

[MIT]: ./License.md
[Tomek Wiszniewski]: https://github.com/tomekwi
