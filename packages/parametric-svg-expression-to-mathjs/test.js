const spec = require('tape-catch');
const parse = require('.').parse;

spec('Mathematical expressions', (test) => {
  test.equal(
    parse('2 * (3 + 4)'),
    'string(2 * (3 + 4))',
    'parentheses'
  );

  test.equal(
    parse('max(2, 1, 5)'),
    'string(max(2, 1, 5))',
    'parameter separator'
  );

  test.equal(
    parse('4 + 5'),
    'string(4 + 5)',
    'add'
  );

  test.equal(
    parse('7 - 3'),
    'string(7 - 3)',
    'subtract'
  );

  test.equal(
    parse('-4'),
    'string(-4)',
    'unary minus'
  );

  test.equal(
    parse('2 * 3'),
    'string(2 * 3)',
    'multiply'
  );

  test.equal(
    parse('6 / 2'),
    'string(6 / 2)',
    'divide'
  );

  test.equal(
    parse('8 % 3'),
    'string(8 % 3)',
    'modulus'
  );

  test.equal(
    parse('2 ^ 3'),
    'string(2 ^ 3)',
    'power'
  );

  test.equal(
    parse('5!'),
    'string(5!)',
    'factorial'
  );

  test.equal(
    parse('true and false ? 1 : 0'),
    'string(true and false ? 1 : 0)',
    'logical and'
  );

  test.equal(
    parse('not true ? 1 : 0'),
    'string(not true ? 1 : 0)',
    'logical not'
  );

  test.equal(
    parse('true or false ? 1 : 0'),
    'string(true or false ? 1 : 0)',
    'logical or'
  );

  test.equal(
    parse('true xor true ? 1 : 0'),
    'string(true xor true ? 1 : 0)',
    'logical xor'
  );

  test.equal(
    parse('false ? 1 : -1'),
    'string(false ? 1 : -1)',
    'conditional expression'
  );

  test.equal(
    parse('2 == 4 - 2 ? 1 : 0'),
    'string(2 == 4 - 2 ? 1 : 0)',
    'equal'
  );

  test.equal(
    parse('2 != 3 ? 1 : 0'),
    'string(2 != 3 ? 1 : 0)',
    'unequal'
  );

  test.equal(
    parse('2 < 3 ? 1 : 0'),
    'string(2 < 3 ? 1 : 0)',
    'smaller'
  );

  test.equal(
    parse('2 > 3 ? 1 : 0'),
    'string(2 > 3 ? 1 : 0)',
    'larger'
  );

  test.equal(
    parse('4 <= 3 ? 1 : 0'),
    'string(4 <= 3 ? 1 : 0)',
    'smallereq'
  );

  test.equal(
    parse('2 + 4 >= 6 ? 1 : 0'),
    'string(2 + 4 >= 6 ? 1 : 0)',
    'largereq'
  );

  test.end();
});

spec('Simple strings', (test) => {
  test.equal(
    parse('`green`'),
    '"green"',
    'very simple'
  );

  test.equal(
    parse('`"\'\\``'),
    '"\\"\'`"',
    'quotes'
  );

  test.equal(
    parse('`\\\\\\`\\$`'),
    '"\\`$"',
    'escapes'
  );

  test.equal(
    parse('`ab\n  cd\t  ef\r`'),
    '"ab\\n  cd\t  ef\\r"',
    'whitespace'
  );

  test.end();
});

spec('Template strings', (test) => {
  test.equal(
    '`1 + 2 = ${3}`',
    'concat("1 + 2 = ", string(3))',
    'simple number'
  );

  test.equal(
    '`${3} = 1 + 2`',
    'concat(string(3), " = 1 + 2")',
    'expression at the beginning'
  );

  test.equal(
    '`1 + 2 = ${1 + 2}`',
    'concat("1 + 2 = ", string(1 + 2))',
    'simple expression'
  );

  test.equal(
    '`(1 + 2) * 3 = ${(1 + 2) * 3}`',
    'concat("(1 + 2) * 3 = ", string((1 + 2) * 3))',
    'complex expression'
  );

  test.equal(
    '`string ${`string`}`',
    'concat("string ", "string")',
    'simple string'
  );

  test.equal(
    '`deeply ${`nested ${`template ${100}`}`}`',
    'concat("deeply ", concat("nested ", concat("template", 100)))',
    'deeply nested template string'
  );

  test.equal(
    '`escaped \\${ template ${`string`} }.`',
    'concat("escaped ${ template ", "string", " }.")',
    'escaped template string'
  );

  test.end();
});
