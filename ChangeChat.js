/*
    小王子制作

    聊天选择器
        - 可用于低血量提醒
        - 可用于补全缩写
         - 聊天开头加上$取消补全
        - 可用于拦截不良信息
        - 可使用cd-s-执行刷屏命令
        - 可扩展 各个执行函数独立运行
        - 当前更新的时间 UTC + 2<<2 2024-4-1

    此脚本为重制版 更加模块化 添加更多功能 类型更清晰 移除无用功能
*/

// 定义脚本名称
var scriptName = 'ChangeChat';

// 定义脚本版本
var scriptVersion = '2.1.2';

// 定义脚本作者
var scriptAuthor = 'CheemsSheep';

// 引入本地聊天数据包 [ C01PacketChatMessage ]
var C01PacketChatMessage = Java.type('net.minecraft.network.play.client.C01PacketChatMessage');

// 引入网络聊天数据包 [ S02PacketChat ]
var S02PacketChat = Java.type('net.minecraft.network.play.server.S02PacketChat');

// 引入世界时间数据包 [ S03PacketTimeUpdate ]
var S03PacketTimeUpdate = Java.type('net.minecraft.network.play.server.S03PacketTimeUpdate');

// 定义模块的构造函数
function TheChangeChat() {

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

        // 定义布尔型选项 [ AntiBadChat ] 意为 是否拦截不文明聊天
        theAntiBadChat: setting.boolean('AntiBadChat', true),

        // 定义布尔型选项 [ JoinParty ] 意为 是否自动加入组队
        theAutoJoinParty: setting.boolean('JoinParty', true),

        // 定义布尔型选项 [ SendLag ] 意为 是否自动发送Lag
        theAutoSendLag: setting.boolean('SendLag', true),

        // 定义布尔型选项 [ LowHPTis ] 意为 是否发送血量提醒
        theLowHPTis: setting.boolean('LowHPTis', false),

        // 定义布尔值选项 [ SendDanger ] 意为 是否发送残血提醒
        theSendDanger: setting.boolean('SendDanger', true),

        // 定义布尔值选项 [ PrintDanger ] 意为 是否输出残血提醒
        thePrintDanger: setting.boolean('PrintDanger', true),

        // 定义浮点数选项 [ DangerHP ] 意为 残血阈值
        theDangerHP: setting.float('DangerHP', 7, 0.1, 9),

        // 定义布尔值选项 [ SendWarn ] 意为 是否发送低血提醒
        theSendWarn: setting.boolean('SendWarn', true),

        // 定义布尔值选项 [ PrintWarn ] 意为 是否输出低血提醒
        thePrintWarn: setting.boolean('PrintWarn', true),

        // 定义浮点数选项 [ WarnHP ] 意为 低血阈值
        theWarnHP: setting.float('WarnHP', 15, 9.1, 25),

        // 定义布尔型选项 [ ClearChat ] 意为 是否无差别拦截 [ S02PacketChat ]
        clearChat: setting.boolean('ClearChat', false),

        // 定义布尔型选项 [ SpammerComm ] 意为 是否启用聊天刷屏命令
        spammerComm: setting.boolean('SpammerComm', false),

        // 定义布尔型选项 [ ChatCompletion ] 意为 是否自动补全聊天
        chatCompletion: setting.boolean('ChatCompletion', true),

        // 定义布尔型选项 [ SendTool ] 意为 是否发送工具
        sendTool: setting.boolean('SendTool', true),
    };

    // 定义模块选项
    this.addValues = function (values) {
        for (var i in settings) {
            values.add(settings[i])
        }
    };

    // 定义模块名称
    this.getName = function () {
        return 'ChangeChat'
    };

    // 定义模块描述
    this.getDescription = function () {
        return 'CheemsSheep'
    };

    // 定义模块归类
    this.getCategory = function () {
        return 'Fun'
    };

    // 定义 [ tick ] 用于计数 @integer
    var tick = 61;

    // 定义 一些列already 表示已经执行了什么动作 @boolean
    var alreadySendLag = false;
    var alreadySendDanger = false;
    var alreadySendWarn = false;
    var alreadyPrintDanger = false;
    var alreadyPrintWarn = false;

    // 定义函数 [ sendChat ] (string text ,integer settings) @void
    function sendChat(text, setting) {

        // 发送聊天
        mc.thePlayer.sendChatMessage(text + 'Health < ' + setting);
    };

    // 定义函数 [ printChat ] (string text ,integer settings) @void
    function printChat(text, setting) {

        // 输出聊天
        chat.print(text + 'Health < ' + setting);
    };

    // 模块更新时调用
    this.onUpdate = function () {

        // 判断 tick 是否小于0 否则自减
        tick = tick < 0 ? tick : tick - 1;

        // 如果 tick 为0
        if (!alreadySendLag && settings.theAutoSendLag.get() && tick === 0) {

            // 发送 Lag
            mc.thePlayer.sendChatMessage('Lag');

            // 设置已发送Lag
            alreadySendLag = true;
        };


        // 判断是否开启了低血量提示
        if (settings.theLowHPTis.get()) {

            // 获取玩家血量 @java-float
            var health = mc.thePlayer.getHealth();

            // 获取设置低血阈值 @float
            var warnHP = settings.theWarnHP.get();

            // 获取设置残血阈值 @float
            var dangerHP = settings.theDangerHP.get();

            // 如果脱离低血
            if (health > warnHP) {

                // 重置变量
                alreadySendWarn = false;
                alreadyPrintWarn = false;

                // 否则如果脱离残血
            } else if (health > dangerHP) {

                // 重置变量
                alreadySendDanger = false;
                alreadyPrintDanger = false;
            };

            // 如果进入残血
            if (health < dangerHP) {

                // 如果设置选项开启 并且还没发送过
                if (settings.theSendDanger.get() && !alreadySendDanger) {

                    // 设置已发送
                    alreadySendDanger = true;

                    // 发送一次
                    sendChat('Danger! ', dangerHP);
                };

                // 如果设置选项开启 并且还没输出过
                if (settings.thePrintDanger.get() && !alreadyPrintDanger) {

                    // 设置已输出
                    alreadyPrintDanger = true;

                    // 输出一次
                    printChat('§4Danger! ', dangerHP);
                }

                // 否则 如果进入低血
            } else if (health < warnHP) {

                // 如果设置选项开启 并且还没发送过
                if (settings.theSendWarn.get() && !alreadySendWarn) {

                    // 设置已发送
                    alreadySendWarn = true;

                    // 发送一次
                    sendChat('Warn! ', warnHP);
                };

                // 如果设置选项开启 并且还没输出过
                if (settings.thePrintWarn.get() && !alreadyPrintWarn) {

                    // 设置已输出
                    alreadyPrintWarn = true;

                    // 输出一次
                    printChat('§5Warn! ', warnHP);
                }
            }
        }
    };

    // 模块检测到数据包时调用
    this.onPacket = function (event) {

        // 获取包 any
        var thePacket = event.getPacket();

        // 如果包的类型是 [ S02PacketChat ]
        if (thePacket instanceof S02PacketChat) {

            // 如果纯净聊天模式启动
            if (settings.clearChat.get()) {

                // 无差别拦截 [ S02PacketChat ] 注意 : 仅聊天栏不接收[ S02PacketChat ] 其他类似的脚本依然能获取到数据包 
                event.cancelEvent();
            } else {

                // 获取服务器聊天文本 @java.lang.String
                var chatText = thePacket.getChatComponent().getUnformattedText();

                // 判断聊天是否是不文明的聊天 并且启用了拦截不文明聊天
                if (isBadChat(chatText) && settings.theAntiBadChat.get()) {

                    // 拦截聊天
                    event.cancelEvent();

                    // 否则 判断聊天是否是 组队邀请信息 并且启用了自动进组队
                } else if (chatText.contains('has invited you to join') && settings.theAutoJoinParty.get()) {

                    // 执行进入组队
                    doJoinParty(chatText);
                } else if (chatText.contains('cd-s-') && settings.spammerComm.get()) {

                    // 执行聊天命令刷屏
                    doSpammerComm(chatText);
                }
            }

            // 如果包的类型是 [ S03PacketTimeUpdate ] 并且启用了 [ theAutoSendLag ]
        } else if (thePacket instanceof S03PacketTimeUpdate && settings.theAutoSendLag.get()) {

            // 重置
            tick = 61;
            alreadySendLag = false;

            // 如果包的类型是 [ C01PacketChatMessage ] 并且开启了聊天补全
        } else if (thePacket instanceof C01PacketChatMessage) {

            if (settings.chatCompletion.get()) {
                // 执行聊天补全
                doChatCompletion(thePacket);
            };

            if (settings.sendTool.get()) {
                // 判断是否已经发送工具
                alreadySendTool(thePacket) ? event.cancelEvent() : null;
            };
        };
    };

    /**
     * @function alreadySendTool 用判断是否已经发送了工具
     * @param {C01PacketChatMessage} packet 
     * @returns {boolean} 判断是否已经发送工具
     */
    function alreadySendTool(packet) {

        // 如果同时检测到 do-sw 和 do-sp
        if (packet.message.contains('do-sw') && packet.message.contains('do-sp')) {

            // 执行发送增益和发送武器
            doSendPerks();
            doSendWeapons();
            return true;
        };

        // 如果检测到 do-sw
        if (packet.message.contains('do-sw')) {
            doSendWeapons();
            return true;
        };

        // 如果检测到 do-sp
        if (packet.message.contains('do-sp')) {
            doSendPerks();
            return true;
        };
    };

    /**
     * @function doSendPerks 用于执行发送增益
     * @returns {void} 发送增益
     */
    function doSendPerks() {

        // 增益映射
        var perksList = [
            'item.dyePowder',
            'item.goldNugget',
            'item.sugar',
            'item.ghastTear',
            'item.cookie',
            'item.redstone',
            'item.blazePowder',
        ];

        // 遍历快捷栏
        for (var slot = 4; slot < 9; slot++) {

            // 获取物品栈
            var itemStack = mc.thePlayer.inventory.getStackInSlot(slot);
            if (itemStack) {

                /**@type {java.lang.String} 获取物品未本地化的名称 */
                var nameUZ = itemStack.getItem().getUnlocalizedName();

                /**@type {java.lang.String} 获取物品本地化的名称 */
                var name = itemStack.getDisplayName();

                // 如果这个物品包含在映射中
                if (perksList.indexOf(nameUZ) !== -1) {

                    // 执行发送
                    mc.thePlayer.sendChatMessage(name);
                };
            };
        };
    };

    /**
     * @function doSendWeapons 执行发送武器 
     * @returns {void} 发送武器
     */
    function doSendWeapons() {

        // 存储武器的列表
        var weaponList = [];

        // 反向遍历快捷栏
        for (var slot = 2 << 2; slot > -1; slot--) {

            // 获取物品栈
            var itemStack = mc.thePlayer.inventory.getStackInSlot(slot);

            // 如果物品栈不为空
            if (itemStack) {

                /**@type {java.lang.String} 获取物品最大耐久度*/
                var maxDurability = itemStack.getMaxDamage();

                /**@type {java.lang.String} 获取物品本地化的名称*/
                var name = itemStack.getDisplayName();

                // 如果最大耐久大于2 并且名称没重复
                if (maxDurability > 2 && weaponList.indexOf(name) === -1) {

                    // 添加 字符串 到武器的列表中
                    weaponList.push(name + ' from slot - ' + slot);
                };
            };
        };

        // 反转武器的列表
        weaponList.reverse();

        // 遍历武器的列表
        for (var index = 0; index < weaponList.length; index++) {

            // 执行发送武器
            mc.thePlayer.sendChatMessage(weaponList[index]);
        };
    };

    // 定义 [ doSpammerComm ] (java.lang.String text) 用于执行命令刷屏 @void
    function doSpammerComm(text) {

        // 获取文本cd-s-后面的数字和-字符串 @string
        var matches = text.match(/(\d+)\-(.*)/);

        // 将获取到的数组存入 [ count ] @integer
        var count = parseInt(matches[1]);

        // 将获取到的字符串存入 [ text ] @string
        var text = matches[2];

        // 如果 [ count ] 大于 [ 9 ]
        if (count > 9) {

            // 把 [ 9 ] 赋值给 [ count ]
            count = 9;
        }

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
            };
        };
    };

    // 定义 [ doJoinParty ] (java.lang.String inviteText) 用于执行进入组队 @void
    function doJoinParty(inviteText) {

        // 起始文本索引 @integer
        var theStart = inviteText.indexOf('-----------------------------------------------------') + '-----------------------------------------------------'.length;

        // 终止文本索引 @integer
        var theEnd = inviteText.indexOf(' has invited you');

        // 获取 起始文本 和 终止文本 之间的字符串 @string
        var theName = inviteText.substring(theStart, theEnd).trim();

        // 正则匹配 所有的方括号及其内部的内容 @any
        var reg = /\[[^\]]+\]/g;

        // 如果匹配到
        if (reg.test(theName)) {

            // 替换成空字符串 可用于移除类似 [Vip+] 这类的干扰
            theName = theName.replace(reg, '');
        };

        // 正则匹配所有的空格并替换为空格 进一步抗干扰
        theName = theName.replace(/\s+/g, '');

        // 发送命令/party accept <玩家名字>
        mc.thePlayer.sendChatMessage('/party accept ' + theName);
    };

    // 定义 [ isBadChat ] (java.lang.String text) 用于判断字符串是否包含垃圾内容 @boolean
    function isBadChat(text) {

        // 判断是否是空字符串
        if (/^\s*$/.test(text)) {
            return true;
        }
        // 否则 判断是否包含以下关键词
        else if (text.contains('傻逼') || text.contains('死妈') || text.contains('你妈') ||
            text.contains('妈逼') || text.contains('死全家') || text.contains('giao') ||
            text.contains('奥利给') || text.contains('蔡徐坤')) {
            return true;
        }
        // 否则 判断是否包含 L
        else if (text.contains('L') || text.contains('l')) {

            // 获取 > 后的的索引 @integer
            var index = text.toString().indexOf(':');

            // 如果存在 :
            if (index !== -1) {

                // 获取 ':' 后面的字符 需要+2才能精确获取 @string
                var string = text.toString().substring(index + 1);

                // 判断是否包含 Loser @boolean
                var includesLoser = /loser/i.test(string);
                return stringAllL(string) || includesLoser || isBadLSimpleString(string);
            };
        };
    };

    /**
     * @function isBadLSimpleString 用于判断字符串中的L字符是否是不健康的
     * @param {string} string 完整的字符串
     * @returns {boolean} 字符串中的L支付是否是不健康的
     */
    function isBadLSimpleString(string) {

        // 如果删去空格后的字符串全是L
        if (stringAllL(string.replace(/ /g, ''))) {
            return true;
        }

        // 把字符串中每个单词拆出来
        var stringArray = string.split(' ');

        for (var i = 0; i < stringArray.length; i++) {
            // 获取删除空格的单词
            var simpleString = stringArray[i].replace(/ /g, '');

            // 如果没有字符
            if (!simpleString) {
                continue;
            }

            // 如果单词中字符全是L
            if (stringAllL(simpleString)) {
                return true;
            }
        }
        return false;
    }

    /**
     * @function stringAllL 用于判断字符串中是不是全是L字符
     * @param {string} string 
     * @returns {boolean} 字符串中是不是全是L字符
     */
    function stringAllL(string) {
        return /^[lL]+$/i.test(string)
    }

    // 定义 [ doChatCompletion ] ([ C01PacketChatMessage ] thePacket) 用于执行聊天补全 @void
    function doChatCompletion(thePacket) {

        // 获取数据包的Java字符串强转JavaScript字符串 @string
        var theMessage = thePacket.message.toString();

        // 如果开头检测到$就不补全
        if (theMessage[0] === '$') {
            // 删除掉开头的$ 以方便交流
            thePacket.message = theMessage.substring(1);
            return;
        }

        // 定义文本缩写 [ key ] 对应的全拼 [ value ] 请注意顺序会影响兼容性 @object
        var replaceRules = {
            'bbr': 'bb -r',
            'der': 'de -r',
            'bbh': 'bb -h',
            'deh': 'de -h',
            'bbn': 'bb -n',
            'den': 'bb -n',
            's1': 'Save 1 || Keep 1',
            'ht': 'Hotel',
            'ps': 'Power Station',
            'rt': 'Roof Top',
            'gy': 'Graveyard',
            'rc': 'Roller Coaster',
            't-de': '/play arcade_zombies_dead_end',
            't-bb': '/play arcade_zombies_bad_blood',
            't-aa': '/play arcade_zombies_alien_arcadium',
            'zb': 'Zombies',
            'rr': 'RainbowRifle',
            'pis': 'Pistol',
            'ft': 'FlameThrower',
            'gd': 'GoldDigger',
            'zz': 'ZombieZapper',
            'eg': 'ElderGun',
            'sg': 'ShotGun',
            'rf': 'Rifle',
            'rpg': 'RocketLauncher',
            'zs': 'ZombieSoaker',
            'sn': 'Sniper',
            'de': 'Dead End',
            'bb': 'Bad Blood',
            'aa': 'Alien Arcadium',
            '-r': 'Rip',
            '-n': 'Normal',
            '-h': 'Hard',
            'ins': 'Insta Kill',
            'ult': 'Ultimate',
            'qf': 'QuickFire',
            'fb': 'FrozenBullet',
            'ew': 'ExtraWeapon',
            'eh': 'ExtraHealth',
            'gar': 'Garden',
            'fr': 'FastRevive',
            'cc': 'Chest Corner',
            'eco': 'Economy Strategy',
            'gh': 'Great Hall',
            'ls': 'Lightning Strategy',
            'idk': "I don't know",
            'ik': 'I know',
            'dr-': 'Dead Round ',
            'bal': 'Balcony',
            'r-': 'Round ',
            'cy': 'Courtyard',
            'ms': 'Mansion',
            'apt': 'Apartment',
            'o1': 'The Old One',
            'ss': 'Shopping Surging',
            'lr': 'Lightning Rod',
            'pc': 'Perk Corner',
            'lib': 'Library',
            'dun': 'Dungeon',
            'cry': 'Crypts',
            'fw': 'Ferris Wheel',
            'bc': 'Bumper Cars',
        };

        // 循环判断 replaceRules
        for (var key in replaceRules) {

            // 如果数据包中的Java字符串包含 [ key ] 属性 Java字符串才能使用contains @java.lang.String
            if (thePacket.message.contains(key)) {

                // 获取关键词左边的字符如果undefined就' ' @string
                var left = theMessage[theMessage.indexOf(key) - 1] || ' ';

                // 获取关键词右边的字符如果undefined就' ' @string
                var right = theMessage[theMessage.indexOf(key) + key.length] || ' ';

                // 判断是否全是空格 @string
                var allSpace = left === ' ' && right === ' ';

                // 如果不是全空格就跳过
                if (!allSpace) {
                    if (/[a-z]/gi.test(left) || /[a-z]/gi.test(right)) {
                        continue;
                    }
                }

                // 全局匹配 [ key ] 替换成 [ key ] 对应的值
                theMessage = theMessage.replace(new RegExp(key, 'g'), replaceRules[key]);

                // 更新数据包的message
                thePacket.message = theMessage;
            };
        };
    };
}

// 脚本启用时调用
function onLoad() {

    // 输出一句话表示已加载
    chat.print('§9' + 'ChangeChat' + ' §2- §4Load');
}

// 创建模块的实例
var dragonChangeChat = new TheChangeChat();

// 定义 [ dragonChangeChatClient ] 用于存储注册信息
var dragonChangeChatClient;

// 脚本运行时调用
function onEnable() {

    // 注册
    dragonChangeChatClient = moduleManager.registerModule(dragonChangeChat);
}

// 脚本禁用时调用
function onDisable() {

    // 注销
    moduleManager.unregisterModule(dragonChangeChatClient);
}