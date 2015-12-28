define(["base"], function(base) {
    var $withdraw_record = $("#withdraw-record-table"),
        $el = $("#apply_table");
    var listUrl = base.domain + "finance/withdrawList";
    var option = {
        sAjaxSource: listUrl,
        aaSorting: [
            [3, 'asc']
        ],
        aoColumns: [{
            mData: "uid",
            bSortable: false,
            sTitle: "用户ID",
            filter: true
        }, {
            mData: "phone",
            bSortable: false,
            sTitle: "手机号码",
            filter: true
        }, {
            mData: "nickname",
            bSortable: false,
            sTitle: "微信昵称",
            filter: true
        }, {
            mData: "price",
            sTitle: "提现金额",
            filter: true
        }, {
            mData: "createdAt",
            sTitle: "提现时间",
            filter: true
        }, {
            mData: "alipay",
            sTitle: "支付宝账号",
            filter: true
        }, {
            mData: "alipay_name",
            sTitle: "真实姓名",
            filter: true
        }, {
            sTitle: "操作",
            sClass: "no-wrap",
            bSortable: false,
            sDefaultContent: ' <button class="btn btn-sm btn-info-outline btn_look_up" type="button">查看</button><button class="btn btn-sm btn-success-outline btn_true" type="button">同意</button><button class="btn btn-sm btn-danger-outline btn_false">拒绝</button>'
        }]
    };

    $el = base.table($el, option);

    $("body").on("click", ".btn_refresh", function() {
        $el = base.refreshTable($el, option);
    });


    var rowEditing;
    // 点击获取用户数据


    var formValidate = $("#withdraw_form").validate({
        rules: {
            deal_input: {
                required: true
            }
        },
        messages: {
            deal_input: {
                required: function() {
                    return "理由不能为空";
                }
            }
        }
    });

    $el.on("click", ".btn_look_up", function() {
        // 查看个人提现记录
        var withdrawData;
        var thisRow = $(this).closest("tr")[0];
        var rowData = $el.fnGetData(thisRow);
        withdrawDetail(rowData.uid)
    }).on("click", ".btn_false", function() {
        // 拒绝提现
        formValidate.resetForm();
        $("#deal_withdraw :input.error").removeClass("error");

        rowEditing = $(this).closest("tr")[0];

        base.renderDialog("#deal_withdraw", function() {
            $("#deal_input", this.content).val("");
        });
    }).on("click", ".btn_true", function() {
        var rowData = $el.fnGetData($(this).closest("tr")[0]);
        // 同意提现
        window.open("http://app2.laizhuan.com/v1/duiba.php?pnowoid=" + rowData.objectId);
        base.initLoad('<button class="btn btn-info btn-reload"> 支付完成 </button>');
    });

    $("body").on("click", "#deal_withdraw .btn_save", function() {
        // 确认保存提现处理
        base.trimVal($("#deal_input"));

        if (formValidate.form()) {
            var rowData = $el.fnGetData(rowEditing);

            $.ajax({
                type: "POST",
                url: base.domain + "finance/withdrawEdit",
                data: {
                    token: base.account.token,
                    objectId: rowData.objectId,
                    errmsg: $("#deal_input").val()
                },
                dataType: "json",
                beforeSend: base.initLoad("拒绝提现中...", $("#deal_withdraw"))
            }).done(function(data) {
                if (data.error == 1) {
                    base.addTip("拒绝提现成功！", "success");
                } else {
                    base.addTip(data.msg);
                }
            }).fail(function(data) {
                base.addTip("拒绝提现失败！");
            }).always(function() {
                $el = base.refreshTable($el, option);
                base.initLoad($("#deal_withdraw"));
                $.fancybox.close();
            });
        }
    }).on("click", ".btn-reload", function() {
        window.location.href = window.location.href;
    });

    // 展示用户信息
    function withdrawDetail(uid) {
        var argArr = [{
            name: "uid",
            value: uid
        }];
        base.renderDialog("#withdraw_detail", function() {
            $withdraw_record = base.refreshTable($withdraw_record, {
                sAjaxSource: base.domain + "finance/withdrawUser",
                "aoColumns": [{
                    "sTitle": "提现金额",
                    "mData": "price",
                    filter: true
                }, {
                    "sTitle": "提现时间",
                    "mData": "createdAt",
                    filter: true
                }, {
                    "sTitle": "审核结果",
                    "mData": "errmsg",
                    "fnCreatedCell": function(a, b, c) {
                        if (c.errmsg) {
                            $(a).html("失败");
                        } else if (c.etime) {
                            $(a).html("成功");
                        } else {
                            $(a).html("处理中");
                        }

                    }
                }, {
                    "sTitle": "流水单号/拒绝理由",
                    "mData": "errmsg",
                    filter: true,
                    "fnCreatedCell": function(a, b, c) {
                        $(a).html(b || c.alipay_id);
                    }
                }, {
                    "sTitle": "审核人",
                    "mData": "name",
                    filter: true
                }]
            }, argArr);
        });
    }

    return base;
});