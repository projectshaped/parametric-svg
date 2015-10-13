import {NAMESPACE, PREFIX} from './constants';

const ast = require('parametric-svg-ast');
const arrayFrom = require('array-from');
const startsWith = require('starts-with');
const {parse} = require('mathjs');
const includes = require('array-includes');
const {keys} = Object;

const ELEMENT_NODE = 1;

const getChildren = ({children, childNodes}) => (children ?
  arrayFrom(children) :
  arrayFrom(childNodes).filter(({nodeType}) => nodeType === ELEMENT_NODE)
);

const nodeBelongsToNamespace = ({namespace, prefix = null}, node) => (
  (node.namespaceURI ?
    node.namespaceURI === namespace :
    (prefix !== null && startsWith(node.name, `${prefix}:`))
  )
);

const getLocalName = (node) => (node.namespaceURI ?
  node.localName :
  node.name.replace(new RegExp(`^.*?:`), '')
);

const stringDelimiter = /(^|[^\\])`/g;
const escapedBacktick = /\\`/g;
const doubleQuote = /"/g;
const newline = /\n/g;
const digestValue = (value) => (value
  .replace(doubleQuote, '\\"')
  .replace(stringDelimiter, '$1"')
  .replace(escapedBacktick, '`')
  .replace(newline, '\\n')
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
      const expressionTree = parse(digestValue(attribute.value));

      const dependencies = [];
      expressionTree.traverse(({isSymbolNode, name}) => {
        if (
          isSymbolNode &&
          !includes(['true', 'false'], name)
            // https://github.com/josdejong/mathjs/issues/468
        ) dependencies.push(name);
      });

      return {
        address,
        name: getLocalName(attribute),
        dependencies,
        relation: (scope) => {
          const availableVariables = keys(scope);
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

export default (root) => {
  const attributes = crawl([])([], root, null);

  return ast({attributes, defaults: []});
};
