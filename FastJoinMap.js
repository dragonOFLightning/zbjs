// 定义脚本名称
var scriptName = 'FastJoinMap';

// 定义脚本版本
var scriptVersion = '1.0.0';

// 定义脚本作者
var scriptAuthor = ['ColdDragon'];

// 引入 [ LiquidBounce ] 仅用于关闭模块
var LiquidBounce = Java.type('net.ccbluex.liquidbounce.LiquidBounce');

// 定义模块的构造函数
function theFastJoinMap() {

    // 定义 [ setting ] 对象 用于提供选项
    var setting = {

        // 列表选项 [ string名称 array数组 string默认值 ]
        list: function (name, values, def) {
            return value.createList(name, values, def);
        },
    }

    // 定义 [ settings ] 对象 用于设置选项
    var settings = {
        theMap: setting.list('Map', ['DeadEnd', 'BadBlood', 'AlienArcadium'])
    };

    // 定义模块选项
    this.addValues = function (values) {
        for (var i in settings) {
            values.add(settings[i])
        }
    };

    // 定义模块名称
    this.getName = function () {
        return 'FastJoinMap';
    };

    // 定义模块描述
    this.getDescription = function () {
        return 'ColdDragon';
    };

    // 定义模块归类
    this.getCategory = function () {
        return 'Fun';
    };

    // 模块启用时调用
    this.onEnable = function () {
        switch (settings.theMap.get()) {
            case 'DeadEnd':
                mc.thePlayer.sendChatMessage('/play arcade_zombies_dead_end');
                break;
            case 'BadBlood':
                mc.thePlayer.sendChatMessage('/play arcade_zombies_bad_blood');
                break;
            case 'AlienArcadium':
                mc.thePlayer.sendChatMessage('/play arcade_zombies_alien_arcadium');
                break;
        }
    };

    // 模块更新时调用
    this.onUpdate = function () {
        LiquidBounce.commandManager.executeCommands('.t FastJoinMap off')
    };
}

// 脚本启用时调用
function onLoad() {

    // 输出一句话表示正常
    chat.print('§9' + 'FastJoinMap' + ' §2- §4Load');
}

// 创建模块的实例 [ dragonFastJoinMap ]
var dragonFastJoinMap = new theFastJoinMap();

// 定义 [ dragonFastJoinMapClient ] 用于存储注册信息
var dragonFastJoinMapClient;

// 脚本运行时调用
function onEnable() {

    // 注册
    dragonFastJoinMapClient = moduleManager.registerModule(dragonFastJoinMap);
}

// 脚本禁用时调用
function onDisable() {

    // 注销
    moduleManager.unregisterModule(dragonFastJoinMapClient);
}