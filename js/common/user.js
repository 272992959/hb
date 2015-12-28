define(["base"], function(base) {

    var $withdraw_record = $("#withdraw-record-table"),
        $el = $("#user_table");
    $login = $("#login-table");
    $friend = $("#friend-table");
    $task_record = $("#task-record-table");
    var role = base.account.role;
    var userListUrl = base.domain + base.fold[role - 1] + "/uidList";

    var option = {
        sAjaxSource: userListUrl,
        aaSorting: [
            [2, 'asc']
        ],
        aoColumns: [{
            mData: "objectId",
            sTitle: "ID",
            filter: true
        }, 
        // {
        //     mData: "idfa",
        //     sTitle: "IDFA",
        //     filter: true,
        //     bSortable: false
        // }, 
        {
            mData: "phone",
            sTitle: "手机号码",
            filter: true
        }, {
            mData: "nickname",
            sTitle: "微信昵称",
            filter: true
        }, 
        // {
        //     mData: "ip",
        //     sTitle: "当前IP",
        //     filter: true
        // }, {
        //     mData: "loginNum",
        //     sTitle: "登录次数"
        // }, {
        //     mData: "loginLatist",
        //     sTitle: "最近登录时间",
        //     filter: true
        // }, {
        //     mData: "todayGet",
        //     sTitle: "今日收入"
        // }, 
        {
            mData: "allGet",
            sTitle: "历史收入"
        }, {
            sTitle: "操作",
            sWidth: "80px",
            sClass: "no-wrap",
            bSortable: false,
            sDefaultContent: getOperHtml(role),
            fnCreatedCell: function(a, b, c) {
                c.isvip && $(a).html(getOperHtml(role));
            }
        }]
    };

    $el = base.table($el, option);

    $("body").on("click", ".btn_refresh", function() {
        $el = base.refreshTable($el, option);
    });

    // 展示用户信息
    function userDetail(loginData, friendData, taskData, id) {
        $(".heading .user_id", this.content).text("用户ID：" + id);
        base.renderDialog("#user_detail", function() {
            var baseOpt = {
                bAutoWidth: false,
                bSort: false,
                bFilter: false,
                sPaginationType: "full_numbers",
                oLanguage: {
                    sEmptyTable: "暂无数据",
                    sInfo: "显示 _START_ ~ _END_ 条，共 _TOTAL_ 条记录",
                    sInfoEmpty: "暂无记录显示",
                    sLengthMenu: "每页显示 _MENU_ 条记录",
                    sZeroRecords: "暂无数据",
                    oPaginate: {
                        sFirst: "首页",
                        sPrevious: "上一页",
                        sNext: "下一页",
                        sLast: "末页"
                    }
                }
            };
            var loginOpt = $.extend({}, baseOpt, {
                aaData: loginData,
                aoColumns: [{
                    sTitle: "登录方式",
                    mData: "loginType"
                }, {
                    sTitle: "时间",
                    mData: "createdAt"
                }, {
                    sTitle: "地点",
                    mData: "ipProvince"
                }, {
                    sTitle: "IP",
                    mData: "ip"
                }]
            });
            var friendOpt = $.extend({}, baseOpt, {
                aaData: friendData,
                aoColumns: [{
                    sTitle: "好友ID",
                    mData: "objectId"
                }, {
                    sTitle: "手机号",
                    mData: "phone"
                }, {
                    sTitle: "微信号",
                    mData: "openid"
                }, {
                    sTitle: "带来收入",
                    mData: "money"
                }]
            });
            var recordOpt = $.extend({}, baseOpt, {
                aaData: taskData,
                aoColumns: [{
                    sTitle: "收入来源",
                    mData: "priceinfo"
                }, {
                    sTitle: "收入时间",
                    mData: "createdAt"
                }, {
                    sTitle: "收入金额",
                    mData: "price_diff"
                }]
            });
            base.isDataTable($login) && $login.fnDestroy();
            base.isDataTable($friend) && $friend.fnDestroy();
            base.isDataTable($task_record) && $task_record.fnDestroy();

            $login = base.renderTable($login, loginOpt);
            $friend = base.renderTable($friend, friendOpt);
            $task_record = base.renderTable($task_record, recordOpt);
        });
    }



    // 特邀用户信息表单验证
    if (role != 2 && role != 3) {
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
    }

    $("body").on("click", ".btn_look_up", function() {
        // 点击获取用户数据
        var loginData, friendData, taskData;
        var rowData = $el.fnGetData($(this).closest("tr")[0]);

        $.ajax({
            type: "POST",
            url: base.domain + base.fold[role - 1] + "/friends",
            data: {
                token: base.account.token,
                objectId: rowData.objectId
            },
            dataType: "json",
            beforeSend: base.initLoad("用户详细信息加载中。。。")
        }).done(function(data) {
            if (data.error == 1) {
                userDetail(data.aaData.loginRecord, data.aaData.friendsRecord, data.aaData.taskRecord, rowData.objectId);
            } else {
                base.addTip("用户详细信息加载失败:" + data.msg);
            }
        }).fail(function(data) {
            base.addTip("用户详细信息加载失败！");
        }).always(function() {
            base.initLoad();
        });
    }).on("click", ".btn_level_up", function() {
        // 升级为特邀用户
        formValidate.resetForm();
        $("#add_guest_user :input.error").removeClass("error");

        rowEditing = $(this).closest("tr")[0];
        base.renderDialog("#add_guest_user", function() {
            this.content.find("select,:text").val("");
        });
    }).on("click", "#add_guest_user .btn_save", function() {
        // 确认升级为特邀用户
        if (formValidate.form()) {
            var rowData = $el.fnGetData(rowEditing);
            var sendObj = {
                token: base.account.token,
                objectId: rowData.objectId,
                type: $("#guest_type").val(),
                platform: $("#anchor_platform").val() || $("#weibo_platform").val() || "",
                num: $("#guest_num").val(),
                isper: $('[name="guest_isper"]:checked').val(),
                pay: $("#guest_pay").val()
            };
            $.ajax({
                type: "POST",
                url: base.domain + base.fold[role - 1] + "/vipAdd",
                data: sendObj,
                beforeSend: base.initLoad("升级为特邀用户中")
            }).done(function(data) {
                $el = base.refreshTable($el, option);
                base.addTip("升级特邀用户成功！", "success");
            }).fail(function() {
                base.addTip("升级特邀用户失败！");
            }).always(function() {
                $.fancybox.close();
                base.initLoad();
            });
        }
    });

    function getOperHtml(role) {
        return '<button class="btn btn-sm btn-info-outline btn_look_up" type="button">查看</button>' + ((role == 2 || role == 3) ? '' : '<button class="btn btn-sm btn-info-outline btn_level_up" type="button">升级为特邀用户</button>');
    }

    // 特邀用户平台显隐
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