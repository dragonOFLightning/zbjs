/* 此JS虽然远古 但没地方值得扩展了 */

// 定义脚本名称
var scriptName = 'AutoReJoin';

// 定义脚本版本
var scriptVersion = '2.1';

// 定义脚本作者
var scriptAuthor = ['ColdDragon'];

// 引入聊天数据包
var S02PacketChat = Java.type('net.minecraft.network.play.server.S02PacketChat');

// 定义模块构造函数
function TheAutoReJoin() {

    // 定义 [ tick ] [ inGame ] 用于 [ int 计时 ] [ boolean 是否在游戏 ]
    var tick, inGame;

    // 定义选项 是否全覆盖重连
    var ReJoin = value.createBoolean('ReJoin', true);

    // 定义选项 重连的模式
    var rejMode = value.createList('ReJoin Mode', ['Normal', 'Once', 'LeaveP', 'Lobby'], 'Normal');

    // 定义模块的选项
    this.addValues = function (values) {

        // 添加选项
        values.add(ReJoin);

        // 添加选项
        values.add(rejMode);
    };

    // 定义模块名称
    this.getName = function () {
        return 'AutoReJoin'
    };

    // 定义模块描述
    this.getDescription = function () {
        return 'ColdDragon'
    };

    // 定义模块分类
    this.getCategory = function () {
        return 'Fun'
    };

    // 模块更新时调用
    this.onUpdate = function () {

        // 分支 重连选项的模式
        switch (rejMode.get()) {

            // 一次性模式 游戏开始就退 游戏 && 组队
            case 'Once':
                if (tick == 21 && inGame) {
                    mc.thePlayer.sendChatMessage('/Lobby');
                    mc.thePlayer.sendChatMessage('/p Leave');
                }
                if (tick == 20 && !inGame && ReJoin.get()) {
                    mc.thePlayer.sendChatMessage('/rej');
                }
                break;

                // 常规模式 游戏开始就退出游戏 然后重进
            case 'Normal':
                if (tick == 20 && !inGame) {
                    mc.thePlayer.sendChatMessage('/rej');
                } else if (tick == 21 && inGame) {
                    mc.thePlayer.sendChatMessage('/Lobby');
                    tick = 0;
                    inGame = false;
                }
                break;

                // 仅退出模式 游戏开始就退出游戏
            case 'Lobby':
                if (tick == 21 && inGame) {
                    mc.thePlayer.sendChatMessage('/Lobby');
                }
                if (tick == 20 && !inGame && ReJoin.get()) {
                    mc.thePlayer.sendChatMessage('/rej');
                }
                break;

                // 仅离队模式 游戏开始就退出 游戏 && 组队 然后重连
            case 'LeaveP':
                if (tick == 20 && !inGame) {
                    mc.thePlayer.sendChatMessage('/rej');
                } else if (tick == 21 && inGame) {
                    mc.thePlayer.sendChatMessage('/Lobby');
                    mc.thePlayer.sendChatMessage('/p Leave');
                    tick = 0;
                    inGame = false;
                }
                break;
        }

        // tick 自增只能到30
        tick = tick < 30 ? tick += 1 : tick;
    };

    // 模块检测到数据包时调用
    this.onPacket = function (event) {

        // 获取数据包
        var packet = event.getPacket();

        // 如果数据包类型是 [ S02PacketChat ]
        if (packet instanceof S02PacketChat) {

            // 如果进入了下一 round
            if (packet.getChatComponent().getUnformattedText().contains("coins!")) {

                // 离开游戏
                mc.thePlayer.sendChatMessage('/Lobby');

                // 设置计时器和判断
                tick = 0;
                inGame = false;

                // 如果游戏即将开始
            } else if (packet.getChatComponent().getUnformattedText().contains('The game starts in 1 second!')) {

                // 设置计时器和判断
                tick = 0;
                inGame = true;

                // 如果游戏开启失败
            } else if (packet.getChatComponent().getUnformattedText().contains("We don't have enough players! Start cancelled. ")) {

                // 发出警告
                chat.print('§9AutoReJoin§r-§4检测到玩家不足-已自动重置AutoReJoin');

                // 设置计时器和判断
                tick = 30;
                inGame = true;
            }
        }
    }
}

// 脚本加载时调用
function onLoad() {

    // 输出一句话表示正常
    chat.print('§9' + 'AutoReJoin' + ' §2- §4Load')
}

// 创建模块的实例
var dragonAutoReJoin = new TheAutoReJoin();

// 定义 [ dragonAutoReJoinClient ] 用于存储注册信息
var dragonAutoReJoinClient

// 脚本启用时调用
function onEnable() {

    // 注册
    dragonAutoReJoinClient = moduleManager.registerModule(dragonAutoReJoin)
}

// 脚本禁用时调用
function onDisable() {

    // 注销
    moduleManager.unregisterModule(dragonAutoReJoinClient)
}