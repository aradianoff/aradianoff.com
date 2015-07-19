---
title: Resumen de los informes de cuentas de Bergondo
slug: cuentas-bergondo
date: 18-07-2015
making_off: extrayendo-informacion-rendiciondecuentas.es
class: visualization-page
taxonomy:
    category: [visualization]
    project: [Bergondo@bierto]
    tags: [cuentas, bergondo, D3, ingresos, gastos, sankey, visualizacion]
---

Diagrama de Sankey del informe de cuentas correspondiente al año fiscal 2013 de Bergondo. 

===

Este diagrama muestra el flujo de dinero en las Cuentas de Bergondo: de las fuentes de ingresos (izquierda), que conforman los recursos disponibles (centro), y a los distintos gastos (derecha).

_Coloca el rat&oacute;n por encima de las l&iacute;neas de flujo para resaltarlas; pincha en las barras para resaltar su flujo._

<div class="row">
    <div class="vis-menus">
        A&ntilde;o Fiscal
        <select id="fy" class="form-control"></select>
    </div>
    <div class="vis-menus">
        Agrupaci&oacute;n de Ingresos
        <select id="rev-group" class="form-control"></select>
    </div>
    <div class="vis-menus">
        Agrupaci&oacute;n de Gastos
        <select id="exp-group" class="form-control"></select>
    </div>
    <div class="vis-menus button">
        <div id="flow-change"> Cambiar </div>
    </div>
</div>

<div id="sankey">
    <div id="chart"></div>
</div>

>>>>>> **Fuente de Datos:** [rendiciondecuentas.es](https://www.rendiciondecuentas.es) // **Código** basado en: [OpenBudgetOakland](http://openbudgetoakland.org/) 

>>>>>**Acerca de los datos**: Los datos de ingresos se refieren a los derechos reconocidos netos, que indican los recursos que ha obtenido el ayuntamiento en ese ejercicio. Los datos de gastos se refieren a las obligaciones reconocidas netas, que indican el importe que se ha gastado en ese ejercicio y, por tanto, el que se considera gasto presupuestario.  Los datos de gastos e ingresos est&aacute;n agrupados seg&uacute;n la clasificaci&oacute;n de la [orden que establece la estructura de los presupuestos de las entidades locales](http://www.boe.es/buscar/act.php?id=BOE-A-2008-19916).

<div id="hover_description"></div>

{{% assets type="js" inline=false load="defer" pipeline=true %}}
./sankey.js
./flows.js
./visualization.js
{{% end %}}

{{% assets type="css" inline=false load="defer" pipeline=true %}}
./sankey.css
{{% end %}}






