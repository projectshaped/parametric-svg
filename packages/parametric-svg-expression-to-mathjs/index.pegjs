{ var flatten = require('flatten');
  var dropNull = function(array) {
    return array.filter(function (item) { return item !== null; })
    }
  ;
}

start
  = castToString

castToString
  = string
  / nonStringExpression: ( nonString / compoundExpression )
    { return 'string(' + nonStringExpression + ')';
    }

nonString
  = nonStringCharacters: [^`{}]+
    { return nonStringCharacters.join('');
    }

compoundExpression
  = parts: ( nonString? ( string nonString? )* )
  { return dropNull(flatten(parts)).join('');
  }

string
  = '`'
    parts: ( rawString? ( templateStringExpression rawString? )* )
    '`'
    { var flatParts = dropNull(flatten(parts));
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
    { return '"' + flatten(content).join('') + '"'
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
