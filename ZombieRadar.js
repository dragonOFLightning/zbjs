/**
 * 龙界板块制造 冰龙开发 3dragons贡献
 * 
 * 当前脚本功能较少 推荐使用ZombieRadarLab
 * 
 * ZombieRadar 僵尸雷达 稳定版
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
 *  - HeroBrine - 长者 - 巨人 -
 * 
 * 僵尸雷达特性
 * 
 * - 使用英文语言可以正常运行
 * 
 * - 使用其他语言会出现渲染名称bug[不可修复]
 * 
 * 代码说明
 *  - 使用旧架构 可能会导致可读性略差
 */

/**脚本名称 */
var scriptName = 'ZombiesRadar';

/**脚本版本 */
var scriptVersion = '0.2.1';

/**脚本作者 */
var scriptAuthor = ['ColdDragon'];

// 定义 [ ItemSword ] 并引入mc的物品的剑类型 Class
var ItemSword = Java.type('net.minecraft.item.ItemSword');

// 引入各种实体类型
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
};

// 引入渲染工具 [ RenderUtils ] @Class
var RenderUtils = Java.type('net.ccbluex.liquidbounce.utils.render.RenderUtils');

// 引入颜色对象 [ Color ] @Class
var Color = Java.type('java.awt.Color');

// 引入容器对象 [ AxisAlignedBB ] @Class
var AxisAlignedBB = Java.type('net.minecraft.util.AxisAlignedBB');

// 定义模块的构造函数 [ theZombieRadar ]
function ZombieRadar() {

    // 定义 [ theRenderEntityList3D ] 用于存储需要渲染的实体对象 @Array<ZombiesEntity>
    var theRenderEntityList3D = [];

    // 定义 [round] 用于存储当前场景 @string
    var ground = 'Lobby';

    // 定义 [tick] 用于计数 @integer
    var tick = -1;

    // 定义 [ tickForWave1 ] 用于计数 @integer
    var tickForWave1 = 221;

    // 定义 [ setting ] 对象 用于提供设置的选项
    var setting = {

        // 整数选项 [ 名称 默认值 最小值 最大值 ]
        integer: function (name, def, min, max) {
            return value.createInteger(name, def, min, max);
        },

        // 布尔值选项 [ 名称 默认值 ]
        boolean: function (name, def) {
            return value.createBoolean(name, def);
        },
    };

    // 定义 [ settings ] 用于存储选项
    var settings = {

        // 避免获取到标题凋灵
        theAntiTitle: setting.boolean('AntiTitle', true),

        // 设置渲染2D 极度危险 坐标
        theRenderX: setting.integer('RenderX', 1160, 0, 2000),
        theRenderY: setting.integer('RenderY', 2, 0, 1080),

        // 设置渲染3D 常规僵尸 三原色 和 透明度 默认淡蓝色
        theRed: setting.integer('Red', 30, 0, 255),
        theGreen: setting.integer('Green', 170, 0, 255),
        theBlue: setting.integer('Blue', 255, 0, 255),
        theAlpha: setting.integer('Alpha', 50, 0, 255),

        // 设置渲染3D  危险 三原色 和 透明度 默认紫色
        theDangerousRed: setting.integer('DangerRed', 255, 0, 255),
        theDangerousGreen: setting.integer('DangerGreen', 0, 0, 255),
        theDangerousBlue: setting.integer('DangerBlue', 255, 0, 255),
        theDangerousAlpha: setting.integer('DangerAlpha', 50, 0, 255),

        // 设置渲染3D  极度危险 三原色 和 透明度 默认红色
        thePerilousRed: setting.integer('thePerilousRed', 255, 0, 255),
        thePerilousGreen: setting.integer('thePerilousGreen', 0, 0, 255),
        thePerilousBlue: setting.integer('thePerilousBlue', 0, 0, 255),
        thePerilousAlpha: setting.integer('thePerilousAlpha', 50, 0, 255),

        // 设置渲染3D  Wave1的僵尸 三原色 和 透明度 默认橙色
        theWave1Red: setting.integer('Wave1Red', 255, 0, 255),
        theWave1Green: setting.integer('WaveGreen', 165, 0, 255),
        theWave1Blue: setting.integer('theWave1Blue', 0, 0, 255),
        theWave1Alpha: setting.integer('theWave1Alpha', 50, 0, 255),
    };

    // 定义模块选项
    this.addValues = function (values) {

        // 获取每一个选项
        for (var index in settings) {

            // 把每个选项添加进去
            values.add(settings[index])
        }
    };

    // 定义模块名称
    this.getName = function () {
        return 'ZombiesRadar';
    };

    // 定义模块描述
    this.getDescription = function () {
        return 'ColdDragon';
    };

    // 定义模块归类
    this.getCategory = function () {
        return 'Fun';
    };

    // 定义 [atLobby] 用于判断是否在大厅 @boolean
    var atLobby = true;

    // 定义模块更新
    this.onUpdate = function () {

        // 把获取到的实体对象存储到 [ theRenderEntityList3D ] 中
        theRenderEntityList3D = getZombiesList3D();

        // tick为 如果tick < 0 则 tick 否则 tick 自减
        tick = tick < 0 ? tick : tick - 1;

        // 定义并获取z轴 @int
        var z = mc.thePlayer.getPosition().getZ();

        // 如果不在游戏 就是在大厅
        atLobby = !inGame();

        tickForWave1 = tickForWave1 > 220 ? tickForWave1 : tickForWave1 + 1;

        // 通过z判断当前场景
        ground = atLobby ? 'Lobby' : tick > 0 ? z > 10 ? 'DeadEnd' : z > 7 ? 'BadBlood' : 'AlienArcadium' : ground;
    };

    // 引入 服务器标题数据包 @Class
    var S45PacketTitle = Java.type('net.minecraft.network.play.server.S45PacketTitle');

    // 引入 服务器聊天数据包 @Class
    var S02PacketChat = Java.type('net.minecraft.network.play.server.S02PacketChat');

    this.onPacket = function (event) {

        // 获取数据包 @any
        var thePacket = event.getPacket();

        // 如果数据包类型是 [S45PacketTitle]
        if (thePacket instanceof S45PacketTitle) {

            // 定义并获取标题文本 @java.lang.String
            var titleText = thePacket.getMessage().getUnformattedText();

            // 如果标题文本中包含 ['Round']
            if (titleText.contains('Round')) {

                // 定义并获取round后面的索引 round的长度是5 而 round和数字之间有1个空格 @integer
                var index = titleText.indexOf('Round') + 6;

                // 截取字符串round @string
                var string = titleText.substring(index, titleText.length);

                // 如果为1 表示游戏刚开始 赋值为10[数值越大精度越高也越易被干扰]
                tick = string == 1 ? 10 : tick;

                // 用于给获取Wave1的怪计数
                tickForWave1 = 0;

                // 初始化 wave1ZombieList
                wave1ZombieList = [];

            };
        }
        // 否则 如果数据包类型是 [S02PacketChat]
        else if (thePacket instanceof S02PacketChat) {

            // 定义并获取聊天文本 @java.lang.String
            var chatText = thePacket.getChatComponent().getUnformattedText();

            if (chatText.contains('Sending you to mini') && chatText.contains('!')) {
                // 赋值 tick 为30
                tick = 30;
            };
        };
    };

    // 定义模块渲染2D
    this.onRender2D = function () {

        // 存储渲染的集合
        var renderList = [];

        // 获取自己操控的生物
        var thePlayer = mc.thePlayer;

        // 获取自己的坐标
        var x1 = thePlayer.posX;
        var y1 = thePlayer.posY;
        var z1 = thePlayer.posZ;

        // 循环获取僵尸的列表
        for (var index = 0; index < theRenderEntityList3D.length; index++) {

            // 获取实体
            var theEntity = theRenderEntityList3D[index];

            // 获取血量
            var health = theEntity.getHealth();

            // 跳过死实体
            if (health === 0) {
                continue;
            };

            // 保留一个小数点
            health = health.toFixed(1);

            // 如果实体的极度危险级别的
            if (isPerilousZombie(theEntity)) {

                // 获取实体坐标
                var x2 = theEntity.posX;
                var y2 = theEntity.posY;
                var z2 = theEntity.posZ;

                // 计算实体与自己的空间距离
                var distance = Math.sqrt(getDistanceDef(x1, y1, z1, x2, y2, z2)).toFixed(1);

                // 获取实体的总血量
                var maxHealth = theEntity.getMaxHealth().toFixed(1);

                // 获取实体的类型
                var name = getPerilousZombieType(theEntity);

                // 文本内容
                var text = name + '§r[' + health + '/' + maxHealth + '] [' + distance + ']';

                // 存储进渲染队列中
                renderList.push(text);
            };
        };

        // 循环渲染已存储的渲染队列
        for (var count = 0; count < renderList.length; count++) {

            // 获取渲染文本
            var text = renderList[count];

            // 计算渲染的X位置
            var renderX = settings.theRenderX.get() - mc.fontRendererObj.getStringWidth(text);

            // 计算渲染的Y位置
            var renderY = settings.theRenderY.get() + count * 9;

            // 执行渲染
            mc.fontRendererObj.drawString(text, renderX, renderY, 0xFFFFFF, true);
        };
    };

    // 定义模块渲染3D
    this.onRender3D = function () {

        // 遍历 [ theZombieList3D ] 中的每一个 实体对象
        for (var index = 0; index < theRenderEntityList3D.length; index++) {

            // 获取实体对象 @theZombiesList3D
            var theEntity = theRenderEntityList3D[index];

            // 获取实体的生命值 @float
            var health = theEntity.getHealth();

            // 如果实体的血量为0 死了就不渲染了
            if (health === 0) {

                // 跳过循环
                continue;
            };

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

            // 定义 [ theRenderText ] 用于存储渲染的文本 @string
            var theRenderText;

            // 获取实体的血量 @string
            var theEntityHealth = health.toFixed(1);

            // 获取实体的名称 @java.lang.String
            var theEntityName = theEntity.getName();

            // 获取实体的总血量 @float
            var theEntityMaxHealth = theEntity.getMaxHealth();

            // 如果实体没有受伤
            if (theEntity.hurtTime == 0) {

                // 存储文本 白色的名称
                theRenderText = '§f' + theEntityName + '§2[' + '§b' + theEntityHealth + '/' + theEntityMaxHealth + '§2]';

                // 否则
            } else {

                // 存储文本 血红的名称
                theRenderText = '§4' + theEntityName + '§2[' + '§b' + theEntityHealth + '/' + theEntityMaxHealth + '§2]';
            };

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

            // 创建颜色对象 存入颜色 - 常规
            var theColor = new Color(settings.theRed.get(), settings.theGreen.get(), settings.theBlue.get(), settings.theAlpha.get());

            // 创建颜色对象 存入颜色 - 危险
            var theDangerousColor = new Color(settings.theDangerousRed.get(), settings.theDangerousGreen.get(), settings.theDangerousBlue.get(), settings.theDangerousAlpha.get());

            // 创建颜色对象 存入颜色 - Wave1
            var theWave1Color = new Color(settings.theWave1Red.get(), settings.theWave1Green.get(), settings.theWave1Blue.get(), settings.theWave1Alpha.get());

            // 创建颜色对象 存入颜色 - 极度危险
            var thePerilousColor = new Color(settings.thePerilousRed.get(), settings.thePerilousGreen.get(), settings.thePerilousBlue.get(), settings.thePerilousAlpha.get());

            // 选择渲染的颜色
            var renderColor = isPerilousZombie(theEntity) ?
                thePerilousColor : isDangerZombie(theEntity) ?
                theDangerousColor : wave1ZombieList.indexOf(theEntity) !== -1 ?
                theWave1Color : theColor;

            // 渲染容器
            RenderUtils.drawAxisAlignedBB(theBox, renderColor);
        };
    };

    // 用于计算空间距离
    function getDistanceDef(x1, y1, z1, x2, y2, z2) {

        // 计算差值
        var x = x2 - x1;
        var y = y2 - y1;
        var z = z2 - z1;

        // 返回平方
        return x * x + y * y + z * z;
    };

    // 定义 [ wave1ZombieList ] 用于存储 Wave1 的僵尸 @Array<ZombieEntity>
    var wave1ZombieList = [];

    // 定义 [ getZombiesList3D ] 用于获取符合条件的实体对象 @Array<ZombiesEntity>
    function getZombiesList3D() {

        // 定义 [ theZombieList ] 用于存储符合条件的实体对象 @Array<ZombiesEntity>
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
                        if (theEntity instanceof ZombiesEntity.EntityWitch && theEntity.getName().length > 20) {

                            // 跳过循环
                            continue;
                        };
                    };

                    if (tickForWave1 > 180 && tickForWave1 < 220) {
                        wave1ZombieList.push(theEntity);
                    };

                    // 存储到 [ theZombieList ] 中
                    theZombieList.push(theEntity);
                };
            };
        };
        // 返回 [ theZombieList ]
        return theZombieList;
    };

    // 定义 [ isDangerZombie ] 判断此僵尸是否是一个危险等级的僵尸 @boolean
    function isDangerZombie(theEntity) {
        // 否则 如果是僵尸
        if (theEntity instanceof ZombiesEntity.EntityZombie) {

            // 满足以下条件的僵尸就是危险等级的僵尸
            if (theEntity.getMaxHealth() > 249 || ground !== 'AlienArcadium' && theEntity.getMaxHealth() > 100) {
                return true;
            };
        };
    };

    // 定义 [ getPerilousZombieType ] 用于获取极度危险僵尸的类型 @string
    function getPerilousZombieType(theEntity) {

        // 是否拿剑
        var takeSword = false;

        try {
            // 判断一下是否拿剑
            takeSword = theEntity.getHeldItem().getItem() instanceof ItemSword;
        } catch (error) { };

        // 是否是长者 实体僵尸 并且 小僵尸 并且 总血量 > 429 并且 拿剑
        var isTheOldOne = theEntity instanceof ZombiesEntity.EntityZombie && theEntity.getEyeHeight() < 1 && theEntity.getMaxHealth() > 249 && takeSword;

        // 是否是Herobrine 实体僵尸 并且 总血量 > 1000
        var isHerobrine = theEntity instanceof ZombiesEntity.EntityZombie && theEntity.getMaxHealth() > 1000;

        // 是否是巨人 返回 绿字'Giant' 否则 是否是长者 返回 红字'TheOldOne' 否则 是否是Herobrine 返回 紫字加粗'Herobrine'
        return theEntity instanceof ZombiesEntity.EntityGiantZombie ? '§3Giant' : isTheOldOne ? '§4TheOldOne' : isHerobrine ? '§5§lHerobrine' : '';
    };

    /**
     * @function isPerilousZombie 用于判断是否是极度危险的僵尸
     * @param {ZombiesEntity} theEntity 实体
     * @returns {boolean} 是否是极度危险的僵尸
     */
    function isPerilousZombie(theEntity) {

        // 巨人僵尸直接 true
        if (theEntity instanceof ZombiesEntity.EntityGiantZombie) {
            return true;
        };

        // 判断是否拿剑
        var takeSword = false;

        try {
            // 尝试获取抓中的物品 并判断是否是 物品剑
            takeSword = theEntity.getHeldItem().getItem() instanceof ItemSword;
        } catch (error) { };

        // 疑似长者或者Herobrine
        if (theEntity instanceof ZombiesEntity.EntityZombie) {
            if (theEntity.getMaxHealth() > 790 || theEntity.getEyeHeight() < 1 && theEntity.getMaxHealth() > 249 && takeSword) {
                return true
            };
        };
    };

    // 定义 [ inGame ] 用于判断是否在游戏中 Boolean
    function inGame() {

        // 尝试调用
        try {

            // 获取计分板名称 java.lang.String
            var name = mc.theWorld.getScoreboard().getScores()[0].getObjective().getName();

            // 判断name是否包含以下的字符串
            return name === 'PreScoreboard' || name === 'health' || name === 'health_tab' || name === 'ZScoreboard';

            // 报错就返回 false
        } catch (error) {

            // 如果没有计分板就不在游戏 因为游戏默认都有计分板
            return false;
        };
    };
}
// 脚本启用时调用
function onLoad() {

    // 输出一句话表示正常
    chat.print('§9' + 'ZombiesRadar' + ' §2- §4Load');
}

// 创建模块的实例 [ dragonZombiesList3D ]
var dragonZombieRadar = new ZombieRadar();

// 定义 [ dragonZombiesRadarClient ] 用于存储注册信息
var dragonZombiesRadarClient;

// 脚本运行时调用
function onEnable() {

    // 注册
    dragonZombiesRadarClient = moduleManager.registerModule(dragonZombieRadar);
}

// 脚本禁用时调用
function onDisable() {

    // 注销
    moduleManager.unregisterModule(dragonZombiesRadarClient);
}