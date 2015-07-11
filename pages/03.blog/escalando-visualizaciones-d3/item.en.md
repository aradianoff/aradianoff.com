---
title: Method to scale visualizations created with the D3.js JavaScript library and make them responsive
slug: scaling-d3-visualizations
date: 10:34 28-06-2015
taxonomy:
    category: [technical, web, blog]
    tag: [D3, D3.js, visualization, tutorial, tips, responsive design]
---

Method to scale the `svg` created with [D3.js](http://d3js.org) and scale them for different devices by using a **scaling factor**. 

===

If we have a visualization created using the `D3` library, a method to change its dimensions so that its elements do not lose their proportions and changing the svg element dimensions without cropping in weird places so that it doesn't have weird effects in the layout of our web could be useful. 

To do this I use the method of: **inserting a scale factor**. A scale factor is a variable that tells me how much do I need to increase or decrease the size of my visualization to adapt it to the dimensions of interest, in this case, the size of the device where the visualization is being displayed.

Once I compute the value of my scale factor, I just need to do two things:
1. When I add the dimensions to the `svg` while creating it, we have to multiply the original dimensions of our visualization times our scale factor.
2. We have to also transform the scale of the main elements group of our visualization (a `<g></g>` block that contains all of the elements of the `svg` - if we don't have one we have to create it) scaling it by our scale factor, or multiplying the original scale by it (in the case of maps it is very common to have already scaled them to the map area we want to display).

Here is an example on **how to do it**. In this particular example, we didn't want to increase the dimensions even for bigger screens; just reduce them in case the device  dimensions are smaller than that of our visualization si an `if` statement was used to see when to reduce them or leave the `scalefactor` as `1`:

```
// Original dimensions 
var width = 500 ,
    height = 500;
    
// Computing the scalefactor. 
var scalefactor;
    if (jQuery(document).width() >= width) {scalefactor = 1}  
    else    {scalefactor = jQuery(document).width()/width};
    
var vis = d3.select("#visualization")
  .append("svg:svg")
  	 .attr("class", "drawing")
    .attr("width", width * scalefactor) 	// New scaled width
    .attr("height", height * scalefactor) // New scaled height
  .append("svg:g")
    .attr("transform", "scale("+ scalefactor+")")	// Scale visualization elements
    .attr("class", "main-g") 


```

>>>>> For more examples, the sources for the visualizations created by D3.js in this site all used the scalefactor. 
