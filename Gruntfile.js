module.exports = function(grunt){

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint:{
            options:{
                asi:true,
                laxcomma:true,
                laxbreak:true
            },
            all:['flexibleWapHelper.js']
        },
        uglify: {
            options: {
                banner: '/*!\n'
                        + ' * author:jieyou\n'
                        + ' * contacts:baidu hi->youyo1122\n'
                        + ' * see https://github.com/jieyou/flexibleWapHelper\n'
                        + ' */\n'
            },
            build: {
                src:'flexibleWapHelper.js',
                dest:'flexibleWapHelper.min.js'
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['jshint','uglify']);
}