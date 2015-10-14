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
  = '`'
    ( singlePart: ( rawString / templateStringExpression )
    / parts: ( ( rawString / templateStringExpression )+ )
    )
    '`'
    { return (
        singlePart ||
        'concat(' + flatten(parts).join(', ') + ')'
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
  = '${' '}'
