{
  function flattenItem (previous, item) {
    return previous.concat(item);
  }

  function flatten(value) {
    if (!(value instanceof Array)) return value;
    return value.reduce(flattenItem, []);
  }
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
