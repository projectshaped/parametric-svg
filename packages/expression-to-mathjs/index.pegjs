{ var flatten = require('flatten');
  var dropNull = function(array) {
    return array.filter(function (item) { return item !== null; })
    };
  var squash = function(array) { return dropNull(flatten(array)); }
}

start
  = castToString

castToString
  = nonStringExpression: ( compoundExpression / nonString )
    { return 'string(' + nonStringExpression + ')';
    }
  / string

nonString
  = nonStringCharacters: [^`{}]+
    { return nonStringCharacters.join('');
    }

compoundExpression
  = parts:
    ( ( nonString ( string nonString? )+ )
    / ( string ( nonString string? )+ )
    )
    { return squash(parts).join('');
    }

string
  = '`'
    parts: ( rawString? ( templateStringExpression rawString? )* )
    '`'
    { var flatParts = squash(parts);
      return (
        ( flatParts.length === 1
        ? flatParts[0]
        : 'concat(' + flatParts.join(', ') + ')'
        ));
    }

rawString
  = content:
    ( [^$\\`"\n\r]
    / escapeSequence
    / illegalCharacter
    / escapedBackslash
    )+
    { return '"' + squash(content).join('') + '"'
    }

escapeSequence
  = sequence: ('\\$' / '\\`')
    { return sequence.charAt(1);
    }

escapedBackslash
  = '\\\\'

illegalCharacter
  = '"' { return '\\"'; }
  / '\n' { return '\\n'; }
  / '\r' { return '\\r'; }

templateStringExpression
  = '${'
    expression: castToString
    '}'
    { return expression;
    }
