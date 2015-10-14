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
  = ([^$\\`] / escapeSequence)*

escapeSequence
  = sequence:('\\$' / '\\`' / '\\\\')
    { return sequence.charAt(1);
    }

templateStringExpression
  = '${' '}'
