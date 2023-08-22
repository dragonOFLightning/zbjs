/* 重写了低血量显示 支持双通道 */

// 定义脚本名称
var scriptName = 'LowHPTis';

// 定义脚本版本
var scriptVersion = '1.0.0';

// 定义脚本作者
var scriptAuthor = ['ColdDragon'];

// 定义模块的构造函数
function TheLowHPTis() {

    // 定义 [ setting ] 对象 用于提供选项
    var setting = {

        // 浮点数选项 [ string名称名称 number默认值 number最小值 number最大值 ]
        float: function (name, def, min, max) {
            return value.createFloat(name, def, min, max);
        },

        // 布尔值选项 [ string名称 boolean默认值 ]
        boolean: function (name, def) {
            return value.createBoolean(name, def);
        },
    }

    // 定义 [ settings ] 对象 用于设置选项
    var settings = {

        // 发送安全警告聊天
        sendWarnChat: setting.boolean('WarnChat', true),

        // 聊天显示安全警告
        sendSelfWarn: setting.boolean('SelfWarn', true),

        // 发送安全警告的阈值
        warnHealth: setting.float('Warn HP', 15, 10, 30),

        // 发送危险警告聊天
        sendDangerChat: setting.boolean('DangerChat', true),

        // 聊天显示危险警告
        sendSelfDanger: setting.boolean('SelfDanger', true),

        // 发送危险警告的阈值
        dangerHealth: setting.float('Danger HP', 7, 0.1, 10),
    };

    // 定义模块选项
    this.addValues = function (values) {
        for (var i in settings) {
            values.add(settings[i])
        }
    };

    // 定义模块名称
    this.getName = function () {
        return 'LowHPTis';
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

    // 定义 [ isSendWarn ] 判断有没有发送过安全警告
    isSendWarn = false;

    // 定义 [ isSendDanger ] 判断有没有发送过危险警告
    isSendDanger = false;

    // 模块更新时调用
    this.onUpdate = function () {

        // 获取血量
        var health = mc.thePlayer.getHealth();

        // 如果血量低于危险阈值并且没发送过危险警告
        if (!isSendDanger && health < settings.dangerHealth.get()) {

            // 如果启用了发送聊天 就发送一个字符串表示危险
            settings.sendDangerChat.get() ? mc.thePlayer.sendChatMessage('Ｄａｎｇｅｒ ! Health < ' + settings.dangerHealth.get()) : null;

            // 如果启用了输出聊天 就输出一个字符串表示危险
            settings.sendSelfDanger.get() ? chat.print('§4Ｄａｎｇｅｒ! Health < ' + settings.dangerHealth.get()) : null;

            // 表示已发送
            isSendDanger = true;
        } else
            // 复杂 如果血量低于警告阈值并且没发送过安全警告
            if (!isSendWarn && health < settings.warnHealth.get()) {

                // 如果启用了发送聊天 就发送一个字符串表示警告
                settings.sendWarnChat.get() ? mc.thePlayer.sendChatMessage('Ｗａｒｎ! Health < ' + settings.warnHealth.get()) : null;

                // 如果启用了输出聊天 就输出一个字符串表示警告
                settings.sendSelfWarn.get() ? chat.print('§5Ｗａｒｎ Health < ' + settings.warnHealth.get()) : null;

                // 表示已发送
                isSendWarn = true;
            } else {

                // 定义 [ noWarn ] 判断有没有发生过安全警告并且血量大于安全警告的阈值
                var noWarn = isSendWarn && health > settings.warnHealth.get();

                // 如果发过了危险警告并且血量超过危险的阈值 重置 isSendDanger 否则 如果 [ noWarn ] 重置isSendWarn
                isSendDanger && health > settings.dangerHealth.get() ? isSendDanger = false : noWarn ? isSendWarn = false : null;
            }
    };
}

// 脚本启用时调用
function onLoad() {

    // 输出一句话表示正常
    chat.print('§9' + 'LowHPTis' + ' §2- §4Load');
}

// 创建模块的实例 [ dragonLowHPTis ]
var dragonLowHPTis = new TheLowHPTis();

// 定义 [ dragonLowHPTisClient ] 用于存储注册信息
var dragonLowHPTisClient;

// 脚本运行时调用
function onEnable() {

    // 注册
    dragonLowHPTisClient = moduleManager.registerModule(dragonLowHPTis);
}

// 脚本禁用时调用
function onDisable() {

    // 注销
    moduleManager.unregisterModule(dragonLowHPTisClient);
}