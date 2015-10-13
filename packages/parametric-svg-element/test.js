import './module';
  // This registers the <parametric-svg> thing on the actual `document`.

import register from './module/register';

const spec = require('tape-catch');
const repeat = require('repeat-element');

spec('Registers the <parametric-svg> element', (test) => {
  test.plan(6);

  const HTMLElement = () => {};

  const registerElement = (
    name, {prototype, extends: extendsArg = null}
  ) => {
    test.pass(
      'taking a custom implementation of `document`'
    );

    test.equal(
      name,
      'parametric-svg',
      'under the name <parametric-svg>'
    );

    test.equal(
      extendsArg,
      null,
      'as a standard HTML element – no bells and whistles'
    );

    test.equal(
      prototype.constructor,
      HTMLElement,
      'inheriting from the given `HTMLElement`'
    );

    test.equal(
      typeof prototype.createdCallback,
      'function',
      'attaching stuff to the createdCallback…'
    );

    test.deepEqual(
      [
        prototype.attachedCallback,
        prototype.detachedCallback,
        prototype.atributeChangedCallback,
      ],
      repeat(undefined, 3),
      '…and to no other lifecycle callback'
    );
  };

  register({document: {registerElement}, HTMLElement});
});

spec('Works in a DOM structure created in one go', (test) => {
  test.plan(1);

  document.body.innerHTML = `
    <parametric-svg>
      <svg>
        <rect parametric:x="50" />
      </svg>
    </parametric-svg>
  `;

  const rect = document.body.querySelector('rect');
  test.equal(
    rect.getAttribute('x'),
    '50',
    'synchronously'
  );
});

spec('Works in a DOM structure built up programatically', (test) => {
  test.plan(2);

  setTimeout(() => {
    // For reliable, consistent results this spec must fire after the initial
    // render.

    const parametricSvg = document.createElement('parametric-svg');
    const svg = document.createElement('svg');
    const circle = document.createElement('circle');
    svg.appendChild(circle);
    parametricSvg.appendChild(svg);

    circle.setAttribute('r', '5');
    circle.setAttribute('parametric:r', '2 * (3 + 5)');

    test.equal(
      circle.getAttribute('r'),
      '5',
      'updates asynchronously'
    );

    requestAnimationFrame(() => {
      test.equal(
        circle.getAttribute('r'),
        String(2 * (3 + 5)),
        'within a single animation frame'
      );
    });
  });
});

spec('Only affects the first child SVG', (test) => {
  test.plan(2);

  document.body.innerHTML = `
    <parametric-svg>
      <svg>
      </svg>

      <svg>
        <rect parametric:x="50" />
      </svg>

      <div><svg>
          <circle parametric:r="70" r="5" />
      </svg></div>
    </parametric-svg>
  `;

  const rect = document.body.querySelector('rect');

  test.equal(
    rect.getAttribute('x'),
    null,
    'leaves a second child untouched'
  );

  const circle = document.body.querySelector('circle');
  test.equal(
    circle.getAttribute('r'),
    '5',
    'leaves another nested child untouched'
  );
});

spec('Works with a nested SVG', (test) => {
  test.plan(1);

  document.body.innerHTML = `
    <parametric-svg>
      <div>
        <svg>
          <rect parametric:x="5 / 5" />
        </svg>
      </div>
    </parametric-svg>
  `;

  const rect = document.body.querySelector('rect');
  test.equal(
    rect.getAttribute('x'),
    String(5 / 5),
    'nested one level deep'
  );
});

spec('Warns when no <svg> is inside', (test) => {
  test.plan(1);

  const HTMLElement = {prototype: {
    querySelector: (selector) => (selector === 'svg' ? null : {}),
  }};

  const document = {
    registerElement: (_, {prototype}) => prototype.createdCallback(),
  };

  const logger = {warn(message) {
    test.ok(
      /couldn’t find/i.test(message),
      'prints a helpful warning'
    );
  }};

  register({document, HTMLElement, logger});
});

spec('Supports variables', (test) => {
  test.plan(1);

  document.body.innerHTML = `
    <parametric-svg
      a="2"
      b="50"
      >
      <svg>
        <rect parametric:x="b / a" />
      </svg>
    </parametric-svg>
  `;

  const rect = document.body.querySelector('rect');
  test.equal(
    rect.getAttribute('x'),
    String(50 / 2),
    'passes multiple variables in the right order'
  );
});

spec('Only updates a parameter when all variables are defined', (test) => {
  test.plan(3);

  document.body.innerHTML = `
    <parametric-svg
      a="2"
      >
      <svg>
        <circle parametric:r="a + b" r="5" />
        <ellipse parametric:fill="c" />
        <rect parametric:x="a" />
      </svg>
    </parametric-svg>
  `;

  const circle = document.body.querySelector('circle');
  test.equal(
    circle.getAttribute('r'),
    '5',
    'doesn’t update an attribute when its dependencies aren’t satisfied'
  );

  const ellipse = document.body.querySelector('ellipse');
  test.equal(
    ellipse.getAttribute('fill'),
    null,
    'doesn’t create an attribute when its dependencies aren’t satisfied'
  );

  const rect = document.body.querySelector('rect');
  test.equal(
    rect.getAttribute('x'),
    '2',
    'updates another attribute with satisfied dependencies'
  );
});

spec('Updates variables dynamically', (test) => {
  test.plan(4);

  document.body.innerHTML = `
    <parametric-svg>
      <svg>
        <rect parametric:x="a" parametric:y="b" />
      </svg>
    </parametric-svg>
  `;

  const rect = document.body.querySelector('rect');
  const parametricSvg = document.body.querySelector('parametric-svg');

  parametricSvg.setAttribute('a', '5');
  test.equal(
    rect.getAttribute('x'),
    '5',
    'updates parametric attributes synchronously'
  );

  parametricSvg.setAttribute('a', '15');
  test.equal(
    rect.getAttribute('x'),
    '15',
    'does it repeatedly'
  );

  parametricSvg.removeAttribute('a');
  parametricSvg.setAttribute('b', '8');
  test.equal(
    rect.getAttribute('x'),
    '15',
    'leaves an attribute as it when a dependency is removed'
  );

  test.equal(
    rect.getAttribute('y'),
    '8',
    'but updates other attributes even so'
  );
});
