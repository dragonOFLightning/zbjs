/**
 * DP = Dragon Plate
 * 龙界板块制造 冰龙开发 3dragons贡献
 * 
 * 渲染每秒点击次数
 *  - 统计你每秒点击的次数 此脚本统计的是与方块互动的次数 也就是你的放置次数
 *  - 此脚本允许您通过修改设置以自定义渲染的位置和渲染的颜色
 *  - 这里所说的每秒点击次数 实质是你每秒与方块互动的次数
 * 
 * 彩蛋: 在单机模式下可能会测出二倍的CPS值
 */

/**@constant 脚本名称 */
var scriptName = 'RenderCPS'

/**@constant 脚本版本 */
var scriptVersion = '1.0.1'

/**@constant 脚本作者 */
var scriptAuthor = ['ColdDragon']

var Timer = Java.type('java.util.Timer')
var TimerTask = Java.type('java.util.TimerTask')

/**@constant 提供选项 */
var setting = {
    /**
     * @constant 整数选项拖动条
     * @param {string} name 选项名称
     * @param {integer} def 选项默认值
     * @param {integer} min 选项最小值
     * @param {integer} max 选项最大值
     * @returns {object} 选项
     */
    integer: function (name, def, min, max) {
        return value.createInteger(name, def, min, max);
    },
}

/**@constant 设置选项 */
var settings = {
    renderX: setting.integer('RenderX', 0, 0, 2e3),
    renderY: setting.integer('RenderY', 0, 0, 1090),
    red: setting.integer('Red', 0, 0, 255),
    green: setting.integer('Green', 255, 0, 255),
    blue: setting.integer('Blue', 255, 0, 255),
}

var timer
var countC08P

var renderMessage = {
    CPS: 0
}

// 生命周期函数的命名方式为 模块名_生命周期函数名
/**@constant {function} RenderCPS_onEnable 模块启用时调用 */
function RenderCPS_onEnable() {
    timer && timer.cancel()
    countC08P = 0
    timer = new Timer()
    var task = new TimerTask({
        run: function () {
            renderMessage.CPS = countC08P
            countC08P = 0
        }
    })
    timer.schedule(task, 0, 1e3)
}

/**@constant {function} RenderCPS_onDisable 模块关闭时调用 */
function RenderCPS_onDisable() {
    timer && timer.cancel()
}

/**
 * @constant {function} RenderCPS_onPacket 监听到Packet事件时调用
 * @param {net.ccbluex.liquidbounce.event.PacketEvent} event 
 */
function RenderCPS_onPacket(event) {
    // 获取数据包
    var packet = event.getPacket()
    if (packet instanceof Java.type('net.minecraft.network.play.client.C08PacketPlayerBlockPlacement')) {
        if (packet.getPlacedBlockDirection() !== 255) return
        countC08P++
    }
}

/**
* @constant {function} RenderCPS_onRender2D 监听到渲染2D事件时调用
* @param {net.ccbluex.liquidbounce.event.Render2DEvent} event 
*/
function RenderCPS_onRender2D(event) {
    var red = settings.red.get().toString(16)
    var green = settings.green.get().toString(16)
    var blue = settings.blue.get().toString(16)
    var colorString = red + green + blue
    var color = parseInt(colorString, 16)
    mc.fontRendererObj.drawString(renderMessage.CPS, settings.renderX.get(), settings.renderY.get(), color, true)
}

/**@constant {class, function} RenderCPS 模块构造函数*/
function RenderCPS() { }
/**@override @constant {string} 模块名称 */
RenderCPS.prototype.getName = function () { return 'RenderCPS' }
/**@override @constant {string} 模块描述 */
RenderCPS.prototype.getDescription = function () { return 'yourName' }
/**@override @constant {string} 模块类型 */
RenderCPS.prototype.getCategory = function () { return 'Fun' }
/**@override @constant {function} */
RenderCPS.prototype.onEnable = RenderCPS_onEnable
/**@override @constant {function} */
RenderCPS.prototype.onDisable = RenderCPS_onDisable
/**@override @constant {function} */
RenderCPS.prototype.onPacket = RenderCPS_onPacket
/**@override @constant {function} */
RenderCPS.prototype.onRender2D = RenderCPS_onRender2D
/**@override @constant {function} 覆写添加值函数 用于给模块添加选项*/
RenderCPS.prototype.addValues = function (values) {
    for (var key in settings) {
        values.add(settings[key])
    }
}

/**脚本启用时调用 */
function onLoad() {

    // 文字反馈模块已加载
    chat.print('§9RenderCPS §2- §4Load')
}

/**@type {object} 定义脚本模块*/
var scriptModule

/**脚本运行时调用 */
function onEnable() {

    // 注册模块
    scriptModule = moduleManager.registerModule(new RenderCPS())
}

/**脚本禁用时调用 */
function onDisable() {
    timer && timer.cancel()

    // 注销模块
    moduleManager.unregisterModule(scriptModule)
}