// 定义脚本名称
var scriptName = 'EventInfo';

// 定义脚本版本
var scriptVersion = '1.0.0';

// 定义脚本作者
var scriptAuthor = ['ColdDragon'];

// 引入网络聊天数据包 [ S02PacketChat ]
var S02PacketChat = Java.type('net.minecraft.network.play.server.S02PacketChat');

// 引入动画数据包 [ S0BPacketAnimation ]
var S0BPacketAnimation = Java.type('net.minecraft.network.play.server.S0BPacketAnimation');

// 定义模块的构造函数
function TheEventInfo() {

    // 定义 [ setting ] 对象 用于提供选项 Object
    var setting = {

        // 整数选项 [ string名称 number默认值 number最小值 number最大值 ]
        integer: function (name, def, min, max) {
            return value.createInteger(name, def, min, max);
        },

        // 布尔值选项 [ string名称 boolean默认值 ]
        boolean: function (name, def) {
            return value.createBoolean(name, def);
        }
    }

    // 定义 [ settings ] 对象 用于设置选项 Object
    var settings = {

        // 是否渲染经济
        renderGame: setting.boolean('Game', true),

        // 是否渲染大厅事件
        renderLobby: setting.boolean('Lobby', true),

        // 是否渲染玩家聊天事件
        renderPlayer: setting.boolean('Player', true),

        // 是否渲染刀械暴击事件
        criticalEvent: setting.boolean('Critical', true),

        // 设定渲染列表的阈值
        listLength: setting.integer('ListLength', 16, 1, 64),

        // 设定渲染文本停留的时间
        renderTime: setting.integer('RenderTime', 120, 1, 72000),

        // 设定渲染位置 
        theDrawStringX: setting.integer('Render2DX', 500, 0, 900),
        theDrawStringY: setting.integer('Render2DY', 230, 0, 900),
    };

    // 定义模块选项
    this.addValues = function (values) {
        for (var i in settings) {
            values.add(settings[i])
        }
    };

    // 定义模块名称
    this.getName = function () {
        return 'EventInfo'
    };

    // 定义模块描述
    this.getDescription = function () {
        return 'ColdDragon'
    };

    // 定义模块归类
    this.getCategory = function () {
        return 'Render'
    };

    // 定义 [ renderDataList ] 用于存储渲染数据的列表 Array<RenderData>
    var renderDataList = [];

    // 模块更新时调用
    this.onUpdate = function () {

        // 如果渲染列表的长度大于设定的阈值
        if (renderDataList.length > settings.listLength.get()) {

            // 删除索引0的元素
            renderDataList.splice(0, 1)
        }

    };

    // 定义全局变量 [lastChatText] 用于存储上一个文本 @java.lang.string
    var lastChatText;

    // 模块检测到数据包时调用
    this.onPacket = function (event) {

        // 获取包 any
        var thePacket = event.getPacket();

        // 如果包的类型是 [ S02PacketChat ]
        if (thePacket instanceof S02PacketChat) {

            // 定义 [chatText] 用于存储文本 @any
            var chatText;

            // 如果聊天类型不是 2
            if (thePacket.getType() !== 2) {

                // 获取聊天文本 @java.lang.String
                chatText = thePacket.getChatComponent().getUnformattedText();
            }

            // 检测文本包含关键词 或者与上一个重复 因为函数只有return 所以不能在函数中判断
            if (isRenderChat(chatText) || chatText === lastChatText && settings.renderPlayer.get()) {

                // 将文本添加至渲染队列
                renderDataList.push(new RenderData(chatText, settings.renderTime.get()));

                // 拦截聊天
                event.cancelEvent();
            };

            // 否则 如果检测到 [ S0BPacketAnimation ] 并且动画类型为 [ 4 ]
        } else if (thePacket instanceof S0BPacketAnimation && thePacket.getAnimationType() == 4) {

            // 将 [ '§d检测到一次近战暴击' ] 条件至渲染队列
            renderDataList.push(new RenderData('§d检测到一次近战暴击', settings.renderTime.get()));
        }
    };

    // 定义 [ isRenderChat ] 用于判断是否符合渲染条件 Boolean
    function isRenderChat(string) {

        // 此逻辑过于简单 懒得注释 仅需注意 string是一个 java.lang.String 类型
        return string.contains('Gold') && settings.renderGame.get() && isGoldChat(string) ||
            string.contains('金钱') && settings.renderGame.get() && isGoldChat(string) ||
            string.contains('joined the lobby!') && settings.renderLobby.get() ||
            string.contains('CLICK HERE to join!') && settings.renderLobby.get() ||
            string.contains('进入了大厅！') && settings.renderLobby.get() ||
            string.contains('即将于30秒后开始！ 点击这里加入！') && settings.renderLobby.get() ||
            string.contains('找到了一个✰✰✰✰✰Mystery Box！') && settings.renderLobby.get() ||
            string.contains('Mystery Box!') && settings.renderLobby.get() ||
            string.contains('You must wait another') && settings.renderLobby.get() ||
            string.contains('在使用这个之前，你需要等待') && settings.renderLobby.get() ||
            string.contains('嘻哈') && settings.renderPlayer.get() ||
            string.contains('喜哈') && settings.renderPlayer.get();
    };

    // 定义 [ isGoldChat ] 用于判断是否为经济聊天 Boolean
    function isGoldChat(theString) {

        // 获取存在 '+' 的索引 integer
        var index = theString.indexOf('+');

        // 如果索引大于 0 并且索引 小于 字符串的长度
        if (index >= 0 && theString.length > index + 1) {

            // 获取 '+' 后的字符串数字 String
            var numberPart = theString.slice(index + 1);

            // 把字符串数字 强制为 数字类型整数的数字 integer
            var parsedNumber = parseInt(numberPart, 10);

            // 返回判断数字是不是 NaN
            return !isNaN(parsedNumber);
        }

        // 返回false
        return false;
    };

    // 定义模块渲染2D
    this.onRender2D = function () {

        // 遍历 [ renderDataList ] 中的每个 经济数据对象
        for (var index = 0; index < renderDataList.length; index++) {

            // 渲染经济数据的 [ string ] 
            mc.fontRendererObj.drawString(renderDataList[index].string, settings.theDrawStringX.get(), settings.theDrawStringY.get() + 9 * index, 0xffffff);

            // 经济数据中的 [ tick ] 自减
            renderDataList[index].tick--;

            // 如果经济数据中的 [ tick ] 小于等于 [ 0 ]
            if (renderDataList[index].tick <= 0) {

                // 删除数据
                renderDataList.splice(index, 1);
            }
        }
    };

    // 定义渲染数据的构造函数
    function RenderData(text, time) {

        // [ string ] 用于存储渲染文本
        this.string = text;

        // [ tick ] 用于计数渲染的时长
        this.tick = time;
    }
}

// 脚本启用时调用
function onLoad() {

    // 输出一句话表示已加载
    chat.print('§9' + 'EventInfo' + ' §2- §4Load');
}

// 创建模块的实例
var dragonEventInfo = new TheEventInfo();

// 定义 [ dragonEventInfoClient ] 用于存储注册信息
var dragonEventInfoClient;

// 脚本运行时调用
function onEnable() {

    // 注册
    dragonEventInfoClient = moduleManager.registerModule(dragonEventInfo);
}

// 脚本禁用时调用
function onDisable() {

    // 注销
    moduleManager.unregisterModule(dragonEventInfoClient);
}