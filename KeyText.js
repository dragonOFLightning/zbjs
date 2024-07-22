/**
 * DP = Dragon Plate
 * 
 * 本脚本依赖于DragonTool 请至少使用1.1.0版本的
 * DragonTools下载链接 : https://github.com/dragonOFLightning/DragonTools/releases/
 * DragonTools请放在Minecraft根目录的scriptMods文件夹下 并一定要使用[DragonTools.jar]这个名字
 * 
 * KeyText文本宏拥抱开源 由DP-龙界板块制造 小王子开发 3dragons贡献 
 * 
 * 文本宏功能
 *  - 按下特定按键触后或者点击特定方块即可触发自动发送聊天内容
 * 
 *  - 可以设定为刷屏模式 一次触发发送多次
 * 
 *  - 可以设定为随机模式 即聊天内容会被加上随机的前后缀
 * 
 *  - 本脚本具有整活的功能 爪7 该功能后续将会升级为正式的功能
 * 
 *  - 可以在游戏中自定义快捷键对应文本内容
 * 
 *  - 可以在scriptsMods文件夹中的KeyText.json文件中自定义点击哪些方块触发哪些内容 方块是用三维坐标表示的
 *  - 如果没有找到KeyText.json这个文件 那你需要运行运行一次KeyText json文件会自动生成
 * 
 * 代码说明
 *  - 这个脚本已经重度依赖DragonTools 你不会在js代码中看到任何底层代码
 * 
 * 依赖说明
 *  - DragonTool.jar 龙界板块制造 冰龙开发
 */

/**脚本名称 */
var scriptName = 'KeyText'

/**脚本版本 */
var scriptVersion = '2.0.0'

/**脚本作者 */
var scriptAuthor = ['CheemsSheep']

/**类加载器 */
var URLClassLoader = Java.type('java.net.URLClassLoader')

/**文件 */
var File = Java.type('java.io.File')

/**线程 */
var Thread = Java.type('java.lang.Thread')

/**基本数据类型 整数 */
var int = Java.type('int')

/**基本数据类型 布尔*/
var boolean = Java.type('boolean')

/**数据类型 字符串*/
var String = Java.type('java.lang.String')

/**方块坐标类型 */
var BlockPos = Java.type('net.minecraft.util.BlockPos')


// 选项的类型就这些 无需更改此
/**提供选项 */
var setting = {
    /**
     * @function boolean 布尔值选项
     * @param {string} name 选项名称
     * @param {boolean} def 选项默认值
     * @returns {object} 选项
     */
    boolean: function (name, def) {
        return value.createBoolean(name, def)
    },

    /**
     * @function text 文本选项
     * @param {string} name 选项名称 
     * @param {string} def 选项默认值
     * @returns {object} 选项
     */
    text: function (name, def) {
        return value.createText(name, def)
    },
}

/**设置选项 */
var settings = {
    /**点击特定方块时自动发生特定内容的聊天 */
    clickSend: setting.boolean('ClickSend', true),

    /**发送的聊天具有随机前后缀 */
    random: setting.boolean('Random', false),

    /**刷屏 */
    spammer: setting.boolean('Spammer', true),

    /**按下Z键自动连续发送爪7 */ // 此为整活功能
    send爪7: setting.boolean('Send爪7', true),

    /**文本宏配置 */ // 配置代码 : 快捷键-内容,快捷键-内容
    config: setting.text('Config', 'T-V')
}

/**DragonTools.jar @constant*/
var DragonToolsFile = new File('scriptsMods/DragonTools.jar')
/**DragonTools.jar URL @constant*/
var DragonToolsURL = DragonToolsFile.toURI().toURL()
/**DragonTools @constant*/
var DragonToolsClass = new URLClassLoader([DragonToolsURL], Thread.currentThread().getContextClassLoader())
/**龙工具 @constant*/
var DT = {
    /**文本宏 - Key 类 */
    Key: DragonToolsClass.loadClass('tk.module.key_text.Key'),

    /**文本宏 - ClickBlock 类 */
    ClickBlock: DragonToolsClass.loadClass('tk.module.key_text.ClickBlock')
}

var onKey = DT.Key.getDeclaredMethod('run', String.class, int.class, boolean.class, boolean.class, boolean.class)

var onClickBlock = DT.ClickBlock.getDeclaredMethod('run', boolean.class, BlockPos.class, boolean.class, boolean.class)

/**
 * @function KeyText_onKey 监听到按键事件时调用
 * @param {net.ccbluex.liquidbounce.event.KeyEvent} event 
 */
function KeyText_onKey(event) {
    /**@type {integer} 按下键的键值*/
    var keyID = event.getKey()

    onKey.invoke(null, settings.config.get(), keyID, settings.random.get(), settings.spammer.get(), settings.send爪7.get())
}

/**
 * @function KeyText_onClickBlock 监听到点击方块事件时调用
 * @param {net.ccbluex.liquidbounce.event.ClickBlockEvent} event 
 */
function KeyText_onClickBlock(event) {

    /**@type {net.minecraft.util.BlockPos} 方块*/
    var blockPos = event.getClickedBlock()

    onClickBlock.invoke(null, settings.clickSend.get(), blockPos, settings.spammer.get(), settings.random.get())

}

/**@class KeyText 模块*/
function KeyText() { }
/**@override 模块名称*/
KeyText.prototype.getName = function () { return 'KeyText' }
/**@override 模块描述*/
KeyText.prototype.getDescription = function () { return 'CheemsSheep' }
/**@override 模块类型*/
KeyText.prototype.getCategory = function () { return 'Fun' }
/**@override */
KeyText.prototype.onKey = KeyText_onKey
/**@override */
KeyText.prototype.onClickBlock = KeyText_onClickBlock
/**@override 覆写添加值函数 用于给模块添加选项*/
KeyText.prototype.addValues = function (values) {
    for (var key in settings) {
        values.add(settings[key])
    }
}

/**脚本启用时调用 */
function onLoad() {

    // 文字反馈模块已加载
    chat.print('§9KeyText §2- §4Load')
}

/**@type {object} 定义脚本模块*/
var scriptModule

/**脚本运行时调用 */
function onEnable() {

    // 注册模块
    scriptModule = moduleManager.registerModule(new KeyText())
}

/**脚本禁用时调用 */
function onDisable() {

    // 注销模块
    moduleManager.unregisterModule(scriptModule)
}