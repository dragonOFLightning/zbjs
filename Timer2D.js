/*
    龙界板块制造

    2D计时器
    高度自适应zombies的环境
    当然你可以用来计时你在游戏挂机的时长
    搭配 ShowSpawnTime.jar 使用会让你感到很神奇
*/

// 定义 [ scriptName ] 用于表示脚本名称
var scriptName = 'Timer2D';

// 定义 [ scriptVersion ] 用于表示脚本版本
var scriptVersion = '1.0.0';

// 定义 [ scriptAuthor ] 用于表示脚本作者
var scriptAuthor = ['ColdDragon'];

// 定义 [ tick ] [ theNumberSecond ] [ theNumberMinute ] [ theNumberHour ]分别用于计时 刻度 秒 分 时
var tick, theNumberSecond, theNumberMinute, theNumberHour;

// 定义 [ theStringHour ] [ theStringMinute ] [ theStringHour ] 分别用于纪录时间的字符串 时 分 秒
var theStringHour, theStringMinute, theStringSecond;

// 定义 [ theTime2D ] 用于纪录字符串
var theTime2D;

// 引入 [ S02PacketChat ] 包
var S02PacketChat = Java.type('net.minecraft.network.play.server.S02PacketChat');

// 定义模块构造函数
function theTimer2D() {

    // 模块名称
    this.getName = function () {
        return 'Timer2D'
    };

    // 模块描述
    this.getDescription = function () {
        return 'ColdDragon'
    };

    // 模块分类
    this.getCategory = function () {
        return 'Fun'
    };

    // 模块初始化
    this.onEnable = function () {

        // 初始化 [ tick ] [ theNumberSecond ] [ theNumberMinute ] [ theNumberHour ] 为0
        tick = 0; theNumberSecond = 0; theNumberMinute = 0; theNumberHour = 0;

        // 初始化 [ theStringHour ] [ theStringMinute ] [ theStringHour ] 为 '00'
        theStringHour = '00'; theStringMinute = '00'; theStringSecond = '00';

        // 初始化 [ theTime2D ] 为 '00:00:00'
        theTime2D = '00:00:00';
    };

    // 模块更新
    this.onUpdate = function () {

        // [ tick ] 自增
        tick++;

        // 如果 [ tick ] 为 20
        if (tick == 20) {

            // [ theNumberSecond ] 自增 1
            theNumberSecond++;

            // [ tick ] 为 0
            tick = 0;
        }

        // 如果 [ theNumberSecond ] 为60
        if (theNumberSecond == 60) {

            // [ theNumberMinute ] 自增 1
            theNumberMinute++;

            // [ theNumberSecond ] 重置
            theNumberSecond = 0;
        }
        // 如果 [ theNumberMinute ] 为60
        if (theNumberMinute == 60) {

            // [ theNumberHour ] 自增 1
            theNumberHour++;

            // [ theNumberMinute ] 重置
            theNumberMinute = 0;
        }
        // 判断 [ theNumberSecond ] 如果在1~9之间就在前面加个0赋值给 [ theStringSecond ] 否则 判断 [ theNumberSecond ] 如果大于9就赋值 [ theNumberSecond ]强制字符串 给 [ theStringSecond ] 否则 不变
        theStringSecond = (theNumberSecond >= 1 && theNumberSecond < 10) ? '0' + theNumberSecond : (theNumberSecond > 9) ? theNumberSecond.toString() : theStringSecond;

        // 判断 [ theNumberMinute ] 如果在1~9之间就在前面加个0赋值给 [ theStringMinute ] 否则 判断 [ theNumberMinute ] 如果大于9就赋值 [ theNumberMinute ]强制字符串 给 [ theStringMinute ] 否则 不变
        theStringMinute = (theNumberMinute >= 1 && theNumberMinute < 10) ? '0' + theNumberMinute : (theNumberMinute > 9) ? theNumberMinute.toString() : theStringMinute;

        // 判断 [ theNumberHour ] 如果在1~9之间就在前面加个0赋值给 [ theStringHour ] 否则 判断 [ theNumberHour ] 如果大于9就赋值 [ theNumberHour ]强制字符串 给 [ theStringHour ] 否则 不变
        theStringHour = (theNumberHour >= 1 && theNumberHour < 10) ? '0' + theNumberHour : (theNumberHour > 9) ? theNumberHour.toString() : theStringHour;

        // 给 [ theTime2D ] 赋值为 时:分:秒
        theTime2D = theStringHour + ':' + theStringMinute + ':' + theStringSecond;
    };

    // 模块2D渲染
    this.onRender2D = function () {

        // 在屏幕 920 400 的位置渲染0x8B0000颜色的字符串theTimer2D
        mc.fontRendererObj.drawString(theTime2D, 920, 400, 0x8B0000);
    };

    // 模块抓包 监听事件
    this.onPacket = function (event) {

        // 获取监听到的事件的包 [ thePacket ]
        var thePacket = event.getPacket();

        // 如果 [ thePacket ] 类型是 [ S02PacketChat ]
        if (thePacket instanceof S02PacketChat) {

            var chat = thePacket.getChatComponent().getUnformattedText();

            // 如果检测到聊天中有字符串 [ 'coins!' ]
            if (chat.contains('coins!')) {

                // 重置计时器
                tick = 0; theNumberSecond = 0; theStringMinute = '00'; theNumberHour = 0; theNumberMinute = '00'; theStringHour = '00';

            }
            // 如果检测到聊天中有字符串 [ 'The game starts in 1 second!' ]
            if (chat.contains('The game starts in 1 second!')) {

                // 重置计时器但 [ tick ] 为-20
                tick = -20; theNumberSecond = 0; theStringMinute = '00'; theNumberHour = 0; theNumberMinute = '00'; theStringHour = '00';
            }
        }
    }
}

// 脚本加载时调用 [ onLoad ]
function onLoad() {

    // 发送特定聊天表示加载成功
    chat.print('§9Timer2D §2- §4Load');
}

// 定义模块 [ theTimer2D ] 的实例 [ dragonTimer2D ]
var dragonTimer2D = new theTimer2D();

// 定义注册表 [ dragonTimer2DClient ]
var dragonTimer2DClient;

// 脚本启用时调用 [ onEnable ]
function onEnable() {

    // 用 [ dragonTimer2DClient ] 给 [ dragonTimer2D ] 注册
    dragonTimer2DClient = moduleManager.registerModule(dragonTimer2D);
}
// 脚本禁用时调用 [ onDisable ]
function onDisable() {

    // 注销 [ dragonTimer2DClient ]
    moduleManager.unregisterModule(dragonTimer2DClient);
}