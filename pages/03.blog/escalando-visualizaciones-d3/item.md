---
title: Método para escalar visualizaciones realizadas con la librería de JavaScript D3.js y hacerlas 'adaptables'(responsive)
slug: escalando-visualizaciones-d3
date: 10:34 28-06-2015
taxonomy:
    category: [tecnico, web, blog]
    tag: [D3, D3.js, visualización, tutorial, consejos, responsive design, diseño adaptable]
---

Método para escalar los `svg` creados con [D3.js](http://d3js.org) y hacer que se escalen apropiadamente a distintos dispositivos insertando un **factor de escala**. 

===

Si tenemos un gráfico creado utilizando la librería `D3`, puede que nos interese cambiarle el tamaño sin que sus elementos pierdan sus proporciones, y sin que se nos recorte por sitios raros o la caja de svg se mantenga con las proporciones originales y nos provoque efectos indeseados en la disposición de nuestra web. 

Para hacerlo yo utilizo este método: **insertar un factor de escala**. Un factor de escala es una variable que me indica cúanto tengo que aumentar o reducir el tamaño de mi gráfico para conseguir que se adapte a las dimensiones que me interesen, en este caso, al tamaño del dispositivo desde el que se abre.

Una vez calculado el valor de mi factor de escala, sólo tengo que hacer dos pequeñas cosas:
1. Al añadirle dimensiones al `svg` cuando lo creamos, multiplicaremos los valores originales de nuestra visualización por nuestro factor de escala.
2. Transformaremos la escala del grupo principal de elementos de nuestra visualización (un bloque `<g></g>` que engloba todos los elementos del `svg` - si no lo hay tenemos que crearlo) escalándolo por el factor de escala, o multiplicando la escala original por el mismo (en el caso de mapas es muy común que ya les hayamos modificado la escala para adaptarlos a la parte del mapa que queremos visualizar).

Aquí os dejo un código de ejemplo sobre **cómo hacerlo**. En este ejemplo particular, no queremos aumentar las dimensiones aunque la pantalla sea grande sino sólo reducirlas en el caso de que las dimensiones del dispositivo sean más pequeñas que nuestra visualización así que utilizaremos un `if` para determinar cuando hay que reducir y sino dejar el factor como `1`:
```
// Dimensiones originales 
var width = 500 ,
    height = 500;
    
// Calculando el factor de escala. 
var scalefactor;
    if (jQuery(document).width() >= width) {scalefactor = 1}  
    else    {scalefactor = jQuery(document).width()/width};
    
var vis = d3.select("#visualization")
  .append("svg:svg")
  	 .attr("class", "drawing")
    .attr("width", width * scalefactor) 	// Nuevo ancho escalado
    .attr("height", height * scalefactor) // Nueva altura escalada
  .append("svg:g")
    .attr("transform", "scale("+ scalefactor+")")	// Escalar elementos del gráfico
    .attr("class", "main-g") 


```

>>>>> Para ver más ejemplos, las fuentes de las visualizaciones de este dominio utilizan factores de escala. 
