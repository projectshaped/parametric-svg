const parse = require('@parametric-svg/parse');
const patch = require('@parametric-svg/patch');
const setImmediate = require('set-immediate-shim');
const assign = require('object-assign');
const asObject = require('as/object');
const arrayFrom = require('array-from');

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
  * - `document` – A custom implementation of `document` – for headless tests
  *   or something. Default: `window.document`
  *
  * - `HTMLElement` – A custom HTMLElement constructor. If you’re passing
  *   a `document`, you’ll probably want to pass this as well. Default:
  *   `window.HTMLElement`.
  *
  * @jsig
  *   register(options: {
  *     logger?       : {warn: Function},
  *     document?     : Document,
  *     HTMLElement?  : Function,
  *   }) => void
  */
module.exports = (options) => {
  const doc = (
    options.document ||
    (typeof window !== 'undefined' && window.document)
  );

  const logger = (
    options.logger ||
    (typeof window !== 'undefined' && window.console)
  );

  const basePrototype = (
    options.HTMLElement ||
    (typeof window !== 'undefined' && window.HTMLElement)
  ).prototype;

  const prototype = assign(Object.create(basePrototype), {
    createdCallback() {
      const syncSvg = this.querySelector('svg');
      if (syncSvg) this._init(syncSvg);
      else setImmediate(() => {
        const asyncSvg = this.querySelector('svg');
        if (asyncSvg) this._init(asyncSvg);
        else logger.warn(
          '<parametric-svg>:  Couldn’t find an <svg> element in ', this
        );
      });
    },

    attributeChangedCallback() { this._update(); },

    _init(svg) {
      this._svg = svg;
      this._ast = parse(this._svg);
      this._update();
    },

    _update() {
      const variables = asObject(arrayFrom(this.attributes).map(
        (attribute) => ({key: attribute.name, value: attribute.value})
      ));

      patch(this._svg, this._ast, variables);
    },
  });

  doc.registerElement('parametric-svg', {prototype});
};
