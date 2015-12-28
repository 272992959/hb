define(["common/report"], function(base) {

    var jqTable, reportTable, $el = $("#promoter_table");
    var operHtml = '<button class="btn btn-sm btn-info-outline btn_see" type="button">查看</button>' + '<button class="btn btn-sm btn-primary-outline btn_edit" type="button">修改</button>';
    var spdUrl = base.domain + "spd_m/spdList";
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
            "mData": "num_payed",
            "sTitle": "累计推广费用"
        }, {
            "mData": "num_money",
            "sTitle": "产生的总消费"
        }, {
            "mData": "num_finish",
            "sTitle": "累计完成份数",
            "sClass": "hidden-xs"
        }, {
            "sTitle": "操作",
            "sWidth": "70px",
            "sDefaultContent": operHtml
        }],
        "sPaginationType": "full_numbers",
        oLanguage: {
            sEmptyTable: "暂无数据"
        }
    };

    // 获取推广人员人员数据并渲染
    $.ajax({
        url: spdUrl,
        data: {
            token: base.account.token
        },
        dataType: "json",
        beforeSend: base.initLoad("推广人员人员列表加载中...")
    }).done(function(data) {
        option.aaData = data.aaData;
        jqTable = base.renderTable($el, option);
    }).fail(function(data) {
        base.addTip("推广人员人员列表加载失败！");
    }).always(function() {
        base.initLoad();
    });

    var rowEditing = null;




    // 表单验证
    var formValidate = $("#promoter_form").validate({
        rules: {
            spd_name: "required",
            spd_phone: {
                required: true,
                digits: true
            },
            spd_username: "required",
            spd_password: {
                required: function(ele) {
                    return !rowEditing;
                },
                minlength: 6
            }
        },
        messages: {
            spd_name: "姓名不能为空",
            spd_phone: {
                required: "电话不能为空",
                digits: "电话只能输入数字"
            },
            spd_username: "账号不能为空",
            spd_password: {
                required: "密码不能为空",
                minlength: "密码至少6位"
            }
        }
    });

    $("body").on("click", "#add_promoter", function() {
        // 添加推广人员
        formValidate.resetForm();
        $("#edit_promoter :input.error").removeClass("error");

        base.renderDialog("#edit_promoter", function() {
            $(".heading>span", this.content).text("添加推广人员");
            $("#spd_password", this.content).attr("placeholder", "密码");
            $("#spd_username", this.content).prop("disabled", false);
            $("input", this.content).val("");
            rowEditing = null;
        });
    }).on("click", ".btn_edit", function() {
        // 修改推广人员
        formValidate.resetForm();
        $("#edit_promoter :input.error").removeClass("error");

        rowEditing = $(this).closest("tr")[0];
        var rowData = jqTable.fnGetData(rowEditing);
        base.renderDialog("#edit_promoter", function() {
            $(".heading>span", this.content).text("修改推广人员");
            $("#spd_password", this.content).attr("placeholder", "若不修改请留空");
            $("#spd_username", this.content).prop("disabled", true);
            $("input", this.content).each(function(i) {
                var thisVal = rowData[$(this).attr("id").slice(4)];
                if (!$(this).is("#spd_password")) {
                    $(this).val(thisVal);
                }
            });
        });
    }).on("click", ".btn_see", function() {
        var rowData = jqTable.fnGetData($(this).closest("tr")[0]);

        base.renderReport({
            $el: $("#promoter_info"),
            headUrl: base.domain + "spd_m/calcSumSpd",
            headTip: "推广费用",
            headArr: ["today", "yesterday", "seven", "thirty", "all"],
            reportUrl: base.domain + "spd_m/calcDaySpd",
            reportTip: "账户报告信息",
            reportArr: [{
                name: "日期",
                mData: "date"
            }, {
                name: "支出",
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
                id: rowData.id
            },
            dialogUrl: "#promoter_info"
        });

    }).on("click", "#edit_promoter .btn_save", function() {
        // 确认添加修改推广人员
        if (formValidate.form()) {
            $.fancybox.close();
            var valObj = {
                name: $("#spd_name").val(),
                phone: $("#spd_phone").val(),
                username: $("#spd_username").val(),
                password: $("#spd_password").val()
            };
            var operUrl = base.domain + 'spd_m/userAdd';
            var operTip = '推广人员添加';
            if (rowEditing) {
                !valObj.password && delete valObj.password;
                $.extend(valObj, {
                    id: $("#spd_id").val()
                });
                operUrl = base.domain + 'spd_m/userEdit';
                operTip = '推广人员修改';
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
                            num_payed: "",
                            num_money: "",
                            num_finish: ""
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