// 定义脚本名称
var scriptName = 'ChatCompletion';

// 定义脚本版本
var scriptVersion = '1.0.1';

// 定义脚本作者
var scriptAuthor = ['ColdDragon'];

// 引入本地聊天数据包 [ C01PacketChatMessage ]
var C01PacketChatMessage = Java.type('net.minecraft.network.play.client.C01PacketChatMessage');

// 定义模块的构造函数
function TheChatCompletion() {

    // 定义模块名称
    this.getName = function () {
        return 'ChatCompletion'
    };

    // 定义模块描述
    this.getDescription = function () {
        return 'ColdDragon'
    };

    // 定义模块归类
    this.getCategory = function () {
        return 'Player'
    };

    // 模块检测到数据包时调用
    this.onPacket = function (event) {
        // 获取包
        var thePacket = event.getPacket();
        // 如果包的类型是..C01PacketChatMessage
        if (thePacket instanceof C01PacketChatMessage) {

            // 获取数据包的Java字符串强转JavaScript字符串 JS字符串才能使用replace
            theMessage = thePacket.message.toString();

            // 定义文本缩写 [ key ] 对应的全拼 [ value ] 请注意顺序会影响兼容性
            var replaceRules = {
                's1': 'Save 1 || Keep 1',
                'ht': 'Hotel',
                'ps': 'Power Station',
                'rt': 'Roof Top',
                'gy': 'Graveyard',
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
                '-r': ' Rip',
                '-n': ' Normal',
                '-h': ' Hard',
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
                'ss': 'Shopping Surging'
            };

            // 循环判断 replaceRules
            for (var key in replaceRules) {

                // 定义 [ skip ] 用于判断是否跳过循环 默认 false
                var skip = false;

                // 如果数据包中的Java字符串包含 [ key ] 属性 Java字符串才能使用contains
                if (thePacket.message.contains(key)) {

                    // 创建包含关键词和它们对应的键的对象
                    var keywords = {
                        'difficult': 'ult',
                        'dead': 'de',
                        'mode': 'de',
                        'ligh': 'gh',
                        'Ligh': 'gh',
                        'light': 'ht',
                        'Light': 'ht',
                        'craft': 'ft',
                    };

                    // 循环判断关键词
                    for (var keyword in keywords) {

                        // 如果检测到含有关键词并且关键词含有补全的缩写
                        if (thePacket.message.contains(keyword) && key === keywords[keyword]) {

                            // 进行跳过关键词
                            skip = true;

                            // 退出循环
                            break;
                        }
                    }

                    // 如果要跳过关键词
                    if (skip) {

                        // 跳过循环
                        continue;
                    }


                    // 全局匹配 [ key ] 替换成 [ key ] 对应的值
                    theMessage = theMessage.replace(new RegExp(key, 'g'), replaceRules[key]);

                    // 更新数据包的message
                    thePacket.message = theMessage;
                }
            }
        }
    };
}

// 脚本启用时调用
function onLoad() {

    // 输出一句话表示正常
    chat.print('§9' + 'ChatCompletion' + ' §2- §4Load');
}

// 创建模块的实例
var dragonChatCompletion = new TheChatCompletion();

// 定义 [ dragonChatCompletionClient ] 用于存储注册信息
var dragonChatCompletionClient;

// 脚本运行时调用
function onEnable() {

    // 注册
    dragonChatCompletionClient = moduleManager.registerModule(dragonChatCompletion);
}

// 脚本禁用时调用
function onDisable() {

    // 注销
    moduleManager.unregisterModule(dragonChatCompletionClient);
}