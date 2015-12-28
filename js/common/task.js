define(["base"], function(base) {

    var $el;
    var role = base.account.role;
    var isAder = role == 8;
    var $el = $("#task-table");
    var $idfa = $("#idfa-table");

    var statusArr = {
        power: {
            "1": '<span class="label label-primary">进行中</span>',
            "-2": '<span class="label label-danger">失败</span>',
            "-1": '<span class="label label-warning">待审核</span>',
            "8": '<span class="label label-warning">终止</span>',
            "9": '<span class="label label-success">完成</span>',
            "2": '<span class="label label-default">暂停中</span>'
        },
        oper: {
            "1": '<button class="btn btn-sm btn-info-outline btn_see" type="button">查看</button><button class="btn btn-sm btn-primary-outline btn_renew" type="button">续单</button>',
            "-2": '<button class="btn btn-sm btn-primary-outline btn_edit" type="button">修改</button><button class="btn btn-sm btn-default-outline btn_delete" type="button">删除</button>',
            "-1": '<button class="btn btn-sm btn-primary-outline btn_edit" type="button">修改</button><button class="btn btn-sm btn-default-outline btn_delete" type="button">删除</button><button class="btn btn-sm btn-primary-outline btn_renew" type="button">续单</button>',
            "8": '<button class="btn btn-sm btn-info-outline btn_see" type="button">查看</button>',
            "9": '<button class="btn btn-sm btn-info-outline btn_see" type="button">查看</button><button class="btn btn-sm btn-primary-outline btn_renew" type="button">续单</button>',
            "2": '<button class="btn btn-sm btn-info-outline btn_see" type="button">查看</button><button class="btn btn-sm btn-warning-outline btn_start" type="button">开始</button><button class="btn btn-sm btn-primary-outline btn_renew" type="button">续单</button>'
        }
    };
    // 非广告主，不同操作
    if (!isAder) {
        statusArr.oper = {
            "1": '<button class="btn btn-sm btn-info-outline btn_see" type="button">查看</button><button class="btn btn-sm btn-warning-outline btn_pause" type="button">暂停</button><button class="btn btn-sm btn-primary-outline btn_add_num" type="button">加量</button><button class="btn btn-sm btn-primary-outline btn_renew" type="button">续单</button><button class="btn btn-sm btn-default-outline btn_end" type="button">终止</button>',
            "-2": '<button class="btn btn-sm btn-primary-outline btn_edit" type="button">修改</button><button class="btn btn-sm btn-default-outline btn_delete" type="button">删除</button>',
            "-1": '<button class="btn btn-sm btn-success-outline btn_agree" type="button">同意</button><button class="btn btn-sm btn-danger-outline btn_refuse" type="button">拒绝</button><button class="btn btn-sm btn-primary-outline btn_edit" type="button">修改</button><button class="btn btn-sm btn-default-outline btn_delete" type="button">删除</button><button class="btn btn-sm btn-primary-outline btn_renew" type="button">续单</button>',
            "8": '<button class="btn btn-sm btn-info-outline btn_see" type="button">查看</button>',
            "9": '<button class="btn btn-sm btn-info-outline btn_see" type="button">查看</button><button class="btn btn-sm btn-primary-outline btn_renew" type="button">续单</button>',
            "2": '<button class="btn btn-sm btn-info-outline btn_see" type="button">查看</button><button class="btn btn-sm btn-warning-outline btn_start" type="button">开始</button><button class="btn btn-sm btn-primary-outline btn_renew" type="button">续单</button><button class="btn btn-sm btn-default-outline btn_end" type="button">终止</button>'
        };
    }
    var downloadType = ["关键词", "链接"];
    var listUrl = base.domain + base.fold[role - 1] + "/taskList";
    var editUrl = base.domain + base.fold[role - 1] + "/taskEdit";


    var option = {
        sAjaxSource: listUrl,
        aoColumns: [{
            mData: "objectId",
            sClass: "no-wrap",
            sTitle: "ID"
        }, {
            mData: "name",
            sTitle: "名称",
            filter: true
        }, {
            mData: "keyword",
            sTitle: "关键词",
            filter: true
        }, {
            mData: "isurl",
            sTitle: "下载方式",
            sWidth: "90px",
            fnCreatedCell: function(a, b) {
                $(a).html(downloadType[b]);
            }
        }, {
            mData: "countall",
            sTitle: "投放数",
            filter: true
        }, {
            mData: "num_finish",
            sTitle: "已完成数",
            sWidth: "90px"
        }, {
            mData: "stime",
            sTitle: "开始时间"
        }, {
            mData: "expire",
            sTitle: "截止时间"
        }, {
            mData: "taskprice",
            sTitle: "单价",
            filter: true
        }, {
            mData: "power",
            sTitle: "状态",
            fnCreatedCell: function(a, b) {
                $(a).html(statusArr.power[b]);
            }
        }, {
            mData: "power",
            sTitle: "操作",
            sWidth: "130px",
            bSortable: false,
            fnCreatedCell: function(a, b) {
                $(a).html(statusArr.oper[b]);
            }
        }]
    };

    // 非广告主多展示的列数
    if (!isAder) {
        option.aoColumns.splice(1, 0, {
            mData: "company",
            sTitle: "公司",
            filter: true
        });
        option.aoColumns.splice(5, 0, {
            mData: "iscomment",
            sTitle: "评论占比",
            sClass: "tdIscomment",
            filter: true,
            fnCreatedCell: function(a, b) {
                $(a).html((!b || b == 0) ? "无" : ("1/" + b));
            }
        });
        // 非商务
        if (role != 7) {
            option.aoColumns.splice(1, 0, {
                mData: "pname",
                sTitle: "商务",
                filter: true
            });
        }
    }
    // 额外向服务器的传参
    var argArr = [{
        name: "status",
        $el: $("#filter_status input")
    }];
    $el = base.table($el, option, argArr);

    $("body").on("click", ".btn_refresh", function() {
        $el = base.refreshTable($el, option, argArr);
    });


    // 任务表单验证
    var taskValidate = $("#task_form").validate({
        rules: {
            task_storeurl: "required",
            task_stime: "required",
            task_countall: {
                required: true,
                digits: true,
                min: 0
            },
            task_iscomment: {
                digits: true,
                min: 1
            },
            task_keywordTop: {
                digits: true,
                min: 1
            },
            task_steptime: {
                digits: true,
                min: 1
            },
            task_taskprice: {
                number: true,
                min: 0.01
            },
            task_price: {
                number: true,
                min: 0.01
            }
        },
        messages: {
            task_storeurl: "链接不能为空",
            task_stime: "开始时间不能为空",
            task_countall: {
                required: "投放份数不能为空",
                digits: "投放份数必须是整数",
                min: "投放份数不能为负数"
            },
            task_keywordTop: {
                digits: "keywordTop必须是正整数",
                min: "keywordTop必须大于0"
            },
            task_steptime: {
                digits: "体验时间必须是正整数",
                min: "体验时间必须大于0"
            },
            task_iscomment: {
                digits: "评论占比必须是正整数",
                min: "评论占比必须大于0"
            },
            task_taskprice: {
                number: "单价必须是数字",
                min: "单价必须大于0"
            },
            task_price: {
                number: "单价必须是数字",
                min: "单价必须大于0"
            }
        },
        errorPlacement: function(error, element) {
            if (element.is("#task_iscomment,#task_taskprice,#task_price")) {
                error.appendTo(element.parent().parent());
            } else {
                error.appendTo(element.parent());
            }
        }
    });
    var addNumValidate = $("#add_num_form").validate({
        rules: {
            add_num: {
                required: true,
                digits: true,
                min: 1
            }
        },
        messages: {
            add_num: {
                required: "添加份数不能为空",
                digits: "添加份数必须是整数",
                min: "添加份数需大于0"
            }
        },
        errorPlacement: function(error, element) {
            error.appendTo(element.parent().parent());
        }
    });

    $("body").on('click', '.btn_edit,#btn_add_task,.btn_renew', function(e) {
        // 添加、修改任务
        taskValidate.resetForm();
        $("#edit_task :input.error").removeClass("error");

        var rowData = $el.fnGetData($(this).closest("tr")[0]);

        var fnCallback;
        if ($(this).is("#btn_add_task")) {
            fnCallback = function() {
                $(".heading>span", this.content).text("添加任务");
                $(":text,#task_id", this.content).val("");

                $(".edit_name_container").hide().find("input").val("");

                $("#task_price", this.content).val("1.00");
                $("#task_taskprice", this.content).val("4.00");
                $("#task_steptime", this.content).val("1");

                $(':radio[value="0"]').trigger("click");

                var sDate = new Date().toString("yyyy-MM-dd HH:mm:ss");
                var eDate = new Date().add({
                    years: 1
                }).toString("yyyy-MM-dd HH:mm:ss");
                $('[data-date-max]', this.content).val(sDate);
                $('[data-date-min]', this.content).val(eDate);

                $('[name="set_isreg"][value="0"]').prop("checked", true);
            };
        } else if ($(this).is(".btn_edit")) {
            fnCallback = function() {
                $(".heading>span", this.content).text("修改任务");
                $(":text,#task_id", this.content).each(function(i) {
                    var thisVal = rowData[$(this).attr("id").slice(5)];
                    $(this).val(thisVal);
                });

                $(".edit_name_container").show().find("input").val(rowData.name);

                $('[name="set_time"][value="0"]').trigger("click");

                $('[name="set_link"][value="' + (rowData.link ? "1" : "0") + '"]').trigger("click");
                $('[name="set_keyword"][value="' + (rowData.keyword ? "1" : "0") + '"]').trigger("click");
                $('[name="set_iscomment"][value="' + (rowData.iscomment ? "1" : "0") + '"]').trigger("click");

                $('[name="set_isreg"][value="' + (rowData.isreg == "1" ? "1" : "0") + '"]').prop("checked", true);
            };
        } else if ($(this).is(".btn_renew")) {
            fnCallback = function() {
                $(".heading>span", this.content).text("续单");
                $(":text,#task_id", this.content).each(function(i) {
                    var thisVal = rowData[$(this).attr("id").slice(5)];
                    $(this).val(thisVal);
                });

                var sDate = new Date().toString("yyyy-MM-dd HH:mm:ss");
                var eDate = new Date().add({
                    years: 1
                }).toString("yyyy-MM-dd HH:mm:ss");
                $('[data-date-max]', this.content).val(sDate);
                $('[data-date-min]', this.content).val(eDate);

                $(".edit_name_container").show().find("input").val(rowData.name);

                $('[name="set_time"][value="0"]').trigger("click");

                $('[name="set_link"][value="' + (rowData.link ? "1" : "0") + '"]').trigger("click");
                $('[name="set_keyword"][value="' + (rowData.keyword ? "1" : "0") + '"]').trigger("click");
                $('[name="set_iscomment"][value="' + (rowData.iscomment ? "1" : "0") + '"]').trigger("click");

                $('[name="set_isreg"][value="' + (rowData.isreg == "1" ? "1" : "0") + '"]').prop("checked", true);
            };
        }
        base.renderDialog("#edit_task", fnCallback);

    }).on('click', '.btn_add_num', function(e) {
        // 添加任务数量
        addNumValidate.resetForm();
        $("#add_num_ct :input.error").removeClass("error");

        var rowData = $el.fnGetData($(this).closest("tr")[0]);
        base.renderDialog("#add_num_ct", function() {
            $("#add_id", this.content).val(rowData.id);
        });
    }).on("click", ".btn_see", function() {
        // 查看IDFA
        var thisRow = $(this).closest("tr")[0];
        var rowData = $el.fnGetData(thisRow);

        var option = {
            sAjaxSource: base.domain + base.fold[role - 1] + "/idfaList",
            aoColumns: [{
                mData: "task_end",
                sTitle: "完成任务时间",
                filter: true
            }, {
                mData: "idfa",
                sTitle: "IDFA",
                filter: true
            }]
        };
        var argArr = [{
            name: "id",
            value: rowData.id
        }];
        $idfa = base.refreshTable($idfa, option, argArr);
        base.renderDialog("#idfa_list", function() {
            $(".icon-upload-alt", this.content).attr("href", base.domain + "admin/idfaExcel?token=" + base.account.token + "&id=" + rowData.id).tooltip({
                placement: "left"
            });
        });
    }).on("click", ".btn_pause,.btn_start,.btn_agree,.btn_refuse", function() {
        // 暂停任务、开始投放任务

        var thisRow = $(this).closest("tr")[0];
        var rowData = $el.fnGetData(thisRow);
        var valObj = {
            id: rowData.id
        };
        var operTip = "";
        if (rowData.power == 1) {
            valObj.power = "2";
            operTip = "暂停任务";
        } else if (rowData.power == 2) {
            valObj.power = "1";
            operTip = "开始任务";
        } else if (rowData.power == -1) {
            if ($(this).is(".btn_agree")) {
                valObj.power = "1";
                operTip = "同意任务审核";
            } else {
                valObj.power = "-2";
                operTip = "拒绝任务审核";
            }
        }

        if (confirm("确认" + operTip)) {
            editTask(valObj, operTip, function() {
                base.refreshTable($el, option, argArr);
            });
        }
    }).on("click", ".btn_delete,.btn_end", function(e) {
        // 删除任务、终止任务
        var operTip = "终止任务";
        var ajaxUrl = base.domain + base.fold[role - 1] + '/taskStop';


        var thisRow = $(this).closest("tr")[0];
        var rowData = $el.fnGetData(thisRow);

        if ($(e.target).is(".btn_delete")) {
            operTip = "删除任务";
            ajaxUrl = base.domain + base.fold[role - 1] + '/taskDel';
        }

        if (confirm("确认" + operTip)) {
            $.ajax({
                type: 'POST',
                url: ajaxUrl,
                data: {
                    token: base.account.token,
                    id: rowData.id
                },
                dataType: 'json',
                beforeSend: base.initLoad(operTip+"中！", $el)
            }).done(function(data) {
                if (data.error == 1) {
                    $el = base.refreshTable($el, option, argArr);
                    base.addTip(operTip + "成功！", "success");
                } else {
                    base.addTip(operTip + "失败：" + data.msg);
                }
            }).fail(function() {
                base.addTip(operTip+"失败!");
            }).always(function() {
                base.initLoad($el);
            });
        }
    }).on("click", "#edit_task .btn_save", function() {
        // 确认添加、修改任务
        if (taskValidate.form()) {
            $.fancybox.close();
            var valObj = {
                storeurl: $("#task_storeurl").val(),
                keyword: $("#task_keyword").val(),
                countall: $("#task_countall").val(),
                stime: $("#task_stime").val(),
                link: $("#task_link").val(),
                iscomment: $("#task_iscomment").val(),
                isreg: $('[name="set_isreg"]:checked').val(),
                price: $('#task_price').val(),
                keywordTop: $("#task_keywordTop").val(),
                steptime: $("#task_steptime").val(),
                taskprice: $("#task_taskprice").val(),
                expire: $("#task_expire").val()
            };
            var operTip = $.trim($("#edit_task .heading>span").text());
            if (operTip === "修改任务") {
                $.extend(valObj, {
                    id: $("#task_id").val(),
                    power: "-1",
                    name: $("#edit_name").val()
                });

                editTask(valObj, operTip, function(dataObj) {
                    base.refreshTable($el, option, argArr);
                });
            } else if (operTip === "添加任务") {
                // 非广告主时向后台传一个虚拟广告主id
                !isAder && (valObj.ad_id = "13");

                editTask(valObj, operTip, function(dataObj) {
                    base.refreshTable($el, option, argArr);
                }, base.domain + base.fold[role - 1] + '/taskAdd');
            } else {
                // 非广告主时向后台传一个虚拟广告主id
                !isAder && (valObj.ad_id = "13");

                editTask(valObj, operTip, function(dataObj) {
                    base.refreshTable($el, option, argArr);
                }, base.domain + base.fold[role - 1] + '/taskAdd');
            }
        }
    }).on("click", "#add_num_form .btn_save", function() {
        // 确认添加任务数量
        var thisForm = $("#add_num_form");
        var idVal = $("#add_id", thisForm).val();
        var numVal = $("#add_num", thisForm).val();
        if (addNumValidate.form()) {
            $.fancybox.close();
            $.ajax({
                type: 'POST',
                url: base.domain + base.fold[role - 1] + '/taskAddNum',
                data: {
                    token: base.account.token,
                    id: idVal,
                    num: numVal
                },
                dataType: 'json',
                beforeSend: base.initLoad("添加任务数量中！", $el)
            }).done(function(data) {
                if (data.error == 1) {
                    $el = base.refreshTable($el, option, argArr);
                    base.addTip("添加任务数量成功！", "success");
                } else {
                    base.addTip("添加任务数量失败：" + data.msg);
                }
            }).fail(function() {
                base.addTip("添加任务数量失败!");
            }).always(function() {
                base.initLoad($el);
            });
        }
    });

    function editTask(valObj, operTip, fnSuccess, addUrl) {
        $.ajax({
            type: 'POST',
            url: addUrl || editUrl,
            data: $.extend({
                token: base.account.token
            }, valObj),
            dataType: 'json',
            beforeSend: base.initLoad(operTip + "中！", $el)
        }).done(function(data) {
            if (data.error == 1) {
                fnSuccess && fnSuccess(data.aaData);
                base.addTip(operTip + "成功！", "success");
            } else {
                base.addTip(operTip + "失败：" + data.msg);
            }
        }).fail(function() {
            base.addTip(operTip + "失败!");
        }).always(function() {
            base.initLoad($el);
        });
    }




    $("body").on("click", '[name="set_time"]', function() {
        $(".time_container").toggle($(this).val() == 1);
    }).on("click", '[name="set_link"]', function() {
        var isSet = $(this).val() == 1;
        $(".link_container").toggle(isSet);
        !isSet && $("#task_link").val("");
    }).on("click", '[name="set_keyword"]', function() {
        var isSet = $(this).val() == 1;
        $(".keyword_container").toggle(isSet);
        !isSet && $("#task_keyword").val("");
    }).on("click", '[name="set_iscomment"]', function() {
        var isSet = $(this).val() == 1;
        $(".iscomment_container").toggle(isSet);
        !isSet && $("#task_iscomment").val("");
    });

    return base;
});