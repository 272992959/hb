define(["base"], function(base) {
    var $el = $("#charge_table");
    var listUrl = base.domain + "finance/adChargeList";
    var option = {
        sAjaxSource: listUrl,
        aaSorting: [
            [6, 'asc']
        ],
        aoColumns: [{
            mData: "ad_id",
            sTitle: "广告主ID",
            filter: true
        }, {
            mData: "money",
            sTitle: "充值金额",
            filter: true
        }, {
            mData: "username",
            sTitle: "用户名",
            filter: true
        }, {
            mData: "name",
            sTitle: "真实姓名",
            filter: true
        }, {
            mData: "createdAt",
            sTitle: "充值时间",
            filter: true
        }, {
            mData: "updatedAt",
            sTitle: "审核时间",
            filter: true
        }, {
            mData: "status",
            sTitle: "状态",
            filter: false,
            fnCreatedCell: function(a,b) {
                $(a).html(["待审核","成功","失败"][+b]);
            }
        }, {
            mData: "status",
            sTitle: "操作",
            sClass: "no-wrap",
            bSortable: false,
            fnCreatedCell: function(a,b) {
                var operHtml = b != 0 ? "已处理" : '<button class="btn btn-sm btn-success-outline btn_true" type="button">同意</button><button class="btn btn-sm btn-danger-outline btn_false">拒绝</button>';
                $(a).html(operHtml);
            }
        }]
    };

    $el = base.table($el, option);

    $("body").on("click", ".btn_refresh", function() {
        $el = base.refreshTable($el, option);
    });


    $el.on("click", ".btn_true,.btn_false", function() {
        var operTip = "同意充值";
        var operStatus = 1;
        if($(this).is(".btn_false")){
            operTip = "拒绝充值";
            operStatus = 2;
        }
        var rowData = $el.fnGetData($(this).closest("tr")[0]);
        // 同意拒绝充值
        if (confirm("确认"+operTip+"?")) {
            $.ajax({
                type: "POST",
                url: base.domain + "finance/adChargeOper",
                data: {
                    token: base.account.token,
                    id: rowData.id,
                    status: operStatus
                },
                dataType: "json",
                beforeSend: base.initLoad(operTip + "中...", $("#charge_table"))
            }).done(function(data) {
                if (data.error == 1) {
                    base.addTip(operTip + "成功！", "success");
                } else {
                    base.addTip(data.msg);
                }
            }).fail(function(data) {
                base.addTip(operTip + "失败！");
            }).always(function() {
                $el = base.refreshTable($el, option);
                base.initLoad($("#charge_table"));
                $.fancybox.close();
            });
        }
    });


    return base;
});