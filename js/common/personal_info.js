define(["base"], function(base) {
    // 获取并回填个人信息
    $.ajax({
        url: base.domain + "admin/getUserInfo",
        type: "POST",
        data: {
            token: base.account.token
        },
        dataType: "json",
        beforeSend: base.initLoad("个人信息加载中...",$("#account_info"))
    }).done(function(data) {
        if (data.error == 1) {
            var account = data.aaData;
            $("#user_count").val(account.username);
            $("#user_name").val(account.name);
            $("#user_phone").val(account.phone);
            $("#ad_company").val(account.company);
            $("#ad_lzphone").val(account.bd_phone);
            $("#ad_money").val(account.money);
        } else {
            base.addTip("个人信息加载失败：" + data.msg);
        }
    }).always(function(){
        base.initLoad($("#account_info"));
    });

    // 验证
    var formValidate = $("#account_info_form").validate({
        rules: {
            user_name: "required",
            user_phone: {
                required: true,
                digits: true
            },
            user_password: {
                required: function() {
                    return !!$("#user_new_password").val();
                },
                minlength: 6
            },
            user_new_password: {
                minlength: 6
            },
            user_repeat_password: {
                equalTo: "#user_new_password"
            }
        },
        messages: {
            user_name: "姓名不能为空",
            user_phone: {
                required: "电话不能为空",
                digits: "电话号码只能输入整数"
            },
            user_password: {
                required: "设置新密码必须填写当前密码",
                minlength: "密码至少6位"
            },
            user_new_password: {
                minlength: "新密码至少6位"
            },
            user_repeat_password: {
                equalTo: "两次输入不一致"
            }
        }
    });

    var editUrl = base.domain + base.fold[+base.account.role - 1] + "/userEdit";
    // 修改基本信息
    $('body').on("click", "#btn_edit_account", function() {
        if (formValidate.form()) {
            $.ajax({
                type: "POST",
                url: editUrl,
                data: {
                    token: base.account.token,
                    name: $("#user_name").val(),
                    phone: $("#user_phone").val(),
                    password: $("#user_password").val(),
                    newpassword: $("#user_new_password").val(),
                    repassword: $("#user_repeat_password").val()
                },
                dataType: "json",
                beforeSend: base.initLoad("基本信息修改中...", $("#account_info"))
            }).done(function(data) {
                base.addTip("基本信息修改成功！", "success");
                $("#account_name").text($("#user_name").val());
                $.cookie("name", $("#user_name").val(), { path: '/' });
                $("#user_password,#user_new_password,#user_repeat_password").val("");
            }).fail(function(data) {
                base.addTip("基本信息修改失败！");
            }).always(function(){
                base.initLoad($("#account_info"));
            });
        }
    });
    return base;
});