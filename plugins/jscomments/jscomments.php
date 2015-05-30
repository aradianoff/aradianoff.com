<?php namespace Grav\Plugin;

use Grav\Common\Plugin;
use Grav\Common\Page\Page;
use Grav\Common\Data\Data;

class JSCommentsPlugin extends Plugin
{
    public static function getSubscribedEvents()
    {
        return [
            'onPluginsInitialized' => ['onPluginsInitialized', 0]
        ];
    }

    public function onPluginsInitialized()
    {
        if ($this->isAdmin()) {
            $this->active = false;
            return;
        }

        $this->enable([
            'onTwigTemplatePaths'   => ['onTwigTemplatePaths', 0],
            'onTwigInitialized'     => ['onTwigInitialized', 0]
        ]);
    }

    public function onTwigInitialized()
    {
        $this->grav['twig']->twig()->addFunction(
            new \Twig_SimpleFunction('jscomments', [$this, 'jscommentsFunction'], ['is_safe' => ['html']])
        );

        $this->grav['twig']->twig()->addFunction(
            new \Twig_SimpleFunction('jscomments_count', [$this, 'jscommentsCountFunction'], ['is_safe' => ['html']])
        );

        $this->grav['twig']->twig()->addFunction(
            new \Twig_SimpleFunction('jscomments_validate_provider', [$this, 'jscommentsValidateProviderFunction'], ['is_safe' => ['html']])
        );
    }

    public function onTwigTemplatePaths()
    {
        $this->grav['twig']->twig_paths[] = __DIR__ . '/templates';
    }

    public function jscommentsFunction($provider = '', $params = [])
    {
        // Load page object.
        $page = $this->grav['page'];

        $this->mergePluginConfig($page, $provider, $params);

        if (!$this->validateProvider($this->config->get('provider'))) {
            return;
        }

        $template_file = 'plugins/jscomments/' . $this->config->get('provider') . '.html.twig';
        $template_vars = $this->config->get('providers.' . $this->config->get('provider'));

        return $this->grav['twig']->twig()->render($template_file, $template_vars);
    }

    public function jscommentsCountFunction($shortname = '')
    {
        $page = $this->grav['page'];

        if ($shortname) {
            $this->mergePluginConfig($page, 'disqus', ['shortname' => $shortname]);
        } else {
            $this->mergePluginConfig($page);
        }

        if (!$this->validateProvider($this->config->get('provider'))) {
            return;
        }

        if ('disqus' != $this->config->get('provider')) {
            return;
        }

        $template_file = 'plugins/jscomments/disqus_count.html.twig';
        $template_vars = [
            'shortname' => $this->config->get('providers.disqus.shortname')
        ];

        $output = $this->grav['twig']->twig()->render($template_file, $template_vars);

        return $output;
    }

    public function jscommentsValidateProviderFunction($provider)
    {
        return $this->validateProvider($provider);
    }

    private function validateProvider($provider)
    {
        if (!$this->config->get('providers')) {
            $page = $this->grav['page'];
            $this->mergePluginConfig($page);
        }

        return (array_key_exists($provider, $this->config->get('providers'))) ? true : false;
    }

    private function mergePluginConfig(Page $page, $provider = '', $params = [])
    {
        $this->config = new Data((array) $this->grav['config']->get('plugins.jscomments'));

        if (isset($page->header()->jscomments)) {
            if (is_array($page->header()->jscomments)) {
                $this->config = new Data(array_replace_recursive($this->config->toArray(), $page->header()->jscomments));
            } else {
                $this->config->set('enabled', $page->header()->jscomments);
            }
        }

        if ($provider and $this->validateProvider($provider)) {
            $this->config->set('providers.' . $provider, array_replace_recursive($this->config->get('providers.' . $provider), $params));
        }
    }
}
