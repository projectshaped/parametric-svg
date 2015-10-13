import patch from './module';

const parse = require('parametric-svg-parse');
const test = require('tape-catch');
const {safeLoad: yaml} = require('js-yaml');
const {jsdom} = require('jsdom');
const {DOMParser: XmldomParser} = require('xmldom');
const asObject = require('as/object');
const asArray = require('as/array');

const wrap = (element) => (
`<svg
  version="1.1"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:parametric="//parametric-svg.js.org/v1"
>${element}</svg>
`);

if (typeof require.ensure !== 'function') require.ensure =
  require('isomorphic-ensure')({
    loaders: {
      raw: require('raw-loader'),
    },
    dirname: __dirname,
  });

require.ensure([
  'raw!./node_modules/parametric-svg-spec/specs/usage-html5.yaml',
  'raw!./node_modules/parametric-svg-spec/specs/usage-xml.yaml',
  'raw!./node_modules/parametric-svg-spec/specs/parametric-attributes.yaml',
  'raw!./node_modules/parametric-svg-spec/specs/syntax-operators.yaml',
  'raw!./node_modules/parametric-svg-spec/specs/syntax-variables.yaml',
    // NOTE: These paths have to be hard-coded in stone – otherwise webpack
    // gets confused. Remember to keep them in sync with the `require`
    // calls below.
], (require) => {
  const specs = [
    require('raw!./node_modules/parametric-svg-spec/specs/usage-html5.yaml'),
    require('raw!./node_modules/parametric-svg-spec/specs/usage-xml.yaml'),
    require(
      'raw!./node_modules/parametric-svg-spec/specs/parametric-attributes.yaml'
    ),
    require(
      'raw!./node_modules/parametric-svg-spec/specs/syntax-operators.yaml'
    ),
    require(
      'raw!./node_modules/parametric-svg-spec/specs/syntax-variables.yaml'
    ),
      // NOTE: See above.
  ].map(yaml);

  specs.forEach(({
    name,
    tests,
    mode,
  }) => tests.forEach(({
    description,
    original,
    example_data: data,
    example_output: expected,
  }) => {
    test(`${name}: ${description}`, (is) => {
      const inBrowser = typeof window !== 'undefined' && window.DOMParser;

      const htmlMode = mode === 'HTML5 document';
      const xmlMode = mode === 'XML document';
      const elementMode = mode === 'Element';
      if (!htmlMode && !xmlMode && !elementMode) throw new Error(
        'Unknown test mode'
      );

      const contentType = (htmlMode ?
        'text/html' :
        'application/xml'
      );

      const Parser = (inBrowser ?
        window.DOMParser :
        XmldomParser
      );

      const toString = (
        (htmlMode &&
          ((node) => node.outerHTML)
        ) ||
        (inBrowser &&
          ((node) => (new window.XMLSerializer()).serializeToString(node))
        ) ||
        String
      );

      const rootElements = asObject(asArray({
        original,
        expected,
      }).map(({key, value}) => {
        const documentSource = (elementMode ?
          wrap(value) :
          value
        );

        const document = (!inBrowser && htmlMode ?
          jsdom(documentSource).defaultView.document :
          (new Parser()).parseFromString(documentSource, contentType)
        ).documentElement;

        return {key, value: (elementMode ?
          document.firstChild :
          document
        )};
      }));

      const ast = parse(rootElements.original);
      patch(rootElements.original, ast, data);

      is.equal(
        toString(rootElements.original),
        toString(rootElements.expected),
        'expected output matches'
      );

      is.end();
    });
  }));
});
