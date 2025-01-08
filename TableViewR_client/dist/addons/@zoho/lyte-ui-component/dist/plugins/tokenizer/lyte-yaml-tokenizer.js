(function () {
    $L.snippets.registerLanguage('yaml', {
        tokenConfig: [
            {
                'token': 'punctuator',
                'regex': /---|<<:|\.\.\.|-|:|,|\&|\*|\!\!|\%|\||>|{|}|\[|\]/,
                'class': 'lyteYamlPunctuator'
            },
            {
                'token': 'identifier',
                'regex': /[a-zA-Z_][\w.,-]*/,
                'class': 'lyteYamlIdentifier'
            },
            {
                'token': 'key',
                'regex': /^(['"]?[a-zA-Z0-9_-]+['"]?):|^'([^']+)':|^"([^"]+)":/,
                'class': 'lyteYamlKey'
            },
            {
                'token': 'string',
                'regex': /('[^']*'|"[^"]*"|'''.*?'''|""".*?""")/,
                'class': 'lyteYamlString'
            },
            {
                'token': 'integer',
                'regex': /(?:0[xX][0-9a-fA-F]+|0[oO]?[0-7]+|0[bB][01]+|\d+)/,
                'class': 'lyteYamlInteger'
            },
            {
                'token': 'dataType',
                'regex': /!!\w+(:[\w-]+)?/,
                'class': 'lyteYamlDataType'
            },
            {
                'group': 'anchor',
                'regex': /&([a-zA-Z_][a-zA-Z0-9_-]*)/,
                'matched-elements': [
                    {
                        'token': 'anchor-punctuation',
                        'regex': /&/,
                        'class': 'lyteYamlAnchorPunctuationCls'
                    },
                    {
                        'token': 'anchor-name',
                        'regex': /([a-zA-Z_][a-zA-Z0-9_-]*)/,
                        'class': 'lyteYamlAnchorNameCls'
                    }
                ]
            },
            {
                'group': 'alias',
                'regex': /\*([a-zA-Z_][a-zA-Z0-9_-]*)/,
                'matched-elements': [
                    {
                        'token': 'alias-punctuation',
                        'regex': /\*/,
                        'class': 'lyteYamlAliasPunctuationCls'
                    },
                    {
                        'token': 'anchor-name',
                        'regex': /([a-zA-Z_][a-zA-Z0-9_-]*)/,
                        'class': 'lyteYamlAliasNameCls'
                    }
                ]
            },
            {
                'token': 'whitespace',
                'regex': /\s+/
            },
            {
                'token': 'comment',
                'class': 'lyteYamlComment',
                'regex': /#.*/
            }
        ]
    });
})();