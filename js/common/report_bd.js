/* page1 v1.0 */
define(["common/report"], function(base) {
    base.renderReport({
        $el: $("#account_report"),
        headUrl: base.domain + "bd/calcSum",
        headTip: "销售信息",
        headArr: ["today", "yesterday", "seven", "thirty", "all"],
        reportUrl: base.domain + "bd/calcDay",
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
            mData: "sum_finish"
        }]
    });
    return base;
});