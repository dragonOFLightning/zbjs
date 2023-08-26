// 定义脚本名称
var scriptName = 'JS';

// 定义脚本版本
var scriptVersion = '1.0.0';

// 定义脚本作者
var scriptAuthor = ['ColdDragon'];

// 引入本地聊天数据包 [ C01PacketChatMessage ]
var C01PacketChatMessage = Java.type('net.minecraft.network.play.client.C01PacketChatMessage');

// 引入网络聊天数据包 [ S02PacketChat ]
var S02PacketChat = Java.type('net.minecraft.network.play.server.S02PacketChat');

// 引入世界时间数据包 [ S03PacketTimeUpdate ]
var S03PacketTimeUpdate = Java.type('net.minecraft.network.play.server.S03PacketTimeUpdate');

// 引入渲染工具 [ RenderUtils ]
var RenderUtils = Java.type('net.ccbluex.liquidbounce.utils.render.RenderUtils');

// 引入BlockPos对象 用于存储三维坐标
var BlockPos = Java.type('net.minecraft.util.BlockPos');

// 引入动画数据包 [ S0BPacketAnimation ]
var S0BPacketAnimation = Java.type('net.minecraft.network.play.server.S0BPacketAnimation');

// 引入 LiquidBounce 可单纯用于关闭模块
var LiquidBounce = Java.type('net.ccbluex.liquidbounce.LiquidBounce');

// 引入颜色对象 [ Color ]
var Color = Java.type('java.awt.Color');

// 引入容器对象 [ AxisAlignedBB ]
var AxisAlignedBB = Java.type('net.minecraft.util.AxisAlignedBB');

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
    }

    // 定义 [ settings ] 对象 用于设置选项
    var settings = {
        神龙死于多少: setting.integer('神龙死于多少', 101, 1, 105),
        神龙会不会通关单刷啊啊: setting.boolean('神龙会不会通关单刷啊啊', false),
        神龙爆压苏北辞的概率: setting.float('神龙爆压苏北辞的概率', 0.4, 0.1, 1),
        神龙的选择怎么打: setting.list('神龙选择怎么打', ['2+2', '3+1', 'cc 0d'], '2+2'),
        神龙站在哪个方块: setting.block('神龙站在哪个方块上', 0),
        神龙站在哪个方块: setting.text('神龙站在哪个方块上', '基岩')
    };

    // 定义模块选项
    this.addValues = function (values) {
        for (var i in settings) {
            values.add(settings[i])
        }
    };

    // 定义模块名称
    this.getName = function () {
        return 'JS'
    };

    // 定义模块描述
    this.getDescription = function () {
        return 'ColdDragon'
    };

    // 定义模块归类
    this.getCategory = function () {
        return 'Fun'
    };

    // 模块启用时调用
    this.onEnable = function () {};

    // 模块更新时调用
    this.onUpdate = function () {};

    // 模块禁用时调用
    this.onDisable = function () {};

    // 模块检测到数据包时调用
    this.onPacket = function (event) {
        // 获取包
        var thePacket = event.getPacket();
        // 如果包的类型是..
        if (thePacket /*instanceof packetName*/ ) {}
    };

    // 定义模块渲染2D
    this.onRender2D = function () {
        // 在屏幕上渲染文本
        mc.fontRendererObj.drawString('神龙啊啊啊', 9, 450, 0x8B0000);
    };

    // 定义模块渲染3D
    this.onRender3D = function () {
        // 在特定坐标渲染文本
        RenderUtils.renderNameTag('三维坐标', 1, 1, 1);
    };

    // 攻击实体时调用
    this.onAttack = function (event) {
        // 获取攻击的实体
        event.getTargetEntity();
    };

    // 按下键盘时调用
    this.onKey = function (event) {
        // 获取按键ID
        event.getKey();
    };

    // 点击方块时调用
    this.onClickBlock = function (event) {
        // 获取方块的三维坐标
        event.getClickedBlock()
    }
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