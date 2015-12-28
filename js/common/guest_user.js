define(["common/report"], function(base) {

    var role = base.account.role;
    var rowEditing, reportTable, $el = $("#guest_user_table"),
        operHtml = getOperHtml(role);
    var $reportTable2 = $("#report-table2");
    var typeObj = {
        anchor: "主播",
        weibo: "微博",
        qq: "QQ群",
        other: "其他"
    };
    var platformObj = {
        longzhu: "龙珠",
        douyu: "斗鱼",
        zhanqi: "战旗",
        huya: "虎牙",
        panda: "熊猫",
        tecent: "腾讯",
        sina: "新浪"
    };
    var isperArr = function(isper, price) {
        return isper ? '<span class="label label-info pull-left">按个计费(' + parseFloat(price).toFixed(2) + ')</span>' : "";
    };
    var ispayArr = ['<span class="label label-danger pull-left">未支付</span>', '<span class="label label-success pull-left">已支付</span>'];
    var guestUserUrl = base.domain + base.fold[role - 1] + "/vipList";
    var option = {
        sAjaxSource: guestUserUrl,
        aoColumns: [{
            mData: "uid",
            sTitle: "ID",
            filter: true,
            bSortable: false
        }, {
            mData: "phone",
            sTitle: "手机号码",
            filter: true,
            bSortable: false
        }, {
            mData: "openid",
            sTitle: "微信号码",
            filter: true,
            bSortable: false
        }, {
            mData: "type",
            sClass: "td-type",
            sTitle: "类别",
            bSortable: false,
            fnCreatedCell: function(a, b) {
                $(a).html(typeObj[b]);
            }
        }, {
            mData: "platform",
            sTitle: "平台",
            sClass: "td-platform",
            bSortable: false,
            fnCreatedCell: function(a, b) {
                $(a).html(platformObj[b] || "无");
            }
        }, {
            mData: "num",
            sTitle: "粉丝/在线人数",
            sClass: "td-num text-right"
        }, {
            mData: "pay",
            sTitle: "推广费用",
            sWidth: "180px",
            sClass: "td-pay text-right",
            fnCreatedCell: function(a, b, c) {
                var totalPrice = b;
                if (+c.isper) {
                    totalPrice = b * c.taskNum;
                }
                totalPrice = parseFloat(totalPrice).toFixed(2);
                $(a).html(totalPrice + isperArr(+c.isper, b));
            }
        }, {
            mData: "payed",
            sTitle: "已付费用",
            sClass: "text-right td-payed"
        }, {
            mData: "downNum",
            sTitle: "带来的下载量",
            sClass: "text-right"
        }, {
            mData: "taskNum",
            sTitle: "带来的任务量",
            sClass: "text-right"
        }, {
            mData: "costNum",
            sTitle: "产生的总消费",
            sClass: "text-right"
        }, {
            sTitle: "操作",
            sWidth: "95px",
            sClass: "no-wrap",
            bSortable: false,
            sDefaultContent: operHtml
        }]
    };

    // 非推广时
    if (role != 6) {
        option.aoColumns.splice(1, 0, {
            mData: "name",
            sTitle: "推广",
            filter: true
        });
    }

    // 额外向服务器的传参
    var argArr = [{
        name: "status",
        $el: $("#filter_status input")
    }];
    $el = base.table($el, option, argArr);
    
    $("body").on("click", ".btn_refresh", function() {
        $el = base.refreshTable($el, option, argArr);
    });

    // 特邀用户信息表单验证
    var formValidate = $("#guest_user_form").validate({
        rules: {
            guest_type: "required",
            anchor_platform: {
                required: function(ele) {
                    return $("#guest_type").val() === "anchor";
                }
            },
            weibo_platform: {
                required: function(ele) {
                    return $("#guest_type").val() === "weibo";
                }
            },
            guest_num: {
                required: true,
                digits: true
            },
            guest_pay: {
                required: true,
                number: true,
                min: 0.01
            }
        },
        messages: {
            guest_type: "类别不能为空",
            anchor_platform: "主播平台不能为空",
            weibo_platform: "微博平台不能为空",
            guest_num: {
                required: "人数不能为空",
                digits: "人数只能输入数字"
            },
            guest_pay: {
                required: "金额不能为空",
                number: "请输入合法金额",
                min: "请至少输入0.01元金额"
            }
        },
        errorPlacement: function(error, element) {
            if (element.is(":text")) {
                error.appendTo(element.parent().parent());
            } else {
                error.appendTo(element.parent());
            }
        }
    });
    // 支付表单验证
    var payValidate = $("#pay_form").validate({
        rules: {
            guest_topay: {
                required: true,
                number: true,
                min: 0.01
            }
        },
        messages: {
            guest_topay: {
                required: "金额不能为空",
                number: "请输入合法金额",
                min: "至少输入0.01元金额"
            }
        }
    });

    // 事件
    $("body").on("click", "#custom_time .btn-sure", function() {
        // 确认时间按钮
        getReportData($("#start_date").val(), $("#end_date").val());
    }).on("click", ".btn_edit", function() {
        // 修改特邀用户
        formValidate.resetForm();
        $("#edit_guest_user :input.error").removeClass("error");

        rowEditing = $(this).closest("tr")[0];
        var rowData = $el.fnGetData($(this).closest("tr")[0]);
        base.renderDialog("#edit_guest_user", function() {
            $("#guest_type").val(rowData.type);
            if (rowData.type === "anchor") {
                $("#anchor_platform").val(rowData.platform).closest(".form-group").show();
                $("#weibo_platform").val('').closest(".form-group").hide();
            } else if (rowData.type === "weibo") {
                $("#weibo_platform").val(rowData.platform).closest(".form-group").show();
                $("#anchor_platform").val('').closest(".form-group").hide();
            } else {
                $("#anchor_platform").val('').closest(".form-group").hide();
                $("#weibo_platform").val('').closest(".form-group").hide();
            }
            $("#guest_num").val(rowData.num);
            $('[name="guest_isper"][value="' + rowData.isper + '"]').prop("checked", true);
            $("#guest_pay").val(rowData.pay);
        });
    }).on("click", ".btn_look_up", function() {
        // 查看报表
        var rowData = $el.fnGetData($(this).closest("tr")[0]);
        base.renderReport({
            $el: $("#guest_user_detail"),
            headUrl: base.domain + base.fold[role - 1] + "/calcSumVip",
            headTip: "推广报告信息",
            headArr: ["today", "yesterday", "seven", "thirty", "all"],
            reportUrl: base.domain + base.fold[role - 1] + "/calcDayVip",
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
            idObj: {
                uid: rowData.uid
            },
            dialogUrl: "#guest_user_detail"
        });
    }).on("click", ".btn_look_up2", function() {
        // 查看报表
        var rowData = $el.fnGetData($(this).closest("tr")[0]);
        var listUrl = base.domain + base.fold[role - 1] + "/uidListAgain";
        var option = {
            sAjaxSource: listUrl,
            aoColumns: [{
                mData: "objectId",
                sTitle: "ID",
                filter: true,
                bSortable: false
            }, {
                mData: "num",
                sTitle: "邀请人数"
            }]
        };

        // 额外向服务器的传参
        var argArr = [{
            name: "objectId",
            value: rowData.objectId
        }];
        base.renderDialog("#guest_user_detail2", function() {
            $reportTable2 = base.refreshTable($reportTable2, option, argArr);
        });
    }).on("click", "#edit_guest_user .btn_save", function() {
        // 确认保存特邀用户的修改
        if (formValidate.form()) {
            var rowData = $el.fnGetData(rowEditing);
            var valObj = {
                type: $("#guest_type").val(),
                platform: $("#anchor_platform").val() || $("#weibo_platform").val() || "",
                num: $("#guest_num").val(),
                isper: $('[name="guest_isper"]:checked').val(),
                pay: $("#guest_pay").val()
            };
            $.ajax({
                type: "POST",
                url: base.domain + base.fold[role - 1] + "/vipEdit",
                data: $.extend({
                    token: base.account.token,
                    id: rowData.id
                }, valObj),
                beforeSend: base.initLoad("修改特邀用户信息中啊"),
                dataType: "json"
            }).done(function(data) {
                if (data.error == 1) {
                    base.addTip("修改特邀用户信息成功！", "success");

                    $el = base.refreshTable($el, option, argArr);
                } else {
                    base.addTip("修改特邀用户信息失败：" + data.msg);
                }
            }).fail(function() {
                base.addTip("修改特邀用户信息失败！");
            }).always(function() {
                $.fancybox.close();
                base.initLoad();
            });
        }
    }).on("click", ".btn_charge", function() {
        // 特邀用户充值
        payValidate.resetForm();
        $("#guest_user_pay :input.error").removeClass("error");

        rowEditing = $(this).closest("tr")[0];
        var rowData = $el.fnGetData($(this).closest("tr")[0]);
        base.renderDialog("#guest_user_pay", function() {
            var totalPrice = rowData.pay;
            if (+rowData.isper) {
                totalPrice = rowData.pay * rowData.taskNum;
            }
            totalPrice = parseFloat(totalPrice).toFixed(2);
            $("#guest_topay").val(totalPrice);
        });
    }).on("click", "#guest_user_pay .btn_save", function() {
        // 确认保存特邀用户的充值
        if (payValidate.form()) {
            var rowData = $el.fnGetData(rowEditing);
            var valObj = {
                money: $("#guest_topay").val()
            };
            $.ajax({
                type: "POST",
                url: base.domain + base.fold[role - 1] + "/vipCharge",
                data: $.extend({
                    token: base.account.token,
                    id: rowData.id
                }, valObj),
                beforeSend: base.initLoad("推广费用支付中啊"),
                dataType: "json"
            }).done(function(data) {
                if (data.error == 1) {
                    base.addTip("推广费用支付成功！", "success");
                    $el = base.refreshTable($el, option, argArr);
                } else {
                    base.addTip("推广费用支付失败：" + data.msg);
                }
            }).fail(function() {
                base.addTip("推广费用支付失败！");
            }).always(function() {
                $.fancybox.close();
                base.initLoad();
            });
        }
    });

    // 根据权限展示操作按钮
    function getOperHtml(role) {
        return '<button class="btn btn-sm btn-info-outline btn_look_up" type="button">账户报告</button>' + '<button class="btn btn-sm btn-warning-outline btn_edit" type="button">修改</button><br>' + '<button class="btn btn-sm btn-info-outline btn_look_up2" type="button">邀请列表</button>' + ((role == 6) ? '' : '<button class="btn btn-sm btn-warning-outline btn_charge" type="button">支付</button>');
    }

    // 特邀用户探矿平台显隐
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