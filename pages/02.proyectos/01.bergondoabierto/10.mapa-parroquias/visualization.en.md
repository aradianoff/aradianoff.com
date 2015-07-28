---
title: Basic Map of the subunits (parishes) of Bergondo in topojson format
slug: map-subunits-bergondo
date: 22-06-2015
making_off: basic-map-topojson
class: visualization-page
visualization:
    topojson: true
taxonomy:
    category: [visualization]
    project: [Bergondo@bierto]
    tags: [mapas, topojson, D3, datospublicos, visualizacion]
---

Our first map. Bergondo and its subunits (parishes). 

===

<div id="visualization"></div>

>>>>>> Sources: Original poligon layer of the subunits in [SHAPE](https://es.wikipedia.org/wiki/Shapefile) format from [webEIEL](http://webeiel.dicoruna.es/) / [Diputación de A Coruña](http://dicoruna.es/), converted to [TOPOJSON](https://en.wikipedia.org/wiki/GeoJSON#TopoJSON) format and drawn using the [D3.js](d3js.org) library.


{{% assets type="css" inline=true priority=10 load="defer" pipeline=false %}}
    .parroquia_pol-label {
	font-size: 0.70rem;
	  fill-opacity: .8;
}
{{% end %}}

{{% assets type="js" inline=true priority=10 load="defer" pipeline=false %}}

jQuery(document).ready( function() {

// Scale graph for different devices
var scalefactor;
    if (jQuery(document).width() >= 500) {scalefactor = 1}  
    else    {scalefactor = jQuery(document).width()/500};
	
 
var width = 500 * scalefactor,
    height = 500 * scalefactor;
    
var color = d3.scale.threshold()
    .domain([ 1, 2, 3, 4, 5, 6, 7, 8])
    .range(["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6" ,"#ffffcc","#e5d8bd","#fddaec","#f2f2f2"]);

var svg = d3.select("#visualization").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("map-subunits-bergondo/bergondo2.json", function(error, bergondo) {
  if (error) return console.error(error);

var parroquias = topojson.feature(bergondo, bergondo.objects.parroquia_pol);
var projection = d3.geo.mercator()
    .center([-8.24,43.31]) /* Centrar las coordenadas a nuestra zona*/
    .scale(250000* scalefactor) /*Escalar de forma apropiada*/
 	 .translate([width / 2, height / 2]);
 	 
var path = d3.geo.path()
    .projection(projection);

/* Crear polígonos de las parroquias */  
svg.selectAll(".parroquia_pol")
    .data(topojson.feature(bergondo, bergondo.objects.parroquia_pol).features)
  .enter().append("path")
    .attr("class", function(d) { return "parroquia_pol " + d.id; })
    .attr("d", path)
    .style("fill", function(d) { return color(d.id-698)})
    .style("stroke", "#aaa");
    
/* Crear etiquetas parroquias */
    
svg.selectAll(".parroquia_pol-label")
    .data(topojson.feature(bergondo, bergondo.objects.parroquia_pol).features)
  .enter().append("text")
    .attr("class", function(d) { return "parroquia_pol-label " + d.id; })
    .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
    .attr("dx", "-2em")
    .text(function(d) { return d.properties.nombre; });
    	   
});   

});

{{% end %}}




