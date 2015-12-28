define(["common/report"], function(base) {
    var originTable, reportTabMenus = $('a[data-toggle="tab"]', $("#spdm_report"));
    reportTabMenus.on('shown.bs.tab', function(e) {
        var linkTo = $(e.target).attr("href");
        if (linkTo === "#spd_tab3") {
            base.renderReport({
                $el: $("#spd_tab3"),
                headUrl: base.domain + "spd_m/effectSum",
                headTip: "投放效果信息",
                headArr: ["numAll", "numCome", "numTask", "numPercent"],
                reportUrl: base.domain + "spd_m/effectDay",
                reportTip: "投放报告信息",
                reportArr: [{
                    name: "日期",
                    mData: "date"
                }, {
                    name: "带来用户量",
                    type: 'bar',
                    barMaxWidth: '30',
                    mData: "numCome"
                }, {
                    name: "带来任务量",
                    type: 'line',
                    mData: "numTask"
                }, {
                    name: "再邀请用户的用户数量",
                    type: 'line',
                    mData: "numAgain"
                }, {
                    name: "再邀请的用户数量",
                    type: 'line',
                    mData: "numPerson"
                }],
                head$el: $("#spd_tab3 table:first"),
                rTable$el: $("#app-table"),
                rChart$el: $('#app-chart')
            });
        } else if (linkTo === "#spd_tab1") {
            base.renderReport({
                $el: $("#spd_tab1"),
                headUrl: base.domain + "spd_m/calcSum",
                headTip: "推广费用",
                headArr: ["today", "yesterday", "seven", "thirty", "all"],
                reportUrl: base.domain + "spd_m/calcDay",
                reportTip: "账户报告信息",
                reportArr: [{
                    name: "日期",
                    mData: "date"
                }, {
                    name: "推广费用",
                    type: 'bar',
                    barMaxWidth: '30',
                    mData: "payNum"
                }, {
                    name: "带来的下载量",
                    type: 'line',
                    mData: "downNum"
                }, {
                    name: "带来的任务量",
                    type: 'line',
                    mData: "taskNum"
                }, {
                    name: "产生的总消费金额",
                    type: 'line',
                    mData: "costNum"
                }],
                head$el: $("#spd_tab1 table:first"),
                rTable$el: $("#report-table"),
                rChart$el: $('#report-chart')
            });
        } else if (linkTo === "#spd_tab2") {
            $("#spd_tab2 .select_date .btn:first").trigger("click");
        }
    });

    var origin = "promoter";
    $("#spd_tab2").on("click", ".select_origin .btn", function() {
        if ($(this).is(".origin_promoter")) {
            origin = "promoter";
        } else {
            origin = "guest_user";
        }
        $(this).removeClass("btn-info-outline").addClass("btn-info");
        $(this).siblings().removeClass("btn-info").addClass("btn-info-outline");
        $("#spd_tab2 .custom_time .btn-sure").trigger("click");
    }).on("click", ".custom_time .btn-sure", function() {
        // $("#origin_stdate").val(), $("#origin_eddate").val(), origin
        $.ajax({
            type: 'POST',
            url: base.domain + "spd_m/fromNum",
            data: {
                token: base.account.token,
                start: $("#origin_stdate").val(),
                end: $("#origin_eddate").val(),
                role: origin === "promoter" ? "6" : "9"
            },
            dataType: 'json',
            beforeSend: base.initLoad("销售额来源信息加载中！")
        }).done(function(data) {
            renderOriginReport(data.aaData);
        }).fail(function() {
            base.addTip("销售额来源信息加载失败！");
        }).always(function() {
            base.initLoad();
        });
    });

    // 推广费用来源图表渲染
    function renderOriginReport(dataArr) {
        var oriName = origin === "promoter" ? "推广人员" : "特邀用户";
        var optionC = {
            title: {
                text: "前10位" + oriName + "销售额占比",
                subtext: $("#origin_stdate").val() + " ~ " + $("#origin_eddate").val(),
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                data: $.map(dataArr, function(a) {
                    return a.name
                })
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
                }
            },
            calculable: true,
            series: [{
                name: '销售额来源',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: dataArr
            }]
        };
        base.renderChart($("#origin-chart")[0], optionC);

        var optionT = {
            "bAutoWidth": false,
            "aaData": dataArr,
            "aoColumns": [{
                "mData": "name",
                "sTitle": oriName
            }, {
                "mData": "value",
                "sTitle": "销售额"
            }],
            "bPaginate": false,
            "oLanguage": {
                "sInfo": ""
            }
        };
        originTable && originTable.fnDestroy();
        originTable = base.renderTable($("#origin-table"), optionT);
    }

    // 默认加载第一个tab
    reportTabMenus.first().tab('show');
    return base;
});