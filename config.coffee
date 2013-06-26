sysPath = require 'path'

exports.config =
    # See http://brunch.io/#documentation for documentation.
    files:
        javascripts:
            joinTo:
                'javascripts/app.js': /^app/
                'javascripts/vendor.js': /^vendor/
                'test/javascripts/test-vendor.js': /^test(\/|\\)(?=vendor)/

            order:
                before: [
                    'vendor/scripts/jquery-1.9.1.js'
                    'vendor/scripts/handlebars-1.0.rc.3.js'
                    'vendor/scripts/jquery-ui-autocomplete.js',
                    'vendor/scripts/jquery.jrumble.1.3.js',
                    'vendor/scripts/jquery.validate.js',
                    'vendor/scripts/console-helper.js',
                    'vendor/scripts/ember-1.0.0-rc.3.js'
                    'vendor/scripts/bootstrap.js',
                    'vendor/scripts/bootstrap-typeahead.custom.js',
                    'vendor/scripts/moment.js',
                    'vendor/scripts/tag-it.js',
                    'vendor/scripts/ZeroClipboard.min.js',
                    'vendor/scripts/md5.js',
                    'vendor/scripts/showdown.js',
                    'vendor/scripts/dropzone.js',
                    'vendor/scripts/inflection.js',
                    'vendor/scripts/jquery.flot.js',
                    'vendor/scripts/jquery.flot.pie.js'
                ]

        stylesheets:
            joinTo:
                'stylesheets/app.css': /^(app|vendor)/
            order:
                before: ['vendor/styles/normalize.css']

        templates:
            precompile: true
            root: 'templates'
            joinTo: 'javascripts/app.js' : /^app/

            modules:
                addSourceURLs: true

    # allow _ prefixed templates so partials work
    conventions:
        ignored: (path) ->
            startsWith = (string, substring) ->
                string.indexOf(substring, 0) is 0
            sep = sysPath.sep
            if path.indexOf("app#{sep}templates#{sep}") is 0
                false
            else
                startsWith sysPath.basename(path), '_'
