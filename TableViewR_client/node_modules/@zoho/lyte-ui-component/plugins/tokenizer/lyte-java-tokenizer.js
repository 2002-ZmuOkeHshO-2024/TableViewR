(function () {
	$L.snippets.registerLanguage('java', {
		tokenConfig: [
			{
				'token': 'keyword',
				'regex': /\b(?:abstract|boolean|break|byte|case|catch|char|class|continue|default|do|double|else|enum|extends|final|finally|float|for|if|implements|import|instanceof|int|interface|long|native|new|package|private|protected|public|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|transient|try|void|volatile|while|assert|const|goto)\b/,
				'class': 'lyteJavaKeyword'
			},
			{
				'token': 'utilClasses',
				'regex': /\b(Scanner|System|String|StringBuilder|Random|Integer|Math|Enum)\b/,
				'class': 'javaUtilClasses'
			},
			{
				'token': 'punctuator',
				'regex': /\-\>|\;|\,|\(|\)|\{|\}|\[|\]|\!|\&|\|/,
				// 'regex': /\-\>|\;|\,|\(|\)|\{|\}|\[|\]|\<|\>|\!|\&|\|/,
				'class': 'lyteJavaPunctuator'
			},
			{
				'token': 'operator',
				'regex': /\<|\>|\!|\<\<\=|\>\>\=|\^\=|\|\=|\&\=|\%\=|\/\=|\*\=|\-\=|\+\=|\|\||\&\&|\<\=|\>\=|\<|\>|\!\=|\=\=|\=|\-\-|\+\+|\%|\/|\*|\-|\+|\.|\:|\?/,
				'class': 'lyteJavaOperator'
			},
			{
				'token': 'identifier',
				'regex': /\b[a-zA-Z_][a-zA-Z0-9_]*\b/,
				'class': 'lyteJavaIdentifier'
			},
			{
				'token': 'string',
				'regex': /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/,
				'class': 'lyteJavaString'
			},
			{
				'token': 'number',
				'regex': /\b(0[xX][0-9a-fA-F]+|\d+)\b/,
				'class': 'lyteJavaInteger'
			},
			{
				'token': 'float',
				'regex': /\b\d+\.\d+\b/,
				'class': 'lyteJavaFloat'
			},
			{
				'token': 'boolean',
				'regex': /\b(?:true|false)\b/,
				'class': 'lyteJavaBoolean'
			},
			{
				'token': 'null',
				'regex': /\b(?:null)\b/,
				'class': 'lyteJavaNull'
			},
			{
				'token': 'whitespace',
				'regex': /\s+/
			},
			{
				'token': 'regex',
				'class': 'lyteJavaRegex',
				'regex': /\/(?![\/\*]).*?\//
			},
			{
				'token': 'comment',
				'class': 'lyteJavaComment',
				'regex': /\/\/[^\n]*|\/\*[\s\S]*?\*\//
			},
			{
				'token': 'annotations',
				'class': 'lyteJavaAnnotations',
				'regex': /@([A-Za-z]+(?:\.[A-Za-z]+)*)/
			},
			{
				'token': 'others',
				'regex': 'remaining',
				'class': 'lyteJavaRemaining'
			}

		]
	});
})();
