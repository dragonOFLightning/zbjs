/*
    聊天选择器
    可用于自动接受组队 自动刷屏 拦截关键聊天
    鉴于功能较为完善 没有重写的想法
*/

// 定义脚本名字
var scriptName = 'ChangeChat';

// 定义脚本版本
var scriptVersion = '1.0.0';

// 定义脚本开发者
var scriptAuthor = ['ColdDragon'];

// 引入S02包
var S02PacketChat = Java.type('net.minecraft.network.play.server.S02PacketChat');

// 模块构造函数
function theChangeChat() {

    // 定义布尔值[ theNoRankMessage] 选项名[ AntiRank ]默认赋值为[ true ] 意为 [ 拦截Rank进入大厅的聊天 ]
    var theNoRankMessage = value.createBoolean('AntiRank', true);

    // 定义布尔值[ theNoGameTisChat ] 选项名[ AntiTis ]默认赋值为[ true ] 意为 [ 拦截大厅中提示进入游戏的聊天 ]
    var theNoGameTisChat = value.createBoolean('AntiTis', true);

    // 定义布尔值[ theAcceptParty ] 选项名[ AcceptParty ]默认赋值为[ true ] 意为 [ 自动接受组队 ]
    var theAcceptParty = value.createBoolean('AcceptParty', true);

    // 定义布尔值[ theChatComm ] 选项名[ StringToComm ]默认赋值为[ true ] 意为 [ 聊天刷屏 ]
    var theChatComm = value.createBoolean('StringToComm', true);

    // 定义布尔值[ theSpammerComm ] 选项名[ SpammerToComm ]默认赋值为[ false ] 意为 [ 聊天命令 ]
    var theSpammerComm = value.createBoolean('SpammerToComm', false);

    // 定义布尔值[ theNoS02 ] 选项名[ AntiS02 ]默认赋值为[ true ] 意为 [ 无差别拦截S02包 ]
    var theNoS02 = value.createBoolean('AntiS02', true);

    // 定义布尔值[ theAntiBog ] 选项名[ AntiBog ]默认赋值为[ true ] 意为 [ 拦截Bog类型的刷屏 ]
    var theAntiBog = value.createBoolean('AntiBog', true);

    // 定义布尔值[ theAntiMysteryBox ] 选项名[ AntiMysteryBox ]默认赋值为[ true ] 意为 [ 拦截提示末影箱的聊天 ]
    var theAntiMysteryBox = value.createBoolean('AntiMysteryBox', true);

    // 定义布尔值[ theAntiFish ] 选项名[ AntiFish ]默认赋值为[ true ] 意为 [ 拦截魔怔类型的刷屏 ]
    var theAntiFish = value.createBoolean('AntiFish', true);

    // 模块值的设定
    this.addValues = function (values) {
        // 添加 [ theNoRankMessage ] 到 [ values ]
        values.add(theNoRankMessage);

        // 添加 [ theNoGameTisChat ] 到 [ values ]
        values.add(theNoGameTisChat);

        // 添加 [ theAcceptParty ] 到 [ values ]
        values.add(theAcceptParty);

        // 添加 [ theChatComm ] 到 [ values ]
        values.add(theChatComm);

        // 添加 [ theSpammerComm ] 到 [ values ]
        values.add(theSpammerComm);

        // 添加 [ theAntiFish ] 到 [ values ]
        values.add(theAntiFish);

        // 添加 [ theAntiBog ] 到 [ values ]
        values.add(theAntiBog);

        // 添加 [ theAntiMysteryBox ] 到 [ values ]
        values.add(theAntiMysteryBox);

        // 添加 [ theNoS02 ] 到 [ values ]
        values.add(theNoS02);
    }

    // 模块名称
    this.getName = function () {
        return 'ChangeChat'
    }

    // 模块说明
    this.getDescription = function () {
        return 'ColdDragon'
    }

    // 模块归类
    this.getCategory = function () {
        return 'Player'
    }

    // 检测发包
    this.onPacket = function (event) {

        // 获取包
        var packet = event.getPacket();

        // 如果包的类型是S02
        if (packet instanceof S02PacketChat) {

            // 如果禁用S02
            if (theNoS02.get()) {

                // 无差别拦截S02
                event.cancelEvent();

            } /*此处用else来增加效率*/
            else {

                if (
                    // 检测到字符串 [ 'joined the lobby!' ] 并且 [ theNoRankMessage ] 启用时 或者
                    packet.getChatComponent().getUnformattedText().contains('joined the lobby!') && theNoRankMessage.get() ||

                    // 检测到字符串 [ '进入了大厅！' ] 并且 [ theNoRankMessage ] 启用时 或者
                    packet.getChatComponent().getUnformattedText().contains('进入了大厅！ ') && theNoRankMessage.get() ||

                    // 检测到字符串 [ '即将于30秒后开始！ 点击这里加入！' ] 并且 [ theNoGameTisChat ] 启用时 或者
                    packet.getChatComponent().getUnformattedText().contains('即将于30秒后开始！ 点击这里加入！') && theNoGameTisChat.get() ||

                    // 检测到字符串 [ 'CLICK HERE to join!' ] 并且 [ theNoGameTisChat ] 启用时 或者
                    packet.getChatComponent().getUnformattedText().contains('CLICK HERE to join!') && theNoGameTisChat.get() ||

                    // 检测到字符串 [ '嘻哈' ] 并且 [ theAntiBog ] 启用时 或者
                    packet.getChatComponent().getUnformattedText().contains('嘻哈') && theAntiBog.get() ||

                    // 检测到字符串 [ '喜哈' ] 并且 [ theAntiBog ] 启用时 或者
                    packet.getChatComponent().getUnformattedText().contains('喜哈') && theAntiBog.get() ||

                    // 检测到字符串 [ 'Mystery Box!' ] 并且 [ theAntiMysteryBox ] 启用时 或者
                    packet.getChatComponent().getUnformattedText().contains('Mystery Box!') && theAntiMysteryBox.get() ||

                    // 检测到字符串 [ '傻逼' ] 并且 [ theAntiFish ] 启用时
                    packet.getChatComponent().getUnformattedText().contains('傻逼') && theAntiFish.get()) {

                    // 拦截
                    event.cancelEvent();
                } // 匹配聊天字符串进行简单的拦截

                // 检测到字符串 [ 'has invited you to join' ] 并且 [ theAcceptParty ] 启用时
                if (packet.getChatComponent().getUnformattedText().contains('has invited you to join') && theAcceptParty.get()) {

                    // 获取聊天文本
                    var theUnformattedText = packet.getChatComponent().getUnformattedText();

                    // 起始文本
                    var theStart = theUnformattedText.indexOf('-----------------------------------------------------') + '-----------------------------------------------------'.length;

                    // 终止文本
                    var theEnd = theUnformattedText.indexOf(' has invited you');

                    // 获取 起始文本 和 终止文本 之间的字符串
                    var theName = theUnformattedText.substring(theStart, theEnd).trim();

                    // 正则匹配 所有的方括号及其内部的内容
                    var reg = /\[[^\]]+\]/g;

                    // 如果匹配到
                    if (reg.test(theName)) {

                        // 替换成空字符串 可用于移除类似 [Vip+] 这类的干扰
                        theName = theName.replace(reg, '');
                    } // if (reg.test(theName))

                    // 正则匹配所有的空格并替换为空格 进一步抗干扰
                    theName = theName.replace(/\s+/g, '');

                    // 发送命令/party accept <玩家名字>
                    mc.thePlayer.sendChatMessage('/party accept ' + theName);
                };

                // 检测到字符串 [ 'cd-s-' ] 并且 [ theSpammerComm ] 启用时
                if (packet.getChatComponent().getUnformattedText().contains('cd-s-') && theSpammerComm.get()) {

                    // 获取聊天文本
                    var theUnformattedText = packet.getChatComponent().getUnformattedText();

                    // 获取文本cd-s-后面的数字和-字符串 
                    var matches = theUnformattedText.match(/(\d+)\-(.*)/);

                    // 将获取到的数组存入 [ count ]
                    var count = parseInt(matches[1]);

                    // 将获取到的字符串存入 [ text ]
                    var text = matches[2];

                    // 如果 [ count ] 大于 [ 9 ]
                    if (count > 9) {

                        // 把 [ 9 ] 赋值给 [ count ]
                        count = 9;
                    } // if (count > 9)

                    // 如果 [ text ] 中存在字符串 [ 'cd-s-' ]
                    if (text.indexOf('cd-s-') !== -1) {

                        // 报错 防止死循环
                        mc.thePlayer.sendChatMessage('SpammerComm-Error');

                        // 或者 如果 [ text ] 中存在字符串 [ '/' ]
                    } else if (text.indexOf('/') !== -1) {

                        // 报错 防止恶意代码
                        mc.thePlayer.sendChatMessage('SpammerComm-Error');

                        // 最后
                    } else {

                        // 循环 [ count ] 次 
                        for (var i = 1; i <= count; i++) {
                            // 发送 [ text ]
                            mc.thePlayer.sendChatMessage(text);
                        } // for (var i = 1; i <= count; i++)
                    } // else
                };

                // 如果[ theChatComm ] 启用时
                if (theChatComm.get()) {

                    // 如果检测到字符串[ 'cd-t-de' ]
                    if (packet.getChatComponent().getUnformattedText().contains('cd-t-de')) {

                        // 输出/play arcade_zombies_dead_end
                        mc.thePlayer.sendChatMessage('/play arcade_zombies_dead_end');
                    } // if (packet.getChatComponent().getUnformattedText().contains('cd-t-de'))

                    // 如果检测到字符串[ 'cd-t-bb' ]
                    if (packet.getChatComponent().getUnformattedText().contains('cd-t-bb')) {

                        // 输出/play arcade_zombies_bad_blood
                        mc.thePlayer.sendChatMessage('/play arcade_zombies_bad_blood');
                    } // if (packet.getChatComponent().getUnformattedText().contains('cd-t-bb'))

                    // 如果检测到字符串[ 'cd-t-aa' ]
                    if (packet.getChatComponent().getUnformattedText().contains('cd-t-aa')) {

                        // 输出/play arcade_zombies_alien_arcadium
                        mc.thePlayer.sendChatMessage('/play arcade_zombies_alien_arcadium');
                    } // if (packet.getChatComponent().getUnformattedText().contains('cd-t-aa'))
                } // if (ChatComm.get())
            } // else
        } // if (packet instanceof S02PacketChat)
    } // this.onPacket = function (event) 
} // theChangeChat

// 加载脚本时触发
function onLoad() {

    // 输出一句话表示正常
    chat.print('§9ChangeChat §2- §4Load');
}

// 创建模块
var dragonChangeChat = new theChangeChat()

// 创建空变量
var dragonChangeChatClient

// 启用脚本时触发
function onEnable() {

    // 注册模块
    dragonChangeChatClient = moduleManager.registerModule(dragonChangeChat);
}

// 禁用脚本时触发
function onDisable() {

    // 注销模块
    moduleManager.unregisterModule(dragonChangeChatClient);
}