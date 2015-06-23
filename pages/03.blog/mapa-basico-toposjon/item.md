---
title: Crear un mapa básico en toposjon
slug: mapa-basico-topojson
date: 10:00 26-06-2015
taxonomy:
    category: [tecnico, web, blog]
    tag: [D3, Grav, D3.js, tutorial, visualización, comoSeHizo]
---
En está guía vamos a ver como crear un mapa básico utilizando [Data Driven Documents (D3)](http://d3js.org) y [Topojson](https://en.wikipedia.org/wiki/GeoJSON#TopoJSON). En este caso, un mapa del municipio de Bergondo y sus parroquias.

===

Fuente de los datos y herramientas utilizadas:
>>>>>> La [Diputación de A Coruña](http://dicoruna.es/), mediante su portal [webEIEL](http://webeiel.dicoruna.es/) tiene disponibles mapas de los distintos municipios de la provincia en formato [SHAPE](https://es.wikipedia.org/wiki/Shapefile) y [GML](https://es.wikipedia.org/wiki/Geography_Markup_Language) que nos podemos descargar y utilizar. En este ejemplo, se utilizaron los polígonos de las parroquias, convirtiéndolos a formato [TOPOJSON](https://en.wikipedia.org/wiki/GeoJSON#TopoJSON) y se dibujaron utilizando la librería [D3.js](d3js.org).

