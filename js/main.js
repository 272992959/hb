$(function() {



    var transitionEnd = 'transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd';
    var animationEnd = 'animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd';


    var delayArr = [];
    $('#fullpage').fullpage({
        anchors: ['page_home', 'page_business', 'page_customer', 'page_advantage', 'page_contact'], //定义锚链接
        menu: '#menu', //绑定菜单，设定的相关属性与 anchors 的值对应后，菜单可以控制滚动
        slidesNavigation: true, //开启水平项目导航
        controlArrows: false,
        fixedElements: "header,#dock",
        responsiveHeight: 300,
        afterLoad: function(anchorLink, index) {
            if (index == 1) {
                $.fn.fullpage.moveTo(1, 0);
            } else if (index == 2) {
                $(".books").addClass("bounceIn");
            } else if (index == 3) {
                var st = 150;
                $(".grid-item").each(function(i) {
                    var tt = this;
                    delayArr.push(setTimeout(function() {
                        $(tt).removeClass("in-box");
                    }, i * (st -= 2)));
                });
            } else if (index == 4) {
                $(".section_advantage ul li").addClass("flip");
            } else if (index == 5) {
                $(".section_contact").addClass("showing");
            }
        },
        onLeave: function(index, direction) {
            if (index == 1) {

            } else if (index == 2) {
                $(".books").removeClass("bounceIn");
            } else if (index == 3) {
                $.each(delayArr,function(a,b){
                    clearTimeout(b);
                });
                $(".grid-item").addClass("in-box");
            } else if (index == 4) {
                $(".section_advantage ul li").removeClass("flip");
            } else if (index == 5) {
                $(".section_contact").removeClass("showing");
            }
        },
        afterSlideLoad: function(anchorLink, sectionIdx, slideIdx) {
            if (slideIdx == 0) {
                $(".mask").addClass("sunshine");
            } else if (slideIdx == 1) {
                $("#eagle").addClass("fly_end");
            } else if (slideIdx == 2) {
                $(".slide_moon .content").addClass("showing");
            }
        },
        onSlideLeave: function(anchorLink, sectionIdx, slideIdx, direction) {
            if (slideIdx == 0) {
                $(".slide_city .mask").removeClass("sunshine");
                $(".slide_city .content h2").removeClass("bounceInDown");
                $(".slide_city .content .p-up").removeClass("bounceInLeft");
                $(".slide_city .content .p-down").removeClass("bounceInRight");
            } else if (slideIdx == 1) {
                $("#eagle").removeClass("fly_end");
                $(".slide_mountain .content").removeClass("fadeIn");
            } else if (slideIdx == 2) {
                $(".slide_moon .content").removeClass("showing");
            }
        }
    });

    // dock
    $("body").on("click", "#dock a.icon-switch", function() {
        var isPlus = $(this).is(".rotate2plus");
        $(this).toggleClass("rotate2plus", !isPlus);
        $("#dock .icons").toggleClass("bounceOutRight", !isPlus).toggleClass("bounceInRight", isPlus);
    }).on("mouseenter", ".icons li", function() {
        $(this).find(".iconfont").addClass("rubberBand");
        $(this).find("p").addClass("slideInRight");
    }).on("mouseleave", ".icons li", function() {
        $(this).find(".iconfont").removeClass("rubberBand");
        $(this).find("p").removeClass("slideInRight");
    }).on("click", "#dock .icon-up", function() {
        $.fn.fullpage.moveSectionUp();
    }).on("click", "#dock .icon-down", function() {
        $.fn.fullpage.moveSectionDown();
    });

    // home

    // city
    $("body").on(transitionEnd, ".slide_city .mask", function() {
        $(this).is(".sunshine") && $(".slide_city .content h2").addClass("bounceInDown");
    }).on(animationEnd, ".slide_city .content h2", function() {
        $(".slide_city .content .p-up").addClass("bounceInLeft");
        $(".slide_city .content .p-down").addClass("bounceInRight");
    }).on(animationEnd, ".slide_city .content .p-down", function() {
        nextSlide(".slide_city");
    });
    // mountain
    $("body").on(transitionEnd, ".slide_mountain #eagle", function() {
        $(this).is(".fly_end") && $(".slide_mountain .content").addClass("fadeIn");
    }).on(animationEnd, ".slide_mountain .content", function() {
        nextSlide(".slide_mountain");
    });
    // moon
    $("body").on(transitionEnd, ".slide_moon .content", function() {
        $(this).is("showing") && nextSlide(".slide_moon");
    });


    // business
    $(".section_business").on("mouseenter mouseleave", ".book", function(eve) {
        var isEnter = eve.type === "mouseenter";
        $(this).toggleClass("open", isEnter);
    });


    // advantage
    $(".section_advantage").on("mouseenter mouseleave", "li", function(eve) {
        var isEnter = eve.type === "mouseenter";
        var icon = $(".iconfont", this);
        $(this).toggleClass("active", isEnter);

        if (icon.is(".icon-phone-wechat")) {
            icon.toggleClass("shake", isEnter);
        } else if (icon.is(".icon-people-chart")) {
            icon.toggleClass("lightSpeedIn", isEnter);
        } else if (icon.is(".icon-ball")) {
            icon.toggleClass("flip", isEnter);
        } else if (icon.is(".icon-shield")) {
            icon.toggleClass("rotateIn", isEnter);
        }
    });



    // contact
    $("body").on(transitionEnd, ".section_contact", function() {
        $(".content", this).toggleClass("fadeInRightBig", $(this).is(".showing"));
    });


    // customer
    window.tt = $('.grid').masonry({
        columnWidth: '.grid-item',
        itemSelector: '.grid-item',
        transitionDuration: '0s',
        isFitWidth: true
    });

    $("body").on("mouseenter", ".grid-item", function() {
        $(this).addClass("active");
    }).on("mouseleave", ".grid-item", function() {
        $(this).removeClass("active");
        // tt.masonry('layout');
    });

    function nextSlide(sel) {
        setTimeout(function() {
            $(sel + ".active").length && $.fn.fullpage.moveSlideRight();
        }, 2500);
    }

});