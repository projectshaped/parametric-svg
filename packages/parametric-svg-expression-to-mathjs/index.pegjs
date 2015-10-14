{
  var flatten = require('flatten');
}

start
  = expression

expression
  = nonStringCharacters:[^`]+
    { return 'string(' + nonStringCharacters.join('') + ')';
    }
  / string

string
  = '`' stringContent:(rawString ( templateStringExpression rawString )*) '`'
    { return '"' + flatten(stringContent).join('') + '"'
    }

rawString
  = ([^$\\`"\n\r] / escapeSequence / illegalCharacter)*

escapeSequence
  = sequence:('\\$' / '\\`' / '\\\\')
    { return sequence.charAt(1);
    }

illegalCharacter
  = '"' { return '\\"'; }
  / '\n' { return '\\n'; }
  / '\r' { return '\\r'; }

templateStringExpression
  = '${' '}'
