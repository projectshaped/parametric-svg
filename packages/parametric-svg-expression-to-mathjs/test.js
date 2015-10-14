const spec = require('tape-catch');
const parse = require('.').parse;

spec('Mathematical expressions', (test) => {
  test.equal(
    parse('2 * (3 + 4)'),
    'string(2 * (3 + 4))',
    'Parentheses	'
  );

  test.equal(
    parse('max(2, 1, 5)'),
    'string(max(2, 1, 5))',
    'Parameter separator'
  );

  test.equal(
    parse('4 + 5'),
    'string(4 + 5)',
    'Add'
  );

  test.equal(
    parse('7 - 3'),
    'string(7 - 3)',
    'Subtract'
  );

  test.equal(
    parse('-4	'),
    'string(-4	)',
    'Unary minus'
  );

  test.equal(
    parse('2 * 3'),
    'string(2 * 3)',
    'Multiply'
  );

  test.equal(
    parse('6 / 2'),
    'string(6 / 2)',
    'Divide'
  );

  test.equal(
    parse('8 % 3'),
    'string(8 % 3)',
    'Modulus'
  );

  test.equal(
    parse('2 ^ 3'),
    'string(2 ^ 3)',
    'Power'
  );

  test.equal(
    parse('5!'),
    'string(5!)',
    'Factorial'
  );

  test.equal(
    parse('true and false ? 1 : 0'),
    'string(true and false ? 1 : 0)',
    'Logical and'
  );

  test.equal(
    parse('not true ? 1 : 0'),
    'string(not true ? 1 : 0)',
    'Logical not'
  );

  test.equal(
    parse('true or false ? 1 : 0'),
    'string(true or false ? 1 : 0)',
    'Logical or'
  );

  test.equal(
    parse('true xor true ? 1 : 0'),
    'string(true xor true ? 1 : 0)',
    'Logical xor'
  );

  test.equal(
    parse('false ? 1 : -1	'),
    'string(false ? 1 : -1	)',
    'Conditional expression'
  );

  test.equal(
    parse('2 == 4 - 2 ? 1 : 0'),
    'string(2 == 4 - 2 ? 1 : 0)',
    'Equal'
  );

  test.equal(
    parse('2 != 3 ? 1 : 0'),
    'string(2 != 3 ? 1 : 0)',
    'Unequal'
  );

  test.equal(
    parse('2 < 3 ? 1 : 0'),
    'string(2 < 3 ? 1 : 0)',
    'Smaller'
  );

  test.equal(
    parse('2 > 3 ? 1 : 0'),
    'string(2 > 3 ? 1 : 0)',
    'Larger'
  );

  test.equal(
    parse('4 <= 3 ? 1 : 0'),
    'string(4 <= 3 ? 1 : 0)',
    'Smallereq'
  );

  test.equal(
    parse('2 + 4 >= 6 ? 1 : 0'),
    'string(2 + 4 >= 6 ? 1 : 0)',
    'Largereq'
  );

  test.end();
});
