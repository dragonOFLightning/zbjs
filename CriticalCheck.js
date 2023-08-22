/*
    此脚本可以检测你有没有暴击
    适用于 Zombies
*/

// 定义脚本名称
var scriptName = 'CriticalCheck';

// 定义脚本版本
var scriptVersion = '1.0.0';

// 定义脚本作者
var scriptAuthor = ['ColdDragon'];

// 引入 [ S02PacketChat ] 用于聊天检测
var S02PacketChat = Java.type('net.minecraft.network.play.server.S02PacketChat');

// 引入 [ S0BPacketAnimation ] 用于暴击动画检测
var S0BPacketAnimation = Java.type('net.minecraft.network.play.server.S0BPacketAnimation');

// 定义脚本的模块
function theCriticalCheck() {

    // 定义 [ theCriticalsList ] 用于存储全部暴击数据的对象
    var theCriticalsList = [];

    // 定义对象类构造函数 - 当做抽象类理解就行了
    function theCriticalClass(key, tick) {

        // 定义 [ key ] 用于存储暴击数据的字符串
        this.key = key;

        // 定义 [ tick ] 用于计数 时间结束就删除数据
        this.tick = tick;
    };

    // 定义模块名称
    this.getName = function () {
        return 'CriticalCheck';
    };

    // 定义模块说明
    this.getDescription = function () {
        return 'ColdDragon';
    };

    // 定义模块分类
    this.getCategory = function () {
        return 'Render';
    };

    // 定义模块检测到数据包时调用
    this.onPacket = function (event) {

        // 获取单独的数据包
        var thePacket = event.getPacket();

        // 如果 数据包类型是 [ S02PacketChat ] 并且 包含聊天字符串 [ '(Critical Hit)' ]
        if (thePacket instanceof S02PacketChat && thePacket.getChatComponent().getUnformattedText().contains('(Critical Hit)')) {

            // 创建一个 [ theCriticalClass ] 对象实例 用于存储暴击数据
            theCriticalsList.push(new theCriticalClass('§2检测到一次枪械暴击', 60));

            // 否则 如果 数据包类型是 [ S0BPacketAnimation ] 并且 动画的类型是 [ 4 ]
        } else if (thePacket instanceof S0BPacketAnimation && thePacket.getAnimationType() == 4) {

            // 创建一个 [ theCriticalClass ] 对象实例 用于存储暴击数据
            theCriticalsList.push(new theCriticalClass('§d检测到一次刀械暴击', 100));
        }
    };

    // 定义模块渲染
    this.onRender2D = function () {

        // 遍历 [ theCriticalsList ] 中的每个 暴击数据对象
        for (var index = 0; index < theCriticalsList.length; index++) {

            // 渲染暴击数据的 [ key ] 
            mc.fontRendererObj.drawString(theCriticalsList[index].key, 500, 230 + 9 * index, 0x8B0000);

            // 暴击数据中的 [ tick ] 自减
            theCriticalsList[index].tick--;

            // 如果暴击数据中的 [ tick ] 小于等于 [ 0 ]
            if (theCriticalsList[index].tick <= 0) {

                // 删除数据
                theCriticalsList.splice(index, 1);
            }
        }
    }
}

// 脚本加载时调用
function onLoad() {

    // 输出一句话表示脚本已加载
    chat.print('§9' + 'CriticalCheck' + ' §2- §4Load');
}

// 定义模块的实例 [ dragonCriticalCheck ]
var dragonCriticalCheck = new theCriticalCheck();

// 定义 [ dragonCriticalCheckClient ] 用于存储注册信息
var dragonCriticalCheckClient;

// 脚本启用时调用
function onEnable() {

    // 注册
    dragonCriticalCheckClient = moduleManager.registerModule(dragonCriticalCheck);
}

// 脚本禁用时调用
function onDisable() {

    // 注销
    moduleManager.unregisterModule(dragonCriticalCheckClient);
}