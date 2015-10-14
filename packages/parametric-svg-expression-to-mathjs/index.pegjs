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
    { console.log(flatten(stringContent));
      return '"' + flatten(stringContent).join('') + '"'
    }

rawString
  = ([^$`] / '\\$' / '\\`')*

templateStringExpression
  = '${' '}'
