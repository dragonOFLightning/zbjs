/*
    这是一个LiquidBounce的JavaScript脚本的模板
    正在持续更新 当前更新日期 UTC+8 2023-12-17
    原版教程在 github.com/CCBlueX/LiquidScript
*/

// 定义脚本名称
var scriptName = 'JS';

// 定义脚本版本
var scriptVersion = '1.0.0';

// 定义脚本作者
var scriptAuthor = ['ColdDragon'];

// ######## - net.minecraft.network.play.client - ########
/**@type {net.minecraft.network.play.client.C08PacketPlayerBlockPlacement} 引入客户端放置数据包类型*/
var C08PacketPlayerBlockPlacement = Java.type('net.minecraft.network.play.client.C08PacketPlayerBlockPlacement');

/**@type {net.minecraft.network.play.client.C07PacketPlayerDigging} 引入客户端挖掘数据包类型*/
var C07PacketPlayerDigging = Java.type('net.minecraft.network.play.client.C07PacketPlayerDigging');

/**@type {net.minecraft.network.play.client.C01PacketChatMessage'} 引入客户端聊天数据包类型*/
var C01PacketChatMessage = Java.type('net.minecraft.network.play.client.C01PacketChatMessage');

// ######## - net.minecraft.network.play.server - ########
/**@type {net.minecraft.network.play.server.S03PacketTimeUpdate} 引入世界时间数据包类型*/
var S03PacketTimeUpdate = Java.type('net.minecraft.network.play.server.S03PacketTimeUpdate');

/**@type {net.minecraft.network.play.server.S0BPacketAnimation} 引入动画数据包类型*/
var S0BPacketAnimation = Java.type('net.minecraft.network.play.server.S0BPacketAnimation');

/**@type {net.minecraft.network.play.server.S02PacketChat} 引入服务器聊天数据包类型*/
var S02PacketChat = Java.type('net.minecraft.network.play.server.S02PacketChat');

/**@type {net.minecraft.network.play.server.S45PacketTitle} 引入服务器标题数据包类型*/
var S45PacketTitle = Java.type('net.minecraft.network.play.server.S45PacketTitle');

// ######## - net.minecraft.entity - ########
/**@type {net.minecraft.entity.item.EntityArmorStand} 引入实体盔甲架类型*/
var EntityArmorStand = Java.type('net.minecraft.entity.item.EntityArmorStand');

/**@type {net.minecraft.entity.player.EntityPlayer} 引入实体玩家*/
var EntityPlayer = Java.type('net.minecraft.entity.player.EntityPlayer');

// ######## - net.minecraft.item - ########
/**@type {net.minecraft.item} 引入物品剑*/
var ItemSword = Java.type('net.minecraft.item.ItemSword');

// ######## - net.minecraft.util - ########
/**@type {net.minecraft.util.AxisAlignedBB} 引入容器类型*/
var AxisAlignedBB = Java.type('net.minecraft.util.AxisAlignedBB');

/**@type {net.minecraft.util.EnumFacing} 引入方块朝向枚举类*/
var EnumFacing = Java.type('net.minecraft.util.EnumFacing');

/**@type {net.minecraft.util.BlockPos} 引入方块坐标数据类型*/
var BlockPos = Java.type('net.minecraft.util.BlockPos');

// ######## - net.ccbluex - ########
/**@type {net.ccbluex.liquidbounce.utils.render.RenderUtils} 引入渲染工具*/
var RenderUtils = Java.type('net.ccbluex.liquidbounce.utils.render.RenderUtils');

// ######## - java - ########
/**@type {java.awt.Color} 引入颜色类型*/
var Color = Java.type('java.awt.Color');

/**@type {java.util.Timer} 引入计时器类型*/
var Timer = Java.type('java.util.Timer');

/**@type {java.util.TimerTask} 引入抽象计时器类型*/
var TimerTask = Java.type('java.util.TimerTask');

// 定义模块的构造函数
function TheJS() {

    // 定义 [ setting ] 对象 用于提供选项
    var setting = {

        // 浮点数选项 [ string名称名称 number默认值 number最小值 number最大值 ]
        float: function (name, def, min, max) {
            return value.createFloat(name, def, min, max);
        },

        // 整数选项 [ string名称 number默认值 number最小值 number最大值 ]
        integer: function (name, def, min, max) {
            return value.createInteger(name, def, min, max);
        },

        // 列表选项 [ string名称 array数组 string默认值 ]
        list: function (name, values, def) {
            return value.createList(name, values, def);
        },

        // 布尔值选项 [ string名称 boolean默认值 ]
        boolean: function (name, def) {
            return value.createBoolean(name, def);
        },

        // 文本选项 [ string名称 string默认值 ]
        text: function (name, def) {
            return value.createText(name, def);
        },

        // 方块选项 [ string名称 number默认值]
        block: function (name, def) {
            return value.createBlock(name, def);
        }
    };

    // 定义 [ settings ] 对象 用于设置选项
    var settings = {
        round: setting.integer('round', 101, 1, 105),
        true: setting.boolean('true', false),
        $100: setting.float('$100%', 0.4, 0.1, 1),
        simple: setting.list('simple', ['2+2', '3+1', 'cc 0d'], '2+2'),
        number: setting.block('number', 0),
        text: setting.text('text', '基岩')
    };

    /**@override 定义模块选项 */
    this.addValues = function (values) {
        for (var i in settings) {
            values.add(settings[i])
        }
    };

    /**@override 定义模块名称 */
    this.getName = function () {
        return 'JS'
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
    this.onEnable = function () { };

    /**@override 每一tick更新时调用 */
    this.onUpdate = function () { };

    /**@override 模块禁用时调用 */
    this.onDisable = function () { };

    /**
     * @override 模块检测到数据包时调用 
     * @param {net.ccbluex.liquidbounce.event.PacketEvent} event 数据包事件
     */
    this.onPacket = function (event) {

        // 获取包
        var thePacket = event.getPacket();

        // 如果数据包 的类型是 C01PacketChatMessage
        if (thePacket instanceof C01PacketChatMessage) { }
    };

    /**
     * @override 模块渲染2D时调用
     * @param {net.ccbluex.liquidbounce.event.Render2DEvent} event 渲染2D事件 这个event暂时不知道咋用
     */
    this.onRender2D = function (event) {
        // 在屏幕上渲染带阴影的文本
        mc.fontRendererObj.drawString('神龙啊啊啊', 9, 450, 0x8B0000, true);
    };

    /**
     * @override 模块渲染3D时调用
     * @param {net.ccbluex.liquidbounce.event.Render3DEvent} event 渲染3D事件 这个event暂时不知道咋用
     */
    this.onRender3D = function (event) {
        // 在特定坐标渲染文本
        RenderUtils.renderNameTag('三维坐标', 1, 1, 1);
    };

    /**
     * @override 攻击时调用
     * @param {net.ccbluex.liquidbounce.event.AttackEvent} event 攻击事件
     */
    this.onAttack = function (event) {
        // 获取攻击的实体
        event.getTargetEntity();
    };

    /**
     * @override 按下键盘的特定键时调用
     * @param {net.ccbluex.liquidbounce.event.KeyEvent} event 按键事件
     */
    this.onKey = function (event) {
        // 获取按键ID
        event.getKey();
    };

    /**
     * @override 点击方块时调用
     * @param {net.ccbluex.liquidbounce.event.ClickBlockEvent} event 点击方块事件
     */
    this.onClickBlock = function (event) {
        // 获取方块的三维坐标
        event.getClickedBlock()
    };

    /**
     * @function getDistanceDef 用于计算三维空间中2点之间的距离
     * @param {number} x1 第一个点的 x 坐标
     * @param {number} y1 第一个点的 y 坐标
     * @param {number} z1 第一个点的 z 坐标
     * @param {number} x2 第二个点的 x 坐标
     * @param {number} y2 第二个点的 y 坐标
     * @param {number} z2 第二个点的 z 坐标
     * @returns {number} 欧几里平方
     */
    function getDistanceDef(x1, y1, z1, x2, y2, z2) {

        // 计算差值
        var x = x2 - x1;
        var y = y2 - y1;
        var z = z2 - z1;

        // 返回平方
        return x * x + y * y + z * z;
    };

    /**
     * @function inGame 用于判断是否在游戏中
     * @returns {Boolean} 是否在游戏中
     */
    function inGame() {

        // 尝试调用
        try {

            // 获取计分板名称 java.lang.String
            var name = mc.theWorld.getScoreboard().getScores()[0].getObjective().getName();

            // 判断name是否包含以下的字符串
            return name === 'PreScoreboard' || name === 'health' || name === 'health_tab' || name === 'ZScoreboard';


        } catch (error) {

            /**
             * 报错就返回 false
             * 如果没有计分板就不在游戏 因为游戏默认都有计分板
             */
            return false;
        }
    };

    /**                                                                                                                                                                                                                                                             
     * @function getVolume 用于计算三维空间中2点围成的区域体积                                                                                                                                                                                                                                                          
     * @param {number} maxX 区域的最大 x 坐标                                                                                                                                                                                                                                                           
     * @param {number} maxY 区域的最大 y 坐标                                                                                                                                                                                                                                                           
     * @param {number} maxZ 区域的最大 z 坐标                                                                                                                                                                                                                                                           
     * @param {number} minX 区域中最大 x 坐标                                                                                                                                                                                                                                                           
     * @param {number} minY 区域中最大 y 坐标                                                                                                                                                                                                                                                           
     * @param {number} minZ 区域中最大 z 坐标                                                                                                                                                                                                                                                           
     * @returns {number} 体积                                                                                                                                                                                                                                                           
     */
    function getVolume(maxX, maxY, maxZ, minX, minY, minZ) {
        var lengthX = maxX - minX;
        var lengthY = maxY - minY;
        var lengthZ = maxZ - minZ;
        return lengthX * lengthY * lengthZ;
    };
}

// 脚本启用时调用
function onLoad() {

    // 输出一句话表示已加载
    chat.print('§9' + 'JS' + ' §2- §4Load');
}

// 创建模块的实例
var dragonJS = new TheJS();

// 定义 [ dragonJSClient ] 用于存储注册信息
var dragonJSClient;

// 脚本运行时调用
function onEnable() {

    // 注册
    dragonJSClient = moduleManager.registerModule(dragonJS);
}

// 脚本禁用时调用
function onDisable() {

    // 注销
    moduleManager.unregisterModule(dragonJSClient);
}