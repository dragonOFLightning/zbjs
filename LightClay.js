/* 这是一个初代版本第二次更新 目前很多地方待优化 */

// 定义脚本名字
var scriptName = 'LightClay';

// 定义脚本版本
var scriptVersion = '0.2.0';

// 定义脚本作者
var scriptAuthor = ['ColdDragon'];

// 引入BlockPos对象 用于存储三维坐标
var BlockPos = Java.type('net.minecraft.util.BlockPos');

// 引入Java类Color 用于设置颜色
var Color = Java.type('java.awt.Color');

// 引入AxisAlignedBB对象 用于绘制容器
var AxisAlignedBB = Java.type('net.minecraft.util.AxisAlignedBB');

// 引入RenderUtils 用于渲染3D
var RenderUtils = Java.type('net.ccbluex.liquidbounce.utils.render.RenderUtils');

// 定义模块构造函数
function theLightClay() {

    // 创建 [ setting ] 对象 用于提供设置的选项
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

    // 创建 [ settings ] 对象 用于存储设置的选项
    var settings = {
        // 开启此选项就可以获取2点的坐标 确定范围
        theChangeGround: setting.boolean('ClickBlock', false),
        // 设置 三原色 和 透明度
        theRed: setting.integer('Red', 30, 0, 255),
        theGreen: setting.integer('Green', 170, 0, 255),
        theBlue: setting.integer('Blue', 255, 0, 255),
        theAlpha: setting.integer('Alpha', 90, 0, 255),
    }

    // 定义模块选项
    this.addValues = function (values) {

        // 把存储的设置选项全部添加进来
        for (var index in settings) {
            values.add(settings[index]);
        }
    }
    // 定义模块名称
    this.getName = function () {
        return 'LightClay';
    }
    // 定义模块描述
    this.getDescription = function () {
        return 'ColdDragon';
    }
    // 定义模块分类
    this.getCategory = function () {
        return 'Render';
    }

    // 定义 [ theBlocksList3D ] 用于存储符合条件方块的 三维坐标
    var theBlocksList3D;

    // 模块启动时调用
    this.onEnable = function () {

        // 初始化 [ theBlocksList3D ]
        theBlocksList3D = [];
    }

    // 定义 [ theItemTypeNumber ] 用于 存储物品的 颜色序号
    var theItemTypeNumber;

    // 模块更新时调用
    this.onUpdate = function () {

        // 抓中的物品更换才调用 getBlocksList()
        if (theItemTypeNumber !== mc.thePlayer.getHeldItem().getMetadata()) {

            // 调用 getBlocksList() 获取符合条件方块的 三维坐标
            theBlocksList3D = getBlocksList();
        }
    }

    // 模块关闭时调用
    this.onDisable = function () {

        // 初始化 2点坐标
        theGroundPosition1 = 'NO';
        theGroundPosition2 = 'NO';
    }

    // 模块3D渲染时调用
    this.onRender3D = function () {

        // 循环遍历 theBlocksList3D 中的每一个 三维坐标
        for (var i = 0; i < theBlocksList3D.length; i++) {

            // 定义 x y z
            var x, y, z;

            // 获取方块的坐标
            x = theBlocksList3D[i].getX();
            y = theBlocksList3D[i].getY();
            z = theBlocksList3D[i].getZ();

            // 获取渲染的坐标
            var renderManager = mc.getRenderManager();

            // 方块的坐标减去渲染的坐标获得相对位置
            x = x - renderManager.renderPosX;
            y = y - renderManager.renderPosY;
            z = z - renderManager.renderPosZ;

            // 创建一个颜色的对象
            var theColor = new Color(settings.theRed.get(), settings.theGreen.get(), settings.theBlue.get(), settings.theAlpha.get());

            // 创建一个盒子的对象 存入坐标
            var theBox = new AxisAlignedBB(x, y, z, x + 1, y + 1, z + 1);

            // 渲染盒子
            RenderUtils.drawAxisAlignedBB(theBox, theColor)
        }
    }

    // 定义2点的坐标 并初始化为 'NO'
    var theGroundPosition1 = 'NO';
    var theGroundPosition2 = 'NO';

    // 模块检测到挖掘方块后调用
    this.onClickBlock = function (event) {

        // 如果 theChangeGround 选项 启用
        if (settings.theChangeGround.get()) {

            // 获取点击的方块
            var theBlockPos = event.getClickedBlock();

            // 如果 点1 是初始值
            if (theGroundPosition1 === 'NO') {

                // 把三维坐标存储到 点1
                theGroundPosition1 = theBlockPos;

                // 输出一句话表示正常
                chat.print('已选择点1  ' + theGroundPosition1);

                // 否则 如果 点2 是初始值 并且 获取到的三维坐标和点1不相等
            } else if (theGroundPosition2 === 'NO' && !isEqual(theGroundPosition1, theBlockPos)) {

                // 把三维坐标存储到 点2
                theGroundPosition2 = theBlockPos;

                // 输出一句话表示正常
                chat.print('已选择点2  ' + theGroundPosition2)
            }
        }
        // 定义 [ isEqual ] 用于比较2个三维坐标是否相等
        function isEqual(theBlockPos1, theBlockPos2) {
            if (
                // 如果 X Y Z 全部相等
                theBlockPos1.getX() === theBlockPos2.getX() &&
                theBlockPos1.getY() === theBlockPos2.getY() &&
                theBlockPos1.getZ() === theBlockPos2.getZ()
            ) {
                // 返回 true
                return true;
            }
            // 返回 false
            return false;
        }
    }
    // 定义 [ getBlocksList ] 用于获取扫码范围内有没有符合条件方块的 三维坐标
    function getBlocksList() {

        // 定义 [ theBlocksList ] 用于存储每个符合条件的 三维坐标
        var theBlocksList = [];

        // 获取 x 最小值
        var minX = Math.min(theGroundPosition1.getX(), theGroundPosition2.getX());

        // 获取 x 最大值
        var maxX = Math.max(theGroundPosition1.getX(), theGroundPosition2.getX());

        // 获取 y 最小值
        var minY = Math.min(theGroundPosition1.getY(), theGroundPosition2.getY());

        // 获取 y 最大值
        var maxY = Math.max(theGroundPosition1.getY(), theGroundPosition2.getY());

        // 获取 z 最小值
        var minZ = Math.min(theGroundPosition1.getZ(), theGroundPosition2.getZ());

        // 获取 z 最大值
        var maxZ = Math.max(theGroundPosition1.getZ(), theGroundPosition2.getZ());

        // 扫码2点范围内的每一个点
        for (var x = minX; x <= maxX; x++) {
            for (var y = minY; y <= maxY; y++) {
                for (var z = minZ; z <= maxZ; z++) {

                    // 创建一个BlockPos类型的变量存储向量
                    var theBlockPos = new BlockPos(x, y, z);

                    // 获取方块类型
                    var theBlockName = mc.theWorld.getBlockState(theBlockPos).getBlock().getRegistryName().toString().split(":")[1];

                    // 如果方块类型是硬化粘土，并且满足其他条件
                    if (theBlockName === 'stained_hardened_clay') {

                        // 获取方块颜色序号
                        var theBlockTypeNumber = mc.theWorld.getBlockState(theBlockPos).getBlock().getMetaFromState(mc.theWorld.getBlockState(theBlockPos));

                        // 获取物品颜色序号
                        var theItemTypeNumber = mc.thePlayer.getHeldItem().getMetadata();

                        // 如果序号一样
                        if (theBlockTypeNumber == theItemTypeNumber) {
                            // 存储进 theBlocksList 中
                            theBlocksList.push(theBlockPos);
                        }
                    }
                }
            }
        }
        // 返回 [ theBlocksList ]
        return theBlocksList;
    }

}
// 脚本加载时调用
function onLoad() {
    // 输出一句话表示脚本已加载
    chat.print('§9' + 'LightClay' + ' §2- §4Load');
}

// 定义 [ theLightClay ] 模块的实例 [ dragonLightClay ]
var dragonLightClay = new theLightClay();

// 定义 [ dragonLightClayClient ] 用于存储注册
var dragonLightClayClient;

// 脚本启用时调用
function onEnable() {
    // 注册
    dragonLightClayClient = moduleManager.registerModule(dragonLightClay);
}
// 脚本禁用时调用
function onDisable() {
    // 注销
    moduleManager.unregisterModule(dragonLightClayClient);
}