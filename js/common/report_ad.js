/* page1 v1.0 */
define(["common/report"], function(base) {

    $.ajax({
        url: base.domain + "admin/getUserInfo",
        type: "POST",
        data: {
            token: base.account.token
        },
        dataType: "json"
        // ,
        // beforeSend: base.initLoad("余额加载中...")
    }).done(function(data) {
        if (data.error == 1) {
            $("#ad_balance .ad_balance_num").html(data.aaData.money);
        } else {
            base.addTip("余额加载失败：" + data.msg);
        }
    }).always(function(){
        // base.initLoad();
    });


    base.renderReport({
        $el: $("#account_report"),
        headUrl: base.domain + "ad/calcSum",
        headTip: "消费信息",
        headArr: ["today", "yesterday", "seven", "thirty", "all"],
        reportUrl: base.domain + "ad/calcDay",
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
        }]
    });
    // 支付表单验证
    var role = base.account.role;
    var charge_list_table;
    var charge_list_url = base.domain + base.fold[role - 1] + "/chargeList";
    var chargeValidate = $("#charge_form").validate({
        rules: {
            ad_charge: {
                required: true,
                number: true,
                min: 0.01
            },
            ad_account: {
                required: true
            }
        },
        messages: {
            ad_charge: {
                required: "金额不能为空",
                number: "请输入合法金额",
                min: "请输入大于0元的金额"
            },
            ad_account: {
                required: "账户名不能为空"
            }
        },
        errorPlacement: function(error, element) {
            if (element.is("#ad_charge")) {
                error.appendTo(element.parent().parent());
            } else {
                error.appendTo(element.parent());
            }
        }
    });

    var charge_list_opt = {
        // bAutoWidth: false,
        aoColumns: [{
            mData: "name",
            sTitle: "账户名"
        }, {
            mData: "money",
            sTitle: "金额"
        }, {
            mData: "createdAt",
            sTitle: "充值时间"
        }, {
            mData: "status",
            sTitle: "状态",
            fnCreatedCell: function(a,b) {
                $(a).html(["待审核","成功","失败"][+b]);
            }
        }],
        sPaginationType: "full_numbers",
        oLanguage: {
            sSearch: "搜索",
            sEmptyTable: "暂无数据",
            sInfo: "显示 _START_ ~ _END_ 条，共 _TOTAL_ 条记录",
            sInfoEmpty: "暂无记录显示",
            sLengthMenu: "每页显示 _MENU_ 条记录",
            oPaginate: {
                sFirst: "首页",
                sPrevious: "上一页",
                sNext: "下一页",
                sLast: "末页"
            }
        }
    };

    $("body").on("click", "#btn_charge", function() {
        // 充值
        chargeValidate.resetForm();
        $("#charge_form :input.error").removeClass("error");

        base.renderDialog("#dialog_charge", function() {
            $("#ad_charge,#ad_account", this.content).val("");
        });
    }).on("click", "#charge_form .btn_save", function() {
        // 确认保存特邀用户的修改
        if (chargeValidate.form()) {
            $.ajax({
                type: "POST",
                url: base.domain + base.fold[role - 1] + "/charge",
                data: {
                    token: base.account.token,
                    money: $("#ad_charge").val(),
                    name: $("#ad_account").val()
                },
                beforeSend: base.initLoad("充值中", $("#charge_form")),
                dataType: "json"
            }).done(function(data) {
                if (data.error == 1) {
                    base.addTip("充值请求成功，待审核！", "success");
                } else {
                    base.addTip("充值失败：" + data.msg);
                }
            }).fail(function() {
                base.addTip("充值失败！");
            }).always(function() {
                $.fancybox.close();
                base.initLoad($("#charge_form"));
            });
        }
    }).on("click", "#btn_charge_list", function() {

        // 充值列表
        base.renderDialog("#dialog_charge_list", function() {

            charge_list_table && charge_list_table.fnDestroy();
            $.ajax({
                url: charge_list_url,
                data: {
                    token: base.account.token
                },
                dataType: "json",
                beforeSend: base.initLoad("充值列表加载中...", $("#dialog_charge_list"))
            }).done(function(data) {
                charge_list_opt.aaData = data.aaData;
                charge_list_table = base.renderTable($("#charge_list_table"), charge_list_opt);
                $(window).trigger("resize");
            }).fail(function(data) {
                base.addTip("充值列表加载失败！");
            }).always(function() {
                base.initLoad($("#dialog_charge_list"));
            });

        });
    });

    return base;
});