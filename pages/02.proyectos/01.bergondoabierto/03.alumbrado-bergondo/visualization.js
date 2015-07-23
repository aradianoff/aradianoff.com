jQuery(document).ready( function() {

// Scale graph for different devices
var scalefactor;
    if (jQuery(document).width() >= 500) {scalefactor = 1}  
    else    {scalefactor = jQuery(document).width()/500};
	
 
var width = 500 * scalefactor,
    height = 500 * scalefactor;

var svg = d3.select("#visualization").append("svg")
    .attr("width", width)
    .attr("height", height);
    
// Draw map
var puntos_luz;
d3.json("alumbrado-bergondo/puntosluz.json", function(error, puntosluz) {
  if (error) return console.error(error);
  puntos_luz = puntosluz;   
});

//var nested_puntos_luz=d3.nest()
//    .key(function(d) { return d.entidad; })
//    .entries(puntos_luz);

d3.json("mapa-parroquias-topojson/bergondo2.json", function(error, bergondo) {
  if (error) return console.error(error);

var parroquias = topojson.feature(bergondo, bergondo.objects.parroquia_pol);
var projection = d3.geo.mercator()
    .center([-8.24,43.31]) /* Centrar las coordenadas a nuestra zona*/
    .scale(250000* scalefactor) /*Escalar de forma apropiada*/
 	 .translate([width / 2, height / 2]);
 	 
var path = d3.geo.path()
    .projection(projection)
    .pointRadius(1.0);

/* Crear polígonos de las parroquias */  
svg.selectAll(".parroquia_pol")
    .data(topojson.feature(bergondo, bergondo.objects.parroquia_pol).features)
  .enter().append("path")
    .attr("class", function(d) { return "parroquia_pol " + d.id; })
    .attr("d", path)
    .style("fill", "#222")
    .style("stroke", "#444");
    
// Add light points
svg.append("path")
      .datum(topojson.feature(puntos_luz, puntos_luz.objects.puntos_luz))
      .attr("class", "light_points")
      .attr("d", path)
      .style("fill", "#ffd92f");
    
svg.append("svg:g")
  .attr("class", "label")
  .append("svg:text")
    .attr("x", 1.75*width / 3)
    .attr("y", 3.5*height / 4)
    .attr("fill", "#dedede")
    .text("Farolas de Bergondo:");
    
svg.append("svg:g")
  .attr("class", "label")
  .append("svg:text")
    .attr("x", 2*width / 3)
    .attr("y", 3.70*height / 4)
    .attr("fill", "#dedede")
    .text(puntos_luz.objects.puntos_luz.geometries.length +" farolas");

    	   
});  

});

