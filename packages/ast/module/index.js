const Set = require('es6-set');

 /**
  * @module {Function} parametric-svg-ast
  *
  * @param {Object} args
  * @param {Object[]} args.attributes
  *   An iterable of objects, each representing a parametric attribute.
  *
  * @param {Number[]} args.attributes.address
  *   An array defining the path of the attribute’s parent element
  *   in its XML DOM tree as a series of numbers. The address
  *   of the root element is `[]`. The address of the `n`th element `a`
  *   in any other element `b` is `[...<address of b>, n - 1]`. For example,
  *   the element `<c>` in the document `<a>some<b /> text<b><c /></b></a>`
  *   has the address `[1, 0]`.
  *
  * @param {String} args.attributes.name
  *   The name of the attribute without the namespace prefix. The name
  *   of the attribute `parametric:a` is `'a'`.
  *
  * @param {String[]} args.attributes.dependencies
  *   An array of identifiers of all variables needed to evaluate
  *   the attribute’s expression. If a parametric attribute
  *   is declared as `a - b * 5`, its dependencies are `['a', 'b']`.
  *
  * @param {Function} args.attributes.relation
  *   The parameter’s expression. This is the value of the parameter
  *   expressed as a JavaScript function. Arguments will be passed
  *   to the function in the same order in which they appear in `dependencies`.
  *   The relation of a parametric attribute declared as `a - b * 5`
  *   is `(a, b) => a - b * 5`.
  *
  * @param {Object[]} args.defaults
  *   An iterable of objects, each representing a `<ref>` element
  *   – the default value of a variable.
  *
  * @param {String} args.defaults.identifier
  *   The value of the `param` attribute.
  *
  * @param {String[]} args.defaults.dependencies
  *   Identifiers of all variables needed to evaluate the
  *   `relation`. The format is the same as in `attributes.dependencies`.
  *
  * @param {Function} args.defaults.relation
  *   The value of the `default` attribute as a JavaScript
  *   function. The format is the same as in `attributes.relation`.
  */
export default ({attributes, defaults}) => {
  return {
    type: 'ParametricSvgAst',
    version: 1,
    attributes: new Set(attributes),
    defaults: new Set(defaults),
  };
};
