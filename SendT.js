// 定义脚本名称
var scriptName = 'SendT';

// 定义脚本版本
var scriptVersion = '1.0.0';

// 定义脚本作者
var scriptAuthor = ['ColdDragon'];

// 引入 LiquidBounce 单纯用于关闭模块
var LiquidBounce = Java.type('net.ccbluex.liquidbounce.LiquidBounce');

// 定义模块的构造函数
function theSendT() {

    // 定义 [ setting ] 对象 用于提供选项
    var setting = {

        // 整数选项 [ string名称 number默认值 number最小值 number最大值 ]
        integer: function (name, def, min, max) {
            return value.createInteger(name, def, min, max);
        },

        // 列表选项 [ string名称 array数组 string默认值 ]
        list: function (name, values, def) {
            return value.createList(name, values, def);
        },

        // 文本选项 [ string名称 string默认值 ]
        text: function (name, def) {
            return value.createText(name, def);
        },
    }

    // 定义 [ settings ] 对象 用于设置选项
    var settings = {

        // 前缀选择
        left: setting.list('left', ['Random', 'None', 'Text'], 'None'),

        // 后缀选择
        right: setting.list('right', ['Random', 'None', 'Text'], 'None'),

        // 自定义前缀文本
        leftText: setting.text('Left Text', '神龙说的'),

        // 自定义后缀文本
        rightText: setting.text('Right Text', '神龙说的'),

        // 发送次数
        spammerCount: setting.integer('Spammer Count', 3, 1, 9),

        // 随机字符串长度
        randomLength: setting.integer('Random Length', 4, 1, 10)
    };

    // 定义模块选项
    this.addValues = function (values) {
        for (var i in settings) {
            values.add(settings[i])
        }
    };

    // 定义模块名称
    this.getName = function () {
        return 'SendT';
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
    this.onEnable = function () {

        // 循环 刷屏次数 次
        for (var index = 1; index <= settings.spammerCount.get(); index++) {

            // 输出文本
            mc.thePlayer.sendChatMessage(getText());
        }
    };

    // 模块更新时调用
    this.onUpdate = function () {

        // 关闭模块
        LiquidBounce.commandManager.executeCommands('.t SendT off')
    };

    // 定义 [ getText ] 用于获取文本
    function getText() {

        // 定义 [ getRandomString ] 用于获取随机字符串
        function getRandomString() {

            // 定义字符串
            var string = '';

            // 循环 随机字符串长度 次
            for (var index = 0; index < settings.randomLength.get(); index++) {

                // 字符串中添加一个随机字符
                string = string + getRandomChat();
            }

            // 返回字符串
            return string;

            // 定义 [ getRandomChat ] 用于获取随机字符
            function getRandomChat() {

                // 定义随机字符范围
                var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

                // 随机获取索引
                var randomIndex = Math.floor(Math.random() * characters.length);

                // 返回字符范围中的随机索引对应的字符
                return characters[randomIndex];
            }
        }

        // 定义 [ thisText ] 用于存储文本内容
        var thisText = 'T';

        // 定义 [ randomLeft ] 用于获取随机前缀
        var randomLeft = '『' + getRandomString() + '』  ';

        // 定义 [ randomRight ] 用于获取随机后缀 
        var randomRight = '  『' + getRandomString() + '』';

        // 定义 [ left ] 并获取left的选项
        var left = settings.left.get();

        // 获取 如果 left是Random就 添加随机前缀 否则 如果 left是Text就 添加特定的前缀 否则不变
        thisText = left === 'Random' ? randomLeft + thisText : left === 'Text' ? settings.leftText.get() + thisText : thisText;

        // 定义 [ right ] 并获取right的选项
        var right = settings.right.get();

        // 获取 如果 right是Random就 添加随机后缀 否则 如果 right是Text就 添加特定的后缀 否则不变
        thisText = right === 'Random' ? thisText + randomRight : right === 'Text' ? thisText + settings.rightText.get() : thisText;

        // 返回文本
        return thisText;
    }
}

// 脚本启用时调用
function onLoad() {

    // 输出一句话表示正常
    chat.print('§9' + 'SendT' + ' §2- §4Load');
}

// 创建模块的实例 [ dragonSendT ]
var dragonSendT = new theSendT();

// 定义 [ dragonSendTClient ] 用于存储注册信息
var dragonSendTClient;

// 脚本运行时调用
function onEnable() {

    // 注册
    dragonSendTClient = moduleManager.registerModule(dragonSendT);
}

// 脚本禁用时调用
function onDisable() {

    // 注销
    moduleManager.unregisterModule(dragonSendTClient);
}