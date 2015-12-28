define(["jquery", "mousewheel", "cookie", "bootstrap", "dataTables", "modernizrCustom", "fancyboxPack", "echartsAll", "date", "date97", "validate"], function() {

    // 预读取表格上方状态
    var filter_status = $.cookie("data-status");
    if (filter_status) {
        $("#filter_status+ul.dropdown-menu li a").each(function() {
            if (filter_status === $(this).attr("data-status")) {

                $("#filter_status").find("span.text_info").text($(this).text());
                $("#filter_status").find("input").val(filter_status).trigger("change");
            }
        });
    }

    var base = {
        domain: "http://admin3.cc:8080/",
        // domain: "http://192.168.1.140:8080/",
        fold: ['admin', 'finance', 'service', 'spd_m', 'bd_m', 'spd', 'bd', 'ad'],
        account: {
            token: $.cookie("token"),
            role: $.cookie("role"),
            name: $.cookie("name")
        },
        getMaskHtml: function(str) {
            return '<div class="mask">' + '<div class="alert-info-container">' + '<div class="loading">' + '<i></i>' + '<i></i>' + '<i></i>' + '<i></i>' + '<i></i>' + '</div>' + '<div class="alert alert-info" role="alert">' + str + '</div>' + '</div>' + '</div>';
        },
        initLoad: function(str, $el) {
            if (typeof str !== "string") {
                $el = str;
                str = null;
            }
            $el && $el.css("position", "relative");
            var maskCT = $el || $("body");
            var mask = $(".mask", maskCT);
            !mask.length && (maskCT.append(mask = $(base.getMaskHtml(str))));
            str ? mask.show().find(".alert-info").html(str) : mask.hide();
        },
        addTip: function(tip, type) {
            var alertArr = $("#tips-container .alert");
            var len = alertArr.length;
            var typeArr = ["danger", "success", "info", "warning"];
            var tipEle = $('<div class="alert alert-' + (~$.inArray(type, typeArr) ? type : "danger") + '">' + '<button class="close" data-dismiss="alert" type="button">&times;</button>' + tip + '<span class="left_corner">'+(len+1)+'</span></div>');
            $("#tips-container .widget-content").append(tipEle);
            if(type === "success"){
                setTimeout(function(){
                    tipEle.fadeOut(1500);
                },5000);
            }
        },
        renderChart: function(dom, option) {
            if (!dom) {
                return false;
            }
            var myChart = echarts.init(dom);

            myChart.setOption(option);

            window.onresize = myChart.resize;
            return myChart;
        },
        renderTable: function($el, option) {
            if (!$el.length) {
                return false;
            }
            return $el.dataTable(option);
        },
        table: function($el, opt, argArr) {
            if (!$el.length) {
                return false;
            }
            var objArr = [];
            for (var i = 0, len = opt.aoColumns.length; i < len; i++) {
                var cur = opt.aoColumns[i];
                if (cur.filter) {
                    var obj = {
                        text: cur.sTitle,
                        value: cur.mData
                    };
                    if (obj.value === $.cookie($el.selector + "_select")) {
                        obj.selected = true;
                    }

                    objArr.push(obj);
                }
            }

            var option = {
                // sServerMethod: "POST",
                bStateSave: true,
                bProcessing: true,
                bServerSide: true,
                iDisplayStart: 0,
                iDisplayLength: 10,
                bAutoWidth: false,
                sPaginationType: "full_numbers",
                oLanguage: {
                    sSearch: base.getSelect(objArr,$el.selector + "_select"),
                    sEmptyTable: "暂无数据",
                    sInfo: "显示 _START_ ~ _END_ 条，共 _TOTAL_ 条记录",
                    sInfoEmpty: "暂无记录显示",
                    sLengthMenu: "每页显示 _MENU_ 条记录",
                    sZeroRecords: "暂无数据",
                    sProcessing: $(base.getMaskHtml("数据加载中")).html(),
                    sInfoFiltered: "",
                    oPaginate: {
                        sFirst: "首页",
                        sPrevious: "上一页",
                        sNext: "下一页",
                        sLast: "末页"
                    }
                }
            };
            $.extend(true, option, opt);
            option.fnServerParams = function(aoData) {
                aoData.push({
                    name: "searchType",
                    value: $('select[data-flag="' + $el.selector + '_select"]').val()
                });
                aoData.push({
                    name: "token",
                    value: base.account.token
                });
                if (argArr) {
                    for (var i = 0, len = argArr.length; i < len; i++) {
                        var cur = argArr[i];
                        // 如果存在$el,则需要动态取值
                        if (cur.$el) {
                            cur.value = cur.$el.val();
                        }
                        aoData.push(cur);
                    }
                }
            };

            option.fnServerData = function(sSource, aoData, fnCallback, oSettings) {
                oSettings.jqXHR = $.ajax({
                    "dataType": 'json',
                    "type": "POST",
                    "url": sSource,
                    "data": aoData,
                    "success": fnCallback
                }).always(function(dt){
                    if(dt.error && dt.error != "1" && dt.msg){
                        base.addTip(dt.msg);
                    }
                });
            };
            
            return $el.dataTable(option);
        },
        refreshTable: function($el, option, argArr) {
            if (base.isDataTable($el)) {
                $el.fnDestroy();
            }
            option.bStateSave = false;
            return base.table($el, option, argArr);
        },
        isDataTable: function($el) {
            return $.fn.DataTable.fnIsDataTable($el[0]);
        },
        renderDialog: function(url, fnBeforeShow) {
            $.fancybox({
                href: url,
                maxWidth: '80%',
                height: "auto",
                fitToView: false,
                autoSize: false,
                padding: 5,
                nextEffect: 'fade',
                prevEffect: 'fade',
                helpers: {
                    title: {
                        type: "outside"
                    }
                },
                beforeShow: fnBeforeShow
            });
        },
        getSelect: function(objArr,flag) {
            var obj, sel = "搜索";
            if (objArr.length) {
                sel = '<select'+ (flag ? ' data-flag="'+flag+'"' : '')+'>';
                while (objArr.length) {
                    obj = objArr.shift();
                    sel += '<option value="' + obj.value + '"' + (obj.selected ? 'selected="selected"' : '') + '>' + obj.text + '</option>';
                }
                sel += '</select>';
            }
            return sel;
        },
        trimVal: function($el) {
            $el.each(function() {
                $(this).val($.trim($(this).val()));
            });
        },
        afterUserinfo: $.Callbacks()
    };

    //全屏切换
    $("body").toggleClass("regular-container", !!$.cookie("narrowScreen"));

    // Navbar scroll animation
    $(function() {
        var delta, lastScrollTop;
        lastScrollTop = 0;
        delta = 50;
        return $(window).scroll(function(event) {

            var st;
            st = $(this).scrollTop();
            if (Math.abs(lastScrollTop - st) <= delta) {
                return;
            }
            $('.navbar.scroll-hide').toggleClass("closed", st > lastScrollTop);
            return lastScrollTop = st;
        });
    });

    if (base.account.token) {
        $("#account_name").text(base.account.name);
    } else {
        var second = 5;
        base.initLoad('您还没有登录， <span id="second2relink">' + second + '</span> 秒后跳转至<a href="../../html/login.html"> 登录页面 </a>！');
        setInterval(function() {
            second-- ? $("#second2relink").text(second): window.location.href = "../../html/login.html";
        }, 1000);
    }



    $("body").on('click', '.navbar-toggle', function() {
        // Mobile Nav
        $('body, html').toggleClass("nav-open");
    }).on('click', '#logout', function() {
        // 登出
        if (base.account) {
            $.ajax({
                url: base.domain + "user/logout",
                dataType: "json",
                data: {
                    token: base.account.token
                }
            }).always(function() {
                $.removeCookie('token', {
                    path: '/'
                });
                $.removeCookie('role', {
                    path: '/'
                });
                $.removeCookie('name', {
                    path: '/'
                });
                window.location.href = "../../html/login.html";
            });
        } else {
            $.removeCookie('token', {
                path: '/'
            });
            window.location.href = "../../html/login.html";
        }
    }).on("mouseover", ".navbar.scroll-hide", function() {
        // Navbar scroll animation
        $(".navbar.scroll-hide").removeClass("closed");
        return setTimeout((function() {
            return $(".navbar.scroll-hide").css({
                overflow: "visible"
            });
        }), 150);
    }).on("click", ".icon-resize-small", function() {
        //全屏切换
        !$.cookie("narrowScreen") ? $.cookie("narrowScreen", "true") : $.removeCookie('narrowScreen');
        $("body").toggleClass("regular-container", !!$.cookie("narrowScreen"));
        $(window).trigger("resize");
    }).on("click", '[data-date-max],[data-date-min]', function(e) {
        //日期组合
        var elementID, obj = {};
        obj.dateFmt = 'yyyy-MM-dd HH:mm:ss';
        if ($(this).is('[data-date-format]')) {
            obj.dateFmt = $(this).attr("data-date-format");
        }
        if ($(this).is('[data-date-max]')) {
            obj.maxDate = '#F{$dp.$D(\'' + $(this).attr('data-date-max') + '\')}';
        } else if ($(this).is('[data-date-min]')) {
            obj.minDate = '#F{$dp.$D(\'' + $(this).attr('data-date-min') + '\')}';
        }
        WdatePicker(obj);
    }).on("click", ".select_date .btn", function() {
        // 选择7、30、90、自定义天
        var thisNum = +$(this).attr("data-num");
        var prev$el = $(this).closest(".select_date").prev(".custom_time");
        if (thisNum) {
            $(this).addClass("btn-info").removeClass("btn-info-outline").siblings(".btn-info").removeClass("btn-info").addClass("btn-info-outline");
            var sDate = Date.today().add({
                days: 1 - thisNum
            }).toString("yyyy-MM-dd");
            var eDate = Date.today().toString("yyyy-MM-dd");
            $('[data-date-max]', prev$el).val(sDate);
            $('[data-date-min]', prev$el).val(eDate);
            $('.btn-sure', prev$el).trigger("click");
        } else {
            $(this).closest(".select_date").hide();
            prev$el.show();
        }
    }).on("click", ".custom_time .btn-cancel", function() {
        // 取消自定义时间
        var next$el = $(this).closest(".custom_time").next(".select_date");
        $(this).closest(".custom_time").hide();
        next$el.show();
        // 默认展示一周图表
        $(".btn.btn-info", next$el).trigger("click");
    }).on("click", ".fancybox-inner .btn_close", function() {
        // 关闭对话框
        $.fancybox.close();
    }).on("mouseover", ".action-buttons i", function() {
        // hack2模拟title  省得维护
        !$(this).attr("data-original-title") && $(this).tooltip() && $(this).trigger("mouseover");
    }).on("change", ".dataTables_filter select", function() {
        $.cookie($(this).attr("data-flag"), $(this).val(), {
            path: '/'
        });
        // 下拉条件触发搜索(文本框有值时)

        $(this).next("input").val() && $(this).closest(".dataTables_filter").prev(".dataTables_length").find('select[aria-controls]').trigger("change");
    }).on("click", "#filter_status+ul.dropdown-menu li", function() {
        // 下拉条件触发搜索
        var prevBtn = $(this).closest("ul").prev("button");
        var thisA = $("a", this);
        var thisVal = thisA.attr("data-status");
        prevBtn.find("span.text_info").text(thisA.text());
        prevBtn.find("input").val(thisVal).trigger("change");
        $.cookie("data-status", thisVal, {
            path: '/'
        });
        $(this).closest(".btn-group").prev(".btn_refresh").trigger("click");
    });


    // 按下enter登录
    $(window).keydown(function(event) {
        event.keyCode === 13 && $(".fancybox-inner .btn_save").trigger("click");
    });

    return base;

});