layui.define(function (exports) {

    var config = {
        base_server: '/admin/', //Interface address 接口地址
        tableName: 'easyweb',  //Stores the table name 存储表名
        autoRender: false,  //Whether to automatically re-render the table after the window size changes 窗口大小改变后是否自动重新渲染表格
        pageTabs: true,   //Whether to enable multi-tab 是否开启多标签
        //Get the cached token 获取缓存的token
        getToken: function () {
            var t = layui.data(config.tableName).token;
            if (t) {
                return JSON.parse(t);
            }
        },
        //Clear user 清除user
        removeToken: function () {
            layui.data(config.tableName, {
                key: 'token',
                remove: true
            });
        },
        //Caching tokens 缓存token
        putToken: function (token) {
            layui.data(config.tableName, {
                key: 'token',
                value: JSON.stringify(token)
            });
        },
        //The navigation menu supports up to three levels, because there is also judgment permission, so rendering the left menu is complicated and cannot be recursive 导航菜单，最多支持三级，因为还有判断权限，所以渲染左侧菜单很复杂，无法做到递归
        menus: [
            {
                name: 'homepage',
                icon: 'layui-icon-home',
                url: '#!console',
                path: "../components/console.html",
                hiden: true
            },
            {
                name: 'user management',
                icon: 'layui-icon-username',
                url: '#!userTable',
                path: '../components/system/userTable.html'
            },
            {
                name: 'Administrator management',
                icon: 'layui-icon-friends',
                url: '#!adminTable',
                path: '../components/system/adminTable.html'
            },
            {
                name: 'Home page carousel',
                icon: 'layui-icon-picture',
                url: '#!swiperTable',
                path: '../components/system/swiperTable.html'
            },
            {
                icon: 'layui-icon-star',
                name: 'goods management',
                url: '#!goodsTable',
                path: '../components/system/goodsTable.html'
            },
            {
                icon: 'layui-icon-release',
                name: 'Order management',
                url: '#!orderTable',
                path: '../components/system/orderTable.html'
            }
        ],
        //The currently logged-on user 当前登录的用户
        getUser: function () {
            var u = layui.data(config.tableName).login_user;
            if (u) {
                return JSON.parse(u);
            }
        },
        //Cache user 缓存user
        putUser: function (user) {
            layui.data(config.tableName, {
                key: 'login_user',
                value: JSON.stringify(user)
            });
        }
    };
    exports('config', config);
});
