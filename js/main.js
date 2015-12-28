$(function() {

    var transitionEnd = 'transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd';
    var animationEnd = 'animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd';

    var $click = ('ontouchend' in window || 'MSPointerCancel' in window) ? "touchend" : "click";
    var $resize = ("onorientationchange" in window ? "orientationchange" : "resize");

    var delayArr = [];

    var toSlideId;
    $(window).load(function() {
        // alert("加载完成！");
        $("#loading").hide();
        $(".container").removeClass("hide");
        $('#fullpage').fullpage({
            anchors: ['page_home', 'page_business', 'page_customer', 'page_advantage', 'page_contact', 'copyright'], //定义锚链接
            menu: '#menu', //绑定菜单，设定的相关属性与 anchors 的值对应后，菜单可以控制滚动
            slidesNavigation: true, //开启水平项目导航
            controlArrows: false,
            fixedElements: "header,#dock",
            responsiveHeight: 300,
            afterLoad: function(anchorLink, index) {
                if (index == 1) {
                    $("header").addClass("home");
                    $.fn.fullpage.moveTo(1, 0);
                } else if (index == 2) {
                    $(".section_business .book.open").each(function(i) {
                        var $this = $(this);
                        setTimeout(function() {
                            $this.removeClass("open");
                        }, 200 * (i - 1));
                    });
                } else if (index == 3) {
                    loadCustomer();
                } else if (index == 4) {
                    // $(".section_advantage ul li").addClass("flip");
                    $(".section_advantage ul").removeClass("ready");
                } else if (index == 5) {
                    // $(".section_contact").addClass("showing");
                }
            },
            onLeave: function(index, direction) {
                if (index == 1) {
                    $("header").removeClass("home");
                    cleanHome(-1);
                } else if (index == 2) {
                    $(".section_business .book").addClass("open");
                } else if (index == 3) {
                    $.each(delayArr, function(a, b) {
                        clearTimeout(b);
                    });
                    loadCustomer(close);
                } else if (index == 4) {
                    // $(".section_advantage ul li").removeClass("flip");
                    $(".section_advantage ul").addClass("ready");
                } else if (index == 5) {
                    // $(".section_contact").removeClass("showing");
                }

                if (direction === 1) {
                    $("header").addClass("home");
                } else if (direction === 2) {
                    $(".section_business .book.open").each(function(i) {
                        var $this = $(this);
                        setTimeout(function() {
                            $this.removeClass("open");
                        }, 200 * (i - 1));
                    });
                } else if (direction === 3) {
                    loadCustomer();
                } else if (direction === 4) {
                    // $(".section_advantage ul li").addClass("flip");
                    $(".section_advantage ul").removeClass("ready");
                } else if (direction === 5) {
                    // $(".section_contact").addClass("showing");
                }
            },
            afterSlideLoad: function(anchorLink, sectionIdx, slideIdx) {
                if (slideIdx == 0) {
                    $(".slide_city .mask").addClass("sunshine");
                } else if (slideIdx == 1) {
                    $("#eagle").addClass("fly_end");
                    $(".slide_mountain .content").addClass("fadeIn");
                } else if (slideIdx == 2) {
                    $(".slide_moon .content").addClass("showing");
                }
            },
            onSlideLeave: function(anchorLink, sectionIdx, slideIdx, direction, target) {
                cleanHome(slideIdx);

                if (target === 0) {
                    $(".slide_city .mask").addClass("sunshine");
                } else if (target === 1) {
                    $("#eagle").addClass("fly_end");
                } else if (target === 2) {
                    $(".slide_moon .content").addClass("showing");
                }
            }
        });




        // customer
        $('.grid').masonry({
            columnWidth: '.grid-item',
            itemSelector: '.grid-item',
            transitionDuration: '0s',
            isFitWidth: true
        });
    });

    // dock
    $("body").on($click, "#dock a.icon-switch", function() {
        var isPlus = $(this).is(".rotate2plus");
        $(this).toggleClass("rotate2plus", !isPlus);
        $("#dock .icons").toggleClass("bounceOutRight", !isPlus).toggleClass("bounceInRight", isPlus);
    }).on("mouseenter", ".icons li", function() {
        $(this).find(".iconfont").addClass("rubberBand");
        $(this).find("p").addClass("slideInRight");
    }).on("mouseleave", ".icons li", function() {
        $(this).find(".iconfont").removeClass("rubberBand");
        $(this).find("p").removeClass("slideInRight");
    }).on($click, "#dock .icon-up", function() {
        $.fn.fullpage.moveSectionUp();
    }).on($click, "#dock .icon-down", function() {
        $.fn.fullpage.moveSectionDown();
    });
    if ($(window).width() < 500) {
        $("#dock a.icon-switch").trigger($click);
    }

    // city ---- home
    $("body").on(transitionEnd, ".slide_city .mask", function() {
        $(this).is(".sunshine") && $(".slide_city .content h2").addClass("bounceInDown");
    }).on(animationEnd, ".slide_city .content h2", function() {
        $(".slide_city .content .p-up").addClass("bounceInLeft");
        $(".slide_city .content .p-down").addClass("bounceInRight");
    }).on(animationEnd, ".slide_city .content .p-down", function() {
        nextSlide(".slide_city");
    });
    // mountain ---- home
    $("body").on(animationEnd, ".slide_mountain .content", function() {
        nextSlide(".slide_mountain");
    });
    // moon ---- home
    $("body").on(transitionEnd, ".slide_moon .content", function() {
        $(this).is(".showing") && nextSlide(".slide_moon");
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

    // customer
    $(".section_customer").on("mouseleave",".customer_ct",function(eve){
        $(".active",this).removeClass("active");
    }).on("mouseenter",".customer_ct li:not('.bg-active')",function(eve){
        $(this).addClass("active").siblings(".active").removeClass("active");
    });




    // bussiness
    // $('.books').masonry({
    //     columnWidth: '.book',
    //     itemSelector: '.book',
    //     transitionDuration: '0s',
    //     isFitWidth: true
    // });

    $("body").on("mouseenter", ".grid-item", function() {
        $(this).addClass("active");
    }).on("mouseleave", ".grid-item", function() {
        $(this).removeClass("active");
    });

    // contact
    $("body").on(transitionEnd, ".section_contact", function() {
        $(".content", this).toggleClass("fadeInRightBig", $(this).is(".showing"));
    });

    function nextSlide(sel) {
        toSlideId = setTimeout(function() {
            // $(sel + ".active").length && $.fn.fullpage.moveSlideRight();
            $.fn.fullpage.moveSlideRight();
        }, 5000);
    }

    function cleanHome(idx) {
        // $(".section_home .slide.active").removeClass("active");
        clearTimeout(toSlideId);
        if (idx === 0 || idx === -1) {
            // $(".slide.active").removeClass("active");
            $(".slide_city .mask.sunshine").removeClass("sunshine");
            $(".slide_city .content h2.bounceInDown").removeClass("bounceInDown");
            $(".section_business .book").addClass("open");
            $(".slide_city .content .p-up.bounceInLeft").removeClass("bounceInLeft");
            $(".slide_city .content .p-down.bounceInRight").removeClass("bounceInRight");
        }
        if (idx === 1 || idx === -1) {
            $("#eagle.fly_end").removeClass("fly_end");
            $(".slide_mountain .content.fadeIn").removeClass("fadeIn");
        }
        if (idx === 2 || idx === -1) {
            $(".slide_moon .content.showing").removeClass("showing");
        }
    }

    function loadCustomer(close) {
        if (!close) {
            var winW = $(window).width();
            var winH = $(window).height();
            var eleW = winW > 800 ? 210 : 105;
            var eleH = winW > 800 ? 100 : 80;

            var horNum = Math.floor(winW * 0.85 / eleW);
            var verNum = Math.floor((winH - 100) / eleH);

            var num = horNum * verNum;

            $(".grid-item:lt(" + num + ")").removeClass("in-box");
            $(".grid-item:gt(" + (num - 1) + ")").addClass("in-box");
            $(".grid").height(verNum * eleH);

            $(".grid-item.hedge").removeClass("hedge");
            for (var i = 1; i < num + 1; i++) {
                i % 2 === (Math.ceil(i / horNum) % 2 === 0 ? (~(horNum % 2) + 2) : 0) && $(".grid-item:eq(" + (i - 1) + ")").addClass("hedge")
            }

        } else {
            $(".grid-item").addClass("in-box");
        }
    }


    $(window)[$resize](function() {
        $(".section_customer.active").length && loadCustomer();
    });

    // $("#menu").on($click, "ul a", function(e){
    //     alert(11);
    //     e.preventDefault();
    //     $.fn.fullpage.moveTo(1+$(this).parent().index());
    // });


});