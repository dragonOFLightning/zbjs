/*
    此脚本可以在你游戏卡顿时发送 Lag 提醒队友
*/

// 定义脚本名称
var scriptName = 'AutoSendLag';

// 定义脚本版本
var scriptVersion = '1.0.0';

// 定义脚本作者
var scriptAuthor = ['ColdDragon'];

// 引入时间时间更新数据包 [ S03PacketTimeUpdate ]
var S03PacketTimeUpdate = Java.type('net.minecraft.network.play.server.S03PacketTimeUpdate')

// 定义模块构造函数
function theAutoSendLag() {

    // 定义模块名称
    this.getName = function () {
        return 'AutoSendLag';
    }

    // 定义模块描述
    this.getDescription = function () {
        return 'ColdDragon';
    }

    // 定义模块分类
    this.getCategory = function () {
        return 'Player';
    }

    // 定义 [ sendChat ] 用于判断是否允许发送聊天
    var sendChat = false;

    // 模块更新
    this.onUpdate = function () {

        // 如果tick小于0 并且允许 sendChat
        if (tick < 0 && sendChat) {

            // 发送聊天
            mc.thePlayer.sendChatMessage('Lag');

            // 禁止 sendChat 防止刷屏
            sendChat = false;
        }

        // tick 自减
        tick--;
    }

    // 定义 tick 用于计时
    var tick = 2;

    // 模块监听数据包事件
    this.onPacket = function (event) {

        // 获取数据包
        var packet = event.getPacket();

        // 如果数据包的类型是 [ S03PacketTimeUpdate ]
        if (packet instanceof S03PacketTimeUpdate) {

            // 重置 tick
            tick = 41;

            // 重置 sendChat
            sendChat = true;
        }
    }
}

// 脚本加载时调用
function onLoad() {
    // 发送一句话表示脚本已加载
    chat.print('§9' + 'AutoSendLag' + ' §2- §4Load');
}

// 创建 [ theAutoSendLag ] 的实例
var dragonAutoSendLag = new theAutoSendLag();

// 定义 [ dragonAutoSendLagClient ] 用于存储注册信息
var dragonAutoSendLagClient;

// 脚本启用时调用
function onEnable() {

    // 注册
    dragonAutoSendLagClient = moduleManager.registerModule(dragonAutoSendLag);
}

// 脚本禁用时调用
function onDisable() {

    // 注销
    moduleManager.unregisterModule(dragonAutoSendLagClient);
}