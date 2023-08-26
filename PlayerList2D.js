// 定义脚本名称
var scriptName = 'PlayerList2D';

// 定义脚本版本
var scriptVersion = '2.2.0';

// 定义脚本作者
var scriptAuthor = ['ColdDragon'];

// 引入 [ Tools.js ] 脚本工具 用于获取工具渲染列表
script.import('Tools.js');

// 引入实体玩家 Class
var EntityPlayer = Java.type('net.minecraft.entity.player.EntityPlayer');

// 定义模块的构造函数
function thePlayerList2D() {

    // 定义 [ setting ] 对象 用于提供选项 Object
    var setting = {

        // 布尔值选项 [ string名称 boolean默认值 ]
        boolean: function (name, def) {
            return value.createBoolean(name, def);
        }
    };

    // 定义选项 Object
    var settings = {

        // 是否防止渲染NPC
        noNPC: setting.boolean('AntiNPC', true),

        // 是否自动渲染工具 当不在游戏时就不渲染工具
        renderTools: setting.boolean('AutoRenderTools', true),

        // 是否渲染工具 关闭此项将不会渲染工具列表
        toolsList2D: setting.boolean('ToolsList2D', true),

        // 是否防止渲染假人
        noBot: setting.boolean('AntiBot', true),

        // 显示隐藏的玩家
        invisible: setting.boolean('invisible', false),
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

    // 定义 [ theRenderPlayerList2D ] 用于存储需要渲染的文本 Array<String>;
    var theRenderPlayerList2D;
    this.onUpdate = function () {

        // 获取渲染文本的列表 Array <String>
        theRenderPlayerList2D = getRenderList2D();
    };
    this.onRender2D = function () {

        // 循环获取每个渲染的文本
        for (var count = 0; count < theRenderPlayerList2D.length; count++) {

            // 把文本渲染到屏幕上
            mc.fontRendererObj.drawString(theRenderPlayerList2D[count], 2, 7 + count * 9, 0xFFFFFF);
        }
    };

    // 定义 [ getRenderList2D ] 用于获取渲染2D列表 Array<String>
    function getRenderList2D() {

        // 定义 [ renderList2D ] 用于存储渲染的文本 Array<String>
        var renderList2D = [];

        // 定义 [ thisPlayerList ] 并存储获取到的玩家列表 Array<net.minecraft.entity.player.EntityPlayer>
        var thisPlayerList = getPlayerList(settings.invisible.get(), settings.noNPC.get(), settings.noBot.get());

        // 循环获取每个玩家对象
        for (var index = 0; index < thisPlayerList.length; index++) {

            // 定义 [ player ] 获取并存储单独的玩家对象 net.minecraft.entity.player.EntityPlayer
            var player = thisPlayerList[index];

            // 数组中添加渲染玩家名称与声明的文本 String
            renderList2D.push(getPlayerRenderText(player));

            // 如果 显示工具列表2D开启 并且 在游戏中 并且 自动渲染开启 或者 如果自动渲染没开 并且 显示工具列表2D开启
            if (settings.renderTools.get() && inGame() && settings.toolsList2D.get() || !settings.renderTools.get() && settings.toolsList2D.get()) {

                // 尝试执行
                try {

                    // 获取工具渲染的列表 Array<String>
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

        // 返回 renderList2D Array<String>
        return renderList2D;
    };

    // 定义 [ getPlayerList ] (Boolean,Boolean) 用于获取全部玩家对象 Array<net.minecraft.entity.player.EntityPlayer>  
    function getPlayerList(invisible, isAntiNPC, isAntiBot) {

        // 创建 [ playerList ] 的数组用于存储符合条件的实体对象 Array<net.minecraft.entity.player.EntityPlayer>
        var playerList = [];

        // 循环遍历世界上每一个实体对象 Object
        for (var index in mc.theWorld.loadedEntityList) {

            // 创建 [ theEntity ] 用于存储每一个实体对象 net.minecraft.entity.Entity
            var theEntity = mc.theWorld.loadedEntityList[index];

            // 如果实体对象是实体玩家 
            if (theEntity instanceof EntityPlayer) {

                // 获取玩家的名称 java.lang.String
                var name = theEntity.getName();

                // 如果实体对象是隐身并且启用禁用隐身 或者 如果启用了禁用NPC并且名称为10并且不含有大写和下划线 或者 如果启用了防假人并且玩家名称红字
                if (theEntity.isInvisible() && !invisible || isAntiNPC && name.length === 10 && !/[A-Z_]/.test(name) || isAntiBot && name.contains('§c')) {

                    // 跳过循环
                    continue;
                };

                // 添加到 [ playerList ] net.minecraft.entity.player.EntityPlayer
                playerList.push(theEntity);
            }
        };

        // 返回 [ playerList ] Array<net.minecraft.entity.player.EntityPlayer>
        return playerList;
    }


    // 定义 [ getPlayerRenderText ] 用于获取玩家的渲染文本 String
    function getPlayerRenderText(thePlayer) {

        // 获取当前血量 Number
        var theEntityHealth = thePlayer.getHealth().toFixed(1);

        // 获取最高血量 float
        var theEntityMaxHealth = thePlayer.getMaxHealth();

        // 获取名称 java.lang.String
        var theEntityName = thePlayer.getName();

        // 如果实体是自身
        if (theEntityName == mc.thePlayer.getName()) {

            // 如果实体没受伤
            if (thePlayer.hurtTime == 0) {

                // 深蓝字体名称
                return '§9' + theEntityName + '§f[§b ' + theEntityHealth + '§d/' + '§a' + theEntityMaxHealth + ' §f]';
            };

            // 血红字体名称
            return '§4' + theEntityName + '§f[§b ' + theEntityHealth + '§d/' + '§a' + theEntityMaxHealth + ' §f]';
        }

        // 如果实体没受伤
        if (thePlayer.hurtTime == 0) {

            // 如果实体是隐身的
            if (thePlayer.isInvisible()) {

                // 灰色字体名称
                return '§7' + theEntityName + '§f[§b ' + theEntityHealth + '§d/' + '§a' + theEntityMaxHealth + ' §f]';
            };

            // 亮绿字体名称
            return '§3' + theEntityName + '§f[§b ' + theEntityHealth + '§d/' + '§a' + theEntityMaxHealth + ' §f]';
        };

        // 血红字体名称
        return '§4' + theEntityName + '§f[§b ' + theEntityHealth + '§d/' + '§a' + theEntityMaxHealth + ' §f]';
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
        }
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
