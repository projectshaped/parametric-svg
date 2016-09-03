require('setimmediate');
  // This shims `setImmediate`

const spec = require('tape-catch');
const repeat = require('repeat-element');
const delay = require('timeout-as-promise');
const sinon = require('sinon');

const register = require('./register');

const waitForNextFrame = () => new Promise((resolve) => {
  requestAnimationFrame(resolve);
});

const recalculateCallback = sinon.spy();
register({ recalculateCallback });
  // This registers the <parametric-svg> thing on the actual `document`.

spec('Registers the <parametric-svg> element', (test) => {
  test.plan(7);

  const HTMLElement = () => {};
  const MutationObserver = () => {
    test.pass(
      'with a custom implementation of `MutationObserver`'
    );

    return {observe: () => {}};
  };

  const registerElement = (
    name, options
  ) => {
    const prototype = options.prototype;
    const extendsArg = options.extends || null;

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

    options.prototype.createdCallback.apply({
      querySelector: () => {},
    });
  };

  register({document: {registerElement}, HTMLElement, MutationObserver});
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

spec('Allows dynamic changes to attributes', (test) => {
  test.plan(1);

  document.body.innerHTML = `
    <parametric-svg l="50">
      <svg>
        <rect parametric:x="l" />
      </svg>
    </parametric-svg>
  `;
  const rect = document.querySelector('rect');

  delay(100).then(() => {
    rect.setAttribute('parametric:x', '2 * l');
  }).then(() => {
    test.equal(
      rect.getAttribute('x'),
      '100',
      'changing attributes'
    );
  });
});

spec('Allows dynamic changes to DOM tree', (test) => {
  test.plan(1);

  document.body.innerHTML = `
    <parametric-svg l="50">
      <svg>
        <rect parametric:x="l" />
      </svg>
    </parametric-svg>
  `;
  const svg = document.querySelector('svg');

  delay(100).then(() => {
    const circle =
      document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('parametric:r', 'l');
    svg.appendChild(circle);

    return delay(100, {circle});
  }).then(({circle}) => {
    test.equal(
      circle.getAttribute('r'),
      '50',
      'adding elements'
    );
  });
});

spec('Works in a DOM structure built up programatically', (test) => {
  test.plan(4);

  setTimeout(() => {
    // For reliable, consistent results this spec must fire after the initial
    // render.

    const parametricSvg = document.createElement('parametric-svg');
    const svg = document.createElement('svg');
    const circle = document.createElement('circle');
    svg.appendChild(circle);
    parametricSvg.appendChild(svg);

    circle.setAttribute('r', '5');
    circle.setAttribute('cx', '0');
    circle.setAttribute('parametric:r', '2 * (3 + 5)');
    setImmediate(() => {
      circle.setAttribute('parametric:cx', '3 * 3');
    });

    test.equal(
      circle.getAttribute('r'),
      '5',
      'updates asynchronously'
    );

    waitForNextFrame().then(() => {
      test.equal(
        circle.getAttribute('r'),
        String(2 * (3 + 5)),
        'within a single animation frame'
      );

      test.equal(
        circle.getAttribute('cx'),
        '0',
        'throttles other updates'
      );

      return waitForNextFrame();
    }).then(() => {
      test.equal(
        circle.getAttribute('cx'),
        String(3 * 3),
        'and applies them in the next animation frame'
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
  test.plan(5);

  document.body.innerHTML = `
    <parametric-svg>
      <svg>
        <rect parametric:x="a" parametric:y="b" />
      </svg>
    </parametric-svg>
  `;

  recalculateCallback.reset();

  const rect = document.body.querySelector('rect');
  const parametricSvg = document.body.querySelector('parametric-svg');

  waitForNextFrame().then(() => {
    parametricSvg.setAttribute('a', '5');
    test.equal(
      rect.getAttribute('x'),
      '5',
      'updates parametric attributes synchronously'
    );

    return waitForNextFrame();
  }).then(() => {
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

    return waitForNextFrame();
  }).then(() => {
    test.equal(
      recalculateCallback.callCount,
      0,
      'does it efficiently, without reparsing the DOM tree'
    );
  });
});

spec('Supports different types of values', (test) => {
  document.body.innerHTML = `
    <parametric-svg>
      <svg>
        <rect
          parametric:x="left"
          parametric:y="down ? 10 : -10"
          parametric:fill="color"
        />
      </svg>
    </parametric-svg>
  `;

  const rect = document.body.querySelector('rect');
  const parametricSvg = document.body.querySelector('parametric-svg');

  parametricSvg.setAttribute('left', '5');
  test.equal(
    rect.getAttribute('x'),
    '5',
    'numbers'
  );

  parametricSvg.setAttribute('down', 'false');
  test.equal(
    rect.getAttribute('y'),
    '-10',
    'booleans'
  );

  parametricSvg.setAttribute('color', '`green`');
  test.equal(
    rect.getAttribute('fill'),
    'green',
    'strings'
  );

  test.end();
});

spec((
  'Doesn’t crash when setting an attribute when no <svg> is inside'
), (test) => {
  const parametricSvg = document.createElement('parametric-svg');
  parametricSvg.setAttribute('class', 'whatever');
  test.pass(
    'doesn’t throw an error'
  );
  test.end();
});
