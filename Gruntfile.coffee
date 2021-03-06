connectMW = require(require("path").resolve("middleware", "connectMW.coffee"))

module.exports = (grunt) ->

    port = 7788
  
    # Project configuration.
    grunt.initConfig
        watch:
            coffee_app:
                files: ['app/coffee/**/**.coffee']
                tasks: ["coffee-compile-app"]
            coffee_jasmine:
                files: ['test/jasmine/coffee/**/**.coffee']
                tasks: ["coffee-compile-jasmine"]
            js_requireConfig:
                files: ["app/js/requireConfig.js", "app/js/main.js", "test/jasmine/SpecRunner.js"]
                tasks: ["concat:main", "concat:jasmine"]
            js:
                files: ["app/js/**/**.js", "test/jasmine/js/**/**.js"]
                options:
                    livereload: true

        coffee:
            app:
                options: {
                    bare: true
                }
                files: [
                    expand: true
                    cwd: 'app/coffee'
                    src: ['**/*.coffee']
                    dest: 'app/js'
                    ext: '.js'
                ]
            jasmine:
                options: {
                    bare: true
                }
                files: [
                    expand: true
                    cwd: 'test/jasmine/coffee'
                    src: ['**/*.coffee']
                    dest: 'test/jasmine/js'
                    ext: '.js'
                ]

        copy:
            app:
                files: [
                    expand: true
                    cwd: "app/"
                    src: ["**"]
                    dest: "prebuild/"
                    filter: "isFile"
                ]

        connect:
            server:
                options:
                    port: port
                    base: '.'
                    middleware: (connect, options) ->
                        return [
                            connectMW.stubService
                            connectMW.autocompleteService
                            connectMW.folderMount(connect, options.base)
                        ]

        concat:
            main:
                src: ["app/js/requireConfig.js", "app/js/main.js"]
                dest: "app/js/supermain.js"
            jasmine:
                src: ["app/js/requireConfig.js", "test/jasmine/js/SpecRunner.js"]
                dest: "test/jasmine/js/superSpecRunner.js"


    grunt.loadNpmTasks "grunt-contrib-watch"
    grunt.loadNpmTasks "grunt-contrib-coffee"
    grunt.loadNpmTasks "grunt-contrib-copy"
    grunt.loadNpmTasks "grunt-contrib-connect"
    grunt.loadNpmTasks "grunt-contrib-concat"
    grunt.loadNpmTasks "grunt-newer"

    grunt.registerTask "default", ["connect:server", "watch"]

    # compilation
    grunt.registerTask "coffee-compile-app", ["newer:coffee:app"]
    grunt.registerTask "coffee-compile-jasmine", ["newer:coffee:jasmine"]

    grunt.registerTask "server", ["connect"]

