(function () {
    $L.snippets.registerLanguage('text', {
        tokenConfig: [
            {
                "token": "url",
                "class": "lyteUrl",
                "regex": /\bhttps?:\/\/[^\s\/$.?#].[^\s]*\b/
            },
            {
                "token": "text",
                "class": "lytePlainText",
                "regex": /\b[a-zA-Z\s.,!?'-]+\b/
            },
            {
                "token": "numbers",
                "class": "lyteNumbers",
                "regex": /\b\d+\b/
            },
            {
                "token": "symbols",
                "class": "lyteSymbols",
                "regex": /[\`\~\!\@\#\$\%\^\&\*\(\)\_\+-\=\[\]\\\{\}\|\;\'\:\"\,\.\/\<\>\?]/
            }
        ]
    });
})();
