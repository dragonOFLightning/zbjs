/**@constant 脚本名称 */
var scriptName = 'JS'

/**@constant 脚本版本 */
var scriptVersion = '1.0.0'

/**@constant 脚本作者 */
var scriptAuthor = ['yourName']

/**@constant Minecraft客户端的网络数据包 */
var CLIENT_PACKET = {
   /**@constant 客户端放置数据包类型 */
   C08PacketPlayerBlockPlacement: Java.type('net.minecraft.network.play.client.C08PacketPlayerBlockPlacement'),

   /**@constant 客户端挖掘数据包类型 */
   C07PacketPlayerDigging: Java.type('net.minecraft.network.play.client.C07PacketPlayerDigging'),

   /**@constant 客户端聊天数据包类型 */
   C01PacketChatMessage: Java.type('net.minecraft.network.play.client.C01PacketChatMessage'),
}

/**@constant Minecraft服务器的网络数据包 */
var SERVER_PACKET = {
   /**@constant 服务器聊天数据包类型 */
   S02PacketChat: Java.type('net.minecraft.network.play.server.S02PacketChat'),

   /**@constant 世界时间数据包类型 */
   S03PacketTimeUpdate: Java.type('net.minecraft.network.play.server.S03PacketTimeUpdate'),

   /**@constant 服务器标题数据包类型 */
   S45PacketTitle: Java.type('net.minecraft.network.play.server.S45PacketTitle'),

   /**@constant 动画数据包类型 */
   S0BPacketAnimation: Java.type('net.minecraft.network.play.server.S0BPacketAnimation'),
}

/**@constant Minecraft的实体 */
var ENTITY = {
   /**@constant 实体盔甲架类型 */
   EntityArmorStand: Java.type('net.minecraft.entity.item.EntityArmorStand'),

   /**@constant 实体玩家类型 */
   EntityPlayer: Java.type('net.minecraft.entity.player.EntityPlayer'),
}

/**@constant Minecraft的物品 */
var ITEM = {
   /**@constant 物品剑类型 */
   ItemSword: Java.type('net.minecraft.item.ItemSword'),
}

/**@constant Minecraft的工具 */
var UTIL = {
   /**@constant 实体或方块边界框类型 */
   AxisAlignedBB: Java.type('net.minecraft.util.AxisAlignedBB'),

   /**@constant 方块朝向枚举类型 */
   EnumFacing: Java.type('net.minecraft.util.EnumFacing'),

   /**@constant 方块坐标类型 */
   BlockPos: Java.type('net.minecraft.util.BlockPos'),
}

/**@constant CCBlueX的内置Java类 */
var CCBLUEX = {
   /**@constant CCBlueX的渲染引擎 */
   RenderUtils: Java.type('net.ccbluex.liquidbounce.utils.render.RenderUtils'),
}

/**@constant 原生的Java类 */
var JAVA_CLASS = {
   /**@constant 颜色类 */
   Color: Java.type('java.awt.Color'),

   /**@constant 计时器类 */
   Timer: Java.type('java.util.Timer'),

   /**@constant 计时器任务类 */
   TimerTask: Java.type('java.util.TimerTask'),

   /**@constant 类加载器 */
   URLClassLoader: Java.type('java.net.URLClassLoader'),

   /**@constant 文件 */
   File: Java.type('java.io.File'),

   /**@constant 线程 */
   Thread: Java.type('java.lang.Thread'),
}

/**@constant 提供选项 */
var setting = {

   /**
    * @constant 浮点数选项拖动条
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

   /**
    * @constant 单选项 
    * @param {string} name 选项名称
    * @param {Array<string>} values 选项可选值
    * @param {string} def 选项默认值
    * @returns {object} 选项
    */
   list: function (name, values, def) {
      return value.createList(name, values, def);
   },

   /**
    * @constant 开关选项
    * @param {string} name 选项名称
    * @param {boolean} def 选项默认值
    * @returns {object} 选项
    */
   boolean: function (name, def) {
      return value.createBoolean(name, def);
   },

   /**
    * @constant 文本选项
    * @param {string} name 选项名称 
    * @param {string} def 选项默认值
    * @returns {object} 选项
    */
   text: function (name, def) {
      return value.createText(name, def);
   },

   // 该选项类似integer 有进度条可以滑动 根据滑动选择的数字映射对应的方块
   /**
    * @constant 方块选项
    * @param {string} name 选项名称
    * @param {integer} def 选项默认值
    * @returns {object} 选项
    */
   block: function (name, def) {
      return value.createBlock(name, def);
   }
}

/**@constant 设置选项 */
var settings = {
   round: setting.integer('round', 101, 1, 105),
   enableFeature: setting.boolean('enableFeature', false),
   percentage: setting.float('percentage', 0.4, 0.1, 1),
   mode: setting.list('mode', ['Option1', 'Option2', 'Option3'], 'Option1'),
   selectedBlock: setting.block('selectedBlock', 0),
   description: setting.text('description', 'demo'),
}

// 生命周期函数的命名方式为 模块名_生命周期函数名
/**@constant {function} JS_onEnable 模块启用时调用 */
function JS_onEnable() { }

/**@constant {function} JS_onUpdate 每tick调用 */
function JS_onUpdate() { }

/**@constant {function} JS_onDisable 模块关闭时调用 */
function JS_onDisable() { }

/**
 * @constant {function} JS_onPacket 监听到Packet事件时调用
 * @param {net.ccbluex.liquidbounce.event.PacketEvent} event 
 */
function JS_onPacket(event) {
   // 获取数据包
   var packet = event.getPacket()
}

/**
* @constant {function} JS_onRender2D 监听到渲染2D事件时调用
* @param {net.ccbluex.liquidbounce.event.Render2DEvent} event 
*/
function JS_onRender2D(event) {
   // 在x=9 y=200的位置渲染颜色为[0x00ffff]的文本[至尊神龙]带阴影[true]
   mc.fontRendererObj.drawString('至尊神龙', 9, 200, 0xFFA500, true)
}

/**
 * @constant {function} JS_onRender2D 监听到渲染3D事件时调用
 * @param {net.ccbluex.liquidbounce.event.Render3DEvent} event 
 */
function JS_onRender3D(event) {
   // 在特定位置渲染三维的文本
   CCBLUEX.RenderUtils.renderNameTag('hello world', 100, 100, -100);

   // 在相对位置渲染三维的方框
   var color = new JAVA_CLASS.Color(30, 170, 255, 50)
   var box = new UTIL.AxisAlignedBB(-.5, 4, -.5, .5, 3, .5)
   CCBLUEX.RenderUtils.drawAxisAlignedBB(box, color)

   // 在绝对位置渲染三维的方框
   var renderManager = mc.getRenderManager();
   var x1 = 100 - renderManager.renderPosX
   var y1 = 60 - renderManager.renderPosY
   var z1 = -100 - renderManager.renderPosZ
   var x2 = 101 - renderManager.renderPosX
   var y2 = 61 - renderManager.renderPosY
   var z2 = -101 - renderManager.renderPosZ
   var box = new UTIL.AxisAlignedBB(x1, y1, z1, x2, y2, z2)
   CCBLUEX.RenderUtils.drawAxisAlignedBB(box, color)
}

/**
 * @constant {function} JS_onAttack 监听到攻击事件时调用
 * @param {net.ccbluex.liquidbounce.event.AttackEvent} event 
 */
function JS_onAttack(event) {
   // 获取攻击的目标实体
   var targetEntity = event.getTargetEntity()
}

/**
 * @constant {function} JS_onKey 监听到按键事件时调用
 * @param {net.ccbluex.liquidbounce.event.KeyEvent} event 
 */
function JS_onKey(event) {
   // 获取按下的键的ID
   var keyID = event.getKey()
}

/**
 * @constant {function} JS_onClickBlock 监听到点击方块事件时调用
 * @param {net.ccbluex.liquidbounce.event.ClickBlockEvent} event 
 */
function JS_onClickBlock(event) {
   // 获取点击的方块
   var block = event.getClickedBlock()
}

/**@constant {class, function} JS 模块构造函数*/
function JS() { }
/**@override @constant {string} 模块名称 */
JS.prototype.getName = function () { return 'JS' }
/**@override @constant {string} 模块描述 */
JS.prototype.getDescription = function () { return 'yourName' }
/**@override @constant {string} 模块类型 */
JS.prototype.getCategory = function () { return 'Fun' }
/**@override @constant {function} */
JS.prototype.onEnable = JS_onEnable
/**@override @constant {function} */
JS.prototype.onUpdate = JS_onUpdate
/**@override @constant {function} */
JS.prototype.onDisable = JS_onDisable
/**@override @constant {function} */
JS.prototype.onPacket = JS_onPacket
/**@override @constant {function} */
JS.prototype.onRender2D = JS_onRender2D
/**@override @constant {function} */
JS.prototype.onRender3D = JS_onRender3D
/**@override @constant {function} */
JS.prototype.onAttack = JS_onAttack
/**@override @constant {function} */
JS.prototype.onKey = JS_onKey
/**@override @constant {function} */
JS.prototype.onClickBlock = JS_onClickBlock
/**@override @constant {function} 覆写添加值函数 用于给模块添加选项*/
JS.prototype.addValues = function (values) {
   for (var key in settings) {
      values.add(settings[key])
   }
}

/**
 * @constant {function} getDistanceSQ 用于计算三维空间中二点之间的距离
 * @function getDistanceSQ 纯函数
 * @param {number} x1 第一个点的 x 坐标
 * @param {number} y1 第一个点的 y 坐标
 * @param {number} z1 第一个点的 z 坐标
 * @param {number} x2 第二个点的 x 坐标
 * @param {number} y2 第二个点的 y 坐标
 * @param {number} z2 第二个点的 z 坐标
 * @returns {number} 欧几里平方
 */
function getDistanceSQ(x1, y1, z1, x2, y2, z2) {

   // 计算差值
   var x = x2 - x1
   var y = y2 - y1
   var z = z2 - z1

   // 返回平方
   return x * x + y * y + z * z
}

/**
 * @constant {function} inGame 用于判断是否在游戏中
 * @returns {Boolean} 是否在游戏中
 */
function inGame() {

   // 尝试调用
   try {

      /**@type {java.lang.String} 获取计分板名称*/
      var name = mc.theWorld.getScoreboard().getScores()[0].getObjective().getName();

      // 判断name是否包含以下的字符串
      return name === 'PreScoreboard' || name === 'health' || name === 'health_tab' || name === 'ZScoreboard';


   } catch (error) {

      /*
       * 报错就返回 false
       * 如果没有计分板就不在游戏 因为游戏默认都有计分板
       */
      return false;
   }
}

/**
 * @constant {function} getVolume 用于计算三维空间中二点围成的区域体积
 * @function getVolume 纯函数
 * @param {number} maxX 区域的最大 x 坐标
 * @param {number} maxY 区域的最大 y 坐标
 * @param {number} maxZ 区域的最大 z 坐标
 * @param {number} minX 区域中最小 x 坐标
 * @param {number} minY 区域中最小 y 坐标
 * @param {number} minZ 区域中最小 z 坐标
 * @returns {number} 体积
 */
function getVolume(maxX, maxY, maxZ, minX, minY, minZ) {
   var lengthX = maxX - minX
   var lengthY = maxY - minY
   var lengthZ = maxZ - minZ
   return lengthX * lengthY * lengthZ
}

/**脚本启用时调用 */
function onLoad() {

   // 文字反馈模块已加载
   chat.print('§9JS §2- §4Load')
}

/**@type {object} 定义脚本模块*/
var scriptModule

/**脚本运行时调用 */
function onEnable() {

   // 注册模块
   scriptModule = moduleManager.registerModule(new JS())
}

/**脚本禁用时调用 */
function onDisable() {

   // 注销模块
   moduleManager.unregisterModule(scriptModule)
}