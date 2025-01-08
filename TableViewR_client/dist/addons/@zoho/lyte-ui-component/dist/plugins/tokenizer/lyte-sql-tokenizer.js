(function () {
    $L.snippets.registerLanguage('sql', {
        tokenConfig: [
            {
                'token': 'comment',
                'class': 'sqlComment',
                'regex': /(\-\-.*|\/\*[\s\S]*?\*\/)/
            },
            {
                'token': 'keyword',
                // 'regex': /\b(?:from|join|on|where|and|or|not|order|group|by|having|table|index|view|database|primary|key|foreign|references|into|values|as|between|in|like|distinct|top|limit|null|add|constraint|asc|case|check|backup|column|any|all|replace|procedure|full|outer|inner|right|left|join|exec|exists|default|desc|truncate|union|unique|rownum|is|unsigned|show|warnings|cast|interval)\b/i,
                'regex': /\b(?:select|insert|update|delete|from|join|on|where|and|or|not|order|group|by|having|alter|drop|table|index|view|database|primary|with|key|foreign|references|into|values|as|between|in|like|set|distinct|top|limit|null|add|constraint|asc|create|case|check|backup|column|any|all|replace|procedure|full|outer|inner|right|left|join|exec|exists|default|desc|truncate|union|unique|rownum|is|unsigned|show|warnings|cast|interval|cancel)\b/i,
                // 'regex': /\b(?:select|insert|update|delete|from|join|on|where|and|or|not|order|group|by|having|crete|alter|drop|table|index|view|database|primary|key|foreign|references|into|values|set|as|between|in|like|distinct|top|limit|null|decimal|int|varchar)\b/i,
                'class': 'sqlKeyword'
            },
            // https://dev.mysql.com/doc/refman/8.0/en/data-types.html
            {
                'token': 'dataType',
                'regex': /\b(?:bit|tinyint|bool|boolean|smallint|mediumint|int|integer|bigint|decimal|dec|float|double|precision|date|datetime|timestamp|time|year|character set||char|varchar|binary|varbinary|enum|json)\b/i,
                'class': 'sqlDataTypes'
            },
            {
                'token': 'punctuator',
                'regex': /\(|\)|\[|\]|"|'|;|,|:|\\/,
                'class': 'sqlPunctuator'
            },
            {
                'token': 'operator',
                'regex': /\=|<>|!=|>|<|>=|<=|&|\||\^|~|\.|<<|>>|\+|\-|\*|\/|%/,
                'class': 'sqlOperator'
            },
            {
                'token': 'identifier',
                // matches a.b
                // 'regex': /\b[a-zA-Z_][a-zA-Z0-9_\.]*(?![.\w])\b/,
                'regex': /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\.[a-zA-Z_])|\b[a-zA-Z_][a-zA-Z0-9_]*\b/,
                // works fine
                // 'regex': /\b[a-zA-Z_][a-zA-Z0-9_]*(?![.\w])\b/,
                'class': 'sqlIdentifier'
            },
            {
                'token': 'delimiters',
                'regex': /\?|~>|~<|~=|@/,
                'class': 'sqlDelimiters'
            },
            {
                'token': 'integer',
                'regex': /(?:0[xX][0-9a-fA-F]+|0[oO]?[0-7]+|0[bB][01]+|\d+)/,
                'class': 'sqlInteger'
            },
            {
                'token': 'decimal',
                'regex': /\b(-?\d+(\.\d+)?)\b/,
                'class': 'sqlDecimal'
            },
            {
                'token': 'string',
                'regex': /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/,
                'class': 'sqlString'
            },
            {
                'token': 'whitespace',
                'regex': /\s+/,
                'class': 'sqlWhitespace'
            }
        ]
    });
})();
