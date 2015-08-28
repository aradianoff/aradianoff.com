---
title: Mapa de farolas de Bergondo
date: 31-07-2015
making_off: visualizando-alumbrado-bergondo
class: visualization-page
visualization:
    topojson: true
taxonomy:
    category: [visualization]
    project: [Bergondo@bierto]
    tags: [mapas, topojson, D3, datospublicos, visualización, bergondo, alumbrado]
false: published
---

Mapa con los puntos de luz (farolas) que conforman el alumbrado público en Bergondo y otros datos relativos al alumbrado público de interés (datos del 2011).

===

<div id="visualization"></div>

>>>>>> Fuente: Capas originales de puntos de luz y polígonos de las parroquias en formato [SHAPE](https://es.wikipedia.org/wiki/Shapefile) de [webEIEL](http://webeiel.dicoruna.es/) / [Diputación de A Coruña](http://dicoruna.es/), convertidos a formato [TOPOJSON](https://en.wikipedia.org/wiki/GeoJSON#TopoJSON) y dibujados utilizando la librería [D3.js](d3js.org).

>>>>> NOTAS


{{% assets type="css" inline=true priority=10 load="defer" pipeline=true %}}

#visualization svg{
    background: #111;
}
    
#visualization .label {
	font-size: 1.5rem;
	fill-opacity: .8;
}
#visualization .light_points {
   fill-opacity: .8; 
}

{{% end %}}

{{% assets type="js" inline=false priority=10 load="defer" pipeline=true %}}
./visualization.js
{{% end %}}




