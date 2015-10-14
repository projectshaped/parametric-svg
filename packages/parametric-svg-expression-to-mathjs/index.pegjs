{ var flatten = require('flatten');
}

start
  = expression

expression
  = nonStringCharacters:[^`]+
    { return 'string(' + nonStringCharacters.join('') + ')';
    }
  / string

string
  = '`'
    head: rawString
    tail: ( templateStringExpression rawString )*
    '`'
    { return (tail.length ?
      'concat(' + flatten([head, tail]).join(', ') + ')' :
      head
      );
    }

rawString
  = content: ( ( [^$\\`"\n\r] / escapeSequence / illegalCharacter )* )
    { return '"' + flatten(content).join('') + '"'
    }

escapeSequence
  = sequence:('\\$' / '\\`' / '\\\\')
    { return sequence.charAt(1);
    }

illegalCharacter
  = '"' { return '\\"'; }
  / '\n' { return '\\n'; }
  / '\r' { return '\\r'; }

templateStringExpression
  = '${'
    expression: expression
    '}'
    { return expression;
    }
