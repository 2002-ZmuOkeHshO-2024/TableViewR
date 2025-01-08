(function () {
	$L.snippets.registerLanguage('python', {
		tokenConfig: [
			{
				'token': 'keyword',
				'regex': /\b(?:as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|is|lambda|nonlocal|pass|raise|return|try|while|with|yield|float|id|int|len|max|min|pow|range|round|str|type|bytearray|print)\b/,
				'class': 'lytePythonKeyword'
			},
			{
				'token': 'punctuator',
				'regex': /\(|\)|\[|\]|\{|\}|;|,|:|\\/,
				'class': 'lytePythonPunctuator'
			},
			{
				'token': 'operator',
				'regex': /\*\*\=|\/\/\=|\*\*|\/\/|\=\=|\!\=|\<\=|\>\=|\=|\+\=|\-\=|\*\=|\/\=|\%\=|\&|and|or|not|@|\&|\||\^|\~|\<\<|\>\>|in|not|\.|\+|\-|\*|\/|\%|\<|\>/,
				'class': 'lytePythonOperator'
			},
			{
				'token': 'identifier',
				'regex': /[a-zA-Z_]\w*/,
				'class': 'lytePythonIdentifier'
			},
			{
				'token': 'string',
				'regex': /('[^']*'|"[^"]*"|'''.*?'''|""".*?""")/,
				'class': 'lytePythonString'
			},
			{
				'token': 'integer',
				'regex': /(?:0[xX][0-9a-fA-F]+|0[oO]?[0-7]+|0[bB][01]+|\d+)/,
				'class': 'lytePythonInteger'
			},
			{
				'token': 'float',
				'regex': /(?:\b|-)(\d+\.\d+|\.\d+|\d+\.\d*[eE][+-]?\d+|\d+[eE][+-]?\d+)\b/,
				'class': 'lytePythonFloat'
			},
			{
				'token': 'byte',
				'regex': /b['"]([^'"]*)['"]/,
				'class': 'lytePythonByte'
			},
			{
				'token': 'boolean',
				'regex': /\b(?:True|False)\b/,
				'class': 'lytePythonBoolean'
			},
			{
				'token': 'none',
				'regex': /\b(?:None)\b/,
				'class': 'lytePythonNone'
			},
			{
				'token': 'whitespace',
				'regex': /\s+/
			},
			{
				'token': 'regex',
				'class': 'lytePythonRegex',
				'regex': /\/(?![\/\*]).*?\//
			},
			{
				'token': 'comment',
				'class': 'lytePythonComment',
				'regex': /#.*|(['"]{3}[\s\S]*?['"]{3})/
			},
			{
				'token': 'others',
				'regex': 'remaining',
				'class': 'lytePythonRemaining'
			}

		]
	});
})();
