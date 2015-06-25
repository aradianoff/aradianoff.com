---
title: Utilizando la librería D3 dentro de GRAV
slug: d3-en-grav
date: 10:00 23-06-2015
assets:
  enabled: false
taxonomy:
    category: [tecnico, web, blog]
    tag: [D3, Grav, D3.js, tutorial]
---
En está guía vamos a ver un método para poder utilizar dentro de [Grav](http://getgrav.org) la librería de [Data Driven Documents (D3)](http://d3js.org), de forma que podamos crear nuestros gráficos y visualizaciones utilizándola.

===

Este método crea una página específica por visualización. Se basa en crear una plantilla específica para las visualizaciones que incluya las librerías de D3.js si están activadas (por defecto D3.js se carga y toposjon.js no) y añadir un bloque `div` llamado `visualization` donde agregar todos los objetos que generemos en la visualización.

#####Requisitos previos:
1. Tener instalado [GRAV](http://getgrav.org)
1. Tener un tema propio ([aquí las instrucciones](http://learn.getgrav.org/themes/theme-tutorial) y [aquí](http://learn.getgrav.org/themes/customization#theme-inheritance) )
1. Tener instalado y activado el [plugin Assets](https://github.com/getgrav/grav-plugin-assets) o el [plugin Shortcodes](https://github.com/Sommerregen/grav-plugin-shortcodes). Utilizan etiquetas distintas pero ambos se utilizan para llamar a scripts de `JS` y sirven para cargar el código para generar las visualizaciones. Este ejemplo utiliza el plugin Assets.

#####Pasos a seguir:

1. **Bajarse las librerías** [D3.js](http://d3js.org) y en este caso también [Toposjon](https://github.com/mbostock/topojson/wiki/API-Reference#client-api) para poder crear mapas (mejor si ya están minimizadas: `d3.min.js` y `topojson.min.js`) y guardarlas en la carpeta `js` de nuestro tema.
2. Añadir a `user/config/site.yaml` las siguientes líneas:
```ruby
visualization:
        d3js: true
        topojson: false
```
3. Crear una **plantilla de página específica** que llamaremos `visualization.html.twig` en el directorio `templates` de nuestro tema. Como el nuestro es un tema basado en [Antimatter](https://github.com/getgrav/grav-theme-antimatter): 
```twig
{% extends 'partials/base.html.twig' %}
    {% if page.header.visualization.d3js == true or page.header.visualization.d3js == null %}	 
    	{% if site.visualization.d3js == true %}
			{% do assets.addJs('theme://js/d3.min.js') %}
    	{% endif %}
    {% endif %}
    {% if site.visualization.topojson == true or page.header.visualization.topojson == true %}
		{% do assets.addJs('theme://js/topojson.min.js') %}
    {% endif %}
{% block content %}
    {% if config.plugins.breadcrumbs.enabled %}
        {% include 'partials/breadcrumbs.html.twig' ignore missing %}
    {% endif %}  
   <h1>{{ page.title }}</h1>
	{{ page.content }}
	<div id="visualization">
	</div>
{% endblock %}
```
>>> Si quisieramos incluir las visualizaciones dentro de los posts de un blog, de forma modular en alguna página, o con otro tema, entonces tendríamos que crear una plantilla adecuada, pero la idea es la misma.
4. **Crear nuestra visualización** como una página de grav utilizando un archivo `visualization.md`. Las opciones de los headers (cabeceras) son las mismas que para las otras páginas, pero si tuviesemos que utilizar `topojson` para nuestra visualización, añadiríamos:
```ruby
visualization:
        topojson: true
```
El código `js` con el que creamos la visualización tenemos meterlo dentro de las etiquetas `{assets:inline_js}` y `{/assets}`para que lo procese el **plugin Assets**. Además, hay que incluirlo también dentro de una llamada a `jQuery(document).ready( function() {}` para asegurarse que el DOM esté cargado antes de ejecutar el script y que así funcione. Nos quedaría algo así como:
```markup
---
title: Ejemplo de visualizacion con toposjon activado
visualization:
    topojson: true
---
{assets:inline_css}
	<!-- Estilos personalizados de la visualización -->
{/assets}
{assets:inline_js}
	jQuery(document).ready( function() {
		<!-- Código de tu visualización -->
	});
{/assets}
```
A tener en cuenta:
 1. Las llamadas de `d3.select` iniciales con las que empezamos a crear los objetos de la visualización tienen que estar referidas al bloque `visualization` que se crea en la plantilla y no a otros elementos de la página como `body`. Así, las llamadas iniciales serían `d3.select("#visualization")` y a partir de ahí se irían creando los nuevos objetos. 
 2. Cualquier función que se ejecute a partir de alguna acción como pinchar en la ventana o pulsar una tecla nos puede dar problemas si está definida como:
 ```js
 function nombreFuncion() {}
 ```
 y habría que definirla de esta manera:
  ```js
window.nombreFuncion = function() {}
 ```
 3. Para evitar que los estilos específicos de la visualización (CSS) interfieran con los de la web, especificar que tienen que pertenecer a los elementos que se encuentren dentro de `#visualization`:
 ```css
 #visualization element {
 	// Style properties
 }
 ```
Y con esto creo que ya está todo lo básico que necesitaréis para incluir vuestras visualizaciones con `D3.js` en las páginas de GRAV. 

>>>> **Cuidado:** Si tenéis habilitado el cache de GRAV, veréis que vuestras visualizaciones dejarán de funcionar en cuanto actualiceis la página. Esto es porque el caché por defecto que trae GRAV sólo cachea parte de la página y los plugins de Assets o Shortcodes dejan de funcionar apropiadamente. Para arreglarlo, podéis desactivar el cache en vuestro sistema de desarrollo y utilizar el plugin [Advanced Page Cache](https://github.com/getgrav/grav-plugin-advanced-pagecache) con vuestros sistemas de producción (vuestra web ya terminada). 



 
