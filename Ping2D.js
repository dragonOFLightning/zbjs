// 定义脚本名称
var scriptName = 'Ping2D';

// 定义脚本版本
var scriptVersion = '1.0.0';

// 定义脚本作者
var scriptAuthor = ['ColdDragon'];

// 定义模块的构造函数
function thePing2D() {

    // 定义模块名称
    this.getName = function () {
        return 'Ping2D';
    };

    // 定义模块描述
    this.getDescription = function () {
        return 'ColdDragon';
    };

    // 定义模块归类
    this.getCategory = function () {
        return 'Render';
    };

    // 定义模块渲染2D
    this.onRender2D = function () {

        // 获取 网络处理器 的 自己UID玩家信息 的 响应时间 的 强制字符串
        var ping = mc.getNetHandler().getPlayerInfo(mc.thePlayer.getUniqueID()).getResponseTime().toString();

        // 渲染延迟
        mc.fontRendererObj.drawString('ping ' + ping, 0, 250, 0xFFFFFF);
    };
}

// 脚本启用时调用
function onLoad() {

    // 输出一句话表示正常
    chat.print('§9' + 'Ping2D' + ' §2- §4Load');
}

// 创建模块的实例 [ dragonPing2D ]
var dragonPing2D = new thePing2D();

// 定义 [ dragonPing2DClient ] 用于存储注册信息
var dragonPing2DClient;

// 脚本运行时调用
function onEnable() {

    // 注册
    dragonPing2DClient = moduleManager.registerModule(dragonPing2D);
}

// 脚本禁用时调用
function onDisable() {

    // 注销
    moduleManager.unregisterModule(dragonPing2DClient);
}