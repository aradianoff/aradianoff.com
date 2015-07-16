---
title: Visualizando las cuentas de un ayuntamiento (Parte II): Entendiendo las cuentas
slug: entendiendo-informacion-cuentas
shortcodes: false
date: 10:00 16-07-2015
published: false
taxonomy:
    category: [tecnico, web, blog]
    tag: [presupuestos, bergondo, tutorial, ingresos, gastos]
---

¿Qué son los datos que aparecen en las cuentas? ¿Cuáles nos interesan? ¿A qué tipo de cosas se refieren? En esta entrada (continuación de la serie de [Visualización de las cuentas de un ayuntamiento - Parte I](./extrayendo-informacion-rendiciondecuentas.es)), conoceremos qué datos que hemos extraído para poder entender qué vamos a visualizar. 

===

En la primera parte de este tutorial vimos un método semi-automático para [extraer las cuentas de un ayuntamiento de la web](./extrayendo-informacion-rendiciondecuentas.es) en España. En este, vamos a ver qué tipo de información hemos extraído y con qué parte nos quedaremos para trabajar posteriormente. A nosotros en este caso nos interesa saber:
1. ¿De dónde obtuvieron el dinero los ayuntamientos?
2. ¿Cómo, cuánto y en qué gastaron el dinero?

##### Ingresos de un ayuntamiento
Los ayuntamiento obtienen ingresos de varias fuentes: procedentes de las economías particulares, fundamentalmente a través de impuestos, tasas y otros tributos y procedentes del Estado, de la Comunidad Autónoma a la que pertenecen y de la Unión Europea, mediante transferencias o subvenciones. También pueden obtener recursos procedentes de su patrimonio y además pueden pedir préstamos con los límites que la Ley les impone.
Los ingresos que obtiene una Entidad local se reflejan en el [Estado de liquidación del presupuesto de ingresos](http://www.rendiciondecuentas.es/es/informaciongeneral/presupuestoentidades/EstadoLiquidacionPresupuestoIngresos.html). Los tipos de ingresos se clasifican económicamente según lo establecido en el Anexo IV de la [orden que establece la estructura de los presupuestos de las entidades locales](http://www.boe.es/buscar/act.php?id=BOE-A-2008-19916).

##### Gastos de un ayuntamiento
Entre todas las partes y apartados de las cuentas que hemos obtenido, el [Estado de liquidación del presupuesto de gastos](http://www.rendiciondecuentas.es/es/informaciongeneral/presupuestoentidades/EstadoLiquidacionPresupuestoGastos.html) informa sobre cómo se ha ejecutado el presupuesto de gastos de un ayuntamiento y, por tanto, contiene la información necesaria para conocer cuánto se ha gastado el ayuntamiento en un año, en qué se ha gastado los recursos que ha obtenido en ese año y quién ha gastado esos recursos. Los tipos de gastos se clasifican económica y funcionalmente según lo establecido en los Anexos I y II de la [orden que establece la estructura de los presupuestos de las entidades locales](http://www.boe.es/buscar/act.php?id=BOE-A-2008-19916). Desgraciadamente en esta orden no aparecen todos los que se utilizan, y en nuestras cuentas nos encontraremos algunos códigos que no aparecen en la lista. 

>>>>>> En [aRadianOff](http://www.aradianoff.com) hemos creado una tabla `.ods` con todos los tipos de gastos e ingresos establecidos para los presupuestos locales según la orden de arriba, que podéis descargar y utilizar aquí: [Codigos.presupuestos.locales.ods](Codigos.presupuestos.locales.ods) 

En función de lo que queramos visualizar tendremos que agrupar nuestros datos de cuentas de una manera u otra, por eso, tener una visión general de cómo se agrupan y clasifican los gastos e ingresos es importante. 

Por otro lado, es muy común que en ciertas visualizaciones se omitan los bloques de gastos e ingresos referidos a operaciones financieras (de adquisición y amortización de deudas) ya que dicen que [a veces distorsionan los resultados](http://dondevanmisimpuestos.es/metodologia). 



