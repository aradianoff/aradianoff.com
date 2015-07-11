---
title: Visualising the anual account records of a municipality (Part I): Extracting information from rendiciondecuentas.es
slug: extracting-information-rendiciondecuentas.es
shortcodes: false
date: 10:00 07-07-2015
taxonomy:
    category: [technical, web, blog]
    tag: [budget, accounts, bergondo, data-gathering, tutorial]
---

In Spain, account reports of anual revenue and expenses of the municipalities and other public organizations are monitored by the Tribunal de Cuentas and their regional delegations. These account reports are available at [rendiciondecuentas.es](http://rendiciondecuentas.es), but in a not-very-friendly format if what you want is to download the information for analysis. If you write to the different delegations they can prepare the data in the format you want, but here we will look at a method to extract that information directly from the web and process it.

===

#####Prerequisites:  

1. We will need the [Charles Web Debugging Proxy](http://www.charlesproxy.com/) (or a similar software), to see the petitions the page where we want to extract the information from makes.  My OS is **Ubuntu Linux** and my browser is **Chrome**. For Chrales to function properly I had to set up the system proxy so that when I want to use Charles it points to `127.0.0.1` and port `8888` (you can do that manually at
`All Settings > Network > Network Proxy`).

2. We will also need `curl`. [Curl](http://curl.haxx.se/)  a tool used to transfer data from/to a server, using HTTP or another of its supported protocols.  To install it in linux: 
``` 
sudo apt-get install curl
 ```

#####Steps: 

For our example, we decided to download the data or the accounts anual report of the municipality of Bergondo correnponding to the year 2011. 
To do that, we navigate through [rendición de cuentas](http://rendiciondecuentas.es) to the [previous page to the one containing the data](http://www.rendiciondecuentas.es/es/consultadeentidadesycuentas/buscarCuentas/consultarCuenta.html?dd=true&idEntidadPpal=2122&idEntidad=2122&idTipoEntidad=A&idModelo=3&ejercicio=2011&nifEntidad=P1500800F
).

We select the option  `Visualizar la Cuenta Anual de la Entidad (fichero XML)` to load the accounts visualization page.  The first thing we can see is that the secondary mouse button is not enabled. Luckly, typing **Ctrl+u** in chrome we can see the source code of the page, and we can see in the index the links to the different report sections containing all of the data, which have this format:
```
http://www.rendiciondecuentas.es/VisualizadorPortalCiudadano/ServletDatos?ejercicio=2008&modelo=NOR&paginacion=10&actual=0&id_form=Balance&nombreFichero=P1500800F_2011_NOR_CUENTAS-ANUALES.xml`.
```
If we copy/paste this link in a browser we access the HTML table source with the data for the specific section. 

The first thing we note is that all sections have the structure `NIFofOrganization_Year_NOR_CUENTAS-ANUALES.xml`.
This is interesting, because just by changing the year in the link we can access other available reports (a fecha de hoy: 2011, 2012 y 2013), and changing the NIF we can access the reports of other organizations like, for example, the municipality of Betanzos (NIF:  P1500900D).

We can also see that default pagination is 10 in 10 (`pagination=10`) and that it starts counting on 0 (`actual=0`), to avoid having to navigate to the different subpages one by one to extract the information, we can modify the `pagination`parameter so that it has a results index so big that so never really need different pages to dysplay the information (ex. 5000, in the case of Betanzos and Bergondo. Bigger municipalities probably need bigger numbers, but I am not sure).

Also, parameter `id_form=NameOfSeccion` will open the different sections of the Anual Account Report.  At this moment, 85 different forms (or tables) are available, named: 
`Balance Resultado LiqPptoGastRes LiqPptoGastDet LiqPptoIngRes LiqPptoIngDet Res NotInfGen InvDestUsoGen PatEntUsoGen InmovInmat InmovMat BienCesTemp BienAdscrip BienEfectAGarant InvGest PatrPublSuel InvFin PrestSingSig Exist Tes EstConcBanc FondProp EstDeudaCapNacDet TotEstDeudaCapNacDet EstDeudaCapDistEurDet TotEstDeudaCapDistEurDet EstDeudaIntExpNacDet TotEstDeudaIntExpNacDet EstDeudaIntExpDistEurDet TotEstDeudaIntExpDistEurDet EstDeudaIntImpNacDet TotEstDeudaIntImpNacDet EstDeudaIntImpDistEurDet TotEstDeudaIntImpDistEurDet ResOperIntFinDiv ResOperIntFinInter AvConc AvRein DesProcGestRecAdmin DesDevRecOtrEntPubl OblDerGest CtaCorrOtrEntPubl OperNoPresTesDeud OperNoPresTesAcr OperNoPresTesPartPendAppCobr OperNoPresTesPartPendAppPag SubRecPendJust TransYSubConcSig OtrCircCarSust EstValRecDep CuadFin CuadFinVarCap ModCred RemCred ProGast AcrOpsPendAplPres DerAnul DerCanc RecNet DevIng ComprIng OblPresCerr DerPresCerrAnul DerPresCerrCanc VarResPresEjAnt ComprGastEjPost ComprIngEjPost DesvFinDet TotDesvFinDet DatGenIdent DatGenIdentAppPres GestGast GestGastTot GestIngAfect GestIngAfectTot DesvFinAgent DesvFinAgentTot RemTes IndFinYPatr IndPresCorr IndPresCerr IndGest NotAcoPosCie BalComp`


With Charles open, we enter the link of the page above and look at the HTTP requests to identify the different parameters it used and be able to replicate them with `Curl`. The cookie data is very important, because it changes with each session and report, and the `User-Agent` will also be different if you are using another browser. 

This is the script I used to download the data of the account reports of a municipality by year:

```ruby
# Declare variables: #
declare -a form_name=( Balance Resultado LiqPptoGastRes LiqPptoGastDet LiqPptoIngRes LiqPptoIngDet Res NotInfGen InvDestUsoGen PatEntUsoGen InmovInmat InmovMat BienCesTemp BienAdscrip BienEfectAGarant InvGest PatrPublSuel InvFin PrestSingSig Exist Tes EstConcBanc FondProp EstDeudaCapNacDet TotEstDeudaCapNacDet EstDeudaCapDistEurDet TotEstDeudaCapDistEurDet EstDeudaIntExpNacDet TotEstDeudaIntExpNacDet EstDeudaIntExpDistEurDet TotEstDeudaIntExpDistEurDet EstDeudaIntImpNacDet TotEstDeudaIntImpNacDet EstDeudaIntImpDistEurDet TotEstDeudaIntImpDistEurDet ResOperIntFinDiv ResOperIntFinInter AvConc AvRein DesProcGestRecAdmin DesDevRecOtrEntPubl OblDerGest CtaCorrOtrEntPubl OperNoPresTesDeud OperNoPresTesAcr OperNoPresTesPartPendAppCobr OperNoPresTesPartPendAppPag SubRecPendJust TransYSubConcSig OtrCircCarSust EstValRecDep CuadFin CuadFinVarCap ModCred RemCred ProGast AcrOpsPendAplPres DerAnul DerCanc RecNet DevIng ComprIng OblPresCerr DerPresCerrAnul DerPresCerrCanc VarResPresEjAnt ComprGastEjPost ComprIngEjPost DesvFinDet TotDesvFinDet DatGenIdent DatGenIdentAppPres GestGast GestGastTot GestIngAfect GestIngAfectTot DesvFinAgent DesvFinAgentTot RemTes IndFinYPatr IndPresCorr IndPresCerr IndGest NotAcoPosCie BalComp )

# You have to update the cookie everytime you want to look at a different report. You look for it in Charles or the development tools in your browser and copy the data here: #
cookie_data="JSESSIONID=3FCFE217FAC8DD6BC16D86A4751C5286.tomcatVisualizador2; treeview=111111110000000000000000000000000000000000000; JSESSIONID=701B5DE1377CCF27CC4F06B87758BC47"

# Check array is formed correctly: #
echo ${form_name[@]}
${#form_name[@]}


#Dump data into file: #
for id_form in ${form_name[@]} ; do curl -vvv -g -H User-Agent:"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.65 Safari/537.36"  -H "Cookie:$cookie_data" "http://www.rendiciondecuentas.es/VisualizadorPortalCiudadano/ServletDatos?ejercicio=2008&modelo=NOR&paginacion=5000&actual=0&id_form=$id_form&nombreFichero=P1500800F_2011_NOR_CUENTAS-ANUALES.xml" >> Cuentas_Bergondo_Ejercicio_2011.txt;  done
```
>>>>You have to update the cookie everytime you want to look at a different report. You look for it in Charles or the development tools in your browser and update it in the script along with the year and NIF of the municipality of the report you are looking at. This script downloads the data of all of the tables of the report in HTML in a single text file for each municipality and year. 

If you run the script above with the appropiate changes, you would have downloaded the accounts report to your computer, but we have now to get rid of the `HTML`tags and format it.

#####Formating the downloaded file: 

We will convert the data of the downloaded file to a `CSV` separated by `;` format.

You can do it from the command line in linux running this script:
```
output_file="Cuentas_Bergondo_Formateado_2011.txt"
input_file="Cuentas_Bergondo_Ejercicio_2011.txt"

#Steps: 
#Erases all blank lines of the file
#Erases blank spaces at the begining of each line
#Erases blank spaces at the begining of each line
#Erases the line breaks
#Replaces </h4> with \n
#Replaces </tr> with \n
#Replaces </td> with ;
#Replaces </th> with ;
#Erases HTML tags

cat $input_file | sed '/^[ ]*$/d' | sed 's/^ *//g'  | sed 's/ *$//g' | tr -d '\n'  | sed 's/<\/h4>/\n/g' | sed 's/<\/tr>/\n/g' | sed 's/<\/td>/;/g'  | sed 's/<\/th>/;/g' | sed -e 's/<[^>]*>//g' > $output_file
```

And now we have our account report in our computer, with a format that we can work with.

Now it's time to organize, filter and visualize (which is not little work) the data. We will keep on doing that in the next part of our tutorial.
 
