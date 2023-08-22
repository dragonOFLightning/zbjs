// 定义脚本名称
var scriptName = 'RenderGold2D';

// 定义脚本版本
var scriptVersion = '1.1.0';

// 定义脚本作者
var scriptAuthor = ['ColdDragon'];

// 引入聊天数据包 [ S02PacketChat ]
var S02PacketChat = Java.type('net.minecraft.network.play.server.S02PacketChat');

// 定义模块构造函数
function theRenderGold2D() {

    // 定义数组 [ theRenderGoldList2D ] 用于存储渲染数据
    var theRenderGoldList2D = [];

    // 定义构造函数 [ theRenderData2D ] 用于创建渲染数据
    function theRenderData2D(chatText, tick) {
        this.key = chatText;
        this.tick = tick;
    };

    // 定义 [ setting ] 对象 用于提供设置的选项
    var setting = {

        // 浮点数选项 [ 名称 默认值 最小值 最大值 ]
        float: function (name, def, min, max) {
            return value.createFloat(name, def, min, max);
        },

        // 整数选项 [ 名称 默认值 最小值 最大值 ]
        integer: function (name, def, min, max) {
            return value.createInteger(name, def, min, max);
        },

        // 布尔值选项 [ 名称 默认值 ]
        boolean: function (name, def) {
            return value.createBoolean(name, def);
        },

        // 列表选项 [ 名称 数组 默认值 ]
        list: function (name, values, def) {
            return value.createList(name, values, def);
        }
    };

    // 定义 [ settings ] 东西 用于存储设置的选项
    var settings = {

        // 是否拦截关于经济的聊天
        theAntiGold: setting.boolean('AntiGold', true),

        // 调整数据删除的时间 应该没人会想让渲染数据停留一个小时吧
        theTick: setting.integer('tick', 60, 20, 72000),

        // 调整渲染位置 
        theDrawStringX: setting.integer('Render2DX', 500, 0, 900),
        theDrawStringY: setting.integer('Render2DY', 230, 0, 900),

        // 自动删除溢出的数据的阈值 设900也没问题 根本达不到900
        theDeleteDataSetting: setting.integer('deleteLength', 16, 1, 900),
    };

    // 定义模块选项
    this.addValues = function (values) {

        // 把 [ settings ] 的选项添加进去
        for (var i in settings) {
            values.add(settings[i])
        }
    };

    // 定义模块名称
    this.getName = function () {
        return 'RenderGold2D';
    };

    // 定义模块描述
    this.getDescription = function () {
        return 'ColdDragon';
    };

    // 定义模块归类
    this.getCategory = function () {
        return 'Render';
    };

    // 模块更新时调用 1秒更新20次
    this.onUpdate = function () {
        if (theRenderGoldList2D.length > settings.theDeleteDataSetting.get()) {
            theRenderGoldList2D.splice(0, 1);
        }
    };

    // 模块检测到数据包时调用
    this.onPacket = function (event) {

        // 获取数据包
        var thePacket = event.getPacket();

        // 如果数据包类型是 [ S02PacketChat ]
        if (thePacket instanceof S02PacketChat) {

            // 获取聊天文本
            var theUnformattedText = thePacket.getChatComponent().getUnformattedText();

            // 如果聊天文本包含 [ 'Gold' ] 或者 [ '金钱' ]
            if (theUnformattedText.contains('Gold') || theUnformattedText.contains('金钱')) {

                // 如果聊天文本是经济聊天
                if (isGoldChat(theUnformattedText)) {

                    // 创建 [ theRenderData2D ] 的实例传入 [ 聊天文本 ] [ tick ] 存储进 [ theRenderGOldList2D ] 中
                    theRenderGoldList2D.push(new theRenderData2D(theUnformattedText, settings.theTick.get()));

                    // 如果拦截经济聊天启用
                    if (settings.theAntiGold.get()) {

                        // 拦截
                        event.cancelEvent();
                    }
                }
            }
        }
    };

    // 定义 [ isGoldChat ] 用于判断是否为经济聊天
    function isGoldChat(theString) {

        // 获取存在 '+' 的索引
        var index = theString.indexOf('+');

        // 如果索引大于 0 并且 小于 字符串的长度
        if (index >= 0 && theString.length > index + 1) {

            // 获取 '+' 后的字符串数字
            var numberPart = theString.slice(index + 1);

            // 把字符串数字 强制为 数字类型整数的数字
            var parsedNumber = parseInt(numberPart, 10);

            // 如果数字不是NaN
            if (!isNaN(parsedNumber)) {

                // 返回true
                return true;
            }
        }

        // 返回false
        return false;
    };

    // 定义模块渲染2D
    this.onRender2D = function () {

        // 遍历 [ theRenderGoldList2D ] 中的每个 经济数据对象
        for (var index = 0; index < theRenderGoldList2D.length; index++) {

            // 渲染经济数据的 [ key ] 
            mc.fontRendererObj.drawString(theRenderGoldList2D[index].key, settings.theDrawStringX.get(), settings.theDrawStringY.get() + 9 * index, 0x8B0000);

            // 经济数据中的 [ tick ] 自减
            theRenderGoldList2D[index].tick--;

            // 如果经济数据中的 [ tick ] 小于等于 [ 0 ]
            if (theRenderGoldList2D[index].tick <= 0) {

                // 删除数据
                theRenderGoldList2D.splice(index, 1);
            }
        }
    }
}

// 脚本启用时调用
function onLoad() {

    // 输出一句话表示正常
    chat.print('§9' + 'RenderGold2D' + ' §2- §4Load');
}

// 创建模块的实例 [ dragonRenderGold2D ]
var dragonRenderGold2D = new theRenderGold2D();

// 定义 [ dragonRenderGold2DClient ] 用于存储注册信息
var dragonRenderGold2DClient;

// 脚本运行时调用
function onEnable() {

    // 注册
    dragonRenderGold2DClient = moduleManager.registerModule(dragonRenderGold2D);
}

// 脚本禁用时调用
function onDisable() {

    // 注销
    moduleManager.unregisterModule(dragonRenderGold2DClient);
}