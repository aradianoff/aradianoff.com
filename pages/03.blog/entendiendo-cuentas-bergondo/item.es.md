---
title: Visualizando las cuentas de un ayuntamiento (Parte II): Entendiendo las cuentas
slug: entendiendo-informacion-cuentas
shortcodes: false
process:
    twig: true
twig_first: true
date: 21:00 19-07-2015
published: true
taxonomy:
    category: [tecnico, web, blog]
    tag: [presupuestos, bergondo, tutorial, ingresos, gastos]
---

¿Qué son los datos que aparecen en las cuentas? ¿Cuáles nos interesan? ¿A qué tipo de cosas se refieren? En esta entrada (continuación de la serie de [Visualización de las cuentas de un ayuntamiento - Parte I](/es/blog/extrayendo-informacion-rendiciondecuentas.es)), conoceremos qué datos que hemos extraído para poder entender qué vamos a visualizar. 

===

En la primera parte de este tutorial vimos un método semi-automático para [extraer las cuentas de un ayuntamiento de la web](/es/blog/extrayendo-informacion-rendiciondecuentas.es) en España. En este, vamos a ver qué tipo de información hemos extraído y con qué parte nos quedaremos para trabajar posteriormente. A nosotros en este caso nos interesa saber:
1. ¿De dónde obtuvieron el dinero los ayuntamientos?
2. ¿Cómo, cuánto y en qué gastaron el dinero?

##### Ingresos de un ayuntamiento
Los ayuntamiento obtienen ingresos de varias fuentes: procedentes de las economías particulares, fundamentalmente a través de impuestos, tasas y otros tributos y procedentes del Estado, de la Comunidad Autónoma a la que pertenecen y de la Unión Europea, mediante transferencias o subvenciones. También pueden obtener recursos procedentes de su patrimonio y además pueden pedir préstamos con los límites que la Ley les impone.
Los ingresos que obtiene una Entidad local se reflejan en el [Estado de liquidación del presupuesto de ingresos](http://www.rendiciondecuentas.es/es/informaciongeneral/presupuestoentidades/EstadoLiquidacionPresupuestoIngresos.html). Los tipos de ingresos se clasifican económicamente según lo establecido en el Anexo IV de la [orden que establece la estructura de los presupuestos de las entidades locales](http://www.boe.es/buscar/act.php?id=BOE-A-2008-19916).


Dentro del Estado de Liquidación, los derechos reconocidos netos indican los recursos que ha obtenido el ayuntamiento en ese ejercicio. 

##### Gastos de un ayuntamiento
Entre todas las partes y apartados de las cuentas que hemos obtenido, el [Estado de liquidación del presupuesto de gastos](http://www.rendiciondecuentas.es/es/informaciongeneral/presupuestoentidades/EstadoLiquidacionPresupuestoGastos.html) informa sobre cómo se ha ejecutado el presupuesto de gastos de un ayuntamiento y, por tanto, contiene la información necesaria para conocer cuánto se ha gastado el ayuntamiento en un año, en qué se ha gastado los recursos que ha obtenido en ese año y quién ha gastado esos recursos. Los tipos de gastos se clasifican económica y funcionalmente según lo establecido en los Anexos I y II de la [orden que establece la estructura de los presupuestos de las entidades locales](http://www.boe.es/buscar/act.php?id=BOE-A-2008-19916). Desgraciadamente en esta orden no aparecen todos los que se utilizan, y en nuestras cuentas nos encontraremos algunos códigos que no aparecen en la lista. 

Las obligaciones reconocidas netas mostradas en el Estado de Liquidación indican el importe que se ha gastado en ese ejercicio y, por tanto, el que se considera gasto presupuestario. 


>>>>>> En [aRadianOff](http://www.aradianoff.com) hemos creado una tabla `.ods` con todos los tipos de gastos e ingresos establecidos para los presupuestos locales según la orden de arriba, que podéis descargar y utilizar aquí: [Codigos Presupuestos Locales]({{ page.url }}/Codigos.presupuestos.locales.ods)

En función de lo que queramos visualizar tendremos que agrupar nuestros datos de cuentas de una manera u otra, por eso, tener una visión general de cómo se agrupan y clasifican los gastos e ingresos es importante. 


##### Visualizando de forma general las cuentas
Basándonos en el código que utiliza el projecto [OpenBudgetOakland](http://openbudgetoakland.org/) hemos generado un [diagrama de Sankey](https://es.wikipedia.org/wiki/Diagrama_de_Sankey) interactivo para mostrar tanto los ingresos como los gastos de las cuentas para el año fiscal 2013 en Bergondo, con distintas opciones de clasificación de los datos. 

[**Ver Diagrama de Sankey de Cuentas de Bergondo**](/proyectos/bergondoabierto/cuentas-bergondo) 


