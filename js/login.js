$(function() {
    // 添加class触发过渡动画
    $(".login-container").addClass("active");
    var authArr = ['admin', 'finance', 'custom_service', 'promoter_management', 'business_management', 'promoter', 'business', 'advertiser'];

    // 点击登录
    var mask = "";
    $("body").on("click", ".submit-icon.available", function() {
        var $this = $(this);
        $(this).removeClass("available");
        $.ajax({
            type: "POST",
            url: "http://admin3.cc:8080/user/login",
            // url: "http://192.168.1.140:8080/user/login",
            data: $("#login-form").serialize(),
            dataType: "json",
            beforeSend: function() {
                !mask.length ? ($("body").append(mask = $('<div class="mask">' + '<div class="alert-info-container">' + '<div class="loading">' + '<i></i>' + '<i></i>' + '<i></i>' + '<i></i>' + '<i></i>' + '</div>' + '<div class="alert alert-info" role="alert">' + '登录中...' + '</div>' + '</div>' + '</div>'))) : mask.show();
            }
        }).done(function(data) {
            if (data && !(data.error - 1)) {
                $.cookie("token", data.aaData.token, {
                    path: '/'
                });
                $.cookie("role", data.aaData.role, {
                    path: '/'
                });
                $.cookie("name", data.aaData.name, {
                    path: '/'
                });
                data.aaData && data.aaData.role && (window.location.href = authArr[data.aaData.role - 1] + "/index.html");
            } else {
                $this.addClass("available");
                $(".tip").text(data.msg);
                setTimeout(function() {
                    $(".tip").text("");
                }, 3000);
            }
            mask.hide();
        }).fail(function(err) {
            $(".tip").text("系统异常，请稍后再试！");
            setTimeout(function() {
                $(".tip").text("");
            }, 3000);
            $this.addClass("available");
            mask.hide();
        });
    });

    // IE6~8
    if (!$.support.leadingWhitespace) {
        $(".login-container").html('<p class="nosupport">您使用的浏览器版本太低，暂不提供支持，请安装最新的chrome浏览器或360浏览器。</p>');
    }
    // 按下enter登录
    $(window).keydown(function(event) {
        event.keyCode === 13 && $(".submit-icon.available").trigger("click");
    });
});