layui.define(['config', 'layer'], function (exports) {
    var config = layui.config;
    var layer = layui.layer;
    var popupRightIndex, popupCenterIndex, popupCenterParam;

    var admin = {
        isRefresh: false,
        //Set the sidebar collapse 设置侧栏折叠
        flexible: function (expand) {
            var isExapnd = $('.layui-layout-admin').hasClass('admin-nav-mini');
            if (isExapnd == !expand) {
                return;
            }
            if (expand) {
                $('.layui-layout-admin').removeClass('admin-nav-mini');
            } else {
                $('.layui-layout-admin').addClass('admin-nav-mini');
            }
            admin.onResize();
        },
        //Set the navigation bar selected 设置导航栏选中
        activeNav: function (url) {
            $('.layui-layout-admin .layui-side .layui-nav .layui-nav-item .layui-nav-child dd').removeClass('layui-this');
            $('.layui-layout-admin .layui-side .layui-nav .layui-nav-item').removeClass('layui-this');
            if (url && url != '') {
                $('.layui-layout-admin .layui-side .layui-nav .layui-nav-item').removeClass('layui-nav-itemed');
                var $a = $('.layui-layout-admin .layui-side .layui-nav>.layui-nav-item>.layui-nav-child>dd>a[href="#!' + url + '"]');
                $a.parent('dd').addClass('layui-this');
                $a.parent('li').addClass('layui-this');
                $a.parent('dd').parent('.layui-nav-child').parent('.layui-nav-item').addClass('layui-nav-itemed');
            }
        },
        //Pop up on the right 右侧弹出
        popupRight: function (path) {
            var param = new Object();
            param.path = path;
            param.id = 'adminPopupR';
            param.title = false;
            param.anim = 2;
            param.isOutAnim = false;
            param.closeBtn = false;
            param.offset = 'r';
            param.shadeClose = true;
            param.area = '336px';
            param.skin = 'layui-layer-adminRight';
            param.end = function () {
                layer.closeAll('tips');
            };
            popupRightIndex = admin.open(param);
            return popupRightIndex;
        },
        //Close the right pop-up 关闭右侧弹出
        closePopupRight: function () {
            layer.close(popupRightIndex);
        },
        //Pop up in the middle 中间弹出
        popupCenter: function (param) {
            param.id = 'adminPopupC';
            popupCenterParam = param;
            popupCenterIndex = admin.open(param);
            return popupCenterIndex;
        },
        //Close the middle pop-up and trigger the finish callback 关闭中间弹出并且触发finish回调
        finishPopupCenter: function () {
            layer.close(popupCenterIndex);
            popupCenterParam.finish ? popupCenterParam.finish() : '';
        },
        //Close the middle eject 关闭中间弹出
        closePopupCenter: function () {
            layer.close(popupCenterIndex);
        },
        //Encapsulate layer.open 封装layer.open
        open: function (param) {
            var sCallBack = param.success;
            param.type = 1;
            param.area = param.area ? param.area : '450px';
            param.offset = param.offset ? param.offset : '120px';
            param.resize ? param.resize : false;
            param.shade ? param.shade : .2;
            param.success = function (layero, index) {
                sCallBack ? sCallBack(layero, index) : '';
                $(layero).children('.layui-layer-content').load(param.path);
            };
            return layer.open(param);
        },
        //Encapsulate the AJAX request with the return data type JSON 封装ajax请求，返回数据类型为json
        req: function (url, data, success, method) {
            if ('put' == method.toLowerCase()) {
                method = 'POST';
                data._method = 'PUT';
            } else if ('delete' == method.toLowerCase()) {
                method = 'POST';
                data._method = 'DELETE';
            }
            var token = config.getToken();
            if (token) {
                data.access_token = token.access_token;
            }
            admin.ajax({
                url: config.base_server + url,
                data: data,
                type: method,
                dataType: 'json',
                success: success,
                xhrFields: {
                    withCredentials: true
                },
                beforeSend: function (xhr) {
                    var token = config.getToken();
                    if (token) {
                        xhr.setRequestHeader('Authorization', 'Basic ' + token.access_token);
                    }
                }
            });
        },
        //Encapsulate the AJAX request 封装ajax请求
        ajax: function (param) {
            var successCallback = param.success;
            param.withCredentials = true;
            param.success = function (result, status, xhr) {
                //Determines that the login is expired and there are no permissions 判断登录过期和没有权限
                var jsonRs;
                if ('json' == param.dataType.toLowerCase()) {
                    jsonRs = result;
                } else if ('html' == param.dataType.toLowerCase() || 'text' == param.dataType.toLowerCase()) {
                    jsonRs = admin.parseJSON(result);
                }
                if (jsonRs) {
                    if (jsonRs.code == 401) {
                        config.removeToken();
                        layer.msg('Login expires', { icon: 2, time: 1500 }, function () {
                            location.replace('/login.html');
                        }, 1000);
                        return;
                    } else if (jsonRs.code == 403) {
                        layer.msg('No permissions', { icon: 2 });
                        return;
                    }
                }
                successCallback(result, status, xhr);
            };
            param.error = function (xhr) {
                param.success({ code: xhr.status, msg: xhr.statusText });
            };
            $.ajax(param);
        },
        //Custom AJAX methods 自定义ajax方法
        myAjax: function ({ url, data = {}, success, method = "GET" }) {
            var param = {
                url: config.base_server + url,
                data: data,
                type: method,
                dataType: 'json',
                xhrFields: {
                    withCredentials: true
                },
                success: success
            };
            var successCallback = param.success;
            param.success = function (result, status, xhr) {
                successCallback(result, status, xhr);
            };
            param.error = function (xhr) {
                param.success({ code: xhr.status, msg: xhr.statusText });
            };
            $.ajax(param);
        },
        //Determine whether you have permissions 判断是否有权限
        hasPerm: function (auth) {
            var user = config.getUser();
            if (user.authorities) {
                for (var i = 0; i < user.authorities.length; i++) {
                    if (auth == user.authorities[i].authority) {
                        return true;
                    }
                }
            }
            return false;
        },
        //Window size changes to listen to the listening 窗口大小改变监听
        onResize: function () {
            if (config.autoRender) {
                if ($('.layui-table-view').length > 0) {
                    setTimeout(function () {
                        admin.events.refresh();
                    }, 800);
                }
            }
        },
        //Displays the loading animation 显示加载动画
        showLoading: function (element) {
            $(element).append('<i class="layui-icon layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop admin-loading"></i>');
        },
        //Remove the loading animation 移除加载动画
        removeLoading: function (element) {
            $(element + '>.admin-loading').remove();
        },
        //Cache temporary data 缓存临时数据
        putTempData: function (key, value) {
            if (value) {
                layui.sessionData('tempData', { key: key, value: value });
            } else {
                layui.sessionData('tempData', { key: key, remove: true });
            }
        },
        //Gets cached temporary data 获取缓存临时数据
        getTempData: function (key) {
            return layui.sessionData('tempData')[key];
        },
        //Slide the tab 滑动选项卡
        rollPage: function (d) {
            var $tabTitle = $('.layui-layout-admin .layui-body .layui-tab .layui-tab-title');
            var left = $tabTitle.scrollLeft();
            if ('left' === d) {
                $tabTitle.scrollLeft(left - 120);
            } else if ('auto' === d) {
                var autoLeft = 0;
                $tabTitle.children("li").each(function () {
                    if ($(this).hasClass('layui-this')) {
                        return false;
                    } else {
                        autoLeft += $(this).outerWidth();
                    }
                });
                // console.log(autoLeft);
                $tabTitle.scrollLeft(autoLeft - 47);
            } else {
                $tabTitle.scrollLeft(left + 120);
            }
        },
        refresh: function () {
            admin.isRefresh = true;
            Q.refresh();
        },
        //Determine whether it is JSON or not 判断是否为json
        parseJSON: function (str) {
            if (typeof str == 'string') {
                try {
                    var obj = JSON.parse(str);
                    if (typeof obj == 'object' && obj) {
                        return obj;
                    }
                } catch (e) {
                }
            }
        }
    };

    //Events provided by ewAdmin ewAdmin提供的事件
    admin.events = {
        flexible: function (e) {  //Collapse side navigation 折叠侧导航
            var expand = $('.layui-layout-admin').hasClass('admin-nav-mini');
            admin.flexible(expand);
        },
        refresh: function () {  //Refresh the main part 刷新主体部分
            admin.refresh();
        },
        back: function () {  //Back off 后退
            history.back();
        },
        theme: function () {  //Set the theme 设置主题
            admin.popupRight('components/tpl/theme.html');
        },
        fullScreen: function (e) {  //Full screen 全屏
            var ac = 'layui-icon-screen-full', ic = 'layui-icon-screen-restore';
            var ti = $(this).find('i');

            var isFullscreen = document.fullscreenElement || document.msFullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || false;
            if (isFullscreen) {
                var efs = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
                if (efs) {
                    efs.call(document);
                } else if (window.ActiveXObject) {
                    var ws = new ActiveXObject('WScript.Shell');
                    ws && ws.SendKeys('{F11}');
                }
                ti.addClass(ac).removeClass(ic);
            } else {
                var el = document.documentElement;
                var rfs = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
                if (rfs) {
                    rfs.call(el);
                } else if (window.ActiveXObject) {
                    var ws = new ActiveXObject('WScript.Shell');
                    ws && ws.SendKeys('{F11}');
                }
                ti.addClass(ic).removeClass(ac);
            }
        },
        //Swipe left on the tab 左滑动tab
        leftPage: function () {
            admin.rollPage("left");
        },
        //Swipe right on the tab 右滑动tab
        rightPage: function () {
            admin.rollPage();
        },
        //Close the current tab 关闭当前选项卡
        closeThisTabs: function () {
            var $title = $('.layui-layout-admin .layui-body .layui-tab .layui-tab-title');
            if ($title.find('li').first().hasClass('layui-this')) {
                return;
            }
            $title.find('li.layui-this').find(".layui-tab-close").trigger("click");
        },
        //Close the other tabs 关闭其他选项卡
        closeOtherTabs: function () {
            $('.layui-layout-admin .layui-body .layui-tab .layui-tab-title li:gt(0):not(.layui-this)').find(".layui-tab-close").trigger("click");
        },
        //Close all tabs 关闭所有选项卡
        closeAllTabs: function () {
            $('.layui-layout-admin .layui-body .layui-tab .layui-tab-title li:gt(0)').find(".layui-tab-close").trigger("click");
        },
        //Close all pop-up windows 关闭所有弹窗
        closeDialog: function () {
            layer.closeAll('page');
        }
    };

    //All ew-events 所有ew-event
    $('body').on('click', '*[ew-event]', function () {
        var event = $(this).attr('ew-event');
        var te = admin.events[event];
        te && te.call(this, $(this));
    });

    //The side navigation is folded and the mouse passes through the display prompt 侧导航折叠状态下鼠标经过显示提示
    $('body').on('mouseenter', '.layui-layout-admin.admin-nav-mini .layui-side .layui-nav .layui-nav-item>a', function () {
        var tipText = $(this).find('cite').text();
        if (document.body.clientWidth > 750) {
            layer.tips(tipText, this);
        }
    }).on('mouseleave', '.layui-layout-admin.admin-nav-mini .layui-side .layui-nav .layui-nav-item>a', function () {
        layer.closeAll('tips');
    });

    //Click Expand in the collapsed side navigation state 侧导航折叠状态下点击展开
    $('body').on('click', '.layui-layout-admin.admin-nav-mini .layui-side .layui-nav .layui-nav-item>a', function () {
        if (document.body.clientWidth > 750) {
            layer.closeAll('tips');
            admin.flexible(true);
        }
    });

    //All lay-tips processing 所有lay-tips处理
    $('body').on('mouseenter', '*[lay-tips]', function () {
        var tipText = $(this).attr('lay-tips');
        var dt = $(this).attr('lay-direction');
        layer.tips(tipText, this, { tips: dt || 1, time: -1 });
    }).on('mouseleave', '*[lay-tips]', function () {
        layer.closeAll('tips');
    });

    exports('admin', admin);
});
