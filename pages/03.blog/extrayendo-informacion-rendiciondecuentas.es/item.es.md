---
title: Visualizando las cuentas de un ayuntamiento (Parte I): Extrayendo información de rendiciondecuentas.es
slug: extrayendo-informacion-rendiciondecuentas.es
shortcodes: false
date: 10:00 07-07-2015
taxonomy:
    category: [tecnico, web, blog]
    tag: [presupuestos, bergondo, data-gathering, extracción de datos, tutorial]
---

En España, los informes de cuentas de los ayuntamientos y otras entidades públicas son monitoreados por el Tribunal de Cuentas y sus delegaciones regionales. Estos informes de cuentas están disponibles para su consulta en la web [rendiciondecuentas.es](http://rendiciondecuentas.es), pero en un formato engorroso si lo que se quiere es extraer la información para su posterior análisis. Escribiendo un escrito a las delegaciones regionales parece que te preparan la información en el formato que necesites, pero nosotros vamos a ver los pasos para extraer la información directamente de la web para su posterior procesado.

===

#####Requisitos del sistema:  

1. Vamos a necesitar el programa [Charles Web Debugging Proxy](http://www.charlesproxy.com/) (o software similar), para ver qué peticiones hace la página de la que nos interese extraer la información.  Mi sistema operativo es **Ubuntu Linux** y mi navegador es **Chrome**. Para que funcione Charles tuve que configurar el proxy del sistema (cuando lo quiero utilizar) manualmente en 
`All Settings > Network > Network Proxy` de forma de que apunte a `127.0.0.1` y al puerto `8888`. 

2. También vamos a necesitar `curl`. [Curl](http://curl.haxx.se/)  es una herramienta para transferir datos desde o a un servidor, usando  data from or to a server, usando HTTP u otro de los protocolos que soporta.  En linux para instalarlo: 
``` 
sudo apt-get install curl
 ```

#####Pasos a seguir: 

Para nuestro ejemplo, decidimos descargarnos los datos del informe de cuentas del Ayuntamiento de Bergondo correspondientes al ejercicio fiscal de 2011. 
Para ello, navegamos a través de la web de [rendición de cuentas](http://rendiciondecuentas.es) hasta la [página previa al visualizador con los datos](http://www.rendiciondecuentas.es/es/consultadeentidadesycuentas/buscarCuentas/consultarCuenta.html?dd=true&idEntidadPpal=2122&idEntidad=2122&idTipoEntidad=A&idModelo=3&ejercicio=2011&nifEntidad=P1500800F
).

Y seleccionamos la opción de  `Visualizar la Cuenta Anual de la Entidad (fichero XML)`para entrar en el visualizador de cuentas.  Lo primero en lo que nos fijamos es que el botón secundario del ratón está deshabilitado.  Por suerte pulsando **Ctrl+u** en chrome nos deja ver el código fuente de la página, y podemos ver en la sección del índice los enlaces a las diferentes secciones con todos los datos, que tienen esta forma:
```
http://www.rendiciondecuentas.es/VisualizadorPortalCiudadano/ServletDatos?ejercicio=2008&modelo=NOR&paginacion=10&actual=0&id_form=Balance&nombreFichero=P1500800F_2011_NOR_CUENTAS-ANUALES.xml`.
```
Si ponemos este enlace en un navegador accedemos a la tabla en `HTML`. 

Lo primero que vemos es que los nombres de los ficheros parecen tener la estructura `NIFdeEntidad_AñoEjercicioFiscal_NOR_CUENTAS-ANUALES.xml`.
Esto es interesante, porque cambiando el año en el enlace accedemos a los otros informes disponibles (a fecha de hoy: 2011, 2012 y 2013), y cambiando el NIF podemos acceder directamente a los informes de otras entidades como por ejemplo el Ayuntamiento de Betanzos (NIF:  P1500900D).

También se observa que la paginación por defecto es de 10 en 10 (`pagination=10`) y que empieza siempre a contar por la 0 (`actual=0`), para evitar tener que ir a las subpáginas una por una para extraer la información podemos modificar el parámetro de paginación para que tenga un índice de resultados por página tan altos que nunca se llegue a paginar (ej. 5000, en el caso de Betanzos y Bergondo. Probablemente Ayuntamientos más grandes necesitan números más grandes).

Además, el parámetro `id_form=NombreSeccion` va abriendo las distintas sessiones de la Cuenta Anual.  Actualmente existen 85 formularios (o tablas) distintos, que se llaman: 
`Balance Resultado LiqPptoGastRes LiqPptoGastDet LiqPptoIngRes LiqPptoIngDet Res NotInfGen InvDestUsoGen PatEntUsoGen InmovInmat InmovMat BienCesTemp BienAdscrip BienEfectAGarant InvGest PatrPublSuel InvFin PrestSingSig Exist Tes EstConcBanc FondProp EstDeudaCapNacDet TotEstDeudaCapNacDet EstDeudaCapDistEurDet TotEstDeudaCapDistEurDet EstDeudaIntExpNacDet TotEstDeudaIntExpNacDet EstDeudaIntExpDistEurDet TotEstDeudaIntExpDistEurDet EstDeudaIntImpNacDet TotEstDeudaIntImpNacDet EstDeudaIntImpDistEurDet TotEstDeudaIntImpDistEurDet ResOperIntFinDiv ResOperIntFinInter AvConc AvRein DesProcGestRecAdmin DesDevRecOtrEntPubl OblDerGest CtaCorrOtrEntPubl OperNoPresTesDeud OperNoPresTesAcr OperNoPresTesPartPendAppCobr OperNoPresTesPartPendAppPag SubRecPendJust TransYSubConcSig OtrCircCarSust EstValRecDep CuadFin CuadFinVarCap ModCred RemCred ProGast AcrOpsPendAplPres DerAnul DerCanc RecNet DevIng ComprIng OblPresCerr DerPresCerrAnul DerPresCerrCanc VarResPresEjAnt ComprGastEjPost ComprIngEjPost DesvFinDet TotDesvFinDet DatGenIdent DatGenIdentAppPres GestGast GestGastTot GestIngAfect GestIngAfectTot DesvFinAgent DesvFinAgentTot RemTes IndFinYPatr IndPresCorr IndPresCerr IndGest NotAcoPosCie BalComp`


Con Charles abierto, entramos en la página anterior y miramos que peticiones realizan mediante HTTP para poder determinar así los distintos parámetros que utilizó y poder utilizarlos con `Curl`. El identificador de la cookie es muy importante porque cambia en cada sesión y petición distintas, y el `User-Agent` también va a cambiar si estáis utilizando un navegador distinto. 

Este es el script que utilicé para bajar los datos por ejercicio fiscal y ayuntamiento:

```ruby
# Declare variables: #
declare -a form_name=( Balance Resultado LiqPptoGastRes LiqPptoGastDet LiqPptoIngRes LiqPptoIngDet Res NotInfGen InvDestUsoGen PatEntUsoGen InmovInmat InmovMat BienCesTemp BienAdscrip BienEfectAGarant InvGest PatrPublSuel InvFin PrestSingSig Exist Tes EstConcBanc FondProp EstDeudaCapNacDet TotEstDeudaCapNacDet EstDeudaCapDistEurDet TotEstDeudaCapDistEurDet EstDeudaIntExpNacDet TotEstDeudaIntExpNacDet EstDeudaIntExpDistEurDet TotEstDeudaIntExpDistEurDet EstDeudaIntImpNacDet TotEstDeudaIntImpNacDet EstDeudaIntImpDistEurDet TotEstDeudaIntImpDistEurDet ResOperIntFinDiv ResOperIntFinInter AvConc AvRein DesProcGestRecAdmin DesDevRecOtrEntPubl OblDerGest CtaCorrOtrEntPubl OperNoPresTesDeud OperNoPresTesAcr OperNoPresTesPartPendAppCobr OperNoPresTesPartPendAppPag SubRecPendJust TransYSubConcSig OtrCircCarSust EstValRecDep CuadFin CuadFinVarCap ModCred RemCred ProGast AcrOpsPendAplPres DerAnul DerCanc RecNet DevIng ComprIng OblPresCerr DerPresCerrAnul DerPresCerrCanc VarResPresEjAnt ComprGastEjPost ComprIngEjPost DesvFinDet TotDesvFinDet DatGenIdent DatGenIdentAppPres GestGast GestGastTot GestIngAfect GestIngAfectTot DesvFinAgent DesvFinAgentTot RemTes IndFinYPatr IndPresCorr IndPresCerr IndGest NotAcoPosCie BalComp )

# La cookie es la que hay que cambiar cada vez que se quiere hacer una consulta distinta, miras cúal es en el Charles y la copias aquí: #
cookie_data="JSESSIONID=3FCFE217FAC8DD6BC16D86A4751C5286.tomcatVisualizador2; treeview=111111110000000000000000000000000000000000000; JSESSIONID=701B5DE1377CCF27CC4F06B87758BC47"

# Check array is formed correctly: #
echo ${form_name[@]}
${#form_name[@]}


#Dump data into file: #
for id_form in ${form_name[@]} ; do curl -vvv -g -H User-Agent:"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.65 Safari/537.36"  -H "Cookie:$cookie_data" "http://www.rendiciondecuentas.es/VisualizadorPortalCiudadano/ServletDatos?ejercicio=2008&modelo=NOR&paginacion=5000&actual=0&id_form=$id_form&nombreFichero=P1500800F_2011_NOR_CUENTAS-ANUALES.xml" >> Cuentas_Bergondo_Ejercicio_2011.txt;  done
```
>>>>Cada vez que se quiere hacer una consulta distinta hay que mirar en el Charles el identificador de la nueva cookie y cambiarla en el script, cambiando también los datos de año fiscal y nif de ayuntamiento que correspondan a la consulta que se hace. Este script te baja los datos de todas las tablas en html en un único archivo de texto por ejercicio fiscal. 

Ejecutando este script con los cambios pertinentes, nos abremos bajado la información de cuentas en un archivo de texto a nuestro ordenador, pero ahora tenemos que quitarle las etiquetas `HTML` y darle formato. 

#####Formateando el archivo descargado: 

Vamos a convertir el archivo de datos en un formato que tipo `CSV` separado por donde los campos estén separados por `;`.

Hacerlo para hacerlo desde la consola en linux podemos utilizar este script:
```
archivo_salida="Cuentas_Bergondo_Formateado_2011.txt"
archivo_entrada="Cuentas_Bergondo_Ejercicio_2011.txt"

#Proceso: 
#Borrar todas las líneas en blanco del fichero
#Borrar los espacios al comienzo de cada línea
#Borrar los espacios al final de cada línea
#Borrar retornos de carro
#Sustituir </h4> por \n
#Sustituir </tr> por \n
#Sustituir </td> por ;
#Sustituir </th> por ;
#Borrar etiquetas HTML

cat $archivo_entrada | sed '/^[ ]*$/d' | sed 's/^ *//g'  | sed 's/ *$//g' | tr -d '\n'  | sed 's/<\/h4>/\n/g' | sed 's/<\/tr>/\n/g' | sed 's/<\/td>/;/g'  | sed 's/<\/th>/;/g' | sed -e 's/<[^>]*>//g' > $archivo_salida
```

Y ya tenemos nuestra información de cuentas en nuestro ordenador, y con un formato que es legible tanto como texto como por la gran mayoría de programas de hojas de cálculo.

Ahora sólo queda clasificar, organizar y visualizar los datos (que no es poco). Eso lo seguiremos haciendo en la siguiente parte de este tutorial. 

[**Visualizando las cuentas de un ayuntamiento (Parte II)**](/es/blog/entendiendo-cuentas-bergondo)


