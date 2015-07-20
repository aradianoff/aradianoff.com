---
title: Installing the Content Management System Grav in our VPS Debian
slug: installing-grav-in-vps-debian
date: 18:34 20-04-2015
taxonomy:
    category: [technical, web, blog]
    tag: [server, VPS, Apache2, PHP5, Grav, CMS]
---
[Grav](http://getgrav.org) is a rising in popularity CMS, characterized for being file based (doesn't need a database to run). It uses the template generation tool [Twig](http://twig.sensiolabs.org),  and supports [Markdown](http://daringfireball.net/projects/markdown/) for content editing. It a very light management system, very easy to set up and to use. It also has great documentation and a very active support community. 
This guide shows how to install Apache, PHP, and set up our web using GRAV in a  virtual server Debian 7. 

===

Grav is still under development, but in future releases it will even have and admin user inferface like (or better ;) ) the ones in Wordpress, Drupal and other CMS, that we were used to and with management and edition permissions. As this site is made and maintained by one person only (at least right now), with Grav we have all (and more) our need covered. 

To install it, we need a web server installed in our system first. We installed an [Apache Server](http://httpd.apache.org/) in our VPS. Because our VPS distribution is Debian 7, it is as easy as typing in a terminal:
```shell
$ atp-get install apache2 

```
One of the [prerequisites of Grav](http://learn.getgrav.org/basics/requirements), is that [a series of modules](http://learn.getgrav.org/basics/requirements#apache-requirements) should be enabled. To see which ones are installed and which of those enabled: 

```shell
$ apache2ctl -M
```

>>> If this command does not work it is possible that the user who is running it does not belong to the same group as the server (`www-data` in Debian). Try to run it as `root` or add the user to the `www-data` group (`usermod -a -G www-data usuario`).
>>>

Also, you have to make sure that `AllowOverride` is set as `AllowOveride All` in the root file of our GRAV instalation so that `.htaccess` can be read and processed. This can be done opening the configuration file of Apache2 with an editor like nano or vi:
```shell
$ nano /etc/apache2/sites-available/default
```
Changing the content of the file so that the section of interest looks like this:
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

Also, php5 needs to have [some modules](http://learn.getgrav.org/basics/requirements#php-requirements) installed and enabled too for GRAV to work.  We can di that typing:

```shell
$ apt-get install php5 php5-gd php5-curl openssl 
```

>>> The `mbstring` extension is already included in the `php5` package in Debian.
>>>

Once we have the prerequisites taken care of, we can install Grav in the VPS. I couldn't do it through GitHub the first time (because I was using the SSH clone url instead of the HTTPS,  and to `clone` it asked for my username and password and of course didn't let me do it because I didn't have enough permissions...) I ended but downloading the `.zip` and extracting it into the root folder where I wanted my GRAV instalation to be (we will take it as if it was `/var/www/` and that we wanted to install grav in the `grav/` folder there). So, I copied the url for the `.zip` and did:
```shell
$ cd /var/www/
$ wget https://github.com/getgrav/grav/releases/download/0.9.24/grav-v0.9.24.zip
$ unzip grav-v0.9.24.zip
```

Make sure to change the url of the `.zip` to that of the [latest version](http://getgrav.org/downloads). That unzipped the files of our GRAV instalation into `grav/` folder (which is just what we want). Now, the last step in our case ([more cases](http://learn.getgrav.org/basics/requirements#permissions)): Change file owners and permissions so that everything works fine:
```shell
$ chown -R usuario:www-data .
$ find . -type f | xargs chmod 664
$ find . -type d | xargs chmod 775
$ find . -type d | xargs chmod +s
$ umask 0002
```

And move to the `bin` folder of our instalation and add execution permissions to the files inside to be able to access the command-line configuration utilities of grav:

```shell
$ cd /var/www/grav/bin
$ find . -type f | xargs chmod 774
```

If I haven't forgotten anything, your GRAV instalation shoud be working now. Go to `http://your.domain.or.IP/grav` and if everything went well you will see the message _**Grav is running!**_.
