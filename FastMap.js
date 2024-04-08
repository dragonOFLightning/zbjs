/*
    龙界板块停更

    可以快速进入 Zombies 地图
    Chat模式下根据发送的聊天选择地图 被动
    Oppress在你启动就进入选择的地图 主动

    此脚本的功能基本都已经被ChangeChat实现
*/

// 定义脚本的名称
var scriptName = 'FastMap';

// 定义脚本的版本
var scriptVersion = '1.1.0';

// 定义脚本的作者
var scriptAuthor = ['dragonsocd'];

// 引入命令
var LiquidBounce = Java.type('net.ccbluex.liquidbounce.LiquidBounce');

// 引入 [ S02PacketChat ] 类型的数据包  
var S02PacketChat = Java.type('net.minecraft.network.play.server.S02PacketChat');

// 定义模块
function theFastMap() {

    // 定义 [ mode ] 创建一个列表单选类型的选项 [ 'Mode' ] 定义选项 [ 'Chat' ] [ 'OnPress' ] 默认选项 [ 'Chat' ]
    var mode = value.createList('Mode', ['Chat', 'OnPress'], 'Chat');

    // 定义 [ map ] 创建一个列表单选类型的选项 [ TheMap ] 定义选项 [ 'DeadEnd' ] [ 'BadBlood' ] [ 'AlienArcadium' ] 默认选项 [ 'DeadEnd' ]
    var map = value.createList('TheMap', ['DeadEnd', 'BadBlood', 'AlienArcadium'], 'DeadEnd');

    // 模块选项
    this.addValues = function (values) {

        // 添加选项 [ map ]
        values.add(map);

        // 添加选项 [ mode ]
        values.add(mode);
    }
    // 模块名称
    this.getName = function () {
        return 'FastMap';
    }
    // 在更新时运行
    this.onUpdate = function () {

        // 如果 [ mode ] 选择了 [ 'OnPress' ]
        if (mode.get() === 'OnPress') {

            // 使用命令禁用脚本
            LiquidBounce.FastMap.executeCommands('.t FastMap off');
        }
    }
    // 在启用时运行
    this.onEnable = function () {

        // 如果 [ mode ] 选择了 [ 'OnPress' ]
        if (mode.get() == 'OnPress') {

            // 获取 [ map ] 的选择
            switch (map.get()) {

                // 选择了 [ 'DeadEnd' ] 就执行这个 case
                case 'DeadEnd':

                    // 发送聊天
                    mc.thePlayer.sendChatMessage('/play arcade_zombies_dead_end');

                    // 禁止执行下一个 case
                    break;

                // 选择了 [ 'BadBlood' ] 就执行这个 case
                case 'BadBlood':

                    // 发送聊天
                    mc.thePlayer.sendChatMessage('/play arcade_zombies_bad_blood');

                    // 禁止执行下一个 case
                    break;

                // 选择了 [ 'AlienArcadium' ] 就执行这个 case
                case 'AlienArcadium':

                    // 发送聊天
                    mc.thePlayer.sendChatMessage('/play arcade_zombies_alien_arcadium');
            }
        }
    }
    // 在检测到数据包时运行
    this.onPacket = function (event) {

        // 获取数据包
        var packet = event.getPacket();

        // 如果数据包是 S02PacketChat 类型 并且 [ mode ] 选择了 [ 'Chat' ]
        if (packet instanceof S02PacketChat && mode.get() == 'Chat') {

            // 获取聊天的完整文本
            var chatText = packet.getChatComponent().getUnformattedText();

            // 如果文本中有 [ 'cd-t-de' ] 执行发送聊天进入DeadEnd 否则
            chatText.includes('cd-t-de') ? mc.thePlayer.sendChatMessage('/play arcade_zombies_dead_end') :

                // 如果文本中有 [ 'cd-t-bb' ] 执行发送聊天进入BadBlood 否则
                chatText.includes('cd-t-bb') ? mc.thePlayer.sendChatMessage('/play arcade_zombies_bad_blood') :

                    // 如果文本中有 [ 'cd-t-aa' ] 执行发送聊天进入AlienArcadium 否则 null
                    chatText.includes('cd-t-aa') ? mc.thePlayer.sendChatMessage('/play arcade_zombies_alien_arcadium') : null
        }
    }
    // 定义模块描述
    this.getDescription = function () {
        return 'dragonsocd'
    }
    // 定义模块分类
    this.getCategory = function () {
        return "Player"
    }
}
// 脚本加载时执行
function onLoad() {

    // 输出一句聊天表示 成功加载
    chat.print('§9FastMap §2- §4Load')
}
// 创建 [ theFastMap ] 模块的实例 [ dragonFastMap ]
var dragonFastMap = new theFastMap();

// 定义 [ dragonFastMapClient ] 用于存储注册消息
var dragonFastMapClient;

// 脚本运行时执行
function onEnable() {

    // 注册
    dragonFastMapClient = moduleManager.registerModule(dragonFastMap);
}
// 脚本禁用时执行
function onDisable() {

    // 注销
    moduleManager.unregisterModule(dragonFastMapClient);
}