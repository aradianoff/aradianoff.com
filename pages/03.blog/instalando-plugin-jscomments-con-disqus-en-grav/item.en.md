---
title: Installing JSComments plugin with Disqus in Grav
slug: installing-jscomments-with-disqus-in-grav
date: 13:34 25-04-2015
taxonomy:
    category: [technical, web, blog]
    tag: [Grav, CMS, JSComments, Disqus]
---
When we create a blog, one of the most important features we need is usually a comment system so that visitors can write their suggestions and share their ideas, questions or advice about what we write. [Grav](http://getgrav.org) has the [JSComments](https://github.com/nunopress/grav-plugin-jscomments) plugin that can be set to integrate with [Disqus](https://disqus.com/), [IntenseDebate](https://intensedebate.com/), [Facebook](https://www.facebook.com) and [Muut](https://muut.com/) and generate comment strings for each of our posts. 
Here we explain how to install the plugin in GRAV from the command line and how to set it up to add comments to each of our posts using Disqus as an example. 

===

Show which plugins are available in GRAV is as easy as going to our installation folder in GRAV and type in the command line:

```shell
$ bin/gpm index

```
>>> Note: If that command is not working for you it could be:  1-. The user does not belong to the same group as the apache server (`www-data` in Debian). Try to run it as `root` or add the user to the group `www-data` (`usermod -a -G www-data user`). 2-. The files in the bin folder don't have the appropiate permissions to be executed (see tutorial on [how to install Grav in VPS](../installing-grav-in-vps-debian))
>>>

With this command, you can see la list of all of the available plugins, their aliases (to install them or update them) and if they are installed or not. To install a plugin you just need to run `bin/gpm install alias_of_package`, in this case:

```shell
$ bin/gpm install jscomments

```

Once installed, setting it up is very easy, even though you will need to set up an account in the comments service of your choice and get (in the case of Disqus) your shortname. If you still don't have it, it's a good time to get it ;). 

 Create a copy of the file `directoriodegrav/user/plugins/jscomments/jscomments.yaml` in your `directoriodegrav/user/config/plugins/` folder (if you don't have that folder; just create it).

And edit it so that it has:

```yaml
enabled: true # To enable/disable plugin

provider: "disqus" # (disqus | intensedebate | facebook | muut)

providers:
  disqus:
    shortname: "your_shortname_disqus"
```

And you have to edit your `blog_item.html.twig` theme template located in `grav_root_folder/user/themes/your_theme_name/templates/partials/blog_item.html.twig` and after the line that says:
```twig
{{ page.content }}
```
add this line
```twig
{{ jscomments('disqus', { shortname: 'your_shortname_disqus' }) }}
```

With that, it should be already working and when you go to a blog post you should be able to see your comments at the end of the post.

>>> Note: If you don't have your own theme, the best approach is creating a child theme of the one you are using ([link to official guide](http://getgrav.org/blog/theme-development-with-inheritance)).
>>>



