define(["base"], function(base) {
    var reportTable = null,
        exit$elArr = [];
    base.renderReport = function(argObj) {
        if (argObj.$el.length) {
            var args = {
                head$el: $("#report_head"),
                rTable$el: $("#report-table"),
                rChart$el: $('#report-chart')
            };
            $.extend(args, argObj);

            var tipNum = 1;
            var sendData = $.extend({
                token: base.account.token
            }, args.idObj);

            // 获取并渲染推广报告数据
            $.ajax({
                type: "POST",
                url: args.headUrl,
                data: sendData,
                dataType: "json",
                beforeSend: base.initLoad(args.headTip + "加载中...", args.$el)
            }).done(function(data) {
                if (data.error == 1) {
                    var d = data.aaData;
                    $("tbody td>span", args.head$el).each(function(i) {
                        $(this).text(d[args.headArr[i]]);
                    });
                }else{
                    base.addTip(data.msg);
                }
            }).fail(function(data) {
                base.addTip(args.headTip + "加载失败！");
            }).always(function() {
                --tipNum < 0 && base.initLoad(args.$el);
            });


            // 获取账户报告数据
            function getReportData(stime, etime) {
                var rpRender = function(){
                    $.ajax({
                        type: "POST",
                        url: args.reportUrl,
                        data: $.extend({
                            start: stime,
                            end: etime
                        }, sendData),
                        dataType: "json",
                        beforeSend: base.initLoad(args.reportTip + "加载中...", args.$el)
                    }).done(function(data) {
                        var optTable = {
                            aaData: data.aaData,
                            bAutoWidth: false,
                            sPaginationType: "full_numbers",
                            oLanguage: {
                                sSearch: "搜索",
                                sEmptyTable: "暂无数据",
                                sInfo: "显示 _START_ ~ _END_ 条，共 _TOTAL_ 条记录",
                                sInfoEmpty: "暂无记录显示",
                                sLengthMenu: "每页显示 _MENU_ 条记录",
                                oPaginate: {
                                    sFirst: "首页",
                                    sPrevious: "上一页",
                                    sNext: "下一页",
                                    sLast: "末页"
                                }
                            }
                        };
                        optTable.aoColumns = $.map(args.reportArr, function(a) {
                            return {
                                sTitle: a.name,
                                mData: a.mData
                            }
                        });

                        //根据预定义的字段设置数据
                        var chartArr = $.each(args.reportArr.slice(1), function() {
                            var dt = this.mData;
                            this.data = $.map(data.aaData, function(a) {
                                return a[dt];
                            });
                        });
                        var optChart = {
                            tooltip: {
                                trigger: 'axis'
                            },
                            legend: {
                                data: $.map(chartArr, function(a) {
                                    return a.name;
                                })
                            },
                            toolbox: {
                                show: true,
                                orient: 'vertical',
                                feature: {
                                    mark: {
                                        show: false
                                    },
                                    magicType: {
                                        show: true,
                                        type: ['line', 'bar']
                                    },
                                    restore: {
                                        show: true
                                    },
                                    saveAsImage: {
                                        show: true
                                    }
                                }
                            },
                            calculable: true,
                            xAxis: [{
                                type: 'category',
                                boundaryGap: false,
                                data: $.map(data.aaData, function(a) {
                                    return a[args.reportArr[0].mData]
                                })
                            }],
                            yAxis: [{
                                type: 'value'
                            }],
                            series: chartArr
                        };
                        reportTable && reportTable.fnDestroy();
                        reportTable = base.renderTable(args.rTable$el, optTable);
                        base.renderChart(args.rChart$el[0], optChart);
                    }).fail(function(data) {
                        base.addTip(args.reportTip + "加载失败！");
                    }).always(function() {
                        --tipNum < 0 && base.initLoad(args.$el);
                    });
                }
                args.dialogUrl ? base.renderDialog(args.dialogUrl, rpRender) : rpRender();
            }

            // 开始结束日期，确认取消按钮
            if (!~$.inArray(argObj.$el.selector, exit$elArr)) {
                exit$elArr.push(argObj.$el.selector);
                argObj.$el.on("click", ".custom_time .btn-sure", function() {
                    var $ct = $(this).closest(".custom_time");
                    getReportData($('[data-date-max]', $ct).val(), $('[data-date-min]', $ct).val());
                });
            }

            $(".select_date .btn:first-child", argObj.$el).trigger("click");
        }
    };
    return base;
});