/**
 * 龙界板块制造 冰龙开发 3dragons贡献
 * 
 * 同步切枪 TickChange 与最近的玩家同步切换快捷栏
 */

// 定义脚本名称
var scriptName = 'TickChange'

// 定义脚本版本
var scriptVersion = '1.1.0'

// 定义脚本作者
var scriptAuthor = ['ColdDragon']

/**实体玩家类型 */
var EntityPlayer = Java.type('net.minecraft.entity.player.EntityPlayer')

// 定义模块的构造函数
function theTickChange() {

    // 定义模块名称
    this.getName = function () {
        return 'TickChange'
    }

    // 定义模块描述
    this.getDescription = function () {
        return 'ColdDragon'
    }

    // 定义模块归类
    this.getCategory = function () {
        return 'Fun'
    }

    // 模块更新时调用
    this.onUpdate = function () {
        /**@type {net.minecraft.entity.player.EntityPlayer} 最近的玩家*/
        var player = getClosePlayer()

        // 如果没获取到 就结束
        if (!player) {
            return
        }

        /**@type {java.lang.String} 最近的玩家当前持有的物品*/
        var item = player.getHeldItem()

        // 如果没有持有物品 则结束
        if (!item) {
            return
        }

        /**@type {java.lang.String} 最近的玩家当前持有的物品名称*/
        var itemName = item.getUnlocalizedName()

        // 反向循环获取快捷栏 反向循环作用是给卡假枪的用的 正常情况和正向循环无差别
        for (var slot = 2 << 2; slot > -1; slot--) {

            /**@type {net.minecraft.item.ItemStack} 当前槽位的物品*/
            var selfItem = mc.thePlayer.inventory.getStackInSlot(slot)

            // 如果当前槽位没有物品 则跳过
            if (!selfItem) {
                continue
            }

            /**@type {java.lang.String} 当前槽位物品名称*/
            var selfItemName = selfItem.getUnlocalizedName()

            // 如果当前槽位物品名称 和 最近的玩家持有的物品相同
            if (selfItemName === itemName) {

                // 切换快捷栏
                mc.thePlayer.inventory.currentItem = slot
            }
        }
    }
}

/**
 * @function getClosePlayer 获取最近的实体  
 */
function getClosePlayer() {

    /**世界实体 */
    var worldEntity = mc.theWorld.loadedEntityList

    // 遍历世界实体
    for (var key in worldEntity) {

        /**@type {net.minecraft.entity.Entity} 实体*/
        var entity = worldEntity[key]

        /**@type {boolean} 是否是玩家*/
        var isPlayer = entity instanceof EntityPlayer

        // 跳过非玩家
        if (!isPlayer) {
            continue
        }

        // 跳过死实体
        if (entity.isDead || entity === mc.thePlayer) {
            continue
        }

        return entity
    }
    return null
}

// 脚本启用时调用
function onLoad() {

    // 输出一句话表示正常
    chat.print('§9' + 'TickChange' + ' §2- §4Load')
}

// 创建模块的实例 [ dragonTickChange ]
var dragonTickChange = new theTickChange()

// 定义 [ dragonTickChange ] 用于存储注册信息
var dragonTickChangeClient

// 脚本运行时调用
function onEnable() {

    // 注册
    dragonTickChangeClient = moduleManager.registerModule(dragonTickChange)
}

// 脚本禁用时调用
function onDisable() {

    // 注销
    moduleManager.unregisterModule(dragonTickChangeClient)
}