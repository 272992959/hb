/* page1 v1.0 */
define(["common/report"], function(base) {
    $.ajax({
        type: "POST",
        url: base.domain + "finance/calcSum",
        data: {
            token: base.account.token
        },
        dataType: "json",
        beforeSend: base.initLoad("账户报告加载中...", $("#account_report"))
    }).done(function(data) {
        if (data.error == 1) {

            var numY = +data.aaData.countYes;
            var numN = +data.aaData.countNo;
            var moneyY = +data.aaData.sumYes;
            var moneyN = +data.aaData.sumNo;

            var option = {
                title: {
                    text: '总申请记录数：' + (numY + numN),
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                toolbox: {
                    show: true,
                    feature: {
                        magicType: {
                            show: true,
                            type: ['pie', 'funnel']
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
                    name: '申请记录数',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: [{
                        value: numY,
                        name: '已处理申请数'
                    }, {
                        value: numN,
                        name: '待处理申请数'
                    }]
                }]
            };
            var option2 = {
                title: {
                    text: '总申请金额：' + (moneyY + moneyN),
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                toolbox: {
                    show: true,
                    feature: {
                        magicType: {
                            show: true,
                            type: ['pie', 'funnel']
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
                    name: '申请金额',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: [{
                        value: moneyY,
                        name: '已处理申请额'
                    }, {
                        value: moneyN,
                        name: '待处理申请额'
                    }]
                }]
            };

            base.renderChart($("#num-chart")[0], option);
            base.renderChart($("#money-chart")[0], option2);
        }else{
            base.addTip(data.msg);
        }
    }).fail(function(data) {
        base.addTip("账户报告加载失败！");
    }).always(function() {
        base.initLoad($("#account_report"));
    });

    return base;
});