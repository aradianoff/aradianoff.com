// Based on the OaklandOpenBudget's flow.js but with dynamic groupings for revenues and expenses.

// Group Data:
var revenue_title = ["Ingresos: Por Capítulo","Ingresos: Por Artículo"],
    expense_title = ["Gastos: Por Política de Gasto","Gastos: Por grupos de programas", "Gastos: Por Capítulo", "Gastos: Por Artículo"];

var revenue_group = ["capitulo_description","articulo_description"], 
    expense_group = ["politica","grupo_programa","capitulo_description","articulo_description"];

var revenue_order = [[
      // keep variations of the same label on a single line
      "Impuestos directos", 
      "Impuestos indirectos", 
      "Transferencias corrientes",
      "Tasas, precios públicos y otros ingresos",
      "Ingresos patrimoniales",
      "Enajenación de inversiones reales", 
      "Transferencias de capital", 
      "Activos financieros"
    ],[
      // keep variations of the same label on a single line
      "Impuestos sobre el capital", 
      "Impuestos sobre las actividades económicas", 
      "Otros impuestos indirectos",
      "Tasas", 
      "Precios públicos",
      "Tasas por la realización de actividades de competencia local", 
      "Tasas por la utilización privativa o el aprovechamiento especial del dominio público local",
      "Otros ingresos", 
      "Transferencias corrientes de la Administración del Estado",
      "Transferencias corrientes de Comunidades Autónomas",
      "Transferencias corrientes de entidades locales",
      "Intereses de depósitos",
      "Productos de concesiones y aprovechamientos especiales",
      "De las demás inversiones reales",
      "De Comunidades Autónomas",
      "De Entidades locales", 
      "Reintegro de préstamos de fuera del sector público"
    ]];
    
var expense_order = [[
        // keep variations of the same label on a single line
        "Seguridad y movilidad ciudadana",
        "Vivienda y urbanismo",
        "Bienestar comunitario",
        "Medio ambiente",
        "Servicios sociales y promoción social",
        "Fomento del empleo",
        "Sanidad",
        "Educación",
        "Cultura",
        "Deportes",
        "Infraestructuras",
        "Órganos de gobierno",
        "Servicios de carácter general", 
        "Transferencias a otras administraciones públicas",
        "Deuda Pública"
    ],  
    [
        // keep variations of the same label on a single line
        "Protección civil", "Administración general seguridad-protección civil", 
        "Seguridad y orden público", 
        "Vivienda y urbanismo", "Administración general vivienda y urbanismo",
        "Saneamiento, abastecimiento, distribución de agua",
        "Recogida, eliminación de residuos", 
        "Cementerio y s. funerario", 
        "Alumbrado público", 
        "Medio ambiente", "Parques y jardines", "Otras actuaciones del medio ambiente",
        "Servicios sociales y promoción social", "Administración general servicios sociales", 
        "Asistencia a personas dependientes",
        "Fomento del empleo",
        "Sanidad", "Acciones públicas relativas a salud",
        "Educación", "Administración general de educación",
        "Cultura", "Admón.general de cultura", 
        "Bibliotecas y archivos", 
        "Fiestas populares y festejos",
        "Deportes", "Administración general de deportes",
        "Infraestructuras", "Administración general de infraestructuras",
        "Caminos vecinales",
        "Órganos de gobierno",
        "Administración general", 
        "Transferencias a CC.AA.",
        "Deuda Pública"
    ],  
    [
            // keep variations of the same label on a single line
        "Gastos de personal",
        "Gastos corrientes en bienes y servicios",
        "Inversiones reales",
        "Transferencias corrientes",
        "Activos financieros", 
        "Pasivos financieros"
    ],  
    [
            // keep variations of the same label on a single line
        "Órganos de gobierno y personal directivo",
        "Personal funcionario",
        "Personal laboral",
        "Personal eventual",
        "Otro personal",
        "Incentivos al rendimiento", 
        "Indemnizaciones por razón del servicio",
        "Cuotas, prestaciones y gastos sociales a cargo del empleador",
        "Reparaciones, mantenimiento y conservación",
        "Material, suministros y otros", 
        "Arrendamientos y cánones",
        "Inversiones de reposición de infraestructuras y bienes destinados al uso general",
        "Inversión nueva asociada al funcionamiento operativo de los servicios",
        "Inversión nueva en infraestructuras y bienes destinados al uso general",
        "A entidades locales",
        "A familias e instituciones sin fines de lucro",
        "Transferencias corrientes a comunidades autónomas", 
        "Amortización de préstamos y operaciones en euros", 
        "De préstamos y otras operaciones financieras en euros",     
        "Concesión de préstamos fuera del sector público"
          
    ]];

//Start code:
var margin = {top: 20, right: 1, bottom: 6, left: 1},
    width = 1140 - margin.left - margin.right,
    height = 630 - margin.top - margin.bottom;

var formatNumber = d3.format(",.2f"),
    format = function(d) { return formatNumber(d) + "€"; },
    color = d3.scale.category10();

var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var revTitle = svg.append("text")
    .text("")
    .attr("y", margin.top * 0.6)
    .attr("x", margin.left);

var expTitle = svg.append("text")
    .text("")
    .attr("y", margin.top * 0.6)
    .attr("x", margin.left + width)
    .attr("text-anchor", "end");

// define color scales
var fundColors = d3.scale.ordinal()
    .domain(["Fondo General", "Fondos específicos"])
    .range(["#ffd92f", "#ffd92f"]);
    // .range(["#276419", "#b8e186"]);
var erColors = d3.scale.ordinal()
    .domain(["expense", "revenue"])
    .range(["#ef8a62", "#67a9cf"])
    // .range(["#c51b7d", "#8e0152"]);

// create color gradients for links
svg.append('linearGradient')
    .attr("id", "gradientRtoGF")
    .attr("x1", 0).attr("y1", 0)
    .attr("x2", '100%').attr("y2", 0)
    .selectAll("stop")
    .data([
        {offset: "10%", color: erColors("revenue")},
        {offset: "90%", color: fundColors("Fondo General")}
    ])
    .enter().append("stop")
    .attr("offset", function(d) { return d.offset; })
    .attr("stop-color", function(d) { return d.color; });
svg.append('linearGradient')
    .attr("id", "gradientRtoNF")
    .attr("x1", 0).attr("y1", 0)
    .attr("x2", '100%').attr("y2", 0)
    .selectAll("stop")
    .data([
        {offset: "10%", color: erColors("revenue")},
        {offset: "90%", color: fundColors("Fondos específicos")}
    ])
    .enter().append("stop")
    .attr("offset", function(d) { return d.offset; })
    .attr("stop-color", function(d) { return d.color; });
svg.append('linearGradient')
    .attr("id", "gradientNFtoE")
    .attr("x1", 0).attr("y1", 0)
    .attr("x2", '100%').attr("y2", 0)
    .selectAll("stop")
    .data([
        {offset: "10%", color: fundColors("Fondos específicos")},
        {offset: "90%", color: erColors("expense")}
    ])
    .enter().append("stop")
    .attr("offset", function(d) { return d.offset; })
    .attr("stop-color", function(d) { return d.color; });
svg.append('linearGradient')
    .attr("id", "gradientGFtoE")
    .attr("x1", 0).attr("y1", 0)
    .attr("x2", '100%').attr("y2", 0)
    .selectAll("stop")
    .data([
        {offset: "10%", color: fundColors("Fondo General")},
        {offset: "90%", color: erColors("expense")}
    ])
    .enter().append("stop")
    .attr("offset", function(d) { return d.offset; })
    .attr("stop-color", function(d) { return d.color; });

// wrangle the data
function data_wrangle(dataset, fy, revenue_i, expense_i){
    var newdata = dataset.filter(function(v){
        return v.budget_year == fy
    })
    
    //Set titles:
    revTitle.text(revenue_title[revenue_i]);
    expTitle.text(expense_title[expense_i]);
    
    rev_order = revenue_order[revenue_i]
    
    rev = newdata.filter(function(v,i,a){
        return v.account_type == "Revenue";
    });
    revcats = d3.nest()
        .key(function(d){
            return eval("d."+ revenue_group[revenue_i]);
        })
        .sortKeys(function(a,b){
            return rev_order.indexOf(a) - rev_order.indexOf(b);
        })
        .key(function(d){
            if (d.fund_code == "1") {
                return "Fondo General";
            } /*else {
                return "Fondos específicos";
            }*/
        })
        .rollup(function(v){
            var values = v;
            values.total = d3.sum(values, function(d){
                return +d.amount;
            });
            return values;
        })
        .entries(rev);
    nodes = [{"name": "Fondo General", "type": "fund", "order": 0}/*, {"name": "Fondos específicos", "type": "fund", "order": 1}*/];
    nodeoffset = nodes.length;
    links = [];
    for (var i = 0; i < revcats.length; i++){
        nodes.push({"name": revcats[i].key, "type": "revenue"});
        for (var x = 0; x < revcats[i].values.length; x++) {
            var link = {
                "source": i + nodeoffset,
                "value": revcats[i].values[x].values.total,
            };
            if (revcats[i].values[x].key == "Fondo General"){
                link.target = 0;
            } /*else if (revcats[i].values[x].key == "Fondos específicos") {
                link.target = 1;
            }*/
            links.push(link);
        }

    }
    exp = newdata.filter(function(v,i,a){
        return v.account_type == "Expense";
    });
    exp_order = expense_order[expense_i]
    
    expdivs = d3.nest()
        .key(function(d){
            return eval("d."+ expense_group[expense_i]);
        })
        .sortKeys(function(a,b){
            return exp_order.indexOf(a) - exp_order.indexOf(b);
        })
        .key(function(d){
            if (d.fund_code == "1") {
                return "Fondo General";
            } /*else {
                return "Fondos específicos";
            }*/
        })
        .rollup(function(v){
            var values = v;
            values.total = d3.sum(values, function(d){
                return d.amount;
            });
            return values;
        })
        .entries(exp);
    for (var i = 0; i < expdivs.length; i++){
        nodes.push({"name": expdivs[i].key, "type": "expense"});
        for (var x = 0; x < expdivs[i].values.length; x++) {
            var link = {
                "target": i + nodeoffset + revcats.length,
                "value": expdivs[i].values[x].values.total,
            };
            if (expdivs[i].values[x].key == "Fondo General"){
                link.source = 0;
            } /*else if (expdivs[i].values[x].key == "Fondos específicos") {
                link.source = 1;
            }*/
            links.push(link);
        }
    }

    return {"nodes": nodes, "links": links};
}

// render the sankey
function do_with_budget(data) {

  svg.select("#chart").remove();

  var chart = svg.append("g")
      .attr("id", "chart")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var sankey = d3.sankey()
      .nodeWidth(20)
      .nodePadding(10)
      .size([width, height]);

  var path = sankey.link();

  sankey
      .nodes(data.nodes)
      .links(data.links)
      .layout(0);

  var link = chart.append("g")
    .selectAll(".link")
      .data(data.links)
    .enter().append("path")
      .attr("class", "link")
      .attr("d", path)
      .style("stroke-width", function(d) {
          return Math.max(1, d.dy); })
      .style("stroke", function(d){
          switch (d.target.name){
              case "Fondo General":
                  return "url('#gradientRtoGF')";
              //case "Fondos específicos":
              //    return "url('#gradientRtoNF')";
          }
          switch (d.source.name) {
              case "Fondo General":
                 return "url('#gradientGFtoE')";
//              //case "Fondos específicos":
//              //    return "url('#gradientNFtoE')";
          }

      })
      .sort(function(a, b) {
          return b.dy - a.dy;
          })
      .on("mouseover", function(d){
        d3.select(this).classed("highlight", true);
        d3.select("#hover_description")
            .classed("show", true)
            .text(d.source.name + " → " + d.target.name + ": " + format(d.value));
      })
      .on("mousemove", function(d){
          d3.select("#hover_description")
            .style({
                    "top": (d3.event.y - 10 + $(window).scrollTop()) + "px",
                    "left": (d3.event.x + 10) + "px"
                    });
      })
      .on("mouseout", function(){
        d3.select(this).classed("highlight", function(){
            return d3.select(this).classed('click');
        })
        d3.select("#hover_description")
            .classed("show", false);
      });

  var node = chart.append("g").selectAll(".node")
      .data(data.nodes)
    .enter().append("g")
      .attr("class", function(d){ return "node " + d.type; })
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });


  node.append("rect")
      .attr("height", function(d) { return d.dy; })
      .attr("width", sankey.nodeWidth())
      .style("fill", function(d) {
          switch (d.type) {
              case "fund":
                  d.color = fundColors(d.name);
                  break;
              default:
                  d.color = erColors(d.type);
                  break;
          }
          return d.color;
      })
      .style("stroke", function(d) { return d3.rgb(d.color).darker(1); })
      .on("mouseover", function(d){
          var thisnode = d3.select(this.parentNode);

        //   highlight node only, not flows
          thisnode.classed("hover", true);

        //   append total amount to label
          thisnode.select("text").transition()
            .text(function(d){
                var text = d.name;
                text += ': ' + format(d.value);
                return text;
            });
      })
      .on("mouseout", function(d){
          var thisnode = d3.select(this.parentNode);
        //   remove node highlight
          thisnode.classed("hover", false);
        //   remove amount from label
        if (!thisnode.classed('highlight')) {
            thisnode.select("text").transition()
              .text(function(d){ return d.name; });
        }

      })
      .on("click", function(d){
          var thisnode = d3.select(this.parentNode);
          if (thisnode.classed("highlight")) {
              thisnode.classed("highlight", false);
              thisnode.classed("hover", false);
          } else {
            //   node.classed("highlight", false);
              thisnode.classed("highlight", true);
          }

          link.classed('highlight click', function(link_d){
              if ([link_d.target.name, link_d.source.name].indexOf(d.name) >= 0) {
                  return thisnode.classed("highlight");
              } else {
                  return d3.select(this).classed("click");
              }
          });

          thisnode.select("text").transition()
            .text(function(d){
                var text = d.name;
                if (thisnode.classed('highlight')) {
                    text += ': ' + format(d.value);
                }
                return text;
            });
      });

  node.append("text")
      .attr("x", -6)
      .attr("y", function(d) { return d.dy / 2; })
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .attr("transform", null)
      .text(function(d) { return d.name; })
    .filter(function(d) { return d.x < width / 2; })
      .attr("x", 6 + sankey.nodeWidth())
      .attr("text-anchor", "start");
};
