/* config v1.0 */

var require = {
    baseUrl: "../../js",
    paths: 
    {
        jquery: "plugin/jquery",                           //最流行的js库
        bootstrap: "plugin/bootstrap",                     //bootstrap基础组件
        mousewheel: "plugin/jquery-mousewheel",            //滚轮侦测
        dataTables: "plugin/jquery-dataTables",            //表格插件
        modernizrCustom: "plugin/modernizr-custom",        //浏览器能力检测
        fancyboxPack: "plugin/jquery-fancybox-pack",       //弹层展示插件
        styleswitcher: "plugin/styleswitcher",             //切换CSS样式表
        date: "plugin/date",                               //日期计算
        base: "_base",                                     //base
        cookie: "plugin/jquery-cookie",                    //cookie
        echartsAll: "plugin/echarts/echarts-all",          //百度图形绘制
        validate: "plugin/jquery-validate",                //表单验证
        date97: "plugin/My97DatePicker/WdatePicker"        //日期
    },
    shim:
    {
        bootstrap: {deps: ['jquery']},
        mousewheel:  {deps: ['jquery']},
        dataTables:  {deps: ['jquery']},
        fancyboxPack:  {deps: ['jquery']},
        cookie:  {deps: ['jquery']},
        validate:  {deps: ['jquery']},
        base:  {deps: ['jquery','mousewheel','cookie']}
    }
};