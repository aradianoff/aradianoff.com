---
title: Mapa básico de parroquias en formato topojson
slug: mapa-parroquias-topojson
date: 22-06-2015
making_off: mapa-basico-topojson
class: visualization-page
visualization:
    topojson: true
taxonomy:
    category: [visualization]
    project: [Bergondo@bierto]
    tags: [mapas, topojson, D3, datospublicos, visualizacion]
---

Nuestro primer mapa. Bergondo y sus parroquias. 

===

>>>>>> Fuente: Capa original de polígonos de las parroquias en formato [SHAPE](https://es.wikipedia.org/wiki/Shapefile) de [webEIEL](http://webeiel.dicoruna.es/) / [Diputación de A Coruña](http://dicoruna.es/), convertidos a formato [TOPOJSON](https://en.wikipedia.org/wiki/GeoJSON#TopoJSON) y dibujados utilizando la librería [D3.js](d3js.org).


{{% assets type="css" inline=true priority=10 load="defer" pipeline=false %}}
    .parroquia_pol-label {
	font-size: 0.70rem;
	  fill-opacity: .8;
}
{{% end %}}

{{% assets type="js" inline=true priority=10 load="defer" pipeline=false %}}

jQuery(document).ready( function() {

var width = 500,
    height = 500;
    
var color = d3.scale.threshold()
    .domain([ 1, 2, 3, 4, 5, 6, 7, 8])
    .range(["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6" ,"#ffffcc","#e5d8bd","#fddaec","#f2f2f2"]);

var svg = d3.select("#visualization").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("mapa-parroquias-topojson/bergondo2.json", function(error, bergondo) {
  if (error) return console.error(error);

var parroquias = topojson.feature(bergondo, bergondo.objects.parroquia_pol);
var projection = d3.geo.mercator()
    .center([-8.24,43.31]) /* Centrar las coordenadas a nuestra zona*/
    .scale(250000) /*Escalar de forma apropiada*/
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




