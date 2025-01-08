;(function( window ) {
    if(window.lyteDomObj){
        convertToHSL = function(color){
            var split_color = color.substring(4, color.length-1)
            .replace(/ /g, '')
            .split(',');
            var r = parseInt(split_color[0]);
            var g = parseInt(split_color[1]);
            var b = parseInt(split_color[2]);
            (r /= 255), (g /= 255), (b /= 255);
            const vmax = Math.max(r, g, b), vmin = Math.min(r, g, b);
            let h, s, l = (vmax + vmin) / 2;

            if (vmax === vmin) {
                return [0, 0, l*100]; // achromatic
            }

            const d = vmax - vmin;
            s = l > 0.5 ? d / (2 - vmax - vmin) : d / (vmax + vmin);
            if (vmax === r){ h = (g - b) / d + (g < b ? 6 : 0); }
            if (vmax === g){ h = (b - r) / d + 2; }
            if (vmax === b){ h = (r - g) / d + 4; }
            h /= 6;    
            return [h*360,s*100,l*100];
        }
        function lytecolorManipulator(color){
            if(/^#/.test( color )){
                this.accentColor = hexToRgb(color);
            }else if(/^rgb/.test( color )){
                this.accentColor = color;
            }
        }
        var convertToRgb = function(h,s,l){
            h /= 360;
            s /= 100;
            l /= 100;
        
            let r, g, b;
        
            if (s === 0) {
                r = g = b = l; // Achromatic (gray) color
            } else {
                const hue2rgb = (p, q, t) => {
                    if (t < 0){ t += 1; }
                    if (t > 1){ t -= 1; }
                    if (t < 1/6){ return p + (q - p) * 6 * t; }
                    if (t < 1/2){ return q; }
                    if (t < 2/3){ return p + (q - p) * (2/3 - t) * 6; }
                    return p;
                };
        
                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;
                r = hue2rgb(p, q, h + 1/3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1/3);
            }
        
            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        }
        $L.colorManipulator = function(color,type){
            return new lytecolorManipulator(color,type)
        }
        function hexToRgb(hex) {
            // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, function(m, r, g, b) {
              return r + r + g + g + b + b;
            });
          
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ?  'rgb(' + parseInt(result[1], 16) + ', ' +  parseInt(result[2], 16) + ', '  + parseInt(result[3], 16) + ')' : null;
        }
        lytecolorManipulator.prototype.compareAccentColor = function(color){
            var CurrColor_percentage = convertToHSL(color)[2];
            var accentColor_percentage = convertToHSL(this.accentColor)[2];
            var returnObj = {};
            if(CurrColor_percentage > accentColor_percentage){
                var maxValue = 100 - accentColor_percentage;
                var actualValue = CurrColor_percentage - accentColor_percentage;
                returnObj.tonePercent = Math.round((actualValue / maxValue) * 100 )+ '%';
                returnObj.toneType = 'Lighten';
            }else{
                var actualValue = (accentColor_percentage - CurrColor_percentage);
                returnObj.tonePercent = Math.round((actualValue / accentColor_percentage) * 100) + '%';
                returnObj.toneType = 'Darken';
            }
            return returnObj;
        }
        lytecolorManipulator.prototype.findAccentColor = function(data){
            var toneType = data.toneType;
            var tonePercent = data.tonePercent;
            var AccentColorHSL = convertToHSL(this.accentColor);
            var accentColor_percentage = AccentColorHSL[2];
            var currColor_percentage = 0;
            var actualValue = 0;
            if(toneType.toLowerCase() == 'lighten'){
                var maxValue = 100 - accentColor_percentage;
                actualValue = ( tonePercent * maxValue ) / 100;
                currColor_percentage = actualValue + accentColor_percentage;
            }else{
                actualValue = (tonePercent * accentColor_percentage) / 100;
                currColor_percentage =  accentColor_percentage - actualValue;
            }
            var rgb = convertToRgb(AccentColorHSL[0],AccentColorHSL[1],currColor_percentage)
            return 'rgb('+ Math.round(rgb[0]) + ',' + Math.round(rgb[1]) + ',' + rgb[2] +')';
        }
        lytecolorManipulator.prototype.isDark = function(){    
            var rgb = this.accentColor.match(/\d+/g).map(Number);
            return Math.sqrt( .299 * rgb[ 0 ] * rgb[ 0 ] + .587 * rgb[ 1 ] * rgb[ 1 ] + .114 * rgb[ 2 ] * rgb[ 2 ] ) < 127.5;
        }
        lytecolorManipulator.prototype.findhsl = function(){
           return convertToHSL(this.accentColor);
        }
    }



})(window);