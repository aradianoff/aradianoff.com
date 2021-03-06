---
title: Instalando el plugin JSComments con Disqus en Grav
slug: instalando-plugin-jscomments-con-disqus-en-grav
date: 13:34 25-04-2015
taxonomy:
    category: [tecnico, web, blog]
    tag: [Grav, CMS, JSComments, Disqus]
---
Cuando montamos un blog, una de las características más importantes suele ser habilitar un gestor de comentarios para que los visitantes puedas aportar sus ideas, dudas o recomendaciones. [Grav](http://getgrav.org) cuenta con el plugin [JSComments](https://github.com/nunopress/grav-plugin-jscomments) que se puede configurar para que integre a los sistemas de comentarios [Disqus](https://disqus.com/), [IntenseDebate](https://intensedebate.com/), [Facebook](https://www.facebook.com) y [Muut](https://muut.com/) y que genere líneas de comentarios para cada entrada del blog. 
Aquí explicamos como instalarlo desde la línea de comandos y cómo configurarlo para que nos introduzca un hilo de comentarios por entrada del blog utilizando como ejemplo una cuenta de Disqus. 

===

Ver los plugins disponibles en Grav es tan sencillo como ir a la carpeta donde se encuentra nuestra instalación de Grav y teclear en el terminal:

```shell
$ bin/gpm index

```
>>> Nota: Si no os funciona este comando es muy probable que sea:  1-. El usuario con el que se está ejecutando no pertenece al mismo grupo que el servidor apache (`www-data` en Debian). Probad a ejecutarlo como `root` o añadid el usuario al grupo `www-data` (`usermod -a -G www-data usuario`). 2-. Los archivos de la carpeta bin no tienen los permisos adecuados para ser ejecutados (ver tutorial de [como instalar correctamente Grav](../instalando-el-gestor-de-contenidos-grav-en-vps-debian))
>>>

Con este comando, vas a ver una lista de todos los plugins disponibles, de su alias para llamarlos desde la linea de comandos, y de si están instalados o no. Para instalar un plugin, sólo tienes que ejecutar:

```shell
$ bin/gpm install jscomments

```

Una vez instalado, ponerlo a funcionar es muy fácil, aunque necesitarás crear una cuenta en el servicio que te interese y conseguir (en el caso de Disqus) tu nombre corto. Si no lo tienes ahora, es buen momento para hacerlo ;). 

 Creas una copia del archivo `directoriodegrav/user/plugins/jscomments/jscomments.yaml` en la carpeta `directoriodegrav/user/config/plugins/` (si no la tienes créala).

La editas de forma que ponga:

```yaml
enabled: true # Para Habilitar/Deshabilitar el plugin

provider: "disqus" # (disqus | intensedebate | facebook | muut)

providers:
  disqus:
    shortname: "tu_nombre_corto_disqus"
```

Y tienes que editar el template de tu tema que está en `directoriodegrav/user/themes/nombredetutema/templates/partials/blog_item.html.twig` y poner después de la línea donde aparece
```twig
{{ page.content }}
```
esta linea
```twig
{{ jscomments('disqus', { shortname: 'tu_nombre_corto_disqus' }) }}
```

Con esto ya debería de estar funcionando y cuando entras en una entrada en tu blog deberías ser capaz de ver el gestor de comentarios al final de la entrada. 

>>> Nota: Si no tienes tema propio, lo mejor es crear uno que sea hijo del que estés utilizando ([enlace a las instrucciones en inglés](http://getgrav.org/blog/theme-development-with-inheritance)).
>>>



