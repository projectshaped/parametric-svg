import ast from './module';

const test = require('tape-catch');
const Set = require('es6-set');

test('Returns an object of the right shape', (is) => {
  const [attributes, defaults] = [[], []];

  is.equal(
    ast({attributes, defaults}).type,
    'ParametricSvgAst',
    'with the `type` property of the right value'
  );

  is.equal(
    ast({attributes, defaults}).version,
    1,
    'with the `version` property of the right value'
  );

  is.equal(
    ast({attributes, defaults}).attributes.constructor,
    Set,
    'with a `attributes: Set` property'
  );

  is.equal(
    ast({attributes, defaults}).defaults.constructor,
    Set,
    'with a `defaults: Set` property'
  );

  is.end();
});

test('Returns correct `.attributes`', (is) => {
  const defaults = [];

  is.equal(
    ast({attributes: [], defaults}).attributes.size,
    0,
    'of zero size for an empty array'
  );

  const attributes = [
    {address: [0],        name: 'a', dependencies: [], relation: () => {}},
    {address: [14],       name: 'a', dependencies: [], relation: () => {}},
    {address: [2, 7, 3],  name: 'a', dependencies: [], relation: () => {}},
    {address: [3, 4],     name: 'a', dependencies: [], relation: () => {}},
  ];

  is.equal(
    ast(
      {attributes, defaults}
    ).attributes.size,
    4,
    'of size `4` for an array of four attributes'
  );

  is.equal(
    ast(
      {attributes: new Set(attributes), defaults}
    ).attributes.size,
    4,
    'of size `4` for a set of four attributes'
  );

  is.end();
});

test('Returns correct `.defaults`', (is) => {
  const attributes = [];

  is.equal(
    ast({attributes, defaults: []}).defaults.size,
    0,
    'of zero size for an empty array'
  );

  const defaults = [
    {identifier: 'a', dependencies: [], relation: () => {}},
    {identifier: 'b', dependencies: [], relation: () => {}},
    {identifier: 'c', dependencies: [], relation: () => {}},
    {identifier: 'd', dependencies: [], relation: () => {}},
  ];

  is.equal(
    ast(
      {attributes, defaults}
    ).defaults.size,
    4,
    'of size `4` for an array of four defaults'
  );

  is.equal(
    ast(
      {attributes, defaults: new Set(defaults)}
    ).defaults.size,
    4,
    'of size `4` for a set of four defaults'
  );

  is.end();
});

test('Enforces types to some extent', (is) => {
  is.throws(
    () => ast(),
    TypeError,
    'fails with a helpful message if called without arguments'
  );

  is.throws(
    () => ast({attributes: {}}),
    TypeError,
    'fails with a helpful message if `attributes` isn’t iterable'
  );

  is.throws(
    () => ast({defaults: {}}),
    TypeError,
    'fails with a helpful message if `defaults` isn’t iterable'
  );

  is.end();
});
