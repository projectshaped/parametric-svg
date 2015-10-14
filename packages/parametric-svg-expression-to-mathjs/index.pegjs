{ var flatten = require('flatten');
  var dropNull = function(array) {
    return array.filter(function (item) { return item !== null; })
    }
  ;
}

start
  = expression

expression
  = nonStringCharacters: [^`{}]+
    { return 'string(' + nonStringCharacters.join('') + ')';
    }
  / string

string
  = '`'
    parts: ( rawString? ( templateStringExpression rawString? )* )
    '`'
    { var flatParts = dropNull(flatten(parts));
      return (flatParts.length === 1 ?
        flatParts[0] :
        'concat(' + flatParts.join(', ') + ')'
        )
      ;
    }

rawString
  = content: ( ( [^$\\`"\n\r] / escapeSequence / illegalCharacter )+ )
    { return '"' + flatten(content).join('') + '"'
    }

escapeSequence
  = sequence: ('\\$' / '\\`' / '\\\\')
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
