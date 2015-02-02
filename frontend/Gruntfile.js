var path       = require('path');
var shelljs    = require('shelljs');
var semver     = require('semver');
var modRewrite = require('connect-modrewrite');


var argv = require('optimist').argv;
module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    // load our tasks
    grunt.loadTasks('tasks');

    var lrSnippet = require('connect-livereload')();
    var mountFolder = function (connect, dir) {
        return connect.static(path.resolve(dir));
    };

    // To use the ’host’ argument, start the server using: grunt server --host=[your.hostname.here]
    var devHost = argv.host || 'dev.padelwar.com';
    var padelConfig = {
        //Open up to pass and environment key, defaults to ’dev’
        env: argv.env || 'dev',
        port: 8070,
        host: devHost,
        livereload: optOut(argv.livereload),
        app: 'app',
        tmp: '.tmp',
        dist: 'dist',
        npm: 'node_modules',
        bower: 'bower_components',
        isProduction: function () {
            return this.env === 'prod';
        },
        getAssetsHost: function () {
            if (this.host === devHost) {
                return this.host + ':' + this.port;
            }
            else {
                return this.host;
            }
        },
        getConnectHostname: function () {
            // Return empty string to make Connect listen to all interfaces.
            // This to be able to access the site from a VirtualBox.
            return this.host === devHost ? '' : this.host;
        }
    };

    // It’s important that we only act on string values not to change default behaviour (if not specified)
    function optOut(value) {
        var treatAsFalse = ['0', 'off', 'false'];
        return treatAsFalse.indexOf(value) === -1;
    }

    function shellExec(cmd) {
        return shelljs.exec(cmd, { 'silent': true }).output.replace('\n', '');
    }

    padelConfig.sha    = shellExec('git rev-parse HEAD');
    padelConfig.branch = shellExec('git symbolic-ref -q --short HEAD');

    padelConfig.date   = grunt.template.today('yyyy-mm-dd HH:MM:ss');
    padelConfig.banner = grunt.template.process('padel (<%= date %>)', { data: { date: padelConfig.date } });

    console.log(padelConfig);

    var gruntConfig = {
        padel: padelConfig,
        ngtemplates: {
            app: {
                cwd: '<%= padel.app %>',
                src: ['common/components/**/**/*.html', 'widgets/**/*.html'],
                dest: '<%= padel.tmp %>/templates.js',
                options: {
                    module: 'olaf.templates',
                    url: function (url) {
                        return '/' + url;
                    },
                    htmlmin: {
                        collapseBooleanAttributes: true,
                        collapseWhitespace: true,
                        removeAttributeQuotes: false,
                        removeComments: true,
                        removeEmptyAttributes: true,
                        removeRedundantAttributes: true,
                        removeScriptTypeAttributes: true,
                        removeStyleLinkTypeAttributes: true
                    },
                    bootstrap: function (module, script) {
                        return "(function(){ angular.module('" + module + "', []).run(['$templateCache', function($templateCache) { " + script + " }]); })();";
                    }
                }
            }
        },
        ngmodules: {
            services: {
                src: ['<%= padel.app %>/services/*.js'],
                dest: '<%= padel.tmp %>/services.js'
            },
            models: {
                src: ['<%= padel.app %>/models/*.js'],
                dest: '<%= padel.tmp %>/models.js'
            },
            components: {
                src: ['<%= padel.app %>/common/components/**/*.js'],
                dest: '<%= padel.tmp %>/components.js'
            },
            utils: {
                src: ['<%= padel.app %>/common/utils/**/*.js'],
                dest: '<%= padel.tmp %>/utils.js'
            },
            widgets: {
                src: ['<%= padel.app %>/widgets/**/*.js'],
                dest: '<%= padel.tmp %>/widgets.js'
            }
        },
        tz: grunt.file.readJSON(path.join(padelConfig.bower, 'moment-timezone/moment-timezone.json')),
        concat: {
            config: {
                options: {
                    banner: "(function() {\n" +
                        "'use strict';\n" +
                        "if (typeof window.olaf === 'undefined') { window['olaf'] = {}; }\n" +
                        "olaf.build = { sha: '<%= padel.sha %>',\n" +
                        "shasum: '<%= padel.sha.substr(0, 7) %>',\n" +
                        "branch: '<%= padel.branch %>',\n" +
                        "date: '<%= padel.date %>'\n" +
                        "}\n" +
                        "olaf.config = ",
                    footer: ";\n" +
                        "olaf.config.assetsHost = '<%= padel.getAssetsHost() %>';\n" +
                        "olaf.config.env = '<%= padel.env %>';\n" +
                        "olaf.config.production = <%= padel.isProduction() %>;\n" +
                        "})();"
                },
                src: ['<%= padel.app %>/config/config.json'],
                dest: '<%= padel.tmp %>/config.js'
            },
            events: {
                options: {
                    banner: "(function() {\n" +
                        "olaf.events = ",
                    footer: "})();"
                },
                src: ['<%= padel.app %>/config/events.json'],
                dest: '<%= padel.tmp %>/events.js'
            },
            app: {
                options: {
                    banner: "(function(undefined){'use strict';\n",
                    process: function (src, filepath) {
                        return '// Source: ' + filepath + '\n' + src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
                    },
                    footer: '\n}());'
                },
                src: [
                    '<%= concat.config.dest %>',
                    '<%= concat.events.dest %>',
                    '<%= ngmodules.components.dest %>',
                    '<%= ngmodules.utils.dest %>',
                    '<%= ngmodules.widgets.dest %>',
                    '<%= ngmodules.services.dest %>',
                    '<%= ngmodules.models.dest %>',
                    '<%= ngtemplates.app.dest %>',
                    '<%= padel.app %>/index.js'
                ],
                dest: '<%= padel.dist %>/js/padel.js'
            },
            vendor: {
                options: {
                    footer: 'moment.tz.add(<%= JSON.stringify(tz) %>);\n_.mixin(_.str.exports());'
                },
                src: [
                    '<%= padel.bower %>/jquery/jquery.js',
                    '<%= padel.bower %>/lodash/dist/lodash.js',
                    // '<%= padel.npm %>/lodash-deep/lodash-deep.js',
                    '<%= padel.bower %>/underscore.string/lib/underscore.string.js',
                    '<%= padel.bower %>/marked/lib/marked.js',
                    '<%= padel.bower %>/moment/moment.js',
                    '<%= padel.bower %>/moment-timezone/moment-timezone.js',
                    '<%= padel.bower %>/angular/angular.js',
                    '<%= padel.bower %>/angular-animate/angular-animate.js',
                    '<%= padel.bower %>/angular-bindonce/bindonce.js',
                    '<%= padel.bower %>/angular-cache/dist/angular-cache-1.2.0.js',
                    '<%= padel.bower %>/angular-route/angular-route.js',
                    '<%= padel.bower %>/angular-sanitize/angular-sanitize.js',
                    '<%= padel.bower %>/angular-i18n/angular-locale_es.js',
                    '<%= padel.bower %>/angular-google-maps/dist/angular-google-maps.js',
                    '<%= padel.bower %>/angular-bootstrap/ui-bootstrap.js',
                    '<%= padel.bower %>/angular-bootstrap/ui-bootstrap-tpls.js',
                    '<%= padel.app %>/common/plugins/*.js'
                ],
                dest: '<%= padel.dist %>/js/vendor.js'
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            components: ['<%= padel.app %>/common/components/*.js', '<%= padel.app %>/common/components/**/*.js'],
            utils: ['<%= padel.app %>/utils/**/*.js'],
            widgets: ['<%= padel.app %>/widgets/**/*.js']
        },
        uglify: {
            app: {
                options: {
                    banner: '/*! <%= padel.banner %> */\n'
                },
                files: {
                    '<%= padel.dist %>/js/padel.min.js': ['<%= concat.app.dest %>']
                }
            },
            vendor: {
                options: {
                    banner: '/*! <%= padel.banner %> */\n'
                },
                files: {
                    '<%= padel.dist %>/js/vendor.min.js': ['<%= concat.vendor.dest %>']
                }
            }
        },
        cssmin: {
            combine: {
                options: {
                    banner: '/* <%= padel.banner %> */\n'
                },
                files: {
                    '<%= padel.dist %>/css/padel.min.css':
                        [
                            '<%= padel.bower %>/bootstrap/dist/css/bootstrap.css',
                            '<%= padel.bower %>/bootstrap/dist/css/bootstrap-theme.css',
                            '<%= padel.bower %>/font-awesome/css/font-awesome.min.css',
                            '<%= padel.app %>/assets/css/**/*.css',
                            '<%= padel.app %>/common/components/**/*.css',
                            '<%= padel.app %>/common/utils/**/*.css',
                            '<%= padel.app %>/widgets/**/**/*.css'
                        ]
                }
            }
        },
        copy: {
            locations: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: [ '<%= padel.app %>/config/locations.json' ],
                        dest: '<%= padel.dist %>/js/'
                    }
                ]
            },
            fonts: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: [
                            '<%= padel.app %>/assets/fonts/*',
                            '<%= padel.bower %>/bootstrap/dist/fonts/*',
                            '<%= padel.bower %>/font-awesome/fonts/*'
                        ],
                        dest: '<%= padel.dist %>/fonts/',
                        filter: 'isFile'
                    }
                ]
            },
            images: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= padel.app %>/assets/img',
                        src: ['**'],
                        dest: '<%= padel.dist %>/img/'
                    }
                ]
            },
            icons: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= padel.app %>',
                        src: ['*.ico'],
                        dest: '<%= padel.dist %>/'
                    }
                ]
            }
        },
        template: {
            //HTML file to process
            html: {
                options: {
                    data: {
                        commitId: '<%= padel.sha %>',
                        assetsHost: '<%= padel.getAssetsHost() %>',
                        minSuffix: '<%= padel.isProduction() ? ".min" : "" %>'
                    }
                },
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['<%= padel.app %>/templates/*.html', '<%= padel.app %>/templates/.htaccess'],
                        dest: '<%= padel.dist %>/',
                        filter: 'isFile'
                    }
                ]
            }
        },
        clean: {
            temp: ['<%= padel.tmp %>'],
            dist: ['<%= padel.dist %>']
        },
        connect: {
            server: {
                options: {
                    port: '<%= padel.port %>',
                    hostname: '<%= padel.getConnectHostname() %>',
                    base: '<%= padel.dist %>',
                    middleware: function (connect, options) {
                        var middlewares = [
                            lrSnippet,
                            modRewrite([
                                //'^/$ /index.html [L]',
                                '!\\.html|\\.js|\\.css|\\.json|\\.eot|\\.svg|\\.ttf|\\.woff|\\.jpg|\\.png|\\.gif|\\.ico$ /index.html']),
                            mountFolder(connect, padelConfig.dist)];
                        if (padelConfig.livereload === false) {
                            //If livereload is off, remove the livereload middleware
                            middlewares.shift();
                        }
                        return middlewares;
                    }
                }
            }
        },
        watch: {
            scripts: {
                files: ['<%= padel.app %>/**/**/*.html', '<%= padel.app %>/**/**/*.js', '<%= padel.app %>/**/*.json', '<%= padel.app %>/index.js'],
                tasks: ['scripts'],
                options: {
                    livereload: true
                }
            },
            styles: {
                files: ['<%= padel.app %>/**/**/*.css'],
                tasks: ['styles'],
                options: {
                    livereload: true
                }
            }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true,
                browsers: ['PhantomJS']
            }
        },
        concurrent: {
            dev: {
                tasks: ['watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    };

    var mock = argv.mock;
    if (argv.mock) {
        gruntConfig.concat.app.src.push('<%= ngmodules.mocks.dest %>');
    }

    grunt.initConfig(gruntConfig);

    grunt.registerTask('scripts', ['ngtemplates', 'ngmodules', 'concat', 'uglify', 'clean:temp']);  // Uglify for prd
    grunt.registerTask('styles', ['cssmin']);

    grunt.registerTask('default', ['clean', 'copy', 'template:html', 'scripts', 'styles']);
    grunt.registerTask('test', ['default', 'jshint', 'karma']);
    grunt.registerTask('server', ['default', 'connect:server', 'concurrent:dev']);


};
