const patch = require('.');

const parse = require('@parametric-svg/parse');
const tape = require('tape-catch');
const yaml = require('js-yaml').safeLoad;
const jsdom = require('jsdom').jsdom;
const XmlDomParser = require('xmldom').DOMParser;
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
  'raw!@parametric-svg/spec/specs/usage-html5.yaml',
  'raw!@parametric-svg/spec/specs/usage-xml.yaml',
  'raw!@parametric-svg/spec/specs/parametric-attributes.yaml',
  'raw!@parametric-svg/spec/specs/syntax-operators.yaml',
  'raw!@parametric-svg/spec/specs/syntax-template-strings.yaml',
  'raw!@parametric-svg/spec/specs/syntax-types.yaml',
  'raw!@parametric-svg/spec/specs/syntax-variables.yaml',
    // NOTE: These paths have to be hard-coded in stone – otherwise webpack
    // gets confused. Remember to keep them in sync with the `require`
    // calls below.
], (require) => {
  const specs = [
    require('raw!@parametric-svg/spec/specs/usage-html5.yaml'),
    require('raw!@parametric-svg/spec/specs/usage-xml.yaml'),
    require('raw!@parametric-svg/spec/specs/parametric-attributes.yaml'),
    require('raw!@parametric-svg/spec/specs/syntax-operators.yaml'),
    require('raw!@parametric-svg/spec/specs/syntax-template-strings.yaml'),
    require('raw!@parametric-svg/spec/specs/syntax-types.yaml'),
    require('raw!@parametric-svg/spec/specs/syntax-variables.yaml'),
      // NOTE: See above.
  ].map(yaml);

  specs.forEach(spec => spec.tests.forEach(test => {
    const original = test.original;
    const data = test.example_data;
    const expected = test.example_output;

    tape(`${spec.name}: ${test.description}`, (is) => {
      const inBrowser = typeof window !== 'undefined' && window.DOMParser;

      const htmlMode = spec.mode === 'HTML5 document';
      const xmlMode = spec.mode === 'XML document';
      const elementMode = spec.mode === 'Element';
      if (!htmlMode && !xmlMode && !elementMode) throw new Error(
        'Unknown test mode'
      );

      const contentType = (htmlMode ?
        'text/html' :
        'application/xml'
      );

      const Parser = (inBrowser ?
        window.DOMParser :
        XmlDomParser
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
      }).map((item) => {
        const documentSource = (elementMode ?
          wrap(item.value) :
          item.value
        );

        const document = (!inBrowser && htmlMode ?
          jsdom(documentSource).defaultView.document :
          (new Parser()).parseFromString(documentSource, contentType)
        ).documentElement;

        return {key: item.key, value: (elementMode ?
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
