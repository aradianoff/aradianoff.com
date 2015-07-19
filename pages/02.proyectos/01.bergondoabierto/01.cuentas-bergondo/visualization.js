jQuery(document).ready( function() {

 var datafiles = [];
  datafiles.push("cuentas-bergondo/cuentas_bergondo_filtradas_2013.csv");
  var years = []
  datafiles.forEach(function(datafile){
    years = years.concat("2013");
    })
years.reverse();
    
d3.select("#fy.form-control").selectAll('option')
    .data(years)
    .enter()
    .append('option')
        .attr('value', function(d){ return d; })
        .property('selected', function(d,i){ return i == 0;})
        .text(function(d){return d;})
        ;

d3.select("#rev-group.form-control").selectAll('option')
    .data(revenue_title)
    .enter()
    .append('option')
        .attr('value', function(d){for (i=0; i<d.length; i++) {if(revenue_title[i]==d)return i;}})
        .property('selected', function(d,i){ return i == 0;})
        .text(function(d){return d;})
        ;
        
d3.select("#exp-group.form-control").selectAll('option')
    .data(expense_title)
    .enter()
    .append('option')
        .attr('value', function(d){for (i=0; i<d.length; i++) {if(expense_title[i]==d)return i;}})
        .property('selected', function(d,i){ return i == 0;})
        .text(function(d){return d;})
        ;
        
// Update sankey when you click the button        
document.getElementById("flow-change").onclick = function() {drawFlow();};

// run once to initially populate the chart
drawFlow();

function drawFlow(){
    years.reverse();
    var fy = d3.select("#fy.form-control").node().value,
        fy_i = years.indexOf(fy),
        file_i = Math.floor(fy_i / 2),
        filename = datafiles[file_i];
    years.reverse();
    
    var revenue_i = d3.select("#rev-group.form-control").node().value,
        expense_i = d3.select("#exp-group.form-control").node().value;

    d3.csv("" + filename, function(error, data){
        if (error) {
            console.log('error', error);
            return false;
        }
        var final_data = data_wrangle(data, fy, revenue_i, expense_i);
        do_with_budget(final_data);
    });
}

});
