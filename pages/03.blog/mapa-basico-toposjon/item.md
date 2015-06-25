---
title: Crear un mapa básico en toposjon
slug: mapa-basico-topojson
date: 10:00 26-06-2015
shortcodes: false
assets:
  enabled: false
taxonomy:
    category: [tecnico, web, blog]
    tag: [D3, Grav, D3.js, tutorial, visualización, mapa, comoSeHizo]
---
En está guía vamos a ver como crear un mapa básico utilizando [Data Driven Documents (D3)](http://d3js.org) y [Topojson](https://en.wikipedia.org/wiki/GeoJSON#TopoJSON). En este caso, un mapa del municipio de Bergondo y sus parroquias.

===

Fuente de los datos y herramientas utilizadas:
>>>>>> La [Diputación de A Coruña](http://dicoruna.es/), mediante su portal [webEIEL](http://webeiel.dicoruna.es/) tiene disponibles mapas de los distintos municipios de la provincia en formato [SHAPE](https://es.wikipedia.org/wiki/Shapefile) y [GML](https://es.wikipedia.org/wiki/Geography_Markup_Language) que nos podemos descargar y utilizar. En este ejemplo, se utilizaron los polígonos de las parroquias, convirtiéndolos a formato [TopoJSON](https://en.wikipedia.org/wiki/GeoJSON#TopoJSON) y se dibujaron utilizando la librería [D3.js](d3js.org).

##### Pasos previos:
1. En este tutorial se asume que tenemos instalado GRAV y lo hemos configurado para poder ejecutar la librería D3.js. [Aquí cómo hacerlo](/d3-en-grav). Para utilizarlo en otro tipo de configuración, simplemente hay que cambiar las etiquetas específicas del plugin Assets para Javascript (`{assets:js_inline}{/assets}`) por etiquetas de `<script></script>`, las de estilo CSS `{assets:css_inline}{/assets}` por etiquetas `<style></style>` y colocarlos entre las etiquetas de `<head></head>` de nuestro documento después de la llamada a la librería JQUERY (la utilizamos para cargar el script sólo después de que cargue la página, pero si ponemos el script al final del documento podríamos quitarla).
2. Descargarse la capa de los polígonos de las parroquias de Bergondo en [webEIEL](http://webeiel.dicoruna.es/) (se pueden utilizar las de otros municipios si queréis). Estás capas están en WGS 84 / UTM zona 29N UTM o [EPSG:32629](http://spatialreference.org/ref/epsg/wgs-84-utm-zone-29n/).

3. Convertirlas a formato [TopoJSON](https://en.wikipedia.org/wiki/GeoJSON#TopoJSON). Para eso tenemos que tener instalado en nuestro sistema herramientas para hacer la conversión como un [SIG](https://es.wikipedia.org/wiki/Sistema_de_informaci%C3%B3n_geogr%C3%A1fica), o  [GDAL](http://www.gdal.org/) y la librería [TopoJSON](https://github.com/mbostock/topojson). En este último caso (GAL+TopoJSON), sólo necesitaríamos estos dos comandos para hacer la conversión ([más información aquí](http://bost.ocks.org/mike/map/)):
```
ogr2ogr -f GeoJSON  -t_srs EPSG:4326 -s_srs EPSG:32629 nombre_archivo_geojson.json nombre_archivo_origen.shp
topojson -o bergondo2.json --id-property geoid --properties name=entidad,nombre=nombre nombre_archivo_geojson.json 
```
Donde `-s_srs EPSG:32629` indica el formato de entrada (UTM Z29N) y `-t_srs EPSG:4326` indica el formato de salida en coordenadas geográficas [WGS84](http://spatialreference.org/ref/epsg/wgs-84/). Enlace al [archivo final en TopoJSON](/proyectos/bergondoabierto/mapa-parroquias-topojson/bergondo2.json).

##### Creando el mapa:

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
{/assets}
```

Ver el *[resultado](/proyectos/bergondoabierto/mapa-parroquias-topojson/)* .

