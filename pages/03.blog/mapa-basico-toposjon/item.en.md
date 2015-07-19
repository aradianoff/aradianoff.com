---
title: Create a basic map in toposjon
slug: basic-map-topojson
date: 10:00 26-06-2015
shortcodes: false
assets:
  enabled: false
taxonomy:
    category: [technical, web, blog]
    tag: [D3, Grav, D3.js, tutorial, visualization, map, makingoff]
---
In this guide we are going to create a basic map using [Data Driven Documents (D3)](http://d3js.org) and [Topojson](https://en.wikipedia.org/wiki/GeoJSON#TopoJSON). In this case, a map of the municipality of Bergondo (Galicia, Spain) and its subunits (parishes).

===

Data source and tools:
>>>>>> The [Diputación de A Coruña](http://dicoruna.es/), through its website [webEIEL](http://webeiel.dicoruna.es/) has published maps of the municipalities of the province in [SHAPE](https://es.wikipedia.org/wiki/Shapefile) and [GML](https://es.wikipedia.org/wiki/Geography_Markup_Language) formats with lots of information that we can download and use. In this example, we used the polygons of the subunits of Bergondo, converting them to [TopoJSON](https://en.wikipedia.org/wiki/GeoJSON#TopoJSON) and drew them using [D3.js](d3js.org).

##### Prerequisites:
1. In this tutorial I assume that you have GRAV installed and set up for its use with the D3.js library. [Here on how to do it](../d3-in-grav). If you want to use this code in another setup, just change the plugin-specific Assets tags for JavaScript code  (`{assets:inline_js}{/assets}`) for `<script></script>` tags, and the Style CSS tags `{assets:inline_css}{/assets}` for `<style></style>` tags and and the code to the  `<head></head>` block of our page after loading the JQuery library (we use JQuery to make sure the script is only loaded once the document is, but if we just put the script at the end of the document we could forgo that call and not load JQuery).
2. Download the Shape file for the polygons of the parishes of Bergondo in [webEIEL](http://webeiel.dicoruna.es/) (you can use those of other municipalities if you wish). This files are all in WGS 84 / UTM zone 29N or [EPSG:32629](http://spatialreference.org/ref/epsg/wgs-84-utm-zone-29n/).

3. Convert them to [TopoJSON](https://en.wikipedia.org/wiki/GeoJSON#TopoJSON) format. To do this we have to have the appropiate tools installed in our system, like a [GIS](https://en.wikipedia.org/wiki/Geographic_Information_System), or  [GDAL](http://www.gdal.org/) and the [TopoJSON](https://github.com/mbostock/topojson) library. In the second opcion (GAL+TopoJSON), we would just need this 2 commands to convert the shapes ([more information here](http://bost.ocks.org/mike/map/)):
```
ogr2ogr -f GeoJSON  -t_srs EPSG:4326 -s_srs EPSG:32629 filename_geojson.json filename_origin.shp
topojson -o bergondo2.json --id-property geoid --properties name=entidad,nombre=nombre filename_geojson.json 
```
Where `-s_srs EPSG:32629` indicates the input format (UTM Z29N) and `-t_srs EPSG:4326` the output format in geographical coordinates [WGS84](http://spatialreference.org/ref/epsg/wgs-84/). Link to the [file in TopoJSON](/projects/bergondoabierto/map-subunits-bergondo/bergondo2.json).

##### Creating the map:

First we insert inline JavaScript and add the call that makes sure the DOM is loaded before running the script:

```
{assets:inline_js}

jQuery(document).ready( function() {

//Here goes the code to make our map

};
{/assets}

```
And then we can write the code needed to make the map. We can add the dimensions of our rendered map and create an svg with them:
```
var width = 500,
    height = 500;
    
var svg = d3.select("#visualization").append("svg")
    .attr("width", width)
    .attr("height", height);
```
Load the data from the topoJSON file, center it and scale it appropiately and create the projection:
```
d3.json("map-subunits-bergondo/bergondo2.json", function(error, bergondo) {
  if (error) return console.error(error);

var parroquias = topojson.feature(bergondo, bergondo.objects.parroquia_pol);
var projection = d3.geo.mercator()
    .center([-8.24,43.31]) /* Center the coordinate in our zone*/
    .scale(250000) /* Scale appropiately */
 	 .translate([width / 2, height / 2]); /* Center map in our svg */

var path = d3.geo.path() /* Add projection */
    .projection(projection);
```
And we can add the polygons of the parishes to the map and give them different colors and tags to differenciate them:
```
/* Create color palette */
var color = d3.scale.threshold()
    .domain([ 1, 2, 3, 4, 5, 6, 7, 8])
    .range(["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6" ,"#ffffcc","#e5d8bd","#fddaec","#f2f2f2"]);
/* Create parishes' polygons */  
svg.selectAll(".parroquia_pol")
    .data(topojson.feature(bergondo, bergondo.objects.parroquia_pol).features)
  .enter().append("path")
    .attr("class", function(d) { return "parroquia_pol " + d.id; })
    .attr("d", path)
    .style("fill", function(d) { return color(d.id-698)}) // Add different colors
    .style("stroke", "#aaa");
    
/* Create parishes' tags */    
svg.selectAll(".parroquia_pol-label")
    .data(topojson.feature(bergondo, bergondo.objects.parroquia_pol).features)
  .enter().append("text")
    .attr("class", function(d) { return "parroquia_pol-label " + d.id; })
    .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
    .attr("dx", "-2em")
    .text(function(d) { return d.properties.nombre; });
    	   
});  /* Close the call to d3.json  */


```

And last, we add styles to the tags of the parishes so they can be seen better by making the fonts a bit smaller and a bit transparent:
```
{assets:inline_css}
.parroquia_pol-label {
	font-size: 0.70rem;
	  fill-opacity: .8;
}
{/assets}
```

The final code would look like this:

```
{assets:inline_css}
.parroquia_pol-label {
	font-size: 0.70rem;
	  fill-opacity: .8;
}
{/assets}

{assets:inline_js}

jQuery(document).ready( function() {

var width = 500,
    height = 500;
    
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
    .center([-8.24,43.31]) /* Center the coordinate in our zone*/
    .scale(250000) /* Scale appropiately */
 	.translate([width / 2, height / 2]); /* Center map in our svg */
 	 
var path = d3.geo.path()
    .projection(projection);

/* Create polygons */  
svg.selectAll(".parroquia_pol")
    .data(topojson.feature(bergondo, bergondo.objects.parroquia_pol).features)
  .enter().append("path")
    .attr("class", function(d) { return "parroquia_pol " + d.id; })
    .attr("d", path)
    .style("fill", function(d) { return color(d.id-698)})
    .style("stroke", "#aaa");
    
/* Create text tags */
    
svg.selectAll(".parroquia_pol-label")
    .data(topojson.feature(bergondo, bergondo.objects.parroquia_pol).features)
  .enter().append("text")
    .attr("class", function(d) { return "parroquia_pol-label " + d.id; })
    .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
    .attr("dx", "-2em")
    .text(function(d) { return d.properties.nombre; });
    	   
});   

});
{/assets}
```

See *[result](/projects/bergondoabierto/map-subunits-bergondo/)* .

