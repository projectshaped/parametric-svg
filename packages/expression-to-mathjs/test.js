const spec = require('tape-catch');
const parse = require('.').parse;

spec('Mathematical expressions', (test) => {
  test.equal(
    parse('2 * (3 + 4)'),
    'output(2 * (3 + 4))',
    'parentheses'
  );

  test.equal(
    parse('max(2, 1, 5)'),
    'output(max(2, 1, 5))',
    'parameter separator'
  );

  test.equal(
    parse('4 + 5'),
    'output(4 + 5)',
    'add'
  );

  test.equal(
    parse('7 - 3'),
    'output(7 - 3)',
    'subtract'
  );

  test.equal(
    parse('-4'),
    'output(-4)',
    'unary minus'
  );

  test.equal(
    parse('2 * 3'),
    'output(2 * 3)',
    'multiply'
  );

  test.equal(
    parse('6 / 2'),
    'output(6 / 2)',
    'divide'
  );

  test.equal(
    parse('8 % 3'),
    'output(8 % 3)',
    'modulus'
  );

  test.equal(
    parse('2 ^ 3'),
    'output(2 ^ 3)',
    'power'
  );

  test.equal(
    parse('5!'),
    'output(5!)',
    'factorial'
  );

  test.equal(
    parse('true and false ? 1 : 0'),
    'output(true and false ? 1 : 0)',
    'logical and'
  );

  test.equal(
    parse('not true ? 1 : 0'),
    'output(not true ? 1 : 0)',
    'logical not'
  );

  test.equal(
    parse('true or false ? 1 : 0'),
    'output(true or false ? 1 : 0)',
    'logical or'
  );

  test.equal(
    parse('true xor true ? 1 : 0'),
    'output(true xor true ? 1 : 0)',
    'logical xor'
  );

  test.equal(
    parse('false ? 1 : -1'),
    'output(false ? 1 : -1)',
    'conditional expression'
  );

  test.equal(
    parse('2 == 4 - 2 ? 1 : 0'),
    'output(2 == 4 - 2 ? 1 : 0)',
    'equal'
  );

  test.equal(
    parse('2 != 3 ? 1 : 0'),
    'output(2 != 3 ? 1 : 0)',
    'unequal'
  );

  test.equal(
    parse('2 < 3 ? 1 : 0'),
    'output(2 < 3 ? 1 : 0)',
    'smaller'
  );

  test.equal(
    parse('2 > 3 ? 1 : 0'),
    'output(2 > 3 ? 1 : 0)',
    'larger'
  );

  test.equal(
    parse('4 <= 3 ? 1 : 0'),
    'output(4 <= 3 ? 1 : 0)',
    'smallereq'
  );

  test.equal(
    parse('2 + 4 >= 6 ? 1 : 0'),
    'output(2 + 4 >= 6 ? 1 : 0)',
    'largereq'
  );

  test.end();
});

spec('Simple strings', (test) => {
  test.equal(
    parse('``'),
    '""',
    'empty string'
  );

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
    '"\\\\`$"',
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
    parse('`1 + 2 = ${3}`'),
    'concat("1 + 2 = ", output(3))',
    'simple number'
  );

  test.equal(
    parse('`${3} = 1 + 2`'),
    'concat(output(3), " = 1 + 2")',
    'expression at the beginning'
  );

  test.equal(
    parse('`1 + 2 = ${1 + 2}`'),
    'concat("1 + 2 = ", output(1 + 2))',
    'simple expression'
  );

  test.equal(
    parse('`(1 + 2) * 3 = ${(1 + 2) * 3}`'),
    'concat("(1 + 2) * 3 = ", output((1 + 2) * 3))',
    'complex expression'
  );

  test.equal(
    parse('`string ${`string`}`'),
    'concat("string ", "string")',
    'simple string'
  );

  test.equal(
    parse('`deeply ${`nested ${`template ${100}`}`}`'),
    'concat("deeply ", concat("nested ", concat("template ", output(100))))',
    'deeply nested template string'
  );

  test.equal(
    parse('`escaped \\${ template ${`string`} }.`'),
    'concat("escaped ${ template ", "string", " }.")',
    'escaped template string'
  );

  test.end();
});

spec('Combining types', (test) => {
  test.equal(
    parse('true ? `a` : 3'),
    'output(true ? "a" : 3)',
    'string and number in ternary'
  );

  test.equal(
    parse('true || false ? `a${5}` : 3'),
    'output(true || false ? concat("a", output(5)) : 3)',
    'template string in ternary'
  );

  test.equal(
    parse('`55` == `5${5}` or false ? 0 : 1'),
    'output("55" == concat("5", output(5)) or false ? 0 : 1)',
    'template strings in logical expression'
  );

  test.equal(
    parse('`I’m ${`black` == `white` ? `lying` : `telling the truth`}!`'),
    'concat("I’m ", output("black" == "white" ? "lying" : "telling the ' +
    'truth"), "!")',
    'ternary embedded in a template string'
  );

  test.end();
});
