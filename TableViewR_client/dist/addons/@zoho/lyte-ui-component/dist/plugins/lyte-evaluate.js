;( function(window){
    if( window.$L ){
        var rank = {
            '=': 0, '+': 1, '-': 1, '/': 2, '*': 2, '~': 6, 'N': 5, '^': 5, 'E': 4, 's': 7, 'c': 7, 't': 7, 'l': 7, 'S': 7, 'C': 7, 'T': 7, 'L': 7, 'i': 7, 'o': 7
            , 'a': 7, 'I': 7, 'O': 7, 'A': 7, 'G': 7, 'Q': 7, '%': 3, '!': 3
        }
        function isOperator( value ) {
            if (value.match(/^[+|\-|/|*|^|~|N|s|c|t|l|S|C|T|!|%|(|L|)|i|o|a|I|O|A|E|G|Q]+$/)) {
                return true;
            }
            return false;
        }
        function isOneMath( value ) {
            if (value.match(/^[s|c|t|l|S|C|T|(|L|i|o|a|I|O|A|Q|~]+$/)) {
                return true;
            }
            return false;
        }
        function convertToPiandRoot( input ) {
            var root = String.fromCharCode(parseInt('221A', 16));
            var pi = String.fromCharCode(parseInt('03C0', 16));
            var re = new RegExp(pi, 'g');
            input = input.replace(re, "p");
            re = new RegExp(root, 'g');
            input = input.replace(re, "N");
            return input;
        }
        function  convertequation( input ) {
            var newStr = convertToPiandRoot( input ).trim();
            var map = {
                "\\s+": " ",
                "sqrt": "Q",
                "logy": "G",
                "arcsinh" : "I",
                "arccosh" : "O",
                "arctanh" : "A",
                "arcsin" : "i",
                "arccos" : "o",
                "arctan" : "a",
                "log": "l" ,
                "sinh" : "S",
                "cosh" : "C",
                "tanh" : "T",
                "sin" : "s",
                "cos" : "c",
                "tan" : "t",
                "Rand" :  "R",
                "ln" : "L"
            }
            var keys = Object.keys(map)
            keys.forEach( key => {
                newStr = newStr.replace(key, map[key])
            });
           
            return newStr;
        }
        function postfix( expression ) {
            
            var  result = [], stack = [], j = 0;
            if (expression.length === 1) {
                return expression;
            }
            for (var i = 0; i < expression.length; i++) {
                var ch = expression[i];
                if (!isOperator(ch)) {
                    result[j] = ch; j++;
                }
                else {
                    if (ch === '(') {
                        stack.push(ch);
                    }
                    else {
                        if (ch === ')') {
                            var lastCh;
                            do {
                                lastCh = stack[stack.length - 1][0];
                                if (lastCh !== '(') {
                                    result[j] = stack[stack.length - 1]; j++;
                                }
                                stack.pop();
                            } while (lastCh !== '(');
                        }
                        else {
                            while (stack.length !== 0 && rank[stack[stack.length - 1] + ""] >= rank[ch + ""]) {
                                result[j] = stack.pop(); j++;
                            }
                            stack.push(ch);
                        }
                    }
                }
            }
            while (stack.length != 0) {
    
                result[j] = stack.pop(); j++;
    
    
            }
            return result;
        }
        function standardizeString( input ) {
            var newString = '', openBracketLen = 0, closeBracketLen= 0;
            input = convertequation(input);
            openBracketLen = input.split("(").length;
            closeBracketLen = input.split(")").length;
            if (closeBracketLen > openBracketLen) {
                return null;
            }
            for (var i = 0; i < (openBracketLen - closeBracketLen); i++) {
                input += ')';
            }
            for (var i = 0; i < input.length; i++) {
                if (i > 0 && isOneMath(input[i]) && (input[i - 1] == ')' || input[i - 1].match(/^[\d|\.|!|%|p|R|e]$/))) {
                    newString = newString + "*";
                }
                if ((i === 0 || (i > 0 && !input[i - 1].match(/^[\d|\.|%|!]$/))) && input[i] === '-' && input[i + 1] && ( input[i + 1].match(/^[\d|\.]$/) || input[i + 1] === 'R' || input[i + 1] === 'e' || input[i + 1] === 'p' || input[i + 1] === '(' || isOneMath(input[i + 1]))) {
                    newString = newString + "~";
                }
                else if ((i === 0 || (i > 0 && input[i - 1] === '(')) && input[i] === '+' && input[i + 1] && ( input[i + 1].match(/^[\d|\.]$/) || input[i + 1] === 'R' || input[i + 1] === 'e' || input[i + 1] === 'p' || input[i + 1] === '(')) {
                    newString = newString + '';
                }
                else if (i > 0 && (input[i - 1].match(/^[\d|\.]$/) || input[i - 1] === ')' || input[i - 1] === 'R' || input[i - 1] === 'e' || input[i - 1] === 'p') && input[i] === 'p') {
                    newString = newString + "*" + input[i];
                }
                else if (i > 0 && ( input[i - 1].match(/^[\d|\.]$/) || input[i - 1] === ')' || input[i - 1] === 'p' || input[i - 1] === 'e' || input[i - 1] === 'R') && input[i] === 'R') {
                    newString = newString + "*" + input[i];
                }
                else if (i > 0 && (input[i - 1].match(/^[\d|\.]$/) || input[i - 1] === ')' || input[i - 1] === 'p' || input[i - 1] === 'R' || input[i - 1] === 'e') && input[i] === 'e') {
                    newString = newString + "*" + input[i];
                }
                else if (i > 0 && (input[i - 1] === '%') && (input[i].match(/^[\d|\.]$/) || input[i] === 'p' || input[i] === 'R' || input[i] === 'e')) {
                    newString = newString + "*" + input[i];
                }
                else if (i > 0 && (input[i - 1] === '!') && (input[i].match(/^[\d|\.]$/) || input[i] === 'p' || input[i] === 'R' || input[i] === 'e')) {
                    newString = newString + "*" + input[i];
                }
                else if (i > 0 && (input[i - 1] === ')' || input[i - 1] === 'p' || input[i - 1] === 'R' || input[i - 1] === 'e') && input[i].match(/^[\d|\.]$/)) {
                    newString = newString + "*" + input[i];
                }
                else {
                    newString = newString + input[i];
                }
            }
            return newString;
        }
        function processString( input ) {
            var s = input.split(/([0-9.]+|\(|\)|\+|\-|\/|\*|\^|~|N|s|c|t|l|S|C|T|!|%|L|i|o|a|I|O|A|G|E|p|R|e|Q)/g).filter(function (x) { return x != "" });
            for (var i = 0; i < s.length; i++) {
                if (i < s.length - 1 && (s[i] === 'p' || s[i] === 'R' || s[i] === 'e') && !isOperator(s[i + 1])) {
                    return null;
                }
                if (i == 0 && !s[0].match(/[0-9a-zA-Zpe(.~]/)) {
                    return null;
                }
                if (i === 0 && s[0] === 'G') {
                    return null;
                }
                if (i < s.length - 1 && !s[i].match(/[(|)|%|!]/) && !s[i + 1].match(/[(]/) && (isOperator(s[i]) && !isOneMath(s[i])) && (isOperator(s[i + 1]) && !isOneMath(s[i + 1]))) {
                    return null;
                }
                if (i < s.length - 1 && s[i] !== '!' && s[i + 1].match(/[E]/)) {
                    return null;
                }
                if (i < s.length - 1 && s[i].match(/[(]/) && (isOperator(s[i + 1]) && !isOneMath(s[i + 1]))) {
                    return null;
                }
                if (i < s.length - 1 && isOneMath(s[i]) && (isOperator(s[i + 1]) && !isOneMath(s[i + 1]))) {
                    return null;
                }
            }
            return s;
        }
        function evaluation( input, deg) {
            var stack = [], num, _PI = Math.PI;
            for (var i = 0; i < input.length; i++) {
                var c = input[i];
                if (c === 'p') {
                    stack.push(Math.PI);
                }
                else if (c === 'e') {
                    stack.push(Math.exp(1));
                }
                else if (isOperator(c) || c.match(/^(\d*\.)?\d+$/)) {
                    if (!isOperator(c)) {
    
                        stack.push(parseFloat(c));
                    }
                    else if (stack.length !== 0) {
                        var num1 = stack.pop();
                        switch (c) {
                            case '~': {
                                num = -num1;
                                break;
                            }
                            case 's': {
                                num = (!deg && Math.abs(num1) === _PI ? '0' : Math.sin(num1 * (deg ? _PI / 180 : 1)) + '');
                                break;
                            }
                            case 'c': {
                                num = (Math.cos(num1 * (deg ? _PI / 180 : 1)) + '');
                                break;
                            }
                            case 't': {
                                num = (!deg && Math.abs(num1) === _PI ? '0' : Math.tan(num1 * (deg ? _PI / 180 : 1)) + '');
                                break;
                            }
                            case '%': {
                                num = num1 / 100; break;
                            }
                            case '!': {
                                if (num1 >= 0 && parseInt(num1) === num1) {
                                    num = factorial(Math.round(+num1));
                                }
                                else {
                                    return 'NaN';
                                }
                                break;
                            }
                            case 'l': {
                                num = Math.log(num1) / Math.log(10);
                                break;
                            }
                            case 'L': {
                                num = Math.log(num1);
                                break;
                            }
                            case 'S': {
                                num = ((Math.pow(Math.E, num1) - Math.pow(Math.E, -1 * num1)) / 2);
                                break;
                            }
                            case 'C': {
                                num = ((Math.pow(Math.E, num1) + Math.pow(Math.E, -1 * num1)) / 2);
                                break;
                            }
                            case 'T': {
                                var e1 = Math.pow(Math.E, num1), e2 = Math.pow(Math.E, -1 * num1);
                                num = (e1 == Infinity ? 1 : e2 == Infinity ? -1 : (e1 - e2) / (e1 + e2));
                                break;
                            }
                            case 'i': {
                                num = Math.asin(num1) * (deg ? 180 / _PI : 1);
                                break;
                            }
                            case 'o': {
                                num = Math.acos(num1) * (deg ? 180 / _PI : 1)
                                break;
                            }
                            case 'a': {
                                num = Math.atan(num1) * (deg ? 180 / _PI : 1);
                                break;
                            }
                            case 'I': {
                                num = Math.log(+num1 + Math.sqrt(1 + Math.pow(num1, 2)));
                                break;
                            }
                            case 'O': {
                                num = 2 * Math.log(Math.sqrt((+num1 + 1) / 2) + Math.sqrt((+num1 - 1) / 2));
                                break;
                            }
                            case 'A': {
                                num = (Math.log(+num1 + 1) - Math.log(1 - num1)) / 2;
                                break;
                            }
                            case 'Q': {
                                num = Math.pow(num1, 1 / 2);
                                break;
                            }
    
                        }
                        if (stack.length !== 0) {
                            var num2 = stack[stack.length - 1];
                            switch (c) {
                                case '+': {
                                    num = parseFloat(num2) + parseFloat(num1);
                                    stack.pop();
                                    break;
                                }
                                case '-': {
                                    num = num2 - num1;
                                    stack.pop();
                                    break;
                                }
                                case '*': {
                                    num = num2 * num1;
                                    stack.pop();
                                    break;
                                }
                                case '/': {
                                    if (num1 != 0) {
                                        num = num2 / num1;
                                    }
                                    else {
                                        return 'NaN';
                                    }
                                    stack.pop();
                                    break;
                                }
                                case '^': {
                                    num = Math.pow(num2, num1);
                                    stack.pop();
                                    break;
                                }
                                case 'N': {
                                    num = Math.pow(num1, 1 / num2);
                                    stack.pop();
                                    break;
                                }
                                case 'E': {
                                    num = num2 * Math.pow(10, num1);
                                    stack.pop();
                                    break;
                                }
                                case 'G': {
                                    num = Math.log(num1) / Math.log(num2); stack.pop();
                                    break;
                                }
                            }
    
                        }
                        stack.push(num);
                    }
                    else {
                        return "Error";
                    }
                }
                else {
                    return "Error";
                }
            }
            return stack.pop() + "";
        }
        function filterOutSpace(input){
           return input.split(/([0-9.]+|\(|\)|\+|\-|\/|\*|\^|~|N|s|c|t|l|S|C|T|!|%|L|i|o|a|I|O|A|G|E|p|R|e|Q)/g).filter(function (x) { return x != "" });

        }
        $L.evaluate = function( input, deg ){
            var equation = convertequation( input );
            var newInput = filterOutSpace(equation)
            if(input.length == 0) {
                return null
            }
            if (newInput.length >= 2 && !newInput[newInput.length - 1].match(/[!|%|^]/) && isOperator(newInput[newInput.length - 1]) && newInput[newInput.length - 2].match(/[0-9!pe%)]/)) {
                newInput = input.split(/(p|Rand|e|arcsinh\(|arccosh\(|arctanh\(|arcsin\(|ln\(|arccos\(|arctan\(|sinh\(|cosh\(|tanh\(|sin\(|cos\(|tan\(|logy\(|log\(|sqrt\(|N\(|\(|\)|\+|\-|\|*|\^|!|%)/g).filter(function (x) { return x != "" });
                newInput = newInput.splice(0, newInput.length - 1);
                equation = newInput.join("");
            }
            else if (newInput.length >= 2 && !newInput[newInput.length - 1].match(/[!|%]/) && isOperator(newInput[newInput.length - 1])) {
                return null;
            }
            equation = standardizeString(equation);
            if ( equation != null ) {
                equation = processString(equation);
            }
            if ( equation != null ) {
                equation = postfix(equation);
            }
            if ( equation != null ) {
                equation = evaluation(equation, deg);
            }
            return equation
		
        }
    }
} )( window );