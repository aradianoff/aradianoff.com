---
title: Instalando el gestor de contenidos Grav en nuestro VPS Debian
slug: instalando-el-gestor-de-contenidos-grav-en-vps-debian
date: 18:34 20-04-2015
taxonomy:
    category: [tecnico, web, blog]
    tag: [servidor, VPS, Apache2, PHP5, Grav, CMS]
---
Entre los gestores de contenido en alza se encuentra [Grav](http://getgrav.org), que se caracteriza por no necesitar bases de datos, utilizar la herramienta de generación de plantillas [Twig](http://twig.sensiolabs.org),  y por utilizar la sintaxis simplificada de  [Markdown](http://daringfireball.net/projects/markdown/) para la edición de contenido entre otras cosas. Es un gestor ligero, fácil de configurar y que parece fácil de utilizar. 
Esa es la guía para instalar Apache, PHP, y montar nuestra web utilizando el gestor de contenidos Grav en un servidor virtual Debian 7. 

===

Grav aún está en desarrollo, pero en versiones próximas incluso va a contar con un administrador en modo gráfico como a los que nos ha acostumbrado Wordpress, Drupal u otros CMS a los que estamos más acostumbrados, y con permisos de gestión y edición. Como este blog es unipersonal  (al menos de momento), con Grav se cumplen nuestras necesidades más que de sobra. 

Para instalarlo, necesitamos primero instalar el [Servidor web Apache](httpd.apache.org/) en el VPS. El nuestro viene con distribución Debian 7, y es tan fácil como ejecutar el en terminal:
```shell
$ atp-get install apache2 

```
Dentro de los [requerimientos que tiene Grav](http://learn.getgrav.org/basics/requirements), está que Apache tenga habilitados [una serie de módulos](http://learn.getgrav.org/basics/requirements#apache-requirements). para ver cuales están instalados y cuales habilitados y activar los que haga falta: 

```shell
$ apache2ctl -M
```

>>> Si no funciona este comando es muy probable que sea porque el usuario con el que se está ejecutando no pertenece al mismo grupo que el servidor apache (`www-data` en Debian). Probad a ejecutarlo como `root` o añadid el usuario al grupo `www-data` (`usermod -a -G www-data usuario`).
>>>

Además, hay que asegurarse de que para el directorio raíz de nuestra instalación de Grav el parámetro `AllowOverride` está configurado como `AllowOveride All` para que se pueda leer y procesar el fichero `.htaccess`. Esto se puede hacer abriendo el archivo de configuración de Apache2 con un editor como nano o vi:
```shell
$ nano /etc/apache2/sites-available/default
```
Cambiando el contenido del archivo para que la sección que nos interese tenga esta pinta: 
```apacheconf
 <Directory /var/www/grav>
                Options Indexes FollowSymLinks MultiViews
                AllowOverride All
                Order allow,deny
                allow from all
 </Directory>
```
Donde `/var/www/grav/` se cambiará por la ruta exacta al directorio en el que instalaremos Grav.  Una vez editado y guardado (se necesitan permisos de  `root` para hacer cambios en este archivo), se reinicia Apache para que los cambios tengan efecto:
```sh
$ service apache2 restart
```

Además, php5 tiene que tener instalados y activados también [otra serie de módulos](http://learn.getgrav.org/basics/requirements#php-requirements).  Simplemente haciendo:

```shell
$ apt-get install php5 php5-gd php5-curl openssl 
```

>>> La extensión `mbstring` ya está incluida dentro del paquete `php5`.
>>>

Una vez revisados los prerequisitos, instalamos Grav en el VPS. A mi hacerlo mediante GitHub no me funcionó. Para el `clone` me pedía el usuario y contraseña de GitHub y después se quejaba de que no tenía permisos suficientes... Así que lo instalé descargándome directamente el `.zip` al directorio raíz donde quiero instalar mi Grav (vamos a suponer que es `/var/www/` que es a donde apunta nuestro servidor y que lo vamos a instalar el en subdirectorio `grav/`). Así, copié la dirección del .zip e hice:
```shell
$ cd /var/www/
$ wget https://github.com/getgrav/grav/releases/download/0.9.24/grav-v0.9.24.zip
$ unzip grav-v0.9.24.zip
```

Asegurate de cambiar la dirección del enlace al .zip por el de la [última versión](http://getgrav.org/downloads). Esto me descomprime los archivos en una carpeta que se llama `grav/` por defecto (que es justo lo que queremos). Ahora, el último paso: Cambiar los propietarios y los permisos para que todo funcione bien:
```shell
$ chown -R usuario:www-data .
$ find . -type f | xargs chmod 664
$ find . -type d | xargs chmod 775
$ find . -type d | xargs chmod +s
$ umask 0002
```

Y ahora nos tenemos que mover al directorio `bin` de nuestra instalación y añadir permisos de ejecución a los archivo que hay en él para poder acceder a la configuración por línea de comandos de grav:

```shell
$ cd /var/www/grav/bin
$ find . -type f | xargs chmod 774
```

Y si no se me ha olvidado nada, ahora debería de estar funcionando ya tu instalación de Grav. Ve a `http://tu.dominio.o.IP/grav` y si todo va bien entonces verás el mensaje de _**Grav is running!**_.
