
/**@constant @readonly @type {string} 脚步名称 */
var scriptName = 'JS'

/** @constant @readonly @type {string} 脚本版本 */
var scriptVersion = '1.0.0'

/***@constant @readonly @type {Array<string>} 脚本作者*/
var scriptAuthor = ['yourName']

/**
 * @description CP = Client Packet
 * @constant
 * @readonly
 * @description 我的世界网络通讯客户端发向服务端的数据包
 */
var CP = {
   /**@constant @readonly @description 放置方块 */
   C08PacketPlayerBlockPlacement: Java.type('net.minecraft.network.play.client.C08PacketPlayerBlockPlacement'),

   /**@constant @readonly @description 挖掘 */
   C07PacketPlayerDigging: Java.type('net.minecraft.network.play.client.C07PacketPlayerDigging'),

   /**@constant @readonly @description 聊天 */
   C01PacketChatMessage: Java.type('net.minecraft.network.play.client.C01PacketChatMessage'),
}

/**
 * @description SP = Server Packet
 * @constant
 * @readonly
 * @description 我的世界网络通讯服务端发向客户端的数据包
 */
var SP = {
   /**@constant @readonly @description 聊天 */
   S02PacketChat: Java.type('net.minecraft.network.play.server.S02PacketChat'),

   /**@constant @readonly @description 时间更新 */
   S03PacketTimeUpdate: Java.type('net.minecraft.network.play.server.S03PacketTimeUpdate'),

   /**@constant @readonly @description 标题 */
   S45PacketTitle: Java.type('net.minecraft.network.play.server.S45PacketTitle'),

   /**@constant @readonly @description 动画 */
   S0BPacketAnimation: Java.type('net.minecraft.network.play.server.S0BPacketAnimation'),
}

/**
 * @description 全部继承自abstract class net.minecraft.entity.Entity
 * @constant
 * @readonly
 * @description 我的世界实体
 */
var Entity = {
   /**@constant @readonly @description 盔甲架 */
   EntityArmorStand: Java.type('net.minecraft.entity.item.EntityArmorStand'),

   /**@constant @readonly @description 玩家 */
   EntityPlayer: Java.type('net.minecraft.entity.player.EntityPlayer'),
}

/**
 * @description 全部继承自class net.minecraft.item.Item
 * @constant
 * @readonly
 * @description 我的世界物品
 */
var Item = {
   /**@constant @readonly @description 剑 */
   ItemSword: Java.type('net.minecraft.item.ItemSword'),
}

/**
 * @description 全部位于package net.minecraft.util
 * @constant
 * @readonly
 * @description 我的世界工具
 */
var Util = {
   /**@constant @readonly @description 轴对称边界框 */
   AxisAlignedBB: Java.type('net.minecraft.util.AxisAlignedBB'),

   /**@constant @readonly @description 方块方向朝向 */
   EnumFacing: Java.type('net.minecraft.util.EnumFacing'),

   /**@constant @readonly @description 方块位置 */
   BlockPos: Java.type('net.minecraft.util.BlockPos'),
}

/**
 * @constant
 * @readonly
 * @description CCBlueX的依赖
 */
var CCBlueX = {
   /**@constant @readonly @description 渲染引擎 */
   RenderUtils: Java.type('net.ccbluex.liquidbounce.utils.render.RenderUtils'),
}

/**
 * @constant
 * @readonly
 * @description Java标准依赖
 */
var JavaClass = {
   /**@constant @readonly @description 颜色类 */
   Color: Java.type('java.awt.Color'),

   /**@constant @readonly @description 计时器类 */
   Timer: Java.type('java.util.Timer'),

   /**@constant @readonly @description 计时器任务类 */
   TimerTask: Java.type('java.util.TimerTask'),

   /**@constant @readonly @description 类加载器 */
   URLClassLoader: Java.type('java.net.URLClassLoader'),

   /**@constant @readonly @description 文件 */
   File: Java.type('java.io.File'),

   /**@constant @readonly @description 线程 */
   Thread: Java.type('java.lang.Thread'),
}

/**@constant @readonly @description 提供选项 */
var setting = {

   /**
    * @constant 浮点数选项拖动条
    * @readonly
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
    * @readonly
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
    * @readonly
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
    * @readonly
    * @param {string} name 选项名称
    * @param {boolean} def 选项默认值
    * @returns {object} 选项
    */
   boolean: function (name, def) {
      return value.createBoolean(name, def);
   },

   /**
    * @constant 文本选项
    * @readonly
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
    * @readonly
    * @param {string} name 选项名称
    * @param {integer} def 选项默认值
    * @returns {object} 选项
    */
   block: function (name, def) {
      return value.createBlock(name, def);
   }
}

/**@constant @readonly @description 设置选项 */
var settings = {
   /// 示例代码 请根据实际需求修改settings中的代码
   round: setting.integer('round', 101, 1, 105),
   enableFeature: setting.boolean('enableFeature', false),
   percentage: setting.float('percentage', 0.4, 0.1, 1),
   mode: setting.list('mode', ['Option1', 'Option2', 'Option3'], 'Option1'),
   selectedBlock: setting.block('selectedBlock', 0),
   description: setting.text('description', 'demo'),
}

/// 除了onEnable onUpdate onDisable 其他生命周期函数内全部都有实例代码
/**@constant @type {function} @description 模块启用时调用 */
function onEnable() { }

/**@constant @type {function} @description 每刻调用 */
function onUpdate() { }

/**@constant @type {function} @description 模块关闭时调用 */
function onDisable() { }

/**
 * @constant @type {function} @description 监听到Packet事件时调用
 * @param {net.ccbluex.liquidbounce.event.PacketEvent} event 数据包事件
 */
function onPacket(event) {
   /**@constant @readonly @type {net.minecraft.network.Packet<T extends net.minecraft.network.INetHandler>} 网络数据包*/
   var packet = event.getPacket()
}

/**
* @constant @type {function} @description 监听到渲染2D事件时调用
* @param {net.ccbluex.liquidbounce.event.Render2DEvent} _event 渲染2D事件
*/
function onRender2D(_event) {
   // 在x=9 y=200的位置渲染颜色为[0x00ffff]的文本[至尊神龙]带阴影[true]
   mc.fontRendererObj.drawString('至尊神龙', 9, 200, 0xFFA500, true)
}

/**
 * @constant @type {function} @description 监听到渲染3D事件时调用
 * @param {net.ccbluex.liquidbounce.event.Render3DEvent} _event 渲染3D事件
 */
function onRender3D(_event) {
   // 在特定位置渲染三维的文本
   CCBlueX.RenderUtils.renderNameTag('hello world', 100, 100, -100);

   // 在相对位置渲染三维的方框
   var color = new JavaClass.Color(30, 170, 255, 50)
   var box = new Util.AxisAlignedBB(-.5, 4, -.5, .5, 3, .5)
   CCBlueX.RenderUtils.drawAxisAlignedBB(box, color)

   // 在绝对位置渲染三维的方框
   var renderManager = mc.getRenderManager();
   var x1 = 100 - renderManager.renderPosX
   var y1 = 60 - renderManager.renderPosY
   var z1 = -100 - renderManager.renderPosZ
   var x2 = 101 - renderManager.renderPosX
   var y2 = 61 - renderManager.renderPosY
   var z2 = -101 - renderManager.renderPosZ
   var box = new Util.AxisAlignedBB(x1, y1, z1, x2, y2, z2)
   CCBlueX.RenderUtils.drawAxisAlignedBB(box, color)
}

/**
 * @constant @type {function} @description 监听到攻击事件时调用
 * @param {net.ccbluex.liquidbounce.event.AttackEvent} event 攻击事件
 */
function onAttack(event) {
   /**@constant @readonly @type {net.minecraft.entity.Entity} 目标实体 */
   var targetEntity = event.getTargetEntity()
}

/**
 * @constant @type {function} @description 监听到按键事件时调用
 * @param {net.ccbluex.liquidbounce.event.KeyEvent} event 按键事件
 */
function onKey(event) {
   /**@constant @readonly @type {java.lang.Integer} 按下的键的值 */
   var keyID = event.getKey()
}

/**
 * @constant {function} @description 监听到点击方块事件时调用
 * @param {net.ccbluex.liquidbounce.event.ClickBlockEvent} event 点击方块事件
 */
function onClickBlock(event) {
   /**@constant @readonly @type {net.minecraft.util.BlockPos} 点击的方块 */
   var block = event.getClickedBlock()
}

/**@constant {class, function} JS 模块构造函数*/
function JS() { }
/**@override @constant @returns {string} 模块名称 */
JS.prototype.getName = function () { return scriptName }
/**@override @constant @returns {string} 模块描述 */
JS.prototype.getDescription = function () { return 'your description' }
/**@override @constant @returns {string} 模块类型 */
JS.prototype.getCategory = function () { return 'Fun' }
/**@override @constant */
JS.prototype.onEnable = onEnable
/**@override @constant */
JS.prototype.onUpdate = onUpdate
/**@override @constant */
JS.prototype.onDisable = onDisable
/**@override @constant */
JS.prototype.onPacket = onPacket
/**@override @constant */
JS.prototype.onRender2D = onRender2D
/**@override @constant */
JS.prototype.onRender3D = onRender3D
/**@override @constant */
JS.prototype.onAttack = onAttack
/**@override @constant */
JS.prototype.onKey = onKey
/**@override @constant */
JS.prototype.onClickBlock = onClickBlock
/**@override @constant 覆写添加值函数 用于给模块添加选项*/
JS.prototype.addValues = function (values) {
   for (var key in settings) {
      values.add(settings[key])
   }
}

/**
 * @constant {function} getEuclideanDistanceSQ 用于计算三维空间中二点之间的距离
 * @function getEuclideanDistanceSQ 纯函数
 * @param {number} x1 第一个点的 x 坐标
 * @param {number} y1 第一个点的 y 坐标
 * @param {number} z1 第一个点的 z 坐标
 * @param {number} x2 第二个点的 x 坐标
 * @param {number} y2 第二个点的 y 坐标
 * @param {number} z2 第二个点的 z 坐标
 * @returns {number} 欧几里平方
 */
function getEuclideanDistanceSQ(x1, y1, z1, x2, y2, z2) {
   /// 计算差值
   /**@constant @readonly */
   var x = x2 - x1

   /**@constant @readonly */
   var y = y2 - y1

   /**@constant @readonly */
   var z = z2 - z1

   // 返回平方
   return x * x + y * y + z * z
}

/**
* @constant {function} inZombiesMap 用于判断是否在玩僵尸末日
* @returns {Boolean} 在玩僵尸末日
*/
function inZombiesMap() {
   /**@constant @readonly @type {java.util.Collection<net.minecraft.scoreboard.Score>} 计分板*/
   var scores = mc.theWorld.getScoreboard().getScores()
   if (!scores || scores.size() === 0) return false

   /**@constant @readonly @type {java.lang.String} 计分板名称*/
   var name = scores[0].getObjective().getName()

   return name === 'PreScoreboard' || name === 'health' || name === 'health_tab' || name === 'ZScoreboard'
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
   /**@constant @readonly */
   var lengthX = maxX - minX

   /**@constant @readonly */
   var lengthY = maxY - minY

   /**@constant @readonly */
   var lengthZ = maxZ - minZ

   return lengthX * lengthY * lengthZ
}

/**脚本启用时调用 */
function onLoad() {

   // 文字反馈模块已加载
   chat.print('§9' + scriptName + '§2- §4Load')
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