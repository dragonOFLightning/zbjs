/* 此脚本的渲染对中文兼容性太差了 */

// 定义脚本名称
var scriptName = 'ZombiesList3D';

// 定义脚本版本
var scriptVersion = '0.1.5';

// 定义脚本作者
var scriptAuthor = ['ColdDragon'];

// 引入渲染工具 [ RenderUtils ]
var RenderUtils = Java.type('net.ccbluex.liquidbounce.utils.render.RenderUtils');

// 引入颜色对象 [ Color ]
var Color = Java.type('java.awt.Color');

// 引入容器对象 [ AxisAlignedBB ]
var AxisAlignedBB = Java.type('net.minecraft.util.AxisAlignedBB');

// 定义 [ ZombiesEntity ] 用于存储所需的实体类型
var ZombiesEntity = {

    // 引入实体类型 [ EntityCreeper ] - 爬行者
    EntityCreeper: Java.type('net.minecraft.entity.monster.EntityCreeper'),

    // 引入实体类型 [ EntityGhast ] - 恶魂
    EntityGhast: Java.type('net.minecraft.entity.monster.EntityGhast'),

    // 引入实体类型 [ EntitySlime ] - 史莱姆
    EntitySlime: Java.type('net.minecraft.entity.monster.EntitySlime'),

    // 引入实体类型 [ EntityWitch ] - 女巫
    EntityWitch: Java.type('net.minecraft.entity.monster.EntityWitch'),

    // 引入实体类型 [ EntityZombie ] - 僵尸
    EntityZombie: Java.type('net.minecraft.entity.monster.EntityZombie'),

    // 引入实体类型 [ EntityPigZombie ] - 猪僵尸
    EntityPigZombie: Java.type('net.minecraft.entity.monster.EntityPigZombie'),

    // 引入实体类型 [ EntityCaveSpider ] - 洞穴蜘蛛
    EntityCaveSpider: Java.type('net.minecraft.entity.monster.EntityCaveSpider'),

    // 引入实体类型 [ EntityGiantZombie ] - 巨人僵尸
    EntityGiantZombie: Java.type('net.minecraft.entity.monster.EntityGiantZombie'),

    // 引入实体类型 [ EntityIronGolem ] - 铁傀儡
    EntityGolem: Java.type('net.minecraft.entity.monster.EntityIronGolem'),

    // 引入实体类型 [ EntityBlaze ] - 烈焰
    EntityBlaze: Java.type('net.minecraft.entity.monster.EntityBlaze'),

    // 引入实体类型 [ EntitySkeleton ] - 骷髅
    EntitySkeleton: Java.type('net.minecraft.entity.monster.EntitySkeleton'),

    // 引入实体类型 [ EntityEndermite ] - 末影螨
    EntityEndermite: Java.type('net.minecraft.entity.monster.EntityEndermite'),

    // 引入实体类型 [ EntityWolf ] - 狼
    EntityWolf: Java.type('net.minecraft.entity.passive.EntityWolf'),

    // 引入实体类型 [ EntityMagmaCube ] - 岩浆怪
    EntityMagmaCube: Java.type('net.minecraft.entity.monster.EntityMagmaCube'),

    // 引入实体类型 [ EntityWither ] - 凋灵
    EntityWither: Java.type('net.minecraft.entity.boss.EntityWither'),
}

// 定义模块的构造函数 [ theZombiesList3D ]
function theZombiesList3D() {

    // 定义 [ setting ] 对象 用于提供设置的选项
    var setting = {

        // 浮点数选项 [ 名称 默认值 最小值 最大值 ]
        float: function (name, def, min, max) {
            return value.createFloat(name, def, min, max);
        },

        // 整数选项 [ 名称 默认值 最小值 最大值 ]
        integer: function (name, def, min, max) {
            return value.createInteger(name, def, min, max);
        },

        // 布尔值选项 [ 名称 默认值 ]
        boolean: function (name, def) {
            return value.createBoolean(name, def);
        },

        // 列表选项 [ 名称 数组 默认值 ]
        list: function (name, values, def) {
            return value.createList(name, values, def);
        }
    }

    // 定义 [ settings ] 用于存储选项
    var settings = {
        // 避免获取到凋零血量标题
        theAntiTitle: setting.boolean('AntiTitle', true),
        // 设置 三原色 和 透明度
        theRed: setting.integer('Red', 30, 0, 255),
        theGreen: setting.integer('Green', 170, 0, 255),
        theBlue: setting.integer('Blue', 255, 0, 255),
        theAlpha: setting.integer('Alpha', 50, 0, 255),
    };

    // 定义模块选项
    this.addValues = function (values) {

        // 获取每一个选项
        for (var i in settings) {

            // 把每个选项添加进去
            values.add(settings[i])
        }
    };

    // 定义 [ theRenderEntityList3D ] 用于存储需要渲染的实体对象
    var theRenderEntityList3D = [];

    // 定义模块名称
    this.getName = function () {
        return 'ZombiesList3D';
    };

    // 定义模块描述
    this.getDescription = function () {
        return 'ColdDragon';
    };

    // 定义模块归类
    this.getCategory = function () {
        return 'Render';
    };

    // 定义模块更新
    this.onUpdate = function () {

        // 把获取到的实体对象存储到 [ theRenderEntityList3D ] 中
        theRenderEntityList3D = getZombiesList3D();
    };

    // 定义模块渲染3D
    this.onRender3D = function () {

        // 遍历 [ theZombieList3D ] 中的每一个 实体对象
        for (var index = 0; index < theRenderEntityList3D.length; index++) {

            // 获取实体对象
            var theEntity = theRenderEntityList3D[index];

            // 获取实体的 minX 和 minZ 
            var minX = theEntity.getEntityBoundingBox().minX;
            var minZ = theEntity.getEntityBoundingBox().minZ;

            // 获取实体的 maxX 和 maxZ
            var maxX = theEntity.getEntityBoundingBox().maxX;
            var maxZ = theEntity.getEntityBoundingBox().maxZ;

            // 获取实体 x 与 z 的中点
            var theCenterX = (minX + maxX) / 2;
            var theCenterZ = (minZ + maxZ) / 2;

            // 获取实体的最大高度
            var maxY = theEntity.getEntityBoundingBox().maxY;

            // 定义 [ theRenderText ] 用于存储渲染的文本
            var theRenderText;

            // 获取实体的血量
            var theEntityHealth = theEntity.getHealth().toFixed(1);

            // 获取实体的名称
            var theEntityName = theEntity.getName();

            // 如果实体没有受伤
            if (theEntity.hurtTime == 0) {

                // 存储文本 白色的名称
                theRenderText = '§f' + theEntityName + '§2[' + '§b' + theEntityHealth + '§2]';

                // 否则
            } else {

                // 存储文本 血红的名称
                theRenderText = '§4' + theEntityName + '§2[' + '§b' + theEntityHealth + '§2]';
            }

            // 渲染文本
            RenderUtils.renderNameTag(theRenderText, theCenterX, maxY + 1, theCenterZ);

            // 获取渲染坐标
            var renderManager = mc.getRenderManager();

            // 实体的最小坐标 减去 渲染坐标 获得相对位置
            var minRenderX = minX - renderManager.renderPosX;
            var minRenderY = theEntity.getEntityBoundingBox().minY - renderManager.renderPosY;
            var minRenderZ = minZ - renderManager.renderPosZ;

            // 实体的最大坐标 减去 渲染坐标 获得相对位置
            var maxRenderX = maxX - renderManager.renderPosX;
            var maxRenderY = maxY - renderManager.renderPosY;
            var maxRenderZ = maxZ - renderManager.renderPosZ;

            // 创建容器对象 存入相对位置坐标
            var theBox = new AxisAlignedBB(minRenderX, minRenderY, minRenderZ, maxRenderX, maxRenderY, maxRenderZ);

            // 创建颜色对象 存入颜色
            var theColor = new Color(settings.theRed.get(), settings.theGreen.get(), settings.theBlue.get(), settings.theAlpha.get());

            // 渲染容器
            RenderUtils.drawAxisAlignedBB(theBox, theColor);
        }
    };

    // 定义 [ getZombiesList3D ] 用于获取符合条件的实体对象
    function getZombiesList3D() {

        // 定义 [ theZombieList ] 用于存储符合条件的实体对象
        var theZombieList = [];

        // 获取世界上每一个实体
        for (var index in mc.theWorld.loadedEntityList) {

            // 获取单独的实体
            var theEntity = mc.theWorld.loadedEntityList[index];

            // 获取全部符合条件的实体类型
            for (var key in ZombiesEntity) {

                // 如果这个单独的实体对象符合其中一个实体类型
                if (theEntity instanceof ZombiesEntity[key]) {

                    // 如果开启了 [ theAntiTitle ]
                    if (settings.theAntiTitle.get()) {
                        // 如果实体类型是凋零并且血量为300
                        if (theEntity instanceof ZombiesEntity.EntityWither && theEntity.getHealth() == 300) {

                            // 跳过循环
                            continue;
                        }
                    }

                    // 存储到 [ theZombieList ] 中
                    theZombieList.push(theEntity);
                }
            }
        }
        // 返回 [ theZombieList ]
        return theZombieList;
    }
}

// 脚本启用时调用
function onLoad() {

    // 输出一句话表示正常
    chat.print('§9' + 'ZombiesList3D' + ' §2- §4Load');
}

// 创建模块的实例 [ dragonZombiesList3D ]
var dragonZombiesList3D = new theZombiesList3D();

// 定义 [ dragonZombiesList3DClient ] 用于存储注册信息
var dragonZombiesList3DClient;

// 脚本运行时调用
function onEnable() {

    // 注册
    dragonZombiesList3DClient = moduleManager.registerModule(dragonZombiesList3D);
}

// 脚本禁用时调用
function onDisable() {

    // 注销
    moduleManager.unregisterModule(dragonZombiesList3DClient);
}