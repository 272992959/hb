define(["common/report"], function(base) {
    var role = base.account.role;
    var jqTable, reportTable, $el = $("#business_table");
    var operHtml = '<button class="btn btn-sm btn-info-outline btn_see" type="button">查看</button>' + '<button class="btn btn-sm btn-primary-outline btn_edit" type="button">修改</button>';
    var bdUrl = base.domain + base.fold[role - 1] + "/userListBd";
    var option = {
        "bAutoWidth": false,
        "aoColumns": [{
            "bVisible": false,
            "mData": "id",
            "sTitle": "ID"
        }, {
            "mData": "name",
            "sTitle": "姓名"
        }, {
            "mData": "phone",
            "sTitle": "电话"
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
            "mData": "price_all",
            "sTitle": "累计销售额"
        }, {
            "mData": "taskNum",
            "sTitle": "累计任务完成数"
        }, {
            "sTitle": "操作",
            "sWidth": "70px",
            "sClass": "no-wrap",
            "sDefaultContent": operHtml
        }],
        "sPaginationType": "full_numbers"
    };

    // 获取商务人员数据并渲染
    $.ajax({
        url: bdUrl,
        data: {
            token: base.account.token
        },
        dataType: "json",
        beforeSend: base.initLoad("商务人员列表加载中...",$("#business_view"))
    }).done(function(data) {
        option.aaData = data.aaData;
        jqTable = base.renderTable($el, option);
    }).fail(function(data) {
        base.addTip("商务人员列表加载失败！");
    }).always(function() {
        base.initLoad($("#business_view"));
    });

    var rowEditing = null;

    // 表单验证
    var formValidate = $("#business_form").validate({
        rules: {
            bd_name: "required",
            bd_phone: {
                required: true,
                digits: true
            },
            bd_username: "required",
            bd_password: {
                required: function(ele) {
                    return !rowEditing;
                },
                minlength: 6
            }
        },
        messages: {
            bd_name: "姓名不能为空",
            bd_phone: {
                required: "电话不能为空",
                digits: "电话只能输入数字"
            },
            bd_username: "账号不能为空",
            bd_password: {
                required: "密码不能为空",
                minlength: "密码至少6位"
            }
        }
    });

    // 事件
    $("body").on("click", "#add_business", function() {
        // 添加商务
        formValidate.resetForm();
        $("#edit_business :input.error").removeClass("error");

        base.renderDialog("#edit_business", function() {
            $(".heading>span", this.content).text("添加商务");
            $("#bd_password", this.content).attr("placeholder", "密码");
            $("#bd_username", this.content).prop("disabled", false);
            $("input", this.content).val("");
            rowEditing = null;
        });
    }).on("click", ".btn_edit", function() {
        // 修改商务
        formValidate.resetForm();
        $("#edit_business :input.error").removeClass("error");

        rowEditing = $(this).closest("tr")[0];
        var rowData = jqTable.fnGetData(rowEditing);
        base.renderDialog("#edit_business", function() {
            $(".heading>span", this.content).text("修改商务");
            $("#bd_password", this.content).attr("placeholder", "若不修改请留空");
            $("#bd_username", this.content).prop("disabled", true);
            $("input", this.content).each(function(i) {
                var thisVal = rowData[$(this).attr("id").slice(3)];
                if (!$(this).is("#bd_password")) {
                    $(this).val(thisVal);
                }
            });
        });
    }).on("click", ".btn_see", function() {
        // 查看报表
        var rowData = jqTable.fnGetData($(this).closest("tr")[0]);
        base.renderReport({
            $el: $("#business_report"),
            headUrl: base.domain + base.fold[role - 1] + "/calcSumBd",
            headTip: "销售信息",
            headArr: ["today", "yesterday", "seven", "thirty", "all"],
            reportUrl: base.domain + base.fold[role - 1] + "/calcDayBd",
            reportTip: "账户报告信息",
            reportArr: [{
                name: "日期",
                mData: "date"
            }, {
                name: "销售",
                type: 'bar',
                barMaxWidth: '30',
                mData: "sum"
            }, {
                name: "完成份数",
                type: 'line',
                mData: "sum_finish"
            }],
            idObj: {
                bd_id: rowData.id
            },
            dialogUrl: "#business_info"
        });

    }).on("click", "#edit_business .btn_save", function() {
        // 确认添加修改商务
        if (formValidate.form()) {
            $.fancybox.close();
            var valObj = {
                name: $("#bd_name").val(),
                phone: $("#bd_phone").val(),
                username: $("#bd_username").val(),
                password: $("#bd_password").val()
            };
            var operUrl = base.domain + base.fold[role - 1] + '/userAddBd';
            var operTip = '商务添加';
            if (rowEditing) {
                !valObj.password && delete valObj.password;
                $.extend(valObj, {
                    id: $("#bd_id").val()
                });
                operUrl = base.domain + base.fold[role - 1] + '/userEdit';
                operTip = '商务修改';
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
                if (data.error == 1) {
                    if (rowEditing) {
                        var rowData = jqTable.fnGetData(rowEditing);
                        !valObj.password && (valObj.password = "******");
                        $.extend(rowData, valObj);
                        jqTable.fnUpdate(rowData, rowEditing);
                        jqTable.fnDraw();
                    } else {
                        // 添加回调
                        jqTable.fnGetNodes(jqTable.fnAddData($.extend({
                            id: data.aaData,
                            price_all: '0',
                            taskNum: '0'
                        }, valObj))[0]);
                    }
                    base.addTip(operTip + "成功！", "success");
                } else {
                    base.addTip(data.msg);
                }
                base.initLoad();
            });
        }
    });


    return base;
});