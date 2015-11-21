const NAMESPACE = '//parametric-svg.js.org/v1';
const PREFIX = 'parametric';

const ast = require('@parametric-svg/ast');
const arrayFrom = require('array-from');
const startsWith = require('starts-with');
const digest = require('@parametric-svg/expression-to-mathjs').parse;
const parse = require('mathjs').parse;
const includes = require('array-includes');

const ELEMENT_NODE = 1;

const getChildren = (node) => (node.children ?
  arrayFrom(node.children) :
  arrayFrom(node.childNodes).filter(child => child.nodeType === ELEMENT_NODE)
);

const nodeBelongsToNamespace = (params, node) => {
  const namespace = params.namespace;
  const prefix = params.prefix || null;

  return (node.namespaceURI ?
    node.namespaceURI === namespace :
    (prefix !== null && startsWith(node.name, `${prefix}:`))
  );
};

const getLocalName = (node) => (node.namespaceURI ?
  node.localName :
  node.name.replace(new RegExp(`^.*?:`), '')
);

const crawl = (parentAddress) => (allAttributes, element, indexInParent) => {
  const address = (indexInParent === null ?
    parentAddress :
    parentAddress.concat(indexInParent)
  );

  const currentAttributes = arrayFrom(element.attributes)
    .filter((node) => nodeBelongsToNamespace({
      namespace: NAMESPACE,
      prefix: PREFIX,
    }, node))

    .map((attribute) => {
      const expressionTree = parse(digest(attribute.value));

      const dependencies = [];
      expressionTree.traverse(node => {
        if (
          node.isSymbolNode &&
          !includes(['true', 'false'], node.name)
            // https://github.com/josdejong/mathjs/issues/468
        ) dependencies.push(node.name);
      });

      return {
        address,
        name: getLocalName(attribute),
        dependencies,
        relation: (scope) => {
          const availableVariables = Object.keys(scope);
          if (!dependencies.every(dep => includes(availableVariables, dep))) {
            return undefined;
          }

          return expressionTree.eval(scope);
        },
      };
    });

  return getChildren(element).reduce(
    crawl(address),
    allAttributes.concat(currentAttributes)
  );
};

module.exports = (root) => {
  const attributes = crawl([])([], root, null);

  return ast({attributes, defaults: []});
};
