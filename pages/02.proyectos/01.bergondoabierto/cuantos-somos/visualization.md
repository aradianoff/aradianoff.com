---
title: ¿Cuántos somos?
slug: cuantos-somos
date: 22-06-2015
class: visualization-page
taxonomy:
    category: [visualization]
    project: [Bergondo@bierto]
    tags: [población, padrón, pirámide poblacional, Bergondo, D3, datospublicos, visualizacion]
---

Pirámide poblacional del municipio de Bergondo, interactiva por edad y por sexo. 

===

>>>>> Seleccione el año de interés en el menú de abajo del gráfico o pulse PLAY para reproducir toda la serie (también puede utilizar las fechas de dirección del teclado para navegar entre años). Ponga el cursor encima de las barras para ver el dato contreto por edad. 

>>>>>> Fuente: Datos del padrón continuo para el municipio de Bergondo obtenidos del <a href="http://ine.es">Instituto Nacional de Estadística</a> // Código obtenido y modificado a partir de <a href="http://vis.stanford.edu/jheer/d3/pyramid/shift.html">vis.stanford.edu</a>.

 
{{% assets type="js" inline=false priority=10 load="defer" pipeline=false %}}
	vis.standford.edu.d3.min.js
	censo_2003_2014_edad_anual.js
{{% end %}} 

{{% assets type="css" inline=true priority=10 load="defer" pipeline=false %}}

#visualization .label {
  position: relative;
  float: left;
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 48px;
  font-weight: bold;
  background: none;
  
}
#visualization .flabel, .mlabel {
  position: relative;
  font-size: 36px;
  font-weight: bold;
  text-align: center;
}

#visualization .break {
  border-bottom: solid 1px #dedede;
  margin: 10px 15px 2px 15px;
  width: 100%;
}
#visualization .years,#visualization .controls {
  display: block;
  margin: 15px;
  width: 100%;
  min-width: 400px;
  text-align: center;
  font-size: 12px;
}
#visualization .years span, #visualization .controls span {
  padding-left: 10px;
  padding-right: 10px;
}
#visualization div.years {
	min-height: 20px;
}

#visualization .years span {
	float:left;
}

#visualization .years .title {
  font-size: 13px;
  font-variant: small-caps;
  letter-spacing: 1;
}
#visualization .years a, #visualization .controls a {
  color: #888;
  text-decoration: none;
}
#visualization .years a:hover,#visualization .controls a:hover {
  color: #000;
  text-decoration: underline;
}

#visualization .years a.active {
  color: #000;
}
#visualization .controls a {
  font-variant: small-caps;
  letter-spacing: 1;
  text-decoration: none;
}
#visualization svg {
  shape-rendering: crispEdges;
}
{{% end %}}

{{% assets type="js" inline=true priority=10 load="defer" pipeline=false %}}

jQuery(document).ready( function() {

document.onkeydown = function(event) {
    var y = year;
    switch (event.keyCode) {
        case 37: // left arrow
            y = Math.max(2003, year-1);
            break;
        case 39: // right arrow
            y = Math.min(2014, year+1);
            break;
        case 32: // space bar
            toggle();
            return;
    }
    if (y != year) goto(y);
};


function isYear(d) { return d.year == year; }
function linkClass(y) { return "y"+y.toFixed(0) + (y==year?" active":""); }
function tooltipText(d) {
    return d3.format(",")(d.people)
        + " " + (d.sex==1?"hombres":"mujeres")
        + " con edad " + (d.age==85?"85 o más":d.age)
	    + " en " + d.year;
}

function barWidth(d) { return x1(d.people); }

window.goto = function(yr, dur) {
	dur = dur || 300;
	var old = year;
	year = yr;
	
	label.text(year + ": " + ttotals[year-2003].people + " personas");
   flabel.text("mujeres " + ftotals[year-2003].people.toFixed(0));
	mlabel.text("hombres " + mtotals[year-2003].people);
	
	div.selectAll("#visualization.span.link a")
	   .attr("class", linkClass);
	
	var fb = vis.selectAll("rect.female").data(fdat.filter(isYear), {
	    nodeKey: function(node) { return node.getAttribute("id"); },
	    dataKey: function(data) { return "f"+(data.year - data.age); }
    });
    fb.enter("svg:rect")
	    .attr("id", function(d) { return "f"+(d.year - d.age); })
	    .attr("class", "female")
	    .attr("fill", "pink")
		.attr("transform", lTransform)
	    .attr("width", function(d) { return x1(d.people); })
	    .attr("y", yr>old ? 20 : -20)
	    .attr("height", y.rangeBand())
	    .attr("opacity", 0.0001)
	  .transition()
	    .duration(dur)
	    .attr("y", 0)
	    .attr("opacity", 1);
    fb.exit().transition()
        .duration(dur)
	    .attr("y", yr>old ? -20 : 30)
        .attr("opacity", 0.0001)
        .each("end", function() { d3.select(this).remove(); });
	fb.transition()
        .duration(dur)
	    .attr("transform", lTransform)
	    .attr("y", 0)
	    .attr("width", function(d) { return x1(d.people); })
	    .attr("opacity", 1);
	fb.select("title").text(tooltipText);


	var mb = vis.selectAll("rect.male").data(mdat.filter(isYear), {
	    nodeKey: function(node) { return node.getAttribute("id"); },
	    dataKey: function(data) { return "m"+(data.year - data.age); }
    });
    mb.enter("svg:rect")
	    .attr("id", function(d) { return "m"+(d.year - d.age); })
	    .attr("class", "male")
	    .attr("fill", "steelblue")
	    .attr("transform", rTransform)
	    .attr("width", function(d) { return x1(d.people); })
	    .attr("y", yr>old ? 20 : -20)
	    .attr("height", y.rangeBand())
	    .attr("opacity", 0.0001)
	  .transition()
	    .duration(dur)
	    .attr("y", 0)
	    .attr("opacity", 1);
    mb.exit().transition()
        .duration(dur)
        .attr("y", yr>old ? -20 : 30)
        .attr("opacity",0.0001)
        .each("end", function() { d3.select(this).remove(); });
	mb.transition()
        .duration(dur)
	    .attr("transform", rTransform)
	    .attr("y", 0)
	    .attr("width", function(d) { return x1(d.people); })
	    .attr("opacity", 1);
	mb.select("title").text(tooltipText);
}


var timer = undefined;
window.stop = function() {
    clearInterval(timer);
    timer = undefined;
    ctrls.select("a.toggle").text("Reproducir");
}
window.toggle = function() {
	if (!timer) {
		play();
	} else {
		stop();
	}
}

window.play = function(rev) {
	rev = rev || false;
	if (timer) { stop(); }
	ctrls.select("a.toggle").text("Parar");
	var advance = function() {
		var y = year + (rev?-1:1);
		if (y < 2003 || y > 2014) {
			// stop at end points
			stop();
			return;
		} else {
			// else advance
			goto(y, 800);
		}
	};
	advance();
	timer = setInterval(advance, 850);
}

var scalefactor;
    if (jQuery(document).width() >= 1050) {scalefactor = 1}  
    else    {scalefactor = jQuery(document).width()/1050};
            
var data = census;


var maxp = data.reduce(function(a,b) { return Math.max(a,b.people); }, 0),
    mdat = data.filter(function(d) { return d.sex==1; })
               .sort(function(a,b) { return b.age - a.age; }),
    fdat = data.filter(function(d) { return d.sex==2; })
               .sort(function(a,b) { return b.age - a.age; });

var w = 500,
    h = 40 * 15,
    bins = d3.range(86),
    year = 2003,
    y = d3.scale.ordinal().domain(bins).rangeBands([0, h], 0.25),
    x1 = d3.scale.linear().domain([0, maxp]).range([0, w]),
    x2 = d3.scale.linear().domain([0, maxp]).range([w, 0]),
    rf = "javascript:return false;";

var vis = d3.select("#visualization")
  .append("svg:svg")
  	 .attr("class", "drawing")
    .attr("width", (2*w + 50)* scalefactor)
    .attr("height", (h + 100)* scalefactor)
  .append("svg:g")
    .attr("transform", "translate(0,"+60*scalefactor+") scale("+ scalefactor+")")
    .attr("class", "main-g") 

// pyramid bar chart

vis.append("svg:g")
  .selectAll("text.ages")
    .data(bins)
  .enter("svg:text")
    .filter(function(d) { return d%5==0; })
    .attr("class", "ages")
    .attr("x", w+15)
    .attr("y", function(d) { return y(d) + y.rangeBand(); })
    .attr("fill", "#888")
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .text(function(d) { return (85-d).toFixed(0); });

var rTransform = function(d,i) {
    return "translate("+(w+30)+","+y(i).toFixed(2)+")";
}
var lTransform = function(d,i) {
    return "translate("+x2(d.people).toFixed(2)+","+y(i).toFixed(2)+")";
}
var lEnter = function(d,i) {
    return "translate("+w+","+y(i).toFixed(2)+")";
}

var mbars = vis.selectAll("rect.male")
    .data(mdat.filter(isYear))
  .enter("svg:rect")
    .attr("id", function(d) { return "m"+(d.year - d.age); })
    .attr("class", "male")
    .attr("fill", "steelblue")
    .attr("transform", rTransform)
    .attr("width", barWidth)
    .attr("height", y.rangeBand())
    .attr("y", 0)
    .attr("opacity", 1);

mbars.append("svg:title").text(tooltipText);

var fbars = vis.selectAll("rect.female")
    .data(fdat.filter(isYear))
  .enter("svg:rect")
    .attr("id", function(d) { return "f"+(d.year - d.age); })
    .attr("class", "female")
    .attr("fill", "pink")
    .attr("opacity", 1)
    .attr("transform", lTransform)
    .attr("width", barWidth)
    .attr("height", y.rangeBand())
    .attr("y", 0)
    .attr("opacity", 1);

fbars.append("svg:title").text(tooltipText);

// animated intro for bars

mbars.attr("width", 0)
    .transition()
      .duration(500)
      .delay(function(d,i) { return 30*i; })
      .attr("width", barWidth);

fbars.attr("width", 0)
    .attr("transform", lEnter)
    .transition()
      .duration(500)
      .delay(function(d, i) { return 30*i; })
      .attr("width", barWidth)
      .attr("transform", lTransform);

// age label

vis.append("svg:text")
    .attr("x", w+15)
    .attr("y", h+8)
    .attr("dy", ".71em")
    .attr("fill", "#888")
    .attr("text-anchor", "middle")
    .attr("font-size", "13px")
    .attr("font-variant", "small-caps")
    .attr("letter-spacing", 1)
    .text("edad");

// gridlines and labels for right pyramid

var rules1 = vis.selectAll("g.rule1")
    .data(x1.ticks(8))
  .enter("svg:g")
    .filter(function(d) { return d > 0; })
    .attr("class", "rule1")
    .attr("transform", function(d) { return "translate("+(w+30+x1(d))+",0)";});

rules1.append("svg:line")
    .attr("y1", h - 2)
    .attr("y2", h + 4)
    .attr("stroke", "#bbb");

rules1.append("svg:line")
    .attr("y1", 0)
    .attr("y2", h)
    .attr("stroke", "white")
    .attr("stroke-opacity", .3);

rules1.append("svg:text")
    .attr("y", h + 9)
    .attr("dy", ".71em")
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("fill", "#bbb")
    .text(function(d) { return (d).toFixed(0); });

// gridlines and labels for left pyramid

var rules2 = vis.selectAll("g.rule2")
    .data(x2.ticks(8))
  .enter("svg:g")
    .filter(function(d) { return d > 0; })
    .attr("class", "rule2")
    .attr("transform", function(d) { return "translate("+(x2(d))+",0)";});

rules2.append("svg:line")
    .attr("y1", h - 2)
    .attr("y2", h + 4)
    .attr("stroke", "#bbb");

rules2.append("svg:line")
    .attr("y1", 0)
    .attr("y2", h)
    .attr("stroke", "white")
    .attr("stroke-opacity", .3);

rules2.append("svg:text")
    .attr("y", h + 9)
    .attr("dy", ".71em")
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("fill", "#bbb")
    .text(function(d) { return (d).toFixed(0); });
    
// Main label
var label = vis.append("svg:g")
  .attr("class", "label")
  .append("svg:text")
    .attr("y", -15)
    .attr("fill", "#dedede")
    .text(year.toFixed(0) + ": " + ttotals[year-2003].people + " personas");
  
// Female and Male Labels
    
var flabel = vis.append("svg:g")
   .attr("class", "flabel")
   .append("svg:text")
    .attr("y", h/2)
    .attr("fill", "#fdd7e4")
    .text("mujeres " + ftotals[year-2003].people.toFixed(0));
    
var mlabel = vis.append("svg:g")
   .attr("class", "mlabel")
   .append("svg:text")
    .attr("y", h/2)
    .attr("x", 3*w/2)
    .attr("fill", "#b7ceec")
    .text("hombres " + mtotals[year-2003].people.toFixed(0));
    
// Controls

d3.select("#visualization")
  .append("div")
    .attr("class", "break");

var div = d3.select("#visualization")
  .append("div")
    .attr("class", "years");

div.append("span")
  .attr("class", "title")
  .text("Año");

var ctrls = d3.select("#visualization")
  .append("div")
  .attr("class", "controls");
ctrls.append("span").append("a")
  .attr("class", "control back")
  .attr("href", "javascript:play(true);")
  .html(" &lt;&lt; ");
ctrls.append("span").append("a")
  .attr("class", "control toggle")
  .attr("href", "javascript:toggle();")
  .text("play");
ctrls.append("span").append("a")
  .attr("class", "control forward")
  .attr("href", "javascript:play();")
  .text(" >> ");

div.selectAll("#visualization.span.link")
    .data(d3.range(2003, 2015, 1))
  .enter("span")
    .attr("class", "link")
  .append("a")
    .attr("class", linkClass)
    .attr("href", function(d) { return "javascript:goto("+d+");"})
    .text(function(d) { return d.toFixed(0); });  

});
{{% end %}}




