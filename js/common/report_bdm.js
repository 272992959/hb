define(["common/report"], function(base) {
    var curTF, originTable, reportTabMenus = $('a[data-toggle="tab"]', $("#bdm_report"));
    reportTabMenus.on('shown.bs.tab', function(e) {
        var linkTo = $(e.target).attr("href");
        if (linkTo === "#bd_tab3") {
            var myChart;
            var curOption = {
                title: {
                    text: '实时投放信息',
                    x: 'center'
                },
                tooltip: {
                    formatter: "{a} <br/>{b} : {c}"
                },
                toolbox: {
                    show: true,
                    feature: {
                        saveAsImage: {
                            show: true
                        }
                    }
                },
                series: [{
                    name: '在跑任务数',
                    type: 'gauge',
                    center: ['25%', '55%'], // 默认全局居中
                    min: 0,
                    data: [{
                        name: '在跑任务数'
                    }],
                    axisLabel: { // 坐标轴文本标签，详见axis.axisLabel
                        textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            color: '#333'
                        }
                    },
                    detail: {
                        offsetCenter: [0, 10]
                    }
                }, {
                    name: '待审核任务数',
                    type: 'gauge',
                    center: ['75%', '55%'], // 默认全局居中
                    min: 0,
                    axisLabel: { // 坐标轴文本标签，详见axis.axisLabel
                        show: true,
                        textStyle: {
                            color: '#333'
                        }
                    },
                    data: [{
                        name: '待审核任务数'
                    }],
                    detail: {
                        offsetCenter: [0, 10]
                    }
                }]
            };

            function resetChart() {
                $.ajax({
                    url: base.domain + "bd_m/effect",
                    data: {
                        token: base.account.token
                    },
                    dataType: 'json',
                    beforeSend: function() {
                        if (!myChart) {
                            base.initLoad("当前投放信息加载中!",$("#bd_tab3"));
                        }
                    }
                }).done(function(data) {
                    var totalNum = +data.aaData.num,
                        runNum = +data.aaData.running,
                        checkNum = +data.aaData.checking,
                        splitNum = 20,
                        maxNum = totalNum;
                    if(data.error != 1){
                        totalNum = runNum = checkNum = 0;
                        maxNum = 1;
                    }
                    if (totalNum <= 20) {
                        splitNum = totalNum;
                    } else {
                        while (maxNum % splitNum) {
                            if (splitNum > 5) {
                                splitNum--
                            } else {
                                splitNum = 20;
                                var lNum = Math.ceil(totalNum / 100) * 5;
                                maxNum = Math.ceil(totalNum / lNum) * lNum;
                            }
                        }
                    }
                    curOption.title.subtext = "当前总任务数: " + totalNum;
                    curOption.series[0].max = curOption.series[1].max = maxNum;
                    curOption.series[0].data[0].value = runNum;
                    curOption.series[1].data[0].value = checkNum;
                    curOption.series[0].splitNumber = curOption.series[1].splitNumber = splitNum;
                    curOption.series[0].axisLabel.formatter = curOption.series[1].axisLabel.formatter = function(v) {
                        if (('' + v).length > 7) {
                            return Math.floor(v / 1000000) + "百万";
                        } else if (('' + v).length > 4) {
                            return Math.floor(v / 1000) + "千";
                        } else {
                            return v;
                        }
                    };

                    if (!myChart) {
                        myChart = base.renderChart($("#app-chart")[0], curOption);
                        base.initLoad();
                    } else {
                        myChart.setOption(curOption, true);
                    }
                    curTF = setTimeout(resetChart, 3000);
                }).fail(function() {
                    base.addTip("实时投放信息加载失败！");
                }).always(function() {
                    base.initLoad($("#bd_tab3"));
                });
            }
            resetChart();

        } else if (linkTo === "#bd_tab1") {
            clearTimeout(curTF);
            base.renderReport({
                $el: $("#bd_tab1"),
                headUrl: base.domain + "bd_m/calcSum",
                headTip: "销售额",
                headArr: ["today", "yesterday", "seven", "thirty", "all"],
                reportUrl: base.domain + "bd_m/calcDay",
                reportTip: "账户报告信息",
                reportArr: [{
                    name: "日期",
                    mData: "date"
                }, {
                    name: "销售额",
                    type: 'bar',
                    barMaxWidth: '30',
                    mData: "sum"
                }, {
                    name: "完成份数",
                    type: 'line',
                    mData: "sum_start"
                }],
                head$el: $("#bd_tab1 table:first"),
                rTable$el: $("#report-table"),
                rChart$el: $('#report-chart')
            });
        } else if (linkTo === "#bd_tab2") {
            clearTimeout(curTF);
            $("#bd_tab2 .select_date .btn:first").trigger("click");
        }
    });

    var origin = "business";
    $("#bd_tab2").on("click", ".select_origin .btn", function() {
        if ($(this).is(".origin_business")) {
            origin = "business";
        } else {
            origin = "advertiser";
        }
        $(this).removeClass("btn-info-outline").addClass("btn-info");
        $(this).siblings().removeClass("btn-info").addClass("btn-info-outline");
        $("#bd_tab2 .custom_time .btn-sure").trigger("click");
    }).on("click", ".custom_time .btn-sure", function() {
        // $("#origin_stdate").val(), $("#origin_eddate").val(), origin
        $.ajax({
            type: 'POST',
            url: base.domain + "bd_m/fromNum",
            data: {
                token: base.account.token,
                start: $("#origin_stdate").val(),
                end: $("#origin_eddate").val(),
                role: origin === "business" ? 7 : 8
            },
            dataType: 'json',
            beforeSend: base.initLoad("销售额来源信息加载中！",$("#bd_tab2"))
        }).done(function(data) {
            renderOriginReport(data.aaData);
        }).fail(function() {
            base.addTip("销售额来源信息加载失败！");
        }).always(function() {
            base.initLoad($("#bd_tab2"));
        });
    });


    function renderOriginReport(dataArr) {
        var oriName = origin === "business" ? "商务" : "广告主";
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
    
    reportTabMenus.first().tab('show');

    return base;
});