/**
 * DP = Dragon Plate
 * 
 * 冰龙 : 此为实验室功能 在稳定后将会代替ZombieRadar 已知有许多bug
 * 
 * ZombieRadarLab僵尸雷达拥抱开源 由DP-龙界板块制造 冰龙之子开发 3dragons贡献 
 * 
 * 僵尸雷达功能
 *  - 在实体上方宣传名称
 * 
 *  - 渲染实体填充框
 * 
 *  - 右上渲染2D极度僵尸详细信息
 * 
 *  - 渲染极度危险僵尸的准星线
 * 
 * 认为是极度危险的怪中 只有巨人不会被画准星线 以下是被认为极度危险的怪物
 *  - 炸弹僵尸 - 炼狱 - 巢穴之母 - 史莱姆王 - HeroBrine - 长者 - 巨人 -
 * 
 *  - 渲染实体框
 * 
 *  - 渲染实体眼睛位置
 * 
 *  - 分别用不同颜色渲染 极度危险僵尸->危险僵尸->第一波僵尸->常规僵尸
 * 
 * 僵尸雷达特性
 * 
 * - 使用英文语言可以正常运行
 * 
 * - 使用其他语言会出现渲染名称bug[不可修复] 和 判定无效的情况
 * 
 * 代码说明
 *  - 部分区域的定义域嵌套超过了三层 但不影响可读性
 * 
 * 冰龙之子 : 这个判断当前地图的逻辑是真的抽象 渲染都没那么难看懂
 * 
 * 依赖说明
 *  - DragonTool.jar 龙界板块制造 冰龙开发
 */

/**脚本名称 */
var scriptName = 'ZombieRadarLab'

/**脚本版本 */
var scriptVersion = '2.1.0'

/**脚本作者 */
var scriptAuthor = ['dragonsocd']

/**Minecraft服务器的网络数据包 */
var SERVER_PACKET = {
    /**服务器聊天数据包类型 */
    S02PacketChat: Java.type('net.minecraft.network.play.server.S02PacketChat'),

    /**服务器标题数据包类型 */
    S45PacketTitle: Java.type('net.minecraft.network.play.server.S45PacketTitle'),
}

/**Minecraft的实体 */
var ENTITY = {
    /**实体 */
    Entity: Java.type('net.minecraft.entity.Entity'),

    /**实体生物 */
    EntityLivingBase: Java.type('net.minecraft.entity.EntityLivingBase'),
}

/**Minecraft的物品 */
var ITEM = {
    /**物品剑类型 */
    ItemSword: Java.type('net.minecraft.item.ItemSword'),
}

/**Minecraft的工具 */
var UTIL = {
    /**实体或方块边界框类型 */
    AxisAlignedBB: Java.type('net.minecraft.util.AxisAlignedBB'),

    /**方块坐标类型 */
    BlockPos: Java.type('net.minecraft.util.BlockPos'),
}

/**CCBlueX的内置Java类 */
var CCBLUEX = {
    /**CCBlueX的渲染引擎 */
    RenderUtils: Java.type('net.ccbluex.liquidbounce.utils.render.RenderUtils'),
}

/**原生的Java类 */
var JAVA_CLASS = {
    /**颜色类 */
    Color: Java.type('java.awt.Color'),

    /**计时器类 */
    Timer: Java.type('java.util.Timer'),

    /**计时器任务类 */
    TimerTask: Java.type('java.util.TimerTask'),

    /**类加载器 */
    URLClassLoader: Java.type('java.net.URLClassLoader'),

    /**文件 */
    File: Java.type('java.io.File'),

    /**线程 */
    Thread: Java.type('java.lang.Thread'),
}

/**僵尸实体类型 */
var ZombiesEntity = {
    EntityZombie: Java.type('net.minecraft.entity.monster.EntityZombie'),
    EntityPigZombie: Java.type('net.minecraft.entity.monster.EntityPigZombie'),
    EntityMagmaCube: Java.type('net.minecraft.entity.monster.EntityMagmaCube'),
    EntitySlime: Java.type('net.minecraft.entity.monster.EntitySlime'),
    EntityGolem: Java.type('net.minecraft.entity.monster.EntityIronGolem'),
    EntityWolf: Java.type('net.minecraft.entity.passive.EntityWolf'),
    EntityGiantZombie: Java.type('net.minecraft.entity.monster.EntityGiantZombie'),
    EntityGhast: Java.type('net.minecraft.entity.monster.EntityGhast'),
    EntityBlaze: Java.type('net.minecraft.entity.monster.EntityBlaze'),
    EntitySkeleton: Java.type('net.minecraft.entity.monster.EntitySkeleton'),
    EntityCreeper: Java.type('net.minecraft.entity.monster.EntityCreeper'),
    EntityWitch: Java.type('net.minecraft.entity.monster.EntityWitch'),
    EntityCaveSpider: Java.type('net.minecraft.entity.monster.EntityCaveSpider'),
    EntityEndermite: Java.type('net.minecraft.entity.monster.EntityEndermite'),
    EntityWither: Java.type('net.minecraft.entity.boss.EntityWither'),
}

/**选项种类 */
var setting = {
    /**
     * @function integer 浮点数选项
     * @param {string} name 选项名称
     * @param {integer} def 选项默认值
     * @param {integer} min 选项最小值
     * @param {integer} max 选项最大值
     * @returns {object} 选项
     */
    integer: function (name, def, min, max) {
        return value.createInteger(name, def, min, max)
    },

    /**
     * @function boolean 布尔值选项
     * @param {string} name 选项名称
     * @param {boolean} def 选项默认值
     * @returns {object} 选项
     */
    boolean: function (name, def) {
        return value.createBoolean(name, def)
    },
}

var defaultColor = [
    new JAVA_CLASS.Color(30, 170, 255, 50),
    new JAVA_CLASS.Color(255, 0, 255, 50),
    new JAVA_CLASS.Color(255, 0, 0, 50),
    new JAVA_CLASS.Color(255, 165, 0, 50),
]

/**定义 [ settings ] 对象 用于设置选项 */
var settings = {
    /**渲染实体2D */
    render2D: setting.boolean('Render2D', true),

    /**渲染名称标签 */
    nameTag: setting.boolean('NameTag', true),

    /**渲染实体盒 */
    fillBox: setting.boolean('FillBox', false),

    /**渲染实体框 */
    outline: setting.boolean('Outline', true),

    /**渲染眼睛线 */
    eyeLine: setting.boolean('EyeLine', true),

    /**渲染准星线 */
    tracer: setting.boolean('Tracer', true),

    /**渲染位置 */
    renderX: setting.integer('RenderX', 960, 0, 2000),
    renderY: setting.integer('RenderY', 2, 0, 1090),

    // 重置颜色
    resetColor: setting.boolean('ResetColor', false),

    // 设置渲染3D 常规僵尸 三原色 和 透明度 默认淡蓝色
    red: setting.integer('Red', defaultColor[0].getRed(), 0, 255),
    green: setting.integer('Green', defaultColor[0].getGreen(), 0, 255),
    blue: setting.integer('Blue', defaultColor[0].getBlue(), 0, 255),
    alpha: setting.integer('Alpha', defaultColor[0].getAlpha(), 0, 255),

    // 设置渲染3D  危险 三原色 和 透明度 默认紫色
    dangerousRed: setting.integer('DangerRed', defaultColor[1].getRed(), 0, 255),
    dangerousGreen: setting.integer('DangerGreen', defaultColor[0].getGreen(), 0, 255),
    dangerousBlue: setting.integer('DangerBlue', defaultColor[1].getBlue(), 0, 255),
    dangerousAlpha: setting.integer('DangerAlpha', defaultColor[1].getAlpha(), 0, 255),

    // 设置渲染3D  极度危险 三原色 和 透明度 默认红色
    perilousRed: setting.integer('PerilousRed', defaultColor[2].getRed(), 0, 255),
    perilousGreen: setting.integer('PerilousGreen', defaultColor[2].getGreen(), 0, 255),
    perilousBlue: setting.integer('PerilousBlue', defaultColor[2].getBlue(), 0, 255),
    perilousAlpha: setting.integer('PerilousAlpha', defaultColor[2].getAlpha(), 0, 255),

    // 设置渲染3D  Wave1的僵尸 三原色 和 透明度 默认橙色
    wave1Red: setting.integer('Wave1Red', defaultColor[3].getRed(), 0, 255),
    wave1Green: setting.integer('WaveGreen', defaultColor[3].getGreen(), 0, 255),
    wave1Blue: setting.integer('Wave1Blue', defaultColor[3].getBlue(), 0, 255),
    wave1Alpha: setting.integer('Wave1Alpha', defaultColor[3].getAlpha(), 0, 255),
}

/**@type {boolean} 当前是否在僵尸末日中*/
var alreadyInZombies = false

/**@type {java.lang.Timer} 定时器*/
var timer = new JAVA_CLASS.Timer()

/**@type {integer} 当前僵尸末日地图*/
var zombiesMap = 0

// 进入游戏是需要等待地图加载
/**@type {integer} 预计地图加载时长最大范围*/
var mapLoadDelay = 300

// 生命周期函数的命名方式为 模块名_生命周期函数名
/**@function ZombieRadarLab_onEnable 模块启用时调用 */
function ZombieRadarLab_onEnable() {

    /// 判断当前Zombie逻辑其一
    if (inZombies()) {
        alreadyInZombies = true
        timer.schedule(createZombiesMapUpdateTask(), mapLoadDelay)
    }
}

/**@type {Array<net.minecraft.entity.Entity>} 僵尸集合 每刻更新 */
var zombieList = []

/**@function ZombieRadarLab_onUpdate 每tick调用 */
function ZombieRadarLab_onUpdate() {

    /// 重置颜色逻辑
    settings.resetColor.get() && resetColor()

    /// 判断当前Zombie逻辑其一
    if (inZombies() && !alreadyInZombies) {
        alreadyInZombies = true
        timer.schedule(createZombiesMapUpdateTask(), mapLoadDelay)
    }
    else if (!inZombies()) {
        alreadyInZombies = false
        zombiesMap = 0
    }

    /// 获取僵尸集合逻辑
    zombieList = getZombieList()
}

/**@type {Array<net.minecraft.entity.Entity>} wave1的僵尸类型*/
var wave1ZombieTypeList = []

/**@type {number} round值*/
var round = 0

/**
 * @function ZombieRadarLab_onPacket 监听到Packet事件时调用
 * @param {net.ccbluex.liquidbounce.event.PacketEvent} event 
 */
function ZombieRadarLab_onPacket(event) {
    // 获取数据包
    var packet = event.getPacket()

    if (packet instanceof SERVER_PACKET.S45PacketTitle) {

        /**@type {java.lang.String} 标题文本*/
        var titleText = packet.getMessage().getUnformattedText()

        // 如果检测到Round
        if (titleText.contains('Round')) {

            /// 获取wave1的类型逻辑
            doGetWave1Task = new JAVA_CLASS.TimerTask({
                /**@override */
                run: function () {
                    wave1ZombieTypeList = zombieList // 此处定义域层数好多
                }
            })

            var spawnWave1FinishTime = 11e3
            timer.schedule(doGetWave1Task, spawnWave1FinishTime)

            /// 获取当前round逻辑
            var start = titleText.indexOf('Round') + 'Round'.length
            var end = titleText.length
            round = +titleText.substring(start, end)
        }
    }

    /// 判断当前Zombie逻辑其一
    if (packet instanceof SERVER_PACKET.S02PacketChat) {
        var chatText = packet.getChatComponent().getUnformattedText()
        alreadyInZombies = isChangeMapWhitChat(chatText) ? false : alreadyInZombies
    }
}

/**
 * @function ZombieRadarLab_onRender2D 监听到渲染2D事件时调用
 * @param {net.ccbluex.liquidbounce.event.Render2DEvent} event 
*/
function ZombieRadarLab_onRender2D(event) {

    // 没开渲染就结束语句
    if (!settings.render2D.get()) {
        return
    }

    /**@type {net.minecraft.client.entity.EntityPlayerSP} 当前玩家*/
    var player = mc.thePlayer

    /**@type {integer} 渲染次数计数器*/
    var count = 0
    for (var index = 0; index < zombieList.length; index++) {

        /**@type {net.minecraft.entity.Entity} 僵尸实体*/
        var zombie = zombieList[index]

        /**@type {string} 极度危险类型*/
        var perilousType = getPerilousZombieType(zombie)

        // 如果是极度危险类型
        if (perilousType) {

            /**@type {string} 渲染的文本*/
            var renderText = getRender2DText(perilousType, zombie, player)

            /**@type {number} 渲染的X位置*/ // 计算渲染X的位置
            var renderX = settings.renderX.get() - mc.fontRendererObj.getStringWidth(renderText)

            /**@type {number} 渲染的Y位置*/ // 计算渲染Y的位置
            var renderY = settings.renderY.get() + count * 10

            // 执行渲染
            mc.fontRendererObj.drawString(renderText, renderX, renderY, 0xFFFFFF, true)

            // 计数一次渲染
            count = count + 1
        }
    }
}

/**DragonTools.jar */
var DragonToolsFile = new JAVA_CLASS.File('scriptsMods/DragonTools.jar')
/**DragonTools.jar URL */
var DragonToolsURL = DragonToolsFile.toURI().toURL()
/**DragonTools */
var DragonToolsClass = new JAVA_CLASS.URLClassLoader([DragonToolsURL], JAVA_CLASS.Thread.currentThread().getContextClassLoader())
/**龙工具 */
var DT = {
    /**渲染实体框 */
    RenderBox: DragonToolsClass.loadClass('tk.tools.RenderBox'),

    /**渲染准星线 */
    RenderTracerLine: DragonToolsClass.loadClass('tk.tools.RenderTracerLine'),

    /**渲染眼睛线 */
    RenderEntityEye: DragonToolsClass.loadClass('tk.tools.RenderEntityEye'),
}

// DT工具中的渲染实体边框 参数是1个Entity类型 1个Color类型
var renderEntity = DT.RenderBox.getDeclaredMethod('renderEntity', ENTITY.Entity.class, JAVA_CLASS.Color.class)

// DT工具中的渲染准星线 参数是1个Entity类型 默认颜色红色
var renderTracerLine = DT.RenderTracerLine.getDeclaredMethod('renderTracerLine', ENTITY.Entity.class)

// DT中举中的渲染眼睛线 参数是1个Entity类型 默认颜色红色
var render = DT.RenderEntityEye.getDeclaredMethod('render', ENTITY.EntityLivingBase.class)
/**
 * @function ZombieRadarLab_onRender2D 监听到渲染3D事件时调用
 * @param {net.ccbluex.liquidbounce.event.Render3DEvent} event 
 */
function ZombieRadarLab_onRender3D(event) {
    /// 获取设置的颜色
    var perilousColor = new JAVA_CLASS.Color(settings.perilousRed.get(), settings.perilousGreen.get(), settings.perilousBlue.get(), settings.perilousAlpha.get())
    var dangerousColor = new JAVA_CLASS.Color(settings.dangerousRed.get(), settings.dangerousGreen.get(), settings.dangerousBlue.get(), settings.dangerousAlpha.get())
    var wave1Color = new JAVA_CLASS.Color(settings.wave1Red.get(), settings.wave1Green.get(), settings.wave1Blue.get(), settings.wave1Alpha.get())
    var defaultColor = new JAVA_CLASS.Color(settings.red.get(), settings.green.get(), settings.blue.get(), settings.alpha.get())

    /// 渲染 实体框 实体名称标签 逻辑
    for (var i = 0; i < zombieList.length; i++) {

        /**@type {net.minecraft.entity.Entity} 僵尸*/
        var zombie = zombieList[i]

        // 渲染极度危险僵尸逻辑
        var perilousType = getPerilousZombieType(zombie)
        if (perilousType) {
            renderZombie3D(zombie, perilousColor)
            continue
        }

        // 渲染危险僵尸逻辑
        var isDangerousZombie = zombie.getMaxHealth() > 249
        if (isDangerousZombie) {
            renderZombie3D(zombie, dangerousColor)
            continue
        }

        // 渲染第一波僵尸逻辑
        var isWave1Zombie = wave1ZombieTypeList.indexOf(zombie) !== -1
        if (isWave1Zombie) {
            renderZombie3D(zombie, wave1Color)
            continue
        }

        // 渲染常规僵尸逻辑
        renderZombie3D(zombie, defaultColor)
    }

    /// 重新获取设置的颜色 除了Alpha是255
    perilousColor = new JAVA_CLASS.Color(perilousColor.getRed(), perilousColor.getGreen(), perilousColor.getBlue(), 255)
    dangerousColor = new JAVA_CLASS.Color(dangerousColor.getRed(), dangerousColor.getGreen(), dangerousColor.getBlue(), 255)
    wave1Color = new JAVA_CLASS.Color(wave1Color.getRed(), wave1Color.getGreen(), wave1Color.getBlue(), 255)
    defaultColor = new JAVA_CLASS.Color(defaultColor.getRed(), defaultColor.getGreen(), defaultColor.getBlue(), 255)

    // 这不是冗余 这是防止GL冲突 DragonTools的渲染api和CCBlueX的渲染api不能出现在同一个循环中
    /// 渲染 准星线 实体框 逻辑
    for (var i = 0; i < zombieList.length; i++) {

        /**@type {net.minecraft.entity.Entity} 僵尸*/
        var zombie = zombieList[i]

        // 渲染极度危险僵尸逻辑
        var perilousType = getPerilousZombieType(zombie)
        if (perilousType) {
            settings.outline.get() && renderEntity.invoke(null, zombie, perilousColor)
            var needTracer = settings.tracer.get() && perilousType.indexOf('Giant') === -1
            needTracer && renderTracerLine.invoke(null, zombie)
            settings.eyeLine.get() && render.invoke(null, zombie)
            continue
        }

        // 渲染危险僵尸逻辑
        var isDangerousZombie = zombie.getMaxHealth() > 249
        if (isDangerousZombie) {
            settings.outline.get() && renderEntity.invoke(null, zombie, dangerousColor)
            settings.eyeLine.get() && render.invoke(null, zombie)
            continue
        }

        // 渲染第一波僵尸逻辑
        var isWave1Zombie = wave1ZombieTypeList.indexOf(zombie) !== -1
        if (isWave1Zombie) {
            settings.outline.get() && renderEntity.invoke(null, zombie, wave1Color)
            settings.eyeLine.get() && render.invoke(null, zombie)
            continue
        }

        // 渲染常规僵尸逻辑
        settings.outline.get() && renderEntity.invoke(null, zombie, defaultColor)
        settings.eyeLine.get() && render.invoke(null, zombie)
    }
}

/**@class ZombieRadarLab 模块*/
function ZombieRadarLab() { }
/**@override 模块名称*/
ZombieRadarLab.prototype.getName = function () { return 'ZombieRadarLab' }
/**@override 模块描述*/
ZombieRadarLab.prototype.getDescription = function () { return 'dragonsocd' }
/**@override 模块类型*/
ZombieRadarLab.prototype.getCategory = function () { return 'Fun' }
/**@override */
ZombieRadarLab.prototype.onEnable = ZombieRadarLab_onEnable
/**@override */
ZombieRadarLab.prototype.onUpdate = ZombieRadarLab_onUpdate
/**@override */
ZombieRadarLab.prototype.onPacket = ZombieRadarLab_onPacket
/**@override */
ZombieRadarLab.prototype.onRender2D = ZombieRadarLab_onRender2D
/**@override */
ZombieRadarLab.prototype.onRender3D = ZombieRadarLab_onRender3D
/**@override 覆写添加值函数 用于给模块添加选项*/
ZombieRadarLab.prototype.addValues = function (values) {
    for (var key in settings) {
        values.add(settings[key])
    }
}

/**
 * @function resetColor 重置颜色
 * @returns {void}
 */
function resetColor() {
    settings.red.set(defaultColor[0].getRed())
    settings.green.set(defaultColor[0].getGreen())
    settings.blue.set(defaultColor[0].getBlue())
    settings.alpha.set(defaultColor[0].getAlpha())

    settings.dangerousRed.set(defaultColor[1].getRed())
    settings.dangerousGreen.set(defaultColor[1].getGreen())
    settings.dangerousBlue.set(defaultColor[1].getBlue())
    settings.dangerousAlpha.set(defaultColor[1].getAlpha())

    settings.perilousRed.set(defaultColor[2].getRed())
    settings.perilousGreen.set(defaultColor[2].getGreen())
    settings.perilousBlue.set(defaultColor[2].getBlue())
    settings.perilousAlpha.set(defaultColor[2].getAlpha())

    settings.wave1Red.set(defaultColor[3].getRed())
    settings.wave1Green.set(defaultColor[3].getGreen())
    settings.wave1Blue.set(defaultColor[3].getBlue())
    settings.wave1Alpha.set(defaultColor[3].getAlpha())

    settings.resetColor.set(false)
}

/**
 * @function renderZombie3D 渲染僵尸3D
 * 
 * @param {net.minecraft.entity.Entity} zombie 实体
 * @param {java.lang.Color} color 
 */
function renderZombie3D(zombie, color) {
    /// 获取实体位置
    var boundingBox = zombie.getEntityBoundingBox()
    var maxX = boundingBox.maxX
    var maxY = boundingBox.maxY
    var maxZ = boundingBox.maxZ

    var minX = boundingBox.minX
    var minY = boundingBox.minY
    var minZ = boundingBox.minZ

    /// 渲染名称逻辑
    // 如果开启了渲染名称
    if (settings.nameTag.get()) {
        // 计算中点
        var centerX = (minX + maxX) / 2
        var centerZ = (minZ + maxZ) / 2

        // 计算文本内容
        var name = zombie.getName()
        var health = zombie.getHealth().toFixed(1)
        var maxHealth = zombie.getMaxHealth().toFixed(1)
        var hurtTime = zombie.hurtTime
        var renderText = (hurtTime ? '§4' + name : '§f' + name) + '§2[' + '§b' + health + '/' + maxHealth + '§2]'

        // 渲染名称标签
        CCBLUEX.RenderUtils.renderNameTag(renderText, centerX, maxY + 1, centerZ)
    }

    /// 渲染填充框逻辑
    // 如果开启了渲染填充框
    if (settings.fillBox.get()) {
        /// 计算相对位置
        var renderManager = mc.getRenderManager()

        var minRenderX = minX - renderManager.renderPosX
        var minRenderY = minY - renderManager.renderPosY
        var minRenderZ = minZ - renderManager.renderPosZ

        var maxRenderX = maxX - renderManager.renderPosX
        var maxRenderY = maxY - renderManager.renderPosY
        var maxRenderZ = maxZ - renderManager.renderPosZ
        /// 计算相对位置

        // 执行渲染
        CCBLUEX.RenderUtils.drawAxisAlignedBB(new UTIL.AxisAlignedBB(minRenderX, minRenderY, minRenderZ, maxRenderX, maxRenderY, maxRenderZ), color)
    }
}

/**
 * 
 * @param {string} type 
 * @param {net.minecraft.entity.Entity} entity 
 * @param {net.minecraft.client.entity.AbstractClientPlayer} player 
 * @returns 
 */
function getRender2DText(type, entity, player) {
    /// 计算距离逻辑
    var x = player.posX
    var y = player.posY
    var z = player.posZ
    var distance = entity.getDistance(x, y, z).toFixed(1)

    /// 获取血量逻辑
    var maxHealth = entity.getMaxHealth().toFixed(1)
    var health = entity.getHealth().toFixed(1)

    // 合成文本
    return type + '§r[' + health + '/' + maxHealth + '] [' + distance + ']'
}

/**
 * @function getPerilousZombieType 获取极度危险僵尸类型
 * @function getPerilousZombieType 虽然是判断类型 但是如果返回空字符串则说明这个实体不属于极度危险僵尸
 * 
 * @param {net.minecraft.entity.Entity} entity 实体
 * @returns {string} 极度危险僵尸类型
 */
function getPerilousZombieType(entity) {

    // 判断实体有没有拿剑
    /**@type {boolean} 是否拿剑*/
    var takeSword = false

    // 判断一下是否拿剑
    try { takeSword = entity.getHeldItem().getItem() instanceof ITEM.ItemSword } catch (error) { }

    /// 判断长者逻辑
    /**@type {boolean} 是否是长者*/ // 实体僵尸 并且 小僵尸 并且 总血量 > 429 并且 拿剑
    var isTheOldOne = entity instanceof ZombiesEntity.EntityZombie && entity.getEyeHeight() < 1 && entity.getMaxHealth() > 249 && takeSword
    if (isTheOldOne) {
        return '§4TheOldOne'
    }

    /// 判断HeroBrine逻辑
    /**@type {boolean} 是否是Herobrine*/ // 实体僵尸 并且 总血量 > 1000
    var isHerobrine = entity instanceof ZombiesEntity.EntityZombie && entity.getMaxHealth() > 1000
    if (isHerobrine) {
        return '§5§lHeroBrine'
    }

    /// 判断巨人逻辑
    /**@type {boolean} 是否是巨人僵尸*/
    var isGiant = entity instanceof ZombiesEntity.EntityGiantZombie
    if (isGiant) {
        return '§3Giant'
    }

    /// 判断史莱姆王逻辑
    /**@type {boolean} 是否是史莱姆王*/ // round是10 15 25 并且 图2
    var isKingSlime = /^(10|15|25)$/.test(round) && entity.getMaxHealth() > 200 && zombiesMap === 2
    if (isKingSlime) {
        return '§2King Slime'
    }

    /// 判断图1极度危险僵尸的逻辑
    if (zombiesMap === 1 && entity.getMaxHealth() > 200) {

        /**@type {boolean} 是否是巢穴之母*/ // 穿金靴子
        var isBroodMother = false

        // 当实体的足部没有穿装备时会得到null null再调用getUnlocalizedName()则会得到TypeError
        try { isBroodMother = entity.getInventory()[0].getUnlocalizedName() === 'item.bootsGold' } catch (error) { }

        // 如果是巢穴之母
        if (isBroodMother) {
            return '§5Brood Mother'
        }

        /// 判断炼狱的逻辑
        /**@type {boolean} 是否是炼狱*/
        var isInferno = takeSword

        // 图1仅有3种极度危险僵尸 排除巢穴之母 不是Inferno就是Bombie
        return isInferno ? '§4Inferno' : '§cBombie'
    }

    return ''
}

/**
 * @function getZombieList 获取僵尸集合
 * 
 * @returns {Array<net.minecraft.entity.Entity>} 僵尸集合
 */
function getZombieList() {
    /**世界实体 */
    var worldEntity = mc.theWorld.loadedEntityList

    /**@type {Array<net.minecraft.entity.Entity>} 僵尸集合*/
    var zombieList = []

    for (var i in worldEntity) {

        /**@type {net.minecraft.entity.Entity} 实体*/
        var entity = worldEntity[i]

        /**@type {boolean} 是否是凋零标题*/
        var isWhiterTitle = entity instanceof ZombiesEntity.EntityWither && entity.getName().length > 10

        // 条件不符合的跳过
        if (!isZombie(entity) || entity.getHealth() === 0 || isWhiterTitle) {
            continue
        }

        // 添加实体到僵尸集合中
        zombieList.push(entity)
    }

    // 返回僵尸集合
    return zombieList
}

/**
 * @function isZombie 判断是否是僵尸实体
 * 
 * @param {net.minecraft.entity.Entity} entity 实体
 * @returns {boolean} 是否是僵尸实体
 */
function isZombie(entity) {
    // 读取每一种僵尸类型
    for (var key in ZombiesEntity) {

        // 如果有一种类型符合
        if (entity instanceof ZombiesEntity[key]) {
            return true
        }
    }
    return false
}

/// 以下3个函数是用来判断当前是不是Zombies和当前的Zombies地图
/**
 * @function isChangeMapWhitChat 改变了地图当聊天改变时
 * 
 * @param {java.lang.String} chatText 聊天字符串
 */
function isChangeMapWhitChat(chatText) {

    // 如果包含自己的名称
    if (chatText.contains(mc.thePlayer.getName())) {

        // 如果聊天字符串中包含以下的内容
        return chatText.contains('has joined') && chatText.contains('/4)!') ||
            chatText.contains('加入了游戏') || chatText.contains('加入了遊戲')
    }
    return false
}

/**
 * @function createZombiesMapUpdateTask 创建更新僵尸地图变量计时任务
 * 
 * @returns {java.util.TimerTask} 更新僵尸地图变量计时任务
 */
function createZombiesMapUpdateTask() {
    return new JAVA_CLASS.TimerTask({
        /**@override */
        run: function () {

            // 固定选取的一个坐标
            var pos = new UTIL.BlockPos(21, 66, 66)

            // 获取这个坐标上的名称
            var blockName = mc.theWorld.getBlockState(pos).getBlock().getRegistryName().toString().split(':')[1]

            var maps = { 'wool': 1, 'air': 2, 'stone': 3 }

            // 根据特定坐标的方块名称判断地图
            zombiesMap = maps[blockName] || 0
        }
    })
}

/**
 * @function inZombies 判断是否在在Zombies中
 * 
 * @returns {boolean} 是否在Zombies中
 */
function inZombies() {
    try {
        // 读取计分板标题
        var scoreboardTitle = mc.theWorld.getScoreboard().getObjectiveInDisplaySlot(1).getDisplayName()

        // 格式化标题
        scoreboardTitle = scoreboardTitle.replace(/[§a-z0-9]/g, '')

        // 检测标题是否包含某些关键词
        return scoreboardTitle.contains('ZOMBIES') || scoreboardTitle.contains('僵尸末日') || scoreboardTitle.contains('殭屍末日')
    } catch (error) {
        return false
    }
}

/**脚本启用时调用 */
function onLoad() {

    // 文字反馈模块已加载
    chat.print('§9ZombieRadarLab §2- §4Load')
}

/**@type {object} 定义脚本模块*/
var scriptModule

/**脚本运行时调用 */
function onEnable() {

    // 注册模块
    scriptModule = moduleManager.registerModule(new ZombieRadarLab())
}

/**脚本禁用时调用 */
function onDisable() {

    // 注销模块
    moduleManager.unregisterModule(scriptModule)
}