---
title: Visualising the anual account records of a municipality (Part II): Understanding the account information
slug: understanding-account-information
shortcodes: false
process:
    twig: true
twig_first: true
date: 21:00 19-07-2015
published: true
taxonomy:
    category: [tecnico, web, blog]
    tag: [accounts, bergondo, tutorial, revenue, expenses]
---

¿What are the data that appear in the reports? ¿Which variables do we have to look to? ¿What is their meaning? In this post (continuation of [Visualising the anual account records of a municipality - Part II](/en/blog//extracting-information-rendiciondecuentas.es), we will look at the data we extracted to understand what are we going to visualize.

===

In the first part of this tutorial we saw a semi-automatic method to  [extract account information of a municipality from the web](/en/blog//extracting-information-rendiciondecuentas.es) in Spain. Here, we are going to see what kind of information we extracted and which one we will use. In this case we are interested to know:
1. From where did the municipality obtain its money?
2. How, how much and in what was it spent?

##### Revenue of a municipality
Municipalities obtain their revenues from different sources: from their incomes, with taxes, fees and other tributes, and from the State, Regional Governments and the European Community, via transferences and grants. They can also obtain resouces from their real state and can obtain loans with the limits the Law imposes them. The revenue of a municipality is shown in the [Estado de liquidación del presupuesto de ingresos](http://www.rendiciondecuentas.es/es/informaciongeneral/presupuestoentidades/EstadoLiquidacionPresupuestoIngresos.html). The types of renevues can be classified as established in Annex IV of the [order that establishes the budget structure of local entities](http://www.boe.es/buscar/act.php?id=BOE-A-2008-19916).


Within the Estado de Liquidación, 'derechos reconocidos netos' indicate the resources that the municipality has obtain in that fiscal year. 

##### Expenses of a municipality
Of all of the information we obtained of the accounts, the [Estado de liquidación del presupuesto de gastos](http://www.rendiciondecuentas.es/es/informaciongeneral/presupuestoentidades/EstadoLiquidacionPresupuestoGastos.html) gives us information about how the budget has been executed in a municipality, so, it contains the information required to know how many resources have been spent by the municipality, and in what. The types of expenses can be classified economically and functionally as established by Annexes I and II of the [order that establishes the budget structure of local entities](http://www.boe.es/buscar/act.php?id=BOE-A-2008-19916). Unfortunately, in this legal document not all of the concepts that are used in practice are described, and in the accounts we will find some that are not in the list.

The 'obligaciones reconocidas netas' in the Estado de Liquidación indicate the amount that has been spend in that fiscal year, and also, what is considered the budget expenses. 


>>>>>> In [aRadianOff](http://www.aradianoff.com) we created a `.ods` table with all types of revenue and expense classifications established for the local budget(see order above), that you can download and use here: [Local Budget Codes]({{ page.url }}/Codigos.presupuestos.locales.ods)

Depending on what we want to visualize we will have to group our account data one way or another, and because of that, having a general view of how they are grouped and classified the renevues and expenses is important.

##### General visualization of Bergondo's accounts
Based in the code used by the [OpenBudgetOakland](http://openbudgetoakland.org/) project we generated a interactive [Sankey diagram](https://es.wikipedia.org/wiki/Diagrama_de_Sankey) to show both the expenses and revenue of the fiscal year's account of 2013 in Bergondo, with different grouping options. 

[**See Sankey Diagram of Bergondo's accounts** (in spanish)](/proyectos/bergondoabierto/cuentas-bergondo) 


