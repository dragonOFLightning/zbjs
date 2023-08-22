// 定义脚本名称
var scriptName = 'Ski';

// 定义脚本版本
var scriptVersion = '1.0.0';

// 定义脚本作者
var scriptAuthor = ['ColdDragon'];

// 定义模块的构造函数
function theSki() {

    // 定义 [ setting ] 对象 用于提供选项
    var setting = {

        // 列表选项 [ string名称 array数组 string默认值 ]
        list: function (name, values, def) {
            return value.createList(name, values, def);
        },
    }

    // 定义 [ settings ] 对象 用于设置选项
    var settings = {
        thePath: setting.list('SkiPath', ['square', 'around', 'cross', 'slow'], 'around'),
    };

    // 定义模块选项
    this.addValues = function (values) {
        for (var i in settings) {
            values.add(settings[i])
        }
    };

    // 定义模块名称
    this.getName = function () {
        return 'Ski';
    };

    // 定义模块描述
    this.getDescription = function () {
        return 'ColdDragon';
    };

    // 定义模块归类
    this.getCategory = function () {
        return 'Player';
    };

    // 模块启用时调用
    this.onEnable = function () { };

    var tick = 0;
    // 模块更新时调用
    this.onUpdate = function () {
        // chat.print(1)
        switch (settings.thePath.get()) {
            case 'slow':
                slow();
                break;
            case 'around':
                around();
                break;
            case 'square':
                square();
                break;
            case 'cross':
                cross();
                break;
        }
        // chat.print(tick);
    };
    function square() { // 正方形
        if (tick < 20) { // ↑
            mc.gameSettings.keyBindForward.pressed = true;
            tick++;
        } else if (tick < 40) { // →
            mc.gameSettings.keyBindForward.pressed = false;
            mc.gameSettings.keyBindRight.pressed = true;
            tick++;
        } else if (tick < 60) { // ↓
            mc.gameSettings.keyBindRight.pressed = false;
            mc.gameSettings.keyBindBack.pressed = true;
            tick++;
        } else if (tick < 80) { // ←
            mc.gameSettings.keyBindBack.pressed = false;
            mc.gameSettings.keyBindLeft.pressed = true;
            tick++;
        } else {
            mc.gameSettings.keyBindLeft.pressed = false;
            tick = 0
        }
    }
    function cross() { // 十字
        if (tick < 20) { // ↑
            mc.gameSettings.keyBindForward.pressed = true;
            tick++;
        } else if (tick < 60) { // ↓↓
            mc.gameSettings.keyBindForward.pressed = false;
            mc.gameSettings.keyBindBack.pressed = true;
            tick++;
        } else if (tick < 80) { // ↑
            mc.gameSettings.keyBindBack.pressed = false;
            mc.gameSettings.keyBindForward.pressed = true;
            tick++;
        } else if (tick < 100) { // ←
            mc.gameSettings.keyBindForward.pressed = false;
            mc.gameSettings.keyBindLeft.pressed = true;
            tick++;
        } else if (tick < 140) { // →→
            mc.gameSettings.keyBindLeft.pressed = false;
            mc.gameSettings.keyBindRight.pressed = true;
            tick++;
        } else if (tick < 160) { // ←
            mc.gameSettings.keyBindRight.pressed = false;
            mc.gameSettings.keyBindLeft.pressed = true;
            tick++;
        } else {
            mc.gameSettings.keyBindLeft.pressed = false;
            tick = 0
        }
    }
    function around() { // 前后
        if (tick < 20) { // ↑
            mc.gameSettings.keyBindForward.pressed = true;
            tick++;
        } else if (tick < 40) { // ↓
            mc.gameSettings.keyBindForward.pressed = false;
            mc.gameSettings.keyBindBack.pressed = true;
            tick++;
        } else {
            mc.gameSettings.keyBindBack.pressed = false;
            tick = 0
        }
    }
    function slow() { // 缓慢
        if (tick < 2000) {
            tick++;
        } else if (tick >= 2000 && tick < 2020) { // ↑
            mc.gameSettings.keyBindForward.pressed = true;
            tick++;
        } else if (tick >= 2020 && tick < 2040) { // ↓
            mc.gameSettings.keyBindForward.pressed = false;
            mc.gameSettings.keyBindBack.pressed = true;
            tick++;
        } else if (tick >= 2040) {
            mc.gameSettings.keyBindBack.pressed = false;
            tick = 0;
        }
    }
    // 模块禁用时调用
    this.onDisable = function () { };
}

// 脚本启用时调用
function onLoad() {

    // 输出一句话表示正常
    chat.print('§9' + 'Ski' + ' §2- §4Load');
}

// 创建模块的实例 [ dragonSki ]
var dragonSki = new theSki();

// 定义 [ dragonSkiClient ] 用于存储注册信息
var dragonSkiClient;

// 脚本运行时调用
function onEnable() {

    // 注册
    dragonSkiClient = moduleManager.registerModule(dragonSki);
}

// 脚本禁用时调用
function onDisable() {

    // 注销
    moduleManager.unregisterModule(dragonSkiClient);
}