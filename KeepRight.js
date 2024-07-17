/*
    一个可以帮你长按右键的脚本
    此脚本为教育版脚本
*/

// 定义脚本名称
var scriptName = 'KeepRight';

// 定义脚本版本
var scriptVersion = '1.0.0';

// 定义脚本作者
var scriptAuthor = ['ColdDragon'];

// 定义模块的构造函数
function TheKeepRight() {

    /**@override 定义模块名称 */
    this.getName = function () {
        return 'KeepRight'
    };

    /**@override 定义模块描述 */
    this.getDescription = function () {
        return 'ColdDragon'
    };

    /**@override 定义模块归类 */
    this.getCategory = function () {
        return 'Fun'
    };

    /**@override 模块启用时调用 */
    this.onEnable = function () {
        mc.gameSettings.keyBindUseItem.pressed = true
    };

    /**@override 模块禁用时调用 */
    this.onDisable = function () {
        mc.gameSettings.keyBindUseItem.pressed = false
    };
}

// 脚本启用时调用
function onLoad() {

    // 输出一句话表示已加载
    chat.print('§9' + 'KeepRight' + ' §2- §4Load');
}

// 创建模块的实例
var dragonKeepRight = new TheKeepRight();

// 定义 [ dragonKeepRightClient ] 用于存储注册信息
var dragonKeepRightClient;

// 脚本运行时调用
function onEnable() {

    // 注册
    dragonKeepRightClient = moduleManager.registerModule(dragonKeepRight);
}

// 脚本禁用时调用
function onDisable() {

    // 注销
    moduleManager.unregisterModule(dragonKeepRightClient);
}