// 定义脚本名称
var scriptName = 'AutoChange';

// 定义脚本版本
var scriptVersion = '0.0.1';

// 定义脚本作者
var scriptAuthor = ['ColdDragon'];

var S02PacketChat = Java.type('net.minecraft.network.play.server.S02PacketChat');
var S03PacketTimeUpdate = Java.type('net.minecraft.network.play.server.S03PacketTimeUpdate');
var RenderUtils = Java.type('net.ccbluex.liquidbounce.utils.render.RenderUtils');
var S0BPacketAnimation = Java.type('net.minecraft.network.play.server.S0BPacketAnimation');

// 定义模块的构造函数
function theAutoChange() {

    // 定义 [ setting ] 对象 用于提供选项
    var setting = {
        // 浮点数选项 [ 名称 默认值 最小值 最大值 ]
        float: function (name, def, min, max) {
            return value.createFloat(name, def, min, max);
        },

        // 整数选项 [ 名称 默认值 最小值 最大值 ]
        integer: function (name, def, min, max) {
            return value.createInteger(name, def, min, max);
        },

        // 布尔值选项 [ 名称 默认值 ]
        boolean: function (name, def) {
            return value.createBoolean(name, def);
        },

        // 列表选项 [ 名称 数组 默认值 ]
        list: function (name, values, def) {
            return value.createList(name, values, def);
        }
    }

    // 定义 [ settings ] 对象 用于设置选项
    var settings = {
        神龙死于多少: setting.integer('神龙死于多少', 101, 1, 105),
        神龙会不会通关单刷啊啊: setting.boolean('神龙会不会通关单刷啊啊', false),
        神龙爆压苏北辞的概率: setting.float('神龙爆压苏北辞的概率', 0.4, 0.1, 1),
        神龙的选择怎么打: setting.list('神龙选择怎么打', ['2+2', '3+1', 'cc 0d'], '2+2')
    };

    // 定义模块选项
    this.addValues = function (values) {
        for (var i in settings) {
            values.add(settings[i])
        }
    };

    // 定义模块名称
    this.getName = function () {
        return 'AutoChange';
    };

    // 定义模块描述
    this.getDescription = function () {
        return 'ColdDragon';
    };

    // 定义模块归类
    this.getCategory = function () {
        return 'Combat';
    };

    // 定义 [ tick ] 用于计数
    var tick;

    // 模块启用时调用一次
    this.onEnable = function () {
        tick = 0;
    };

    // 模块更新时调用
    this.onUpdate = function () {
        tick++;
    };

    // 模块禁用时调用一次
    this.onDisable = function () { };

    // 判断枪械是否处于换弹
    function onLoad(count) {

        // 获取即将切到的物品对象
        item = mc.thePlayer.inventory.getStackInSlot(count);

        // 如果没有物品
        if (item == null) {

            // 返回 true 
            return true;
        }

        // 获取物品总耐久
        var totalDurability = item.getMaxDamage();

        // 计算物品剩余耐久 = 总耐久 - 获取已消耗的耐久
        var currentDurability = totalDurability - item.getItemDamage();

        // 如果总耐久小于 0 
        if (totalDurability <= 0) {

            // 非枪械 返回true
            return true;
        } /* 不需要else 有return就不会执行下面的语句了 */

        // 如果满耐久
        if (currentDurability == totalDurability) {

            // 有子弹 返回 false
            return false;
        }


        // 如果剩余的耐久小于 4
        if (currentDurability < 4) {

            // 有假子弹 返回 false
            return false;
        }

        // 如果剩余耐久小于总耐久
        if (currentDurability < totalDurability) {
            
            // 没子弹 返回
            return true;
        }
    }
}

// 脚本启用时调用
function onLoad() {

    // 输出一句话表示正常
    chat.print('§9' + 'AutoChange' + ' §2- §4Load');
}

// 创建模块的实例 [ dragon ]
var dragonAutoChange = new theAutoChange();

// 定义 [ Client ] 用于存储注册信息
var dragonAutoChangeClient;

// 脚本运行时调用
function onEnable() {

    // 注册
    dragonAutoChangeClient = moduleManager.registerModule(dragonAutoChange);
}

// 脚本禁用时调用
function onDisable() {

    // 注销
    moduleManager.unregisterModule(dragonAutoChangeClient);
}