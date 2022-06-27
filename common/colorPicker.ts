/* Formula from: https://www.w3.org/TR/WCAG21/#dfn-relative-luminance */
/* Takes colour hex as parameter */
function Luminance(h: string): number {
    const r: number = parseInt("0x" + h[1] + h[2]);
    const g: number = parseInt("0x" + h[3] + h[4]);
    const b: number = parseInt("0x" + h[5] + h[6]);
    const rgb = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928
        ? v / 12.92
        : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}

/* Formula from:https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio */
/* Takes colour hexes as parameter */
function Contrast(c1: string, c2: string): number {
const lum1 = Luminance(c1);
const lum2 = Luminance(c2);
const lighter = Math.max(lum1, lum2);
const darker = Math.min(lum1, lum2);
return (lighter + 0.05) / (darker + 0.05);
}

/* For now will return either white or black */
/* Takes colour hex as parameter */
function bestFontColor(background: string): string {
const white: string = "#ffffff";
const black: string = "#000000";
// const contrastThreshold = 4.5; /* https://www.w3.org/TR/WCAG21/#contrast-minimum */

const contrast: number = Contrast(white, background);

return (contrast >= 4.5) ? white : black;
}

function bestAuxFontColor(bg: string, font: string): string {
    const colors: string[] = [ "blue", "#F0F8FF", "#FAEBD7", "#00FFFF", "#7FFFD4", "#F0FFFF", "#F5F5DC", "#FFE4C4", "#000000", "#FFEBCD", "#0000FF", "#8A2BE2", "#A52A2A", "#DEB887", "#5F9EA0", "#7FFF00", "#D2691E", "#FF7F50", "#6495ED", "#FFF8DC", "#DC143C", "#00FFFF", "#00008B", "#008B8B", "#B8860B", "#A9A9A9", "#006400", "#A9A9A9", "#BDB76B", "#8B008B", "#556B2F", "#FF8C00", "#9932CC", "#8B0000", "#E9967A", "#8FBC8F", "#483D8B", "#2F4F4F", "#2F4F4F", "#00CED1", "#9400D3", "#FF1493", "#00BFFF", "#696969", "#696969", "#1E90FF", "#B22222", "#FFFAF0", "#228B22", "#FF00FF", "#DCDCDC", "#F8F8FF", "#FFD700", "#DAA520", "#808080", "#008000", "#ADFF2F", "#808080", "#F0FFF0", "#FF69B4", "#CD5C5C", "#4B0082", "#FFFFF0", "#F0E68C", "#E6E6FA", "#FFF0F5", "#7CFC00", "#FFFACD", "#ADD8E6", "#F08080", "#E0FFFF", "#FAFAD2", "#D3D3D3", "#90EE90", "#D3D3D3", "#FFB6C1", "#FFA07A", "#20B2AA", "#87CEFA", "#778899", "#778899", "#B0C4DE", "#FFFFE0", "#00FF00", "#32CD32", "#FAF0E6", "#FF00FF", "#800000", "#66CDAA", "#0000CD", "#BA55D3", "#9370DB", "#3CB371", "#7B68EE", "#00FA9A", "#48D1CC", "#C71585", "#191970", "#F5FFFA", "#FFE4E1", "#FFE4B5", "#FFDEAD", "#000080", "#FDF5E6", "#808000", "#6B8E23", "#FFA500", "#FF4500", "#DA70D6", "#EEE8AA", "#98FB98", "#AFEEEE", "#DB7093", "#FFEFD5", "#FFDAB9", "#CD853F", "#FFC0CB", "#DDA0DD", "#B0E0E6", "#800080", "#663399", "#FF0000", "#BC8F8F", "#4169E1", "#8B4513", "#FA8072", "#F4A460", "#2E8B57", "#FFF5EE", "#A0522D", "#C0C0C0", "#87CEEB", "#6A5ACD", "#708090", "#708090", "#FFFAFA", "#00FF7F", "#4682B4", "#D2B48C", "#008080", "#D8BFD8", "#FF6347", "#40E0D0", "#EE82EE", "#F5DEB3", "#FFFFFF", "#F5F5F5", "#FFFF00", "#9ACD32" ];
    var color: string = "blue";

    var maxBgContrast: number = 0;
    var maxFontContrast: number = 0;
    for (let i = 0; i < colors.length; i++) {
        var c: string = colors[i];
        const bgContrast: number = Contrast(bg, c);
        const fontContrast: number = Contrast(font, c);

        if (bgContrast >= 3.5 && fontContrast >= 2 && 
            bgContrast > maxBgContrast && fontContrast > maxFontContrast) { // WCAG guidelines
            color = c;
            maxBgContrast = bgContrast;
            maxFontContrast = fontContrast;
        }
    }
    
    return color;
}

export {bestFontColor, bestAuxFontColor}
