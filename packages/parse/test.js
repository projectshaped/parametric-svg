const parse = require('.');

const tape = require('tape-catch');
const yaml = require('js-yaml').safeLoad;
const ord = require('ord');
const tosource = require('tosource');
const jsdom = require('jsdom').jsdom;
const arrayFrom = require('array-from');
const XmlDomParser = require('xmldom').DOMParser;

const wrap = (element) => (
`<svg
  version="1.1"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:parametric="//parametric-svg.js.org/v1"
>${element}</svg>
`
);

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

  // {name, tests, mode}
  specs.forEach(spec => spec.tests.forEach(test => {
    tape(`${spec.name}: ${test.description}`, (is) => {
      const inBrowser = typeof window !== 'undefined' && window.DOMParser;

      const htmlMode = spec.mode === 'HTML5 document';
      const xmlMode = spec.mode === 'XML document';
      const elementMode = spec.mode === 'Element';
      if (!htmlMode && !xmlMode && !elementMode) throw new Error(
        'Unknown test mode'
      );

      const documentSource = (elementMode ?
        wrap(test.original) :
        test.original
      );

      const contentType = (htmlMode ?
        'text/html' :
        'application/xml'
      );

      const Parser = (inBrowser ?
        window.DOMParser :
        XmlDomParser
      );

      const document = (!inBrowser && htmlMode ?
        jsdom(documentSource).defaultView.document :
        (new Parser()).parseFromString(documentSource, contentType)
      ).documentElement;

      const rootElement = (elementMode ?
        document.firstChild :
        document
      );

      const attributes = parse(rootElement).attributes;

      is.equal(
        attributes.size,
        test.ast.length,
        'the AST has the right number of attributes'
      );

      test.ast.forEach((expected, index) => {
        const n = index + 1;
        const nth = `${n}-${ord(n)}`;
        const actual = arrayFrom(attributes)[index];

        is.deepEqual(
          actual.address,
          expected.address,
          `the \`address\` matches in the ${nth} parametric attribute`
        );

        is.equal(
          actual.name,
          expected.name,
          `the \`name\` matches in the ${nth} parametric attribute`
        );

        is.deepEqual(
          actual.dependencies,
          expected.dependencies,
          `the \`dependencies\` match in the ${nth} parametric attribute`
        );

        expected.relation.forEach(relation => {
          is.deepEqual(
            actual.relation(relation.input),
            relation.output,
            `the \`relation\` in the ${nth} parametric attribute returns ` +
            'the expected value when called with the arguments ' +
            `\`${tosource(relation.input)}\`.`
          );
        });
      });

      is.end();
    });
  }));
});
