const arrayFrom = require('array-from');

const children = (node) => (
  node.children ||
  arrayFrom(node.childNodes).filter(({nodeType}) => nodeType === 1)
);

 /**
  * The `element` will be updated in place with bindings from the `ast` using
  * the `variables` you give us. The `ast` should generally come from the module
  * [parametric-svg-parse][]. You can also generate it yourself using
  * [parametric-svg-ast][].
  *
  * If a parametric attribute depends on a variable you don’t give us, we won’t
  * update the attribute. For example, if you have
  * a `<rect parametric:x="a + 1" y="5" parametric:y="b + 1" />` and only
  * give us `{a: 10}` as `variables`, the result will be
  * `<rect x="11" parametric:x="a + 1" y="5" parametric:y="b + 1" />`.
  *
  * [parametric-svg-parse]:  https://npmjs.com/package/parametric-svg-parse
  * [parametric-svg-ast]:    https://npmjs.com/package/parametric-svg-ast
  *
  * @jsig
  *   patch(
  *     element: DOMElement,
  *     ast: ParametricSvgAst,
  *     variables: Object
  *   ) => void
  */
export default (element, ast, variables) => {
  if (ast.type !== 'ParametricSvgAst' || ast.version >= 2) {
    throw new Error('Incompatible AST object');
  }

  arrayFrom(ast.attributes).forEach(({address, name, relation}) => {
    const node = address.reduce(
      (parent, indexInParent) => children(parent)[indexInParent],
      element
    );

    const result = relation(variables);
    if (typeof result !== 'undefined') node.setAttribute(name, result);
  });
};
