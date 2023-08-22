/*
    快速切枪 但也只能 快速切枪 TG的意思就是to gun
    如你说见 这个脚本就是反复执行切换 不具备自适应的功能
    但至少对某些菜鸟或者切换都懒得切的玩家比较有用
*/

// 脚本名称
var scriptName = 'FastChange-TG';

// 脚本版本
var scriptVersion = '2.0.0';

// 脚本作者
var scriptAuthor = ['ColdDragon'];

// 定义 [ tick ] [ zapperTick ] 分别用于计数
var tick, zapperTick;

// 定义模块构造函数 [ theFastChange ]
function theFastChange() {

    // 定义列表 [ mode ] 选项名 [ ChangeMode ] 默认赋值为 [ '234' ] 意为 [ 切换的模式 ]
    var mode = value.createList('ChangeMode', ['234', '23', '24', '34', 'AFK'], '234');

    // 定义整数拖动条 [ zapper ] 选项名 [ ZapperCount ] 默认赋值为 [ 25 ] 意为 [ 间隔多少tick诈骗一次 ]
    var zapper = value.createInteger('ZapperCount', 25, 5, 40);

    // 定义布尔值 [ zapperMode ] 选项名 [ ZapperMode ] 默认赋值为 [ false ] 意为 [ 诈骗模式 ]
    var zapperMode = value.createBoolean('ZapperMode', false);

    // 模块动态添加数值
    this.addValues = function (values) {

        // 添加 [ mode ]
        values.add(mode);

        // 添加 [ zapper ]
        values.add(zapper);

        // 添加 [ zapperMode ]
        values.add(zapperMode);
    };
    // 模块名称
    this.getName = function () {
        return 'FastChange-TG'
    };
    // 模块描述
    this.getDescription = function () {
        return 'ColdDragon'
    };
    // 模块分类
    this.getCategory = function () {
        return 'Combat'
    };
    // 模块初始化
    this.onEnable = function () {

        // 初始化 [ tick ] [ zapperTick ] 的值为 1
        tick = 1; zapperTick = 1;
    };
    // 模块生命周期函数
    this.onUpdate = function () {

        // 如果 [ mode ] 选择了 '234 相当于在快捷栏索引 1~3之间来回切
        if (mode.get() == '234') {

            // 切换快捷栏到 [ tick ] 索引
            mc.thePlayer.inventory.currentItem = tick;

            // 如果 [ tick ] 大于等于 [ 3 ]
            if (tick >= 3) {

                // 设 [ tick ] 为 [ 0 ]
                tick = 0;
            }
            // 否则 如果 [ mode ] 选择了 '23' 相当于在快捷栏索引 1~2之间来回切
        } else if (mode.get() == '23') {

            // 切换快捷栏到 [ tick ] 索引
            mc.thePlayer.inventory.currentItem = tick;

            // 如果 [ tick ] 大于等于 [ 2 ]
            if (tick >= 2) {

                // 设 [ tick ] 为 [ 0 ]
                tick = 0;
            }
            // 如果 [ zapperMode ] 开启
            if (zapperMode.get()) { // 相当于间隔 zapperTick 诈骗一次

                // [ zapperTick ] 自增
                zapperTick++;

                // 如果 [ zapperTick ] 等于 [ zapper ] 即用户设定的值
                if (zapperTick == zapper.get()) {

                    // 切到快捷栏 [ 3 ] 索引
                    mc.thePlayer.inventory.currentItem = 3;

                    // 重置 [ zapperTick ]
                    zapperTick = 0;
                }
            }
            // 否则 如果 [ mode ] 选择了 '23'
        } else if (mode.get() == '24') { // 相当于在快捷栏索引 1 和 3 之间来回切

            // 切换快捷栏到 [ tick ] 索引
            mc.thePlayer.inventory.currentItem = tick;

            // 如果 [ tick ] 大于等于 [ 2 ]
            if (tick >= 2) {

                // 切换快捷栏到 [ 3 ] 索引
                mc.thePlayer.inventory.currentItem = 3;

                // 重置 [ tick ]
                tick = 0;
            }
            // 如果 [ zapperMode ] 开启
            if (zapperMode.get()) { // 相当于间隔 zapperTick 诈骗一次

                // [ zapperTick ] 自增
                zapperTick++;

                // 如果 [ zapperTick ] 等于 [ zapper ] 即用户设定的值
                if (zapperTick == zapper.get()) {

                    // 切到快捷栏 [ 2 ] 索引
                    mc.thePlayer.inventory.currentItem = 2;

                    // 重置 [ zapperTick ]
                    zapperTick = 0;
                }
            }
            // 否则 如果 [ mode ] 选择了 '34'
        } else if (mode.get() == '34') { // 相当于在快捷栏索引 2~3 之间来回切换

            // 切换快捷栏到 [ tick ] 索引
            mc.thePlayer.inventory.currentItem = tick + 1;

            // 如果 [ tick ] 大于等于 [ 2 ]
            if (tick >= 2) {

                // 设 [ tick ] 等于 [ 0 ]
                tick = 0;
            }

            // 如果 [ zapperMode ] 开启
            if (zapperMode.get()) { // 相当于间隔 zapperTick 诈骗一次

                // [ zapperTIck ] 自增 
                zapperTick++;

                // 如果 [ zapperTick ] 等于 [ zapper ] 即用户设定的值
                if (zapperTick == zapper.get()) {

                    // 切到快捷栏 [ 1 ] 索引
                    mc.thePlayer.inventory.currentItem = 1;

                    // 重置 [ zapperTick ]
                    zapperTick = 0;
                }
            }
            // 否则 如果 [ mode ] 选择了 'AFK'
        } else if (mode.get() == 'AFK') { // 相当于在快捷栏索引 3 和 6 之间来回切 开发者无聊才设计的

            // 如果 [ tick ] 全等 [ 1 ]
            if (tick === 1) {

                // 切到快捷栏 [ 3 ] 索引
                mc.thePlayer.inventory.currentItem = 3;

                // 否则如果 [ tick ] 大于等于 [ 2 ]
            } else if (tick >= 2) {

                // 切到快捷栏 [ 6 ] 索引
                mc.thePlayer.inventory.currentItem = 6;

                // 设 [ tick ] 为 0
                tick = 0;
            }
        }
        // [ tick ] 自增
        tick++;
    };
}
// 脚本加载时调用
function onLoad() {
    // 输出一句字符串表示加载成功
    chat.print("§9FastChange-TG §2- §4Load")
}

// 创建 [ theFastChange ] 模块的实例 [ dragonFastChange ]
var dragonFastChange = new theFastChange();

// 创建注册表
var dragonFastChangeClient;

// 脚本启用时调用
function onEnable() {

    // 注册模块
    client = moduleManager.registerModule(dragonFastChange);
}

// 脚本禁用时调用
function onDisable() {

    // 注销模块
    moduleManager.unregisterModule(dragonFastChangeClient);
}