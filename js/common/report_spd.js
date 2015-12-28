/* page1 v1.0 */
define(["common/report"],function(base) {
        base.renderReport({
            $el: $("#account_report"),
            headUrl: base.domain + "spd/calcSum",
            headTip: "推广报告信息",
            headArr: ["today", "yesterday", "seven", "thirty", "all"],
            reportUrl: base.domain + "spd/calcDay",
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
            }]
        });

        $("body").on("change", "#guest_type", function() {
            var thisVal = $(this).val();
            if (thisVal === "anchor") {
                $("#weibo_platform").val("");
            } else if (thisVal === "weibo") {
                $("#anchor_platform").val("");
            } else {
                $("#weibo_platform").val("");
                $("#anchor_platform").val("");
            }
            $("#anchor_platform").closest(".form-group").toggle(thisVal === "anchor");
            $("#weibo_platform").closest(".form-group").toggle(thisVal === "weibo");
        });
        return base;
    });