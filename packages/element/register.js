const parse = require('@parametric-svg/parse');
const patch = require('@parametric-svg/patch');
const assign = require('object-assign');
const asObject = require('as/object');
const arrayFrom = require('array-from');
const privateParts = require('private-parts');

const _ = privateParts.createKey();

const quotesTest = /^`.*`$/;
function parseValue(value) {
  if (quotesTest.test(value)) {
    return value.slice(1, -1);
  }

  if (value === 'true') {
    return 1;
  }
  if (value === 'false') {
    return 0;
  }

  return Number(value);
}

 /**
  * Register the `<parametric-svg>` element with custom settings
  *
  * In most cases you’ll just import the main module and be fine with the
  * default settings (see [getting started](#/getting-started)). But if you want
  * fine control, you can `require('@parametric-svg/element/register')`. The
  * function you get back takes a single argument `options` with the following
  * properties:
  *
  * - `logger` – A custom logger. Default: `window.console`.
  *
  * - `document` – A custom implementation of `document` – for running this
  *   headlessly. Default: `window.document`.
  *
  * - `HTMLElement` – A custom HTMLElement constructor. If you’re passing
  *   a `document`, you’ll probably want to pass this as well. Default:
  *   `window.HTMLElement`.
  *
  * - `MutationObserver` – Same story here. Default: `window.MutationObserver`.
  *
  * @jsig
  *   register(options: {
  *     document?           : Document,
  *     HTMLElement?        : Function,
  *     MutationObserver?   : Function,
  *   }) => void
  */
module.exports = (options) => {
  const document = options.document || window.document;
  const HTMLElement = options.HTMLElement || window.HTMLElement;
  const MutationObserver = options.MutationObserver || window.MutationObserver;

  const prototype = assign(Object.create(HTMLElement.prototype), {
    createdCallback() {
      let svg;
      let ast;

      _(this).update = () => {
        const variables = asObject(arrayFrom(this.attributes).map(
          ({name, value}) => ({key: name, value: parseValue(value)})
        ));

        patch(svg, ast, variables);
      };

      const parseContents = () => {
        svg = this.querySelector('svg');
        if (!svg) return;
        ast = parse(svg);
        _(this).update();
      };

      parseContents();

      let parsedInThisFrame = false;
      const observer = new MutationObserver(() => {
        if (parsedInThisFrame) return;
        parseContents();
        parsedInThisFrame = true;
        requestAnimationFrame(() => {parsedInThisFrame = false;});
      });
      observer.observe(this, {
        childList: true,
        attributes: true,
        subtree: true,
      });
    },

    attributeChangedCallback() { _(this).update(); },
  });

  document.registerElement('parametric-svg', {prototype});
};
