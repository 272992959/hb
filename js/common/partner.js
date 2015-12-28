define(["common/report"], function(base) {
    var role = base.account.role;
    var jqTable, reportTable, $el = $("#advertiser-table");
    var operHtml = '<button class="btn btn-sm btn-info-outline btn_see" type="button">查看</button>' + '<button class="btn btn-sm btn-primary-outline btn_edit" type="button">修改</button>' + '<button class="btn btn-sm btn-primary-outline btn_plus_task" type="button">添加任务</button>' + '<button class="btn btn-sm btn-warning-outline btn_charge" type="button">充值</button>';
    var adUrl = base.domain + base.fold[role - 1] + "/userListAd";
    var option = {
        "bAutoWidth": false,
        "aoColumns": [{
            "bVisible": false,
            "mData": "id",
            "sTitle": "ID"
        }, {
            "mData": "company",
            "sTitle": "公司"
        }, {
            "mData": "name",
            "sTitle": "姓名"
        }, {
            "mData": "phone",
            "sTitle": "电话"
        }, {
            "mData": "discount",
            "sTitle": "折扣率(免费)"
        }, {
            "mData": "discount_charge",
            "sTitle": "折扣率(付费)"
        }, {
            "mData": "price_all",
            "sTitle": "累计消费"
        }, {
            "mData": "money",
            "sTitle": "余额",
            "sClass": "ad_money"
        }, {
            "mData": "taskNum",
            "sTitle": "累计任务完成数"
        }, {
            "mData": "username",
            "sTitle": "账号"
        }, {
            "mData": "password",
            "sTitle": "密码",
            "fnCreatedCell": function(a) {
                $(a).html('******');
            }
        }, {
            "sTitle": "操作",
            "sWidth": "120px",
            "sClass": "no-wrap",
            "sDefaultContent": operHtml
        }],
        "sPaginationType": "full_numbers"
    };

    // 广告主最低折扣率
    var ad_discount_min = 70;
    // 商务管理员
    if (role == 5) {
        option.aoColumns.splice(1, 0, {
            "mData": "bd_name",
            "sTitle": "商务"
        });
        ad_discount_min = 60;
    }

    // 获取广告主数据并渲染
    $.ajax({
        url: adUrl,
        data: {
            token: base.account.token
        },
        dataType: "json",
        beforeSend: base.initLoad("广告主列表加载中...", $("#advertiser"))
    }).done(function(data) {
        option.aaData = data.aaData;
        jqTable = base.renderTable($el, option);
    }).fail(function(data) {
        base.addTip("广告主列表加载失败！");
    }).always(function() {
        base.initLoad($("#advertiser"));
    });

    var rowEditing = null,
        chargeTrEditing = null;



    // 广告主表单验证
    var partnerValidate = $("#advertiser_form").validate({
        rules: {
            ad_company: "required",
            ad_name: "required",
            ad_phone: {
                required: true,
                digits: true
            },
            ad_discount_charge: {
                digits: true,
                range: [ad_discount_min, 100]
            },
            ad_discount: {
                digits: true,
                range: [ad_discount_min, 100]
            },
            ad_username: "required",
            ad_password: {
                required: function(ele) {
                    return !rowEditing;
                },
                minlength: 6
            }
        },
        messages: {
            ad_company: "公司不能为空",
            ad_name: "姓名不能为空",
            ad_phone: {
                required: "电话不能为空",
                digits: "电话必须是整数"
            },
            ad_discount_charge: {
                digits: "折扣率必须是整数",
                range: "请输入" + ad_discount_min + "到100之间的整数",
            },
            ad_discount: {
                digits: "折扣率必须是整数",
                range: "请输入" + ad_discount_min + "到100之间的整数",
            },
            ad_username: "账号不能为空",
            ad_password: {
                required: "密码不能为空",
                minlength: "密码不能少于6位"
            }
        },
        errorPlacement: function(error, element) {
            if (element.is("#ad_discount,#ad_discount_charge")) {
                error.appendTo(element.parent().parent());
            } else {
                error.appendTo(element.parent());
            }
        }
    });
    // 任务表单验证
    var taskValidate = $("#task_form").validate({
        rules: {
            task_link: "required",
            task_countall: {
                required: true,
                digits: true,
                min: 0
            },
            task_iscomment: {
                digits: true,
                min: 1
            },
            task_keywordTop: {
                digits: true,
                min: 1
            },
            task_steptime: {
                digits: true,
                min: 1
            },
            task_price: {
                number: true,
                min: 0.01
            }
        },
        messages: {
            task_link: "链接不能为空",
            task_countall: {
                required: "投放份数不能为空",
                digits: "投放份数必须是整数",
                min: "投放份数不能为负数"
            },
            task_keywordTop: {
                digits: "keywordTop必须是正整数",
                min: "keywordTop必须大于0"
            },
            task_steptime: {
                digits: "体验时间必须是正整数",
                min: "体验时间必须大于0"
            },
            task_iscomment: {
                digits: "评论占比必须是正整数",
                min: "评论占比必须大于0"
            },
            task_price: {
                number: "单价必须是数字",
                min: "单价必须大于0"
            }
        },
        errorPlacement: function(error, element) {
            if (element.is("#task_iscomment,#task_price")) {
                error.appendTo(element.parent().parent());
            } else {
                error.appendTo(element.parent());
            }
        }
    });
    // 支付表单验证
    var payValidate = $("#pay_form").validate({
        rules: {
            recharge_money: {
                required: true,
                number: true,
                min: 0.01
            }
        },
        messages: {
            recharge_money: {
                required: "金额不能为空",
                number: "请输入合法金额",
                min: "请输入至少0.01元的金额"
            }
        },
        errorPlacement: function(error, element) {
            error.appendTo(element.parent().parent());
        }
    });

    $("body").on("click", "#btn_add_advertiser", function() {
        // 添加广告主
        partnerValidate.resetForm();
        $("#edit_advertiser :input.error").removeClass("error");

        base.renderDialog("#edit_advertiser", function() {
            $(".heading>span", this.content).text("添加广告主");
            $("#ad_password", this.content).attr("placeholder", "密码");
            $("#ad_username", this.content).prop("disabled", false);
            $("input", this.content).val("");
            rowEditing = null;
        });
    }).on("click", ".btn_edit", function() {
        // 修改广告主
        partnerValidate.resetForm();
        $("#edit_advertiser :input.error").removeClass("error");

        rowEditing = $(this).closest("tr")[0];
        var rowData = jqTable.fnGetData(rowEditing);
        base.renderDialog("#edit_advertiser", function() {
            $(".heading>span", this.content).text("修改广告主");
            $("#ad_username", this.content).prop("disabled", true);
            $("input", this.content).each(function(i) {
                var thisVal = rowData[$(this).attr("id").slice(3)];
                if (!$(this).is("#ad_password")) {
                    $(this).val(thisVal);
                }
            });
        });
    }).on("click", ".btn_see", function() {
        // 查看报表
        var rowData = jqTable.fnGetData($(this).closest("tr")[0]);
        base.renderReport({
            $el: $("#advertiser_report"),
            headUrl: base.domain + base.fold[role - 1] + "/calcSumAd",
            headTip: "消费信息",
            headArr: ["today", "yesterday", "seven", "thirty", "all"],
            reportUrl: base.domain + base.fold[role - 1] + "/calcDayAd",
            reportTip: "账户报告信息",
            reportArr: [{
                name: "日期",
                mData: "date"
            }, {
                name: "消费",
                type: 'bar',
                barMaxWidth: '30',
                mData: "sum"
            }, {
                name: "完成份数",
                type: 'line',
                mData: "sum_finish"
            }, {
                name: "完成率",
                type: 'line',
                mData: "sum_percent"
            }],
            idObj: {
                ad_id: rowData.id
            },
            dialogUrl: "#advertiser_info"
        });
    }).on("click", ".btn_plus_task", function() {
        // 添加任务
        taskValidate.resetForm();
        $("#add_task :input.error").removeClass("error");

        var rowData = jqTable.fnGetData($(this).closest("tr")[0]);
        base.renderDialog("#add_task", function() {
            $(":text", this.content).val("");
            $("#task_ad_id", this.content).val(rowData['id']);

            $("#task_price", this.content).val("1.00");
            $("#task_taskprice", this.content).val("4.00");

            $(':radio[value="0"]').trigger("click");

            var sDate = new Date().toString("yyyy-MM-dd HH:mm:ss");
            var eDate = new Date().add({
                years: 1
            }).toString("yyyy-MM-dd HH:mm:ss");
            $('[data-date-max]', this.content).val(sDate);
            $('[data-date-min]', this.content).val(eDate);

            $('[name="set_isreg"][value="0"]').prop("checked", true);
        });
    }).on("click", "#edit_advertiser .btn_save", function() {
        // 确认添加修改广告主
        if (partnerValidate.form()) {
            $.fancybox.close();
            var valObj = {
                company: $("#ad_company").val(),
                name: $("#ad_name").val(),
                phone: $("#ad_phone").val(),
                discount: $("#ad_discount").val(),
                discount_charge: $("#ad_discount_charge").val(),
                username: $("#ad_username").val(),
                password: $("#ad_password").val()
            };
            var operUrl = base.domain + base.fold[role - 1] + '/userAddAd';
            var operTip = '广告主添加';
            if (rowEditing) {
                !valObj.password && delete valObj.password;
                $.extend(valObj, {
                    id: $("#ad_id", this.content).val()
                });
                operUrl = base.domain + base.fold[role - 1] + '/userEdit';
                operTip = '广告主修改';
            }
            $.ajax({
                type: 'POST',
                url: operUrl,
                data: $.extend({
                    token: base.account.token
                }, valObj),
                dataType: 'json',
                beforeSend: base.initLoad(operTip + "中！")
            }).done(function(data) {
                if (rowEditing) {
                    var rowData = jqTable.fnGetData(rowEditing);
                    !valObj.password && (valObj.password = "******");
                    $.extend(rowData, valObj);
                    jqTable.fnUpdate(rowData, rowEditing);
                    jqTable.fnDraw();
                } else {
                    // 添加回调
                    jqTable.fnGetNodes(jqTable.fnAddData($.extend({
                        bd_name: base.account.name,
                        id: data.aaData,
                        price_all: '0',
                        money: '0.00',
                        taskNum: '0'
                    }, valObj))[0]);
                }
                base.initLoad();
                base.addTip(operTip + "成功！", "success");
            });
        }
    }).on("click", "#add_task .btn_save", function() {
        // 确认添加任务
        if (taskValidate.form()) {
            $.fancybox.close();
            var valObj = {
                ad_id: $("#task_ad_id").val(),
                link: $("#task_link").val(),
                keyword: $("#task_keyword").val(),
                countall: $("#task_countall").val(),
                stime: $("#task_stime").val(),
                storeurl: $("#task_storeurl").val(),
                iscomment: $("#task_iscomment").val(),
                isreg: $('[name="set_isreg"]:checked').val(),
                price: $("#task_price").val(),
                keywordTop: $("#task_keywordTop").val(),
                steptime: $("#task_steptime").val(),
                taskprice: $("#task_taskprice").val(),
                expire: $("#task_expire").val()
            };
            var operUrl = base.domain + base.fold[role - 1] + '/taskAdd';
            var operTip = '任务添加';
            $.ajax({
                type: 'POST',
                url: operUrl,
                data: $.extend({
                    token: base.account.token
                }, valObj),
                dataType: 'json',
                beforeSend: base.initLoad(operTip + "中！")
            }).done(function(data) {
                if (data.error == 1) {
                    base.addTip(operTip + "成功！", "success");
                } else {
                    base.addTip(operTip + "失败：" + data.msg);
                }
            }).fail(function() {
                base.addTip(operTip + "失败!");
            }).always(function() {
                base.initLoad();
            });
        }
    }).on("click", ".btn_charge", function() {
        // 充值
        payValidate.resetForm();
        $("#recharge :input.error").removeClass("error");

        chargeTrEditing = $(this).closest("tr")[0];
        var rowData = jqTable.fnGetData(chargeTrEditing);
        base.renderDialog("#recharge", function() {
            $("#recharge_ad_id", this.content).val(rowData.id);
            $("#recharge_money", this.content).val('');
        });
    }).on("click", "#recharge .btn_save", function() {
        // 确认充值
        if (payValidate.form()) {
            var rowData = jqTable.fnGetData(chargeTrEditing);
            var sendObj = {
                token: base.account.token,
                ad_id: +$("#recharge_ad_id").val(),
                price_all: +$("#recharge_money").val()
            };
            $.ajax({
                type: 'POST',
                url: base.domain + base.fold[role - 1] + '/adCharge',
                data: sendObj,
                dataType: 'json',
                beforeSend: base.initLoad("充值中！")
            }).done(function(data) {
                $.fancybox.close();
                if (data.error == 1) {
                    base.addTip("充值成功！", "success");
                    rowData.money = parseFloat(+rowData.money + sendObj.price_all).toFixed(2);
                    jqTable.fnUpdate(rowData, chargeTrEditing);
                    jqTable.fnDraw();
                } else {
                    base.addTip(data.msg);
                }
            }).fail(function() {
                base.addTip("充值失败!");
            }).always(function() {
                base.initLoad();
            });
        }
    });


    $("body").on("click", '[name="set_time"]', function() {
        $(".time_container").toggle($(this).val() == 1);
    }).on("click", '[name="set_link"]', function() {
        var isSet = $(this).val() == 1;
        $(".link_container").toggle(isSet);
        !isSet && $("#task_link").val("");
    }).on("click", '[name="set_keyword"]', function() {
        var isSet = $(this).val() == 1;
        $(".keyword_container").toggle(isSet);
        !isSet && $("#task_keyword").val("");
    }).on("click", '[name="set_iscomment"]', function() {
        var isSet = $(this).val() == 1;
        $(".iscomment_container").toggle(isSet);
        !isSet && $("#task_iscomment").val("");
    });

    return base;
});