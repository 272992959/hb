define(["base"], function(base) {
    var $withdraw_record = $("#withdraw-record-table"),
        $el = $("#records_table");
    var listUrl = base.domain + "finance/withdrawListed";
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
            mData: "createdAt",
            sTitle: "处理时间",
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
            mData: "errmsg",
            sTitle: "申请结果",
            bSortable: false,
            fnCreatedCell: function(a, b, c) {
                if (c.errmsg) {
                    $(a).html("失败");
                } else if (c.etime) {
                    $(a).html("成功");
                } else {
                    $(a).html("处理中");
                }

            }
        }, {
            mData: "errmsg",
            sTitle: "流水单号/拒绝理由",
            bSortable: false,
            filter: true,
            fnCreatedCell: function(a, b, c) {
                $(a).html(b || c.alipay_id);
            }
        }, {
            sTitle: "操作",
            sClass: "no-wrap",
            bSortable: false,
            sDefaultContent: ' <button class="btn btn-sm btn-info-outline btn_look_up" type="button">查看</button>'
        }]
    };

    // 额外向服务器的传参
    var argArr = [{
        name: "status",
        $el: $("#filter_status input")
    }];

    $el = base.table($el, option, argArr);

    $("body").on("click", ".btn_refresh", function() {
        $el = base.refreshTable($el, option, argArr);
    });

    $el.on("click", ".btn_look_up", function() {
        // 查看个人提现记录
        var withdrawData;
        var thisRow = $(this).closest("tr")[0];
        var rowData = $el.fnGetData(thisRow);
        withdrawDetail(rowData.uid)
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