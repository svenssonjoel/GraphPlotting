(function($) {

function init(plot) {
plot.hooks.processOptions.push(addLastDrawHook);
}

function addLastDrawHook(plot) {
plot.hooks.draw.push(drawLegend);
}

// draws the legend on the canvas, using the HTML added by flot as a guide
function drawLegend(plot, ctx) {
var options = plot.getOptions();
if(!options.legend.show) return;

var placeholder = plot.getPlaceholder();
// var container = options.legend.container; || placeholder.find('.legend');
var container = options.legend.container || placeholder.find('.legend');



var f = {
style: placeholder.css("font-style"),
size: 24, //Math.round(0.8 * (+placeholder.css("font-size").replace("px", "") || 13)),
variant: placeholder.css("font-variant"),
weight: placeholder.css("font-weight"),
family: placeholder.css("font-family")
};

ctx.font = f.style + " " + f.variant + " " + f.weight + " " + f.size + "px '" + f.family + "'";
ctx.textAlign = "left";
ctx.textBaseline = "bottom";

function fontAscent() {
return 12;
}


var series = plot.getData();
var plotOffset = plot.getPlotOffset();
var plotHeight = plot.height();
var plotWidth = plot.width();
var lf = options.legend.labelFormatter;
var legendWidth = 0, legendHeight = 0;
var num_labels = 0;
var s, label;
// get width of legend and number of valid legend entries
for(var i = 0; i < series.length; ++i) {
s = series[i];
label = s.label;
if(!label) continue;
num_labels++;
if(lf) label = lf(label, s);
labelWidth = ctx.measureText(label).width;
if(labelWidth > legendWidth) legendWidth = labelWidth
}
var LEGEND_BOX_WIDTH = 45; //22; // color box
var PADDING_RIGHT = 5;
var LEGEND_BOX_LINE_HEIGHT = 32; //18;
var PADDING_TOP = 5;
legendWidth = legendWidth + LEGEND_BOX_WIDTH + PADDING_RIGHT;
legendHeight = num_labels * (LEGEND_BOX_LINE_HEIGHT + PADDING_TOP);
var x, y;
if(options.legend.container != null) {
x = $(options.legend.container).offset().left;
y = $(options.legend.container).offset().top;
} else {
var pos = "";
var p = options.legend.position;
var m = options.legend.margin;
if(m[0] == null) m = [m, m];
if(p.charAt(0) == "n")
y = Math.round(plotOffset.top + options.grid.borderWidth + m[1]);
else if(p.charAt(0) == "s")
y = Math.round(plotOffset.top + options.grid.borderWidth + plotHeight - m[0] - legendHeight);
if(p.charAt(1) == "e")
x = Math.round(plotOffset.left + options.grid.borderWidth + plotWidth - m[0] - legendWidth);
else if(p.charAt(1) == "w")
x = Math.round(plotOffset.left + options.grid.borderWidth + m[0]);
if(options.legend.backgroundOpacity != 0.0) {
var c = options.legend.backgroundColor;
if(c == null) c = options.grid.backgroundColor;
if(c && typeof c == "string") {
ctx.globalAlpha = options.legend.backgroundOpacity;
ctx.fillStyle = c;
ctx.fillRect(x, y, legendWidth, legendHeight);
ctx.globalAlpha = 1.0;
}
}
}
var posx, posy;
var B_WIDTH = 32; 
var B_HEIGHT = 24;
var FONT_PAD_LEFT = 38;
var B_PAD_TOP  = 5;
for(var i = 0; i < series.length; ++i) {
s = series[i];
label = s.label;
if(!label) continue;
if(lf) label = lf(label, s);
posy = y + (i * (24 + B_PAD_TOP));
ctx.fillStyle = options.legend.labelBoxBorderColor;
ctx.fillRect(x, posy, B_WIDTH, B_HEIGHT); //18, 14);
ctx.fillStyle = "#FFF";
ctx.fillRect(x + 1, posy + 1, B_WIDTH-2, B_HEIGHT-2); //16, 12);
ctx.fillStyle = s.color;
ctx.fillRect(x + 2, posy + 2, B_WIDTH-4,B_HEIGHT-4); //14, 10);
//posx = x + 22;
//posy = posy + f.size + 2;
posx = x + FONT_PAD_LEFT;
posy = posy + B_HEIGHT + B_PAD_TOP; 

//ctx.fillStyle = options.grid.color;
ctx.fillStyle = options.legend.color || options.grid.color;
ctx.fillText(label, posx, (posy - i));
}

container.hide(); // hide the HTML version
}

$.plot.plugins.push({
init: init,
options: {},
name: 'legendoncanvas',
version: '1.0'
});
})(jQuery);
