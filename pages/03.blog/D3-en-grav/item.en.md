---
title: Using the D3 library in GRAV
slug: d3-in-grav
date: 10:00 23-06-2015
taxonomy:
    category: [technical, web, blog]
    tag: [D3, Grav, D3.js, tutorial]
---
In this guide we are going to see a method to use the [Data Driven Documents (D3)](http://d3js.org) in [Grav](http://getgrav.org), so that we can create our charts and visualizations with it.

===

This method creates a specific page per visualization. It is based in creating a custom template for the visualizations that includes the D3.js libraries if they are enabled (by default, `D3.js` is enabled and `toposjon.js` no) and adds a `div` block named `visualization` where you can append all of the objects that you generate for the visualization.

#####Pre-requisites:
1. Have a [GRAV](http://getgrav.org) instalation.
1. Have a custom theme ([Instruccions here](http://learn.getgrav.org/themes/theme-tutorial) and [here](http://learn.getgrav.org/themes/customization#theme-inheritance) )
1. Have the [Assets plugin](https://github.com/getgrav/grav-plugin-assets) or [Shortcodes plugin](https://github.com/Sommerregen/grav-plugin-shortcodes) installed and enabled. They use different labels but both can be used to call `JS` and `CSS` scripts  and can load the code that generates the visualizations. This example uses the Assets plugin.

#####Steps:

1. **Download libraries** [D3.js](http://d3js.org) and in this case also [Toposjon](https://github.com/mbostock/topojson/wiki/API-Reference#client-api) to create maps (it is better if they are already minimized: `d3.min.js` and `topojson.min.js`) and store them in the `js` folder of our theme.
2. Add the following lines to `user/config/site.yaml`:
```ruby
visualization:
        d3js: true
        topojson: false
```
3. Create a **custom page template** that we'll call `visualization.html.twig` in the `templates` folder of our theme. As ou theme (aRadianOff) is based in  [Antimatter](https://github.com/getgrav/grav-theme-antimatter): 
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
>>> If we wanted to include the visualizations within the posts of a blog, or as a module in a page, or with another theme, then we would have to create another custom template, but you get the idea.
4. **Create our visualization** like a grav page using a file named `visualization.md`. Header options are the same as other pages, but if we wanted to activate the `topojson` libraries in our visualization, we would add:
```ruby
visualization:
        topojson: true
```
The `js` code that creates the visualization should be inserted within the `{assets:inline_js}` and `{/assets}` tags so that the **Assets plugin** can proccess it. Also, put the code in a `jQuery(document).ready( function() {}`call to make sure the DOM is loaded before the script is executed:
```markup
---
title: Exemplo of visualization with toposjon enabled
visualization:
    topojson: true
---
{assets:inline_css}
	<!-- Custom visualization styles -->
{/assets}
{assets:inline_js}
	jQuery(document).ready( function() {
		<!-- Visualization code -->
	});
{/assets}
```
**Some important tips**:
 1. Initial calls to `d3.select` in which we start to create the elements of the visualization should be directed to the `visualization` block we created in the twig template and not to other page elements like `body`. That way, initial calls would be `d3.select("#visualization")` and from that call we would start creating the new elements. 
 2. Any function that uses windows events to start executing (like clicking on the window or pressing a key) can give us trouble if it is defined like:
 ```js
 function nameOfFuncion() {}
 ```
 and should be defined thus:
  ```js
window.nameOfFuncion = function() {}
 ```
 3. Para evitar que los estilos específicos de la visualización (CSS) interfieran con los de la web, especificar que tienen que pertenecer a los elementos que se encuentren dentro de `#visualization`:
 ```css
 #visualization element {
 	// Style properties
 }
 ```
And with that, I think that i have covered all of the basics you will neeed to include your `D3.js`visualizations in a page powered by GRAV. 

>>>> **Warning:** If GRAV cache is enabled, you will find that your visualizations will stop working everytime you reload a page after a change. This is because the cache that GRAV uses by default just caches part of the page, and plugins like Asssets or Shortcodes stop functioning properly. You can fix it deactivating the cache in your development environment (your computer) and using the [Advanced Page Cache](https://github.com/getgrav/grav-plugin-advanced-pagecache) plugin in your production environments (your published websites). 



 
