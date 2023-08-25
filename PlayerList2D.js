// 定义脚本名称
var scriptName = 'PlayerList2D';

// 定义脚本版本
var scriptVersion = '2.1.0';

// 定义脚本作者
var scriptAuthor = ['ColdDragon'];

// 引入 [ Tools.js ] 脚本工具 用于获取工具渲染列表
script.import('Tools.js');

// 定义模块的构造函数
function thePlayerList2D() {

    // 定义 [ setting ] 对象 用于提供选项
    var setting = {

        // 布尔值选项 [ string名称 boolean默认值 ]
        boolean: function (name, def) {
            return value.createBoolean(name, def);
        }
    };

    // 定义选项
    var settings = {

        // 是否暴力不显示 NPC 仅靠坐标模糊判断
        noNPC: setting.boolean('NOArcadeNPC', true),

        // 当 z 大于 700 时不渲染工具
        renderTools: setting.boolean('AutoRenderTools', true),
    };

    // 定义模块选项 
    this.addValues = function (values) {

        // 循环添加选项
        for (var i in settings) {
            values.add(settings[i])
        }
    };

    // 定义模块名称
    this.getName = function () {
        return 'PlayerList2D';
    };

    // 定义模块描述
    this.getDescription = function () {
        return 'ColdDragon';
    };

    // 定义模块归类
    this.getCategory = function () {
        return 'Render';
    };

    // 定义 [ theRenderPlayerList2D ] 用于存储需要渲染的文本;
    var theRenderPlayerList2D;
    this.onUpdate = function () {

        // 获取渲染文本的列表
        theRenderPlayerList2D = getRenderList2D();
    };
    this.onRender2D = function () {

        // 循环获取每个渲染的文本
        for (var count = 0; count < theRenderPlayerList2D.length; count++) {

            // 把文本渲染到屏幕上
            mc.fontRendererObj.drawString(theRenderPlayerList2D[count], 2, 7 + count * 9, 0xFFFFFF);
        }
    };

    // 定义 [ getRenderList2D ] 用于获取渲染2D列表
    function getRenderList2D() {

        // 定义 [ renderList2D ] 用于存储渲染的文本
        var renderList2D = [];

        // 定义 [ thisPlayerList ] 并存储获取到的玩家列表
        var thisPlayerList = getPlayerList(settings.noNPC.get());

        // 循环获取每个玩家对象
        for (var index = 0; index < thisPlayerList.length; index++) {

            // 定义 [ player ] 获取并存储单独的玩家对象
            var player = thisPlayerList[index];

            // 数组中添加渲染玩家名称与声明的文本
            renderList2D.push(getPlayerRenderText(player));

            // 如果自动渲染开启 当玩家所在 z < 700 时就渲染 或者 如果关闭自动渲染 任何时候都渲染工具
            if (settings.renderTools.get() && mc.thePlayer.getPosition().getZ() < 700 || !settings.renderTools.get()) {

                // 尝试执行
                try {

                    // 获取工具渲染的列表
                    var toolsList2D = getToolsList2D(player);

                    // 循环获取 [ toolsList2D ] 中的每个文本
                    for (var key in toolsList2D) {

                        // 把工具的中的每个文本都添加到[renderList2D] 中
                        renderList2D.push(toolsList2D[key]);
                    }
                    // 报错就略过
                } catch (error) {}
            }
        }

        // 返回 renderList2D
        return renderList2D;
    }


    // 定义 [ getPlayerRenderText ] 用于获取玩家的渲染文本
    function getPlayerRenderText(thePlayer) {

        // 获取当前血量
        var theEntityHealth = thePlayer.getHealth().toFixed(1);

        // 获取最高血量
        var theEntityMaxHealth = thePlayer.getMaxHealth();

        // 获取名称
        var theEntityName = thePlayer.getName();

        // 如果实体是自身
        if (theEntityName == mc.thePlayer.getName()) {

            // 如果实体没受伤
            if (thePlayer.hurtTime == 0) {

                // 深蓝字体名称 绿色字体血量
                return '§9' + theEntityName + '§f[§b ' + theEntityHealth + '§d/' + '§a' + theEntityMaxHealth + ' §f]';
            }

            // 血红字体名称 绿色字体血量
            return '§4' + theEntityName + '§f[§b ' + theEntityHealth + '§d/' + '§a' + theEntityMaxHealth + ' §f]';
        }

        // 如果实体没受伤
        if (thePlayer.hurtTime == 0) {

            // 亮绿字体名称 淡蓝
            return '§3' + theEntityName + '§f[§b ' + theEntityHealth + '§d/' + '§a' + theEntityMaxHealth + ' §f]';
        }
        // 血红字体名称
        return '§4' + theEntityName + '§f[§b ' + theEntityHealth + '§d/' + '§a' + theEntityMaxHealth + ' §f]';
    }
}

// 脚本启用时调用
function onLoad() {

    // 输出一句话表示正常
    chat.print('§9' + 'PlayerList2D' + ' §2- §4Load');
}

// 创建模块的实例 [ dragonPlayerList2D ]
var dragonPlayerList2D = new thePlayerList2D();

// 定义 [ dragonPlayerList2DClient ] 用于存储注册信息
var dragonPlayerList2DClient;

// 脚本运行时调用
function onEnable() {

    // 注册
    dragonPlayerList2DClient = moduleManager.registerModule(dragonPlayerList2D);
}

// 脚本禁用时调用
function onDisable() {

    // 注销
    moduleManager.unregisterModule(dragonPlayerList2DClient);
}