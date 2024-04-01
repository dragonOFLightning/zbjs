/**定义脚本名称 */
var scriptName = 'JS';

/**定义脚本版本 */
var scriptVersion = '1.0.0';

/**定义脚本作者 */
var scriptAuthor = ['yourName'];

/**客户端放置数据包类型 */
var C08PacketPlayerBlockPlacement = Java.type('net.minecraft.network.play.client.C08PacketPlayerBlockPlacement')
/**客户端挖掘数据包类型 */
var C07PacketPlayerDigging = Java.type('net.minecraft.network.play.client.C07PacketPlayerDigging')
/**客户端聊天数据包类型 */
var C01PacketChatMessage = Java.type('net.minecraft.network.play.client.C01PacketChatMessage')

/**服务器聊天数据包类型 */
var S02PacketChat = Java.type('net.minecraft.network.play.server.S02PacketChat')
/**世界时间数据包类型 */
var S03PacketTimeUpdate = Java.type('net.minecraft.network.play.server.S03PacketTimeUpdate')
/**服务器标题数据包类型 */
var S45PacketTitle = Java.type('net.minecraft.network.play.server.S45PacketTitle')
/**动画数据包类型 */
var S0BPacketAnimation = Java.type('net.minecraft.network.play.server.S0BPacketAnimation')

/**实体盔甲架类型 */
var EntityArmorStand = Java.type('net.minecraft.entity.item.EntityArmorStand')
/**实体玩家类型 */
var EntityPlayer = Java.type('net.minecraft.entity.player.EntityPlayer')

/**物品剑类型 */
var ItemSword = Java.type('net.minecraft.item.ItemSword')

/**实体或方块边界框类型 */
var AxisAlignedBB = Java.type('net.minecraft.util.AxisAlignedBB')
/**方块朝向枚举类型 */
var EnumFacing = Java.type('net.minecraft.util.EnumFacing')
/**方块坐标类型 */
var BlockPos = Java.type('net.minecraft.util.BlockPos')

/**CCBlueX的渲染引擎 */
var RenderUtils = Java.type('net.ccbluex.liquidbounce.utils.render.RenderUtils')

/**颜色类 */
var Color = Java.type('java.awt.Color')
/**计时器类 */
var Timer = Java.type('java.util.Timer')
/**计时器任务类 */
var TimerTask = Java.type('java.util.TimerTask')

// 选项的类型就这些 无需更改此
/**定义 [ setting ] 对象 用于提供选项 */
var setting = {

    /**
     * @function float 浮点数选项
     * @param {string} name 选项名称
     * @param {float} def 选项默认值
     * @param {float} min 选项最小值
     * @param {float} max 选项最大值
     * @returns {object} 选项
     */
    float: function (name, def, min, max) {
        return value.createFloat(name, def, min, max);
    },

    /**
     * @function integer 浮点数选项
     * @param {string} name 选项名称
     * @param {integer} def 选项默认值
     * @param {integer} min 选项最小值
     * @param {integer} max 选项最大值
     * @returns {object} 选项
     */
    integer: function (name, def, min, max) {
        return value.createInteger(name, def, min, max);
    },

    /**
     * @function list 列表选项
     * @param {string} name 选项名称
     * @param {Array<string>} values 选项可选值
     * @param {string} def 选项默认值
     * @returns {object} 选项
     */
    list: function (name, values, def) {
        return value.createList(name, values, def);
    },

    /**
     * @function boolean 布尔值选项
     * @param {string} name 选项名称
     * @param {boolean} def 选项默认值
     * @returns {object} 选项
     */
    boolean: function (name, def) {
        return value.createBoolean(name, def);
    },

    /**
     * @function text 文本选项
     * @param {string} name 选项名称 
     * @param {string} def 选项默认值
     * @returns {object} 选项
     */
    text: function (name, def) {
        return value.createText(name, def);
    },

    // 该选项类似integer 有进度条可以滑动 根据滑动选择的数字映射对应的方块
    /**
     * @function block 方块选项
     * @param {string} name 选项名称
     * @param {integer} def 选项默认值
     * @returns {object} 选项
     */
    block: function (name, def) {
        return value.createBlock(name, def);
    }
}

function JS() {
    /**@override 模块名称*/
    this.getName = function () {
        return 'JS'
    }

    /**@override 模块描述*/
    this.getDescription = function () {
        return 'yourName'
    }

    /**@override 模块类型*/
    this.getCategory = function () {
        return 'Fun'
    }

    /**@override 模块添加选项值*/
    this.addValues = function (values) {
    }

    /**@override 模块启用时调用*/
    this.onEnable = function () {
    }

    /**@override 每tick调用*/
    this.onUpdate = function () {
    }

    /**@override 模块关闭时调用*/
    this.onDisable = function () {

    }

    /**
     * @override 监听到Packet事件时调用
     * @param {net.ccbluex.liquidbounce.event.PacketEvent} event
     */
    this.onPacket = function (event) {
        var packet = event.getPacket()
    }

    /**
     * @override 监听到渲染2D事件时调用
     * @param {net.ccbluex.liquidbounce.event.Render2DEvent} event
     */
    this.onRender2D = function (event) {
    }

    /**
     * @override 监听到渲染3D事件时调用
     * @param {net.ccbluex.liquidbounce.event.Render3DEvent} event 
     */
    this.onRender3D = function (event) {

    }

    /**
     * @override 监听到攻击事件时调用
     * @param {net.ccbluex.liquidbounce.event.AttackEvent} event 
     */
    this.onAttack = function (event) {
        var targetEntity = event.getTargetEntity()
    }

    /**
     * @override 监听到按键事件时调用
     * @param {net.ccbluex.liquidbounce.event.KeyEvent} event 
     */
    this.onKey = function (event) {
        var keyID = event.getKey()
    }

    /**
     * @override 监听到点击方块事件时调用
     * @param {net.ccbluex.liquidbounce.event.ClickBlockEvent} event 
     */
    this.onClickBlock = function (event) {
        var block = event.getClickedBlock();
    }
}

/**脚本启用时调用 */
function onLoad() {

    // 文字反馈模块已加载
    chat.print('§9JS §2- §4Load');
}

/**@type {object} 定义脚本模块*/
var scriptModule;

/**脚本运行时调用 */
function onEnable() {

    // 注册模块
    scriptModule = moduleManager.registerModule(new JS());
}

/**脚本禁用时调用 */
function onDisable() {

    // 注销模块
    moduleManager.unregisterModule(scriptModule);
}