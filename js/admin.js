/* page1 v1.0 */
require([
        "base",
        "common/report",
        "common/personal_info",
        "common/partner",
        "common/business",
        "common/task",
        "common/user",
        "common/promoter",
        "common/withdraw",
        "common/guest_user",
        "common/spdm_report",
        "common/bdm_report"
    ],
    function(base) {
        var reportTabMenus = $('a[data-toggle="tab"]', $("#admin_report"));
        reportTabMenus.on('shown.bs.tab', function(e) {
            var linkTo = $(e.target).attr("href");
            if (linkTo === "#admin_tab3") {
                $(".custom_time .btn-sure", $("#admin_tab3")).click(function() {
                    renderUserChart($("#lz_stdate").val(), $("#lz_eddate").val());
                });
                $(".select_date .btn:first", $("#admin_tab3")).trigger("click");
            } else if (linkTo === "#admin_tab1") {
                $(".custom_time .btn-sure", $("#admin_tab1")).click(function() {
                    renderLZChart($("#lz_stdate").val(), $("#lz_eddate").val());
                });
                $(".select_date .btn:first", $("#admin_tab1")).trigger("click");
            } else if (linkTo === "#admin_tab2") {
                base.renderReport({
                    $el: $("#admin_tab2"),
                    headUrl: base.domain + "ad/calcSum",
                    headTip: "产品信息",
                    headArr: ["today", "yesterday", "seven", "thirty"],
                    reportUrl: base.domain + "ad/calcDay",
                    reportTip: "产品报告信息",
                    reportArr: [{
                        name: "日期",
                        mData: "date"
                    }, {
                        name: "平均浏览页面数",
                        type: 'bar',
                        barMaxWidth: '30',
                        mData: "sum"
                    }, {
                        name: "平均浏览时长",
                        type: 'line',
                        mData: "sum_finish"
                    }, {
                        name: "平时下载任务量",
                        type: 'line',
                        mData: "sum_percent"
                    }],
                    head$el: $("#admin_tab2 table:first"),
                    rTable$el: $("#product-table"),
                    rChart$el: $('#product-chart')
                });
            }
        });
        base.afterUserinfo.add(function() {
            reportTabMenus.first().tab('show');
        });

        function renderLZChart(stime, etime) {
            $.ajax({
                // type: "POST",
                url: "../../js/json/_report2.json",
                data: {
                    token: base.account.token,
                    stime: stime,
                    expire: etime
                },
                dataType: "json",
                beforeSend: base.initLoad("账户报告信息加载中。。。")
            }).done(function(data) {
                var option = {
                    title: {
                        text: '来赚账户报告',
                        subtext: stime + " ~ " + etime,
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: { // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    legend: {
                        selected: {
                            '点击下载钥匙的人数': false,
                            '总浏览数': false,
                            '通过SAFARI浏览数': false,
                            '通过微信浏览数': false
                        },
                        data: ['活跃用户', '次日留存', '下载并激活的人数(新增数)', '点击下载钥匙的人数', '总浏览数', '通过SAFARI浏览数', '通过微信浏览数'],
                        y: '45'
                    },
                    toolbox: {
                        show: true,
                        orient: 'vertical',
                        x: 'right',
                        feature: {
                            magicType: {
                                show: true,
                                type: ['line', 'bar', 'tiled']
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
                        data: ['2011-11-11', '2011-11-12', '2011-11-13', '2011-11-14', '2011-11-15', '2011-11-16', '2011-11-17']
                    }],
                    yAxis: [{
                        type: 'value'
                    }],
                    series: [{
                        name: '活跃用户',
                        type: 'line',
                        data: [150, 232, 321, 274, 350, 340, 147]
                    }, {
                        name: '次日留存',
                        type: 'line',
                        data: [120, 202, 121, 74, 150, 140, 203]
                    }, {
                        name: '下载并激活的人数(新增数)',
                        type: 'bar',
                        barWidth: 10,
                        data: [220, 232, 281, 234, 290, 230, 220]
                    }, {
                        name: '点击下载钥匙的人数',
                        type: 'bar',
                        barWidth: 30,
                        data: [320, 332, 301, 334, 390, 330, 320]
                    }, {
                        name: '总浏览数',
                        type: 'bar',
                        barWidth: 30,
                        data: [862, 1018, 964, 1026, 1679, 1600, 1570]
                    }, {
                        name: '通过SAFARI浏览数',
                        type: 'bar',
                        barWidth: 10,
                        stack: '总浏览数',
                        data: [620, 732, 701, 734, 1090, 1130, 1120]
                    }, {
                        name: '通过微信浏览数',
                        type: 'bar',
                        stack: '总浏览数',
                        barWidth: 30,
                        data: [120, 132, 101, 134, 290, 230, 220]
                    }]
                };
                base.renderChart($("#lz-chart")[0], option);
            }).fail(function(data) {
                base.addTip("账户报告信息加载失败！");
            }).always(function() {
                base.initLoad();
            });
        }
        
        function renderUserChart(stime, etime){
            $.ajax({
                // type: "POST",
                // url: base.domain + "ad/calcList",
                url: "../../js/json/_rp1.json",
                data: {
                    token: base.account.token,
                    stime: stime,
                    expire: etime
                },
                dataType: "json",
                beforeSend: base.initLoad("信息加载中。。。")
            }).done(function(data) {

                var arr = data.aaData;

                var optMap = {
                    title: {
                        text: '用户活跃地域分布',
                        subtext: stime + " ~ " + etime,
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    dataRange: {
                        min: 0,
                        max: 1000,
                        x: 'left',
                        y: 'bottom',
                        text: ['高', '低'], // 文本，默认为数值文本
                        calculable: true
                    },
                    toolbox: {
                        show: true,
                        orient: 'vertical',
                        x: 'right',
                        y: 'center',
                        feature: {
                            restore: {
                                show: true
                            },
                            saveAsImage: {
                                show: true
                            }
                        }
                    },
                    roamController: {
                        show: true,
                        x: 'right',
                        mapTypeControl: {
                            'china': true
                        }
                    },
                    series: [{
                        name: '用户活跃量',
                        type: 'map',
                        mapType: 'china',
                        roam: false,
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true
                                }
                            },
                            emphasis: {
                                label: {
                                    show: true
                                }
                            }
                        },
                        data: arr
                    }]
                };

                var optTimezone = {
                    title: {
                        text: '用户活跃时间段',
                        subtext: stime + " ~ " + etime,
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    toolbox: {
                        show: true,
                        feature: {
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
                        },
                        orient: 'vertical'
                    },
                    calculable: true,
                    xAxis: [{
                        type: 'category',
                        data: ['0:00-2:00', '2:00-4:00', '4:00-6:00', '6:00-8:00', '8:00-10:00', '10:00-12:00', '12:00-14:00', '14:00-16:00', '16:00-18:00', '18:00-20:00', '20:00-22:00', '22:00-0:00']
                    }],
                    yAxis: [{
                        type: 'value'
                    }],
                    series: [{
                        name: '活跃人数',
                        type: 'bar',
                        data: [13014, 8050, 3021, 1983, 14902, 16930, 18736, 24201, 28531, 32102, 59203, 19203]
                    }]
                };

                var optVersion = {
                    title: {
                        text: '用户系统版本比例图',
                        subtext: stime + " ~ " + etime,
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        data: ['IOS8.0', 'IOS8.3', 'IOS8.5', 'IOS8.6', 'IOS9.2']
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            magicType: {
                                show: true,
                                type: ['pie', 'funnel'],
                                option: {
                                    funnel: {
                                        x: '25%',
                                        width: '50%',
                                        funnelAlign: 'left',
                                        max: 1548
                                    }
                                }
                            },
                            restore: {
                                show: true
                            },
                            saveAsImage: {
                                show: true
                            }
                        },
                        orient: 'vertical'
                    },
                    calculable: true,
                    series: [{
                        name: '访问来源',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        data: [{
                            value: 335,
                            name: 'IOS8.0'
                        }, {
                            value: 310,
                            name: 'IOS8.3'
                        }, {
                            value: 234,
                            name: 'IOS8.5'
                        }, {
                            value: 135,
                            name: 'IOS8.6'
                        }, {
                            value: 1548,
                            name: 'IOS9.2'
                        }]
                    }]
                };

                base.renderChart($("#map-chart")[0], optMap);
                base.renderChart($("#timezone-chart")[0], optTimezone);
                base.renderChart($("#version-chart")[0], optVersion);
            }).fail(function(data) {
                base.addTip("信息加载失败！");
            }).always(function() {
                base.initLoad();
            });
        }
    },
    function(err) {
        window['console'] && console.log && console.log(err.message);
    }
);