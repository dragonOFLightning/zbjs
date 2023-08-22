// 定义脚本名称
var scriptName = 'TickChange';

// 定义脚本版本
var scriptVersion = '1.0.0';

// 定义脚本作者
var scriptAuthor = ['ColdDragon'];

// 引入 [ Tools.js ] 脚本工具
script.import('Tools.js');

// 定义模块的构造函数
function theTickChange() {

    // 定义模块名称
    this.getName = function () {
        return 'TickChange';
    };

    // 定义模块描述
    this.getDescription = function () {
        return 'ColdDragon';
    };

    // 定义模块归类
    this.getCategory = function () {
        return 'Fun';
    };

    // 模块更新时调用
    this.onUpdate = function () {

        // 获取最近的玩家
        var player = getPlayerList()[1];

        // 获取玩家的物品
        var item = player.inventory.getStackInSlot(0).getDisplayName();

        // 循环获取快捷栏
        for (var i = 0; i < 9; i++) {

            // 如果获取到的快捷栏没有物品
            if (!mc.thePlayer.inventory.getStackInSlot(i)) {

                // 下一次循环
                continue;
            }

            // 获取快捷栏上的物品
            var selfItem = mc.thePlayer.inventory.getStackInSlot(i).getDisplayName();

            // 如果物品是其他玩家的物品
            if (selfItem == item) {

                // 切换快捷栏
                mc.thePlayer.inventory.currentItem = i;
            }
        }
    };
}

// 脚本启用时调用
function onLoad() {

    // 输出一句话表示正常
    chat.print('§9' + 'TickChange' + ' §2- §4Load');
}

// 创建模块的实例 [ dragonTickChange ]
var dragonTickChange = new theTickChange();

// 定义 [ dragonTickChange ] 用于存储注册信息
var dragonTickChangeClient;

// 脚本运行时调用
function onEnable() {

    // 注册
    dragonTickChangeClient = moduleManager.registerModule(dragonTickChange);
}

// 脚本禁用时调用
function onDisable() {

    // 注销
    moduleManager.unregisterModule(dragonTickChangeClient);
}