/**
 * DP = Dragon Plate
 * 龙界板块制造 索拉卡开发 3dragons贡献
 */

/**
 * ########## WARN UN LEGIT SCRIPT ########## WARN UN LEGIT SCRIPT ########## WARN UN LEGIT SCRIPT ##########
 * ########## 警告 此脚本功能可能不合法 ########## 警告 此脚本功能可能不合法 ########## 警告 此脚本功能可能不合法 ##########
 * 
 * 在使用前请看服务器允不允许使用 技术本无罪 但你可能会因为滥用技术得罪其他
 * 
 * 脚本名称 隔空点击盔甲架
 * 作用如脚本名称所示
 */

/**@constant 脚本名称 */
var scriptName = 'ClickOfStand'

/**@constant 脚本版本 */
var scriptVersion = '0.0.3'

/**@constant 脚本作者 */
var scriptAuthor = ['kuukirikigaku']

/**@constant 我的世界客户端的网络数据包 */
var CLIENT_PACKET = {
   /**@constant 客户端实体互动数据包类型 */
   C02PacketUseEntity: Java.type('net.minecraft.network.play.client.C02PacketUseEntity'),
}

/**@constant 我的世界实体 */
var ENTITY = {
   /**@constant 实体盔甲架类型 */
   EntityArmorStand: Java.type('net.minecraft.entity.item.EntityArmorStand'),
}

/**@constant 原生的Java类 */
var JAVA_CLASS = {
   /**@constant 计时器类 */
   Timer: Java.type('java.util.Timer'),

   /**@constant 计时器任务类 */
   TimerTask: Java.type('java.util.TimerTask'),
}

/**@constant 提供选项 */
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
}

/**@constant 设置选项 */
var settings = {
   /**@constant 设置的距离 */
   distance: setting.float('Reach', 3.5, 1, 6),
}

/**@type {boolean} 用于状态判断是否已经点击了盔甲架*/
var alreadyTouchStand
/**@constant {function} JS_onEnable 模块启用时调用 */
function ClickOfStand_onEnable() {
   alreadyTouchStand = false
}

/**@constant {function} JS_onUpdate 每tick调用 */
function ClickOfStand_onUpdate() {

   // 如果还没点盔甲架 且右键了
   if (!alreadyTouchStand && mc.gameSettings.keyBindUseItem.pressed) {

      /**@type {net.minecraft.entity.item.EntityArmorStand} 盔甲架实体*/
      var targetStand = getTargetStand()

      // 如果为空
      if (!targetStand) return

      /**@type {net.minecraft.client.entity.EntityPlayerSP} 自己操作的角色*/
      var player = mc.thePlayer

      /**@type {net.minecraft.util.Vec3} 角色看向的位置*/
      var lookVec = player.getLookVec()

      /**@type {net.minecraft.network.play.client.C02PacketUseEntity} 创建新的实体互动数据包*/
      var packet = new CLIENT_PACKET.C02PacketUseEntity(targetStand, lookVec)

      // 发包
      mc.thePlayer.sendQueue.addToSendQueue(packet)
   }
}

/**
 * @constant {function} JS_onPacket 监听到Packet事件时调用
 * @param {net.ccbluex.liquidbounce.event.PacketEvent} event 
 */
function ClickOfStand_onPacket(event) {
   // 获取数据包
   var packet = event.getPacket()

   if (packet instanceof CLIENT_PACKET.C02PacketUseEntity) {
      /**@type {net.minecraft.entity.Entity} 实体*/
      var entity = packet.getEntityFromWorld(mc.theWorld)

      // 如果实体不是盔甲架
      if (!(entity instanceof ENTITY.EntityArmorStand)) return

      // 以下代码索拉卡不知道怎么解释 因为是全局变量控制 你们自己体会吧
      alreadyTouchStand = true
      var task = new JAVA_CLASS.TimerTask({
         run: function () {
            alreadyTouchStand = false
         }
      })
      var timer = new JAVA_CLASS.Timer()
      timer.schedule(task, 50)
      // 以上代码索拉卡不知道怎么解释 因为是全局变量控制 你们自己体会吧
   }
}

/**@constant {class, function} JS 模块构造函数*/
function ClickOfStand() { }
/**@override @constant {string} 模块名称 */
ClickOfStand.prototype.getName = function () { return 'ClickOfStand' }
/**@override @constant {string} 模块描述 */
ClickOfStand.prototype.getDescription = function () { return 'kuukirikigaku' }
/**@override @constant {string} 模块类型 */
ClickOfStand.prototype.getCategory = function () { return 'Fun' }
/**@override @constant {function} */
ClickOfStand.prototype.onEnable = ClickOfStand_onEnable
/**@override @constant {function} */
ClickOfStand.prototype.onUpdate = ClickOfStand_onUpdate
/**@override @constant {function} */
ClickOfStand.prototype.onPacket = ClickOfStand_onPacket
/**@override @constant {function} 覆写添加值函数 用于给模块添加选项*/
ClickOfStand.prototype.addValues = function (values) {
   for (var key in settings) {
      values.add(settings[key])
   }
}

function getTargetStand() {
   /**@constant {Array<CloseArmorStand>} 盔甲架数组*/
   var armorStandEntityArray = getArmorStandEntityArray()

   // 如果数组没有东西
   if (armorStandEntityArray.length === 0) return null

   // 排序数组
   armorStandEntityArray.sort(function (a, b) {
      return a.distance - b.distance
   })

   // 获取当前玩家的三维坐标x与z
   var player = mc.thePlayer
   var x = player.posX
   var z = player.posZ

   // 获取旋转角度角度
   var yaw = player.rotationYaw
   var pitch = player.rotationPitch

   // 计算旋转弧度
   var yawRad = yaw * Math.PI / 180
   var pitchRad = pitch * Math.PI / 180

   for (var i = 0; i < armorStandEntityArray.length; i++) {
      /**@constant {CloseArmorStand} 盔甲架数据*/
      var armorStandEntity = armorStandEntityArray[i]

      /**@constant {net.minecraft.entity.item.EntityArmorStand} 盔甲架实体*/
      var entity = armorStandEntity.entity

      /**@constant {number} 盔甲架距离*/
      var distance = armorStandEntity.distance

      // 计算目标盔甲架可能的位置
      var targetX = x + Math.cos(pitchRad) * Math.sin(-yawRad) * distance
      var targetZ = z + Math.cos(pitchRad) * Math.cos(-yawRad) * distance

      // 获取目标盔甲架的实体框
      var targetBox = entity.getEntityBoundingBox()
      var maxX = targetBox.maxX
      var maxZ = targetBox.maxZ
      var minX = targetBox.minX
      var minZ = targetBox.minZ

      // 如果盔甲架可能的位置符合要求
      if (targetX > minX && targetX < maxX && targetZ > minZ && targetZ < maxZ) {
         return entity
      }
   }
   return null
}

/**
 * @constant {function} getArmorStandEntityArray 获取盔甲架实体数据数组
 * @returns {Array<CloseArmorStand>}
 */
function getArmorStandEntityArray() {
   /**@constant {Array<CloseArmorStand>} 盔甲架实体数据数组*/
   var armorStandEntityArray = []

   /**@constant {java.util.List<net.minecraft.entity.Entity>} 世界实体*/
   var worldEntity = mc.theWorld.loadedEntityList

   /**@constant {net.minecraft.client.entity.EntityPlayerSP} 玩家角色*/
   var player = mc.thePlayer

   /// 玩家角色的位置
   var x1 = player.posX
   var y1 = player.posY
   var z1 = player.posZ

   // 遍历世界实体
   for (var index = 0; i < worldEntity.size(); i++) {

      /**@constant @type {net.minecraft.entity.Entity} 实体*/
      var entity = worldEntity[index]

      // 如果实体不为盔甲架
      if (!(entity instanceof ENTITY.EntityArmorStand)) continue

      /**@constant {number} 实体离玩家的距离*/
      var distance = entity.getDistance(x1, y1, z1)

      // 如果距离太远
      if (distance > settings.distance.get()) continue

      // 添加一个盔甲架数据至数组中
      armorStandEntityArray.push(new CloseArmorStand(entity, distance))
   }

   // 返回数组
   return armorStandEntityArray
}

/**
 * @constant {class, function} 在自己距离范围内的盔甲架实体数据
 * @param {net.minecraft.entity.item.EntityArmorStand} entity 盔甲架
 * @param {number} distance 距离
 */
function CloseArmorStand(entity, distance) {
   /**@type {net.minecraft.entity.item.EntityArmorStand} 盔甲架*/
   this.entity = entity
   /**@type {number} 距离*/
   this.distance = distance
}

/**脚本启用时调用 */
function onLoad() {

   // 文字反馈模块已加载
   chat.print('§9ClickOfStand §2- §4Load')
}

/**@type {object} 定义脚本模块*/
var scriptModule

/**脚本运行时调用 */
function onEnable() {

   // 注册模块
   scriptModule = moduleManager.registerModule(new ClickOfStand())
}

/**脚本禁用时调用 */
function onDisable() {

   // 注销模块
   moduleManager.unregisterModule(scriptModule)
}
