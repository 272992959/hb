module.exports = function(grunt) 
{
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    var project_version=(function(){
        return '?v='+grunt.template.today('yyyymmddHHMM') //  v.join('') //'0.1.0';
    })();

    var config = {

        pkg:grunt.file.readJSON('package.json'),
        business:'/*\n'+
            '*  Copyright <%= grunt.template.today("yyyy-mm-dd")%>  houbu.com \n'+
            '*  Author wangbao \n'+
            '*/\n',
        meta:{
            basePath:'../',
            destPath:'../../demo_min/',
            smartPath: 'css/'
        },
        src: '../',
        serverHost: '192.168.1.125',
        // serverHost: '127.0.0.1',
        serverPort: 5211,
        livereload: 35729
    }; 
    grunt.initConfig({
        config: config,
        watch:{          // 监测文件变动
            less:
            {
                files: 'less/**/*.less',
                tasks: ['less'],
                // tasks: ['less','copy:css','smartsprites'],
                options: {
                    livereload: true 
                }
            },
            smartsprites :
            {
                files: ['img/**/*.jpg', 'img/**/*.png', 'img/**/*.gif'],
                tasks: ['smartsprites'],
                options: {
                    livereload: true 
                }
            },
            include: 
            {
                files: [
                    'html/**/*.html',
                    'html/**/*.json'
                ],
                tasks: ['include'],
                options: {
                    spawn: false,
                    livereload: true 
                }
            }
        },
        connect:{        // 开启服务
            options: 
            {
                port: config.serverPort,
                hostname: config.serverHost,
                middleware: function(connect, options) 
                {
                    return [
                    require('connect-livereload')({
                        port: config.livereload
                    }),
                    //  Serve static files.
                    connect.static(options.base),
                    //  Make empty directories browsable.
                    //  connect.directory(options.base),
                    ];
                }
            },
            server: 
            {
                options: 
                {
                    //  keepalive: true,
                    base: config.src
                }
            }
        },
        open:{           // 打开浏览器
            server: 
            {
                url: 'http://' + config.serverHost + ':' + config.serverPort + "/html/main.html"
            }
        },
        include:{        // html模板编译
            dev: 
            {
                options: {
                    includesDir : 'html_template',
                    prefix : '@',

                    suffix : ';',
                    docroot : '.',
                    resroot : '',
                    globals : {},
                    ignore: ['.svn']
                },
                files: [{
                    src: ['html/**/*.html'],
                    dest: '../'
                }]
            }
        },
        less:{           // less
            dev: 
            {
                options: {
                    smartSpriteTag: true
                },
                files: [{
                    expand: true,
                    cwd: 'less/',
                    src: ['*.less','color/*.less','module/*.less'],
                    dest: '../css',
                    ext : '.css'
                }]
            }
        },
        smartsprites:{   // 精灵图
            dev: 
            {
                rootPath: '<%=config.meta.smartPath%>',
                outputPath: '../<%=config.meta.smartPath%>',
                stdout: false,
                stderr: true,
                callback: function(error)
                {
                    if(error)
                    {
                        grunt.log.writeln('smartsprite exec error:' + error);    
                    }
                    else
                    {
                        grunt.log.writeln('smartsprite exec successfully.');
                    }
                }
            }
        },
        clean:{          // 清理线上目录
            options:{
                force:true
            },
            dest:{
                expand: true,
                cwd: '<%=config.meta.destPath%>', 
                src: [
                'css/**/*.css','html/**/*.html','css/**/*.png','css/**/*.jpg',
                'js/**/*.js'
                ]
            }
        },
        uglify:{         // 压缩js 
            main:{
                options:{
                    banner:'<%=config.business%>'
                },
                files:[
                {
                    expand:true,
                    cwd:'<%=config.meta.basePath%>js/',
                    src:['**/*.js'],
                    dest:'<%=config.meta.destPath%>js/',
                    ext:'.min.js'
                }]
            },
        },
        cssmin:{         // 压缩css
            options: {
                keepSpecialComments: 0
            },
            compress: {
                options:{
                    banner:'<%=config.business%>'
                },
                files:[
                {
                    expand:true,
                    cwd:'<%=config.meta.basePath%>css/',
                    src:['**/*.css'],
                    dest:'<%=config.meta.destPath%>css/',
                    ext:'.min.css'
                }
                ]
            }
        },
        htmlmin:{        // 压缩html
            dist:{
                options:{
                    removeComments: true, // 去注析
                    collapseWhitespace: true // 去换行
                },
                files:[
                {
                    expand:true,
                    cwd:'<%=config.meta.destPath%>html/',
                    src:['**/*.html'],
                    dest:'<%=config.meta.destPath%>html/',
                    ext:'.html'
                }
                ]  
            }
        },
        copy:{           // 复制到线上目录
            css:{
                files :[
                    {
                        expand: true,
                        cwd: '<%=config.meta.smartPath%>/', 
                        src: ['**/*.css'],
                        dest: '../<%=config.meta.smartPath%>/'
                    }
                ]
            },
            all:{
                files :[
                    {
                        expand: true,
                        cwd: '<%=config.meta.basePath%>html/', 
                        src: ['**/*.html'],
                        dest: '<%=config.meta.destPath%>html/'
                    },
                    {
                        expand: true,
                        cwd: '<%=config.meta.basePath%>img/', 
                        src: ['**/*.png','**/*.jpg'],
                        dest: '<%=config.meta.destPath%>img/'
                    },
                    {
                        expand: true,
                        cwd: '<%=config.meta.basePath%>font/', 
                        src: ['**/*.eot','**/*.svg','**/*.ttf','**/*.woff'],
                        dest: '<%=config.meta.destPath%>font/'
                    }
                ]
            }
        },
        'string-replace':{  // 字符串替换
            dist:{
                files:[{
                    expand: true,
                    cwd: '<%=config.meta.destPath%>html/', 
                    src: ['**/*.html'],
                    dest: '<%=config.meta.destPath%>html/',
                }],
                options:{
                    replacements:[{
                        pattern: /[\s\S]*/ig,  //  /(<link[^>]*rel="stylesheet"[^>]*)(\.css)([^>]*>)/mgi, // /\.css/ig,
                        replacement: function (match, p1, offset, string) {  
                            var content=match || ''
                            ,cssRegex=/<link[^>]*rel="stylesheet"[^>]*\.css[^>]*>/mgi
                            ,jsRegex=/<script[^>]*src="[^>]*\.js[^>]*><\/script>/mgi
                            ,temp=''
                            ,matches=content.match(cssRegex)
                            ,jsMatches=content.match(jsRegex);

                            if(matches  && matches.length){
                                Array.prototype.forEach.call(matches,function(v,i){
                                    temp=v.replace('.css','.min.css'+project_version);
                                    content=content.replace(v,temp);
                                });
                            }
                            if(jsMatches  && jsMatches.length){
                                Array.prototype.forEach.call(jsMatches,function(v,i){
                                    temp=v.replace('.js','.min.js'+project_version);
                                    if(temp.split("data-main").length - 1){
                                        grunt.log.writeln(temp);
                                        temp=temp.replace('.js"','.min.js"');
                                    }
                                    content=content.replace(v,temp);
                                });
                            }
                            return content;
                        }


                    }]
                }
            }
        },
        jshint:{         // js语法规范检查
            files:['<%=config.meta.basePath%>**/*.js'],
            options: {
                options: { 
                    curly: true,    //循环或者条件语句必须使用花括号包围
                    eqeqeq: true,   //使用===和!==替代==和!=
                    immed: true,    //要求匿名函数的这样调用(function(){}()),而不是(function(){})();为了表明，表达式的值是函数的结果，而不是函数本身
                    latedef: true,  //变量定义前禁止使用
                    newcap: true,   //构造器函数首字母大写
                    noarg: true,    //禁止使用 arguments.caller 和 arguments.calle (因为未来会被弃用)
                    sub: true,      //允许各种形式的下标来访问对象,eg:person['name'],person.name
                    undef: true,    //要求所有的非全局变量，在使用前都被声明
                    boss: true,     //JSHint会允许在if，for，while里面编写赋值语句
                    eqnull: true,   //允许使用"== null"作比较
                    browser: true   //预定义全局变量 document, navigator, FileReader等
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');  
    grunt.loadNpmTasks('grunt-contrib-less-smartsprites');  
    grunt.loadNpmTasks('grunt-contrib-smartsprites'); 
    grunt.loadNpmTasks('grunt-contrib-include');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-string-replace');


    grunt.registerTask('default', ['connect:server', 'include', 'less', 'open:server', 'watch']);
    // grunt.registerTask('default', ['connect:server', 'include', 'less', 'copy:css', 'smartsprites', 'open:server', 'watch']);

    grunt.registerTask('min',['clean','uglify','cssmin','copy:all','string-replace','htmlmin']);


    // 动态改变include的参数从而加快效率,提升体验！！
    var changedFiles = [];
    var onChange = grunt.util._.debounce(function() {
        grunt.config('include.dev.files', changedFiles);
        changedFiles = [];
    }, 100);
    grunt.event.on('watch', function(action, filepath) {
        var filesObj = Object.create(null);
        var srcArr = [];
        
        if(filepath.split('includes').length == 2){
            srcArr.push('html/**/*.html');
            srcArr.push('*.html');
        }else{
            srcArr.push(filepath);
        }
        filesObj.src = srcArr;
        filesObj.dest = '../';
        changedFiles.push(filesObj);
        onChange();
    });

};