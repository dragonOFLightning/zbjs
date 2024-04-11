/**
 * DP = Dragon Plate
 * 
 * PlayerRadar玩家雷达拥抱开源 由DP-龙界板块制造 冰龙开发 3dragons贡献 
 * 
 * 玩家雷达功能
 *  - 在左上角显示玩家信息
 * 
 *  - 可以显示其他玩家持有的物品
 * 
 *  - 可以显示自己有哪些工具
 * 
 * 冰龙之子 : 这个代码的注释完善程度超过我理想了
 * 
 * 代码说明
 *  - 使用旧架构 部分区域的定义域嵌套超过了三层是正常
 */
// 定义脚本名称
var scriptName = 'PlayerRadar';

// 定义脚本版本
var scriptVersion = '1.0.2';

// 定义脚本作者
var scriptAuthor = ['ColdDragon'];

// ######## - net.minecraft.entity - ########
/**@type {net.minecraft.entity.player.EntityPlayer} 引入实体玩家*/
var EntityPlayer = Java.type('net.minecraft.entity.player.EntityPlayer');

// ######## - net.minecraft.item - ########
/**@type {net.minecraft.item} 引入物品剑*/
var ItemSword = Java.type('net.minecraft.item.ItemSword');

// 定义模块的构造函数
function ThePlayerRadar() {

    // 定义 [ setting ] 对象 用于提供选项
    var setting = {

        // 整数选项 [ string名称 number默认值 number最小值 number最大值 ]
        integer: function (name, def, min, max) {
            return value.createInteger(name, def, min, max);
        },

        // 列表选项 [ string名称 array数组 string默认值 ]
        list: function (name, values, def) {
            return value.createList(name, values, def);
        },

        // 布尔值选项 [ string名称 boolean默认值 ]
        boolean: function (name, def) {
            return value.createBoolean(name, def);
        },
    }

    // 定义 [ settings ] 对象 用于设置选项
    var settings = {

        // 渲染工具的模式 自动渲染 不渲染 总是渲染
        tool2D: setting.list('Tool2D', ['Auto', 'Off', 'On'], 'Auto'),

        // 是否防机器人
        antiBot: setting.boolean('AntiBot', true),

        // 防NPC的形式 自动设防 不设防 总是设防
        antiNPC: setting.list('AntiNPC', ['Auto', 'Off', 'On'], 'Auto'),

        // 是否显示隐身
        invisible: setting.boolean('Invisible', true),

        // 是否显示已死亡的实体
        died: setting.boolean('Died', false),

        // 渲染最大长度上限
        renderLength: setting.integer('Length', 12, 1, 100),
    };

    /**@override 定义模块选项 */
    this.addValues = function (values) {
        for (var i in settings) {
            values.add(settings[i])
        }
    };

    /**@override 定义模块名称 */
    this.getName = function () {
        return 'PlayerRadar'
    };

    /**@override 定义模块描述 */
    this.getDescription = function () {
        return 'ColdDragon'
    };

    /**@override 定义模块归类 */
    this.getCategory = function () {
        return 'Fun'
    };

    /**
     * @override 模块渲染2D时调用
     * @param {net.ccbluex.liquidbounce.event.Render2DEvent} event 渲染2D事件 这个event暂时不知道咋用
     */
    this.onRender2D = function (event) {

        /**@type {Array<EntityPlayer>} 获取玩家的集合*/
        var playerList = getPlayerList();

        /**@type {Array<string>} 获取渲染的队列*/
        var renderList2D = getRenderList2D(playerList);

        /**@type {integer} 获取设置渲染长度的上限*/
        var renderLength = settings.renderLength.get();

        /**@type {integer} 计算渲染的长度*/
        var indexLength = renderList2D.length > renderLength ? renderLength : renderList2D.length;

        for (var index = 0; index < indexLength; index++) {

            /**
             * 执行渲染
             * @property {string} 渲染的文本
             * @property {float} 渲染的x位置
             * @property {float} 渲染的y位置
             * @property {number} 渲染文本的颜色
             * @property {boolean} 是否渲染阴影
             */
            mc.fontRendererObj.drawString(renderList2D[index], 2, 7 + index * 9, 0xFFFFFF, true);
        }
    };

    /**
     * @function getRenderList2D 获取渲染的队列
     * @param {Array<string>} playerList 玩家的集合
     * @returns {Array<string>} 渲染的队列
     */
    function getRenderList2D(playerList) {

        /**@type {Array<string>} 存储渲染文本的集合*/
        var renderList2D = [];

        // 遍历玩家集合
        for (var index = 0; index < playerList.length; index++) {

            /**@type {EntityPlayer} 获取单独的玩家*/
            var player = playerList[index];

            /**@type {string} 获取该玩家的渲染文本*/
            var playerRenderText = getPlayerRenderText(player);

            // 添加文本到渲染文本集合
            renderList2D.push(playerRenderText);

            /**@type {boolean} 判断需不需要渲染工具集合*/
            var renderTool = renderTools();

            // 如果需要渲染工具
            if (renderTool) {

                /**@type {Array<Tool>} 获取该玩家的工具集合 */
                var toolsList = getToolsList(player);

                // 循环遍历工具集合
                for (var count = 0; count < toolsList.length; count++) {

                    /**@type {Tool} 工具*/
                    var tool = toolsList[count];

                    // 如果工具的状态不为 NO FOUND
                    if (tool.state !== 'NO FOUND') {

                        /**@type {string} 获取工具渲染的文本*/
                        var renderText = getToolRenderText(tool);

                        // 添加工具的渲染文本到渲染队列
                        renderList2D.push(renderText);
                    };
                };
            };
        };
        // 返回渲染文本的集合 
        return renderList2D;
    };

    /**
     * @function renderTools 用于判断是否渲染工具的集合
     * 逻辑较为简单 不过多注释
     * @returns {boolean} 是否渲染工具
     */
    function renderTools() {
        switch (settings.tool2D.get()) {
            case 'Off':
                return false;
            case 'On':
                return true;
            default:
                return inGame();
        };
    };

    /**
     * @function getToolRenderText 获取工具的渲染文本
     * @param {Tool} tool 工具
     * @returns {string} 渲染文本
     */
    function getToolRenderText(tool) {

        /**@type {java.lang.string} 工具的名称*/
        var name = tool.name;

        /**@type {integer} 获取工具最大的耐久*/
        var maxDurability = tool.maxDurability;

        /**@type {integer} 获取工具当前的耐久*/
        var durability = tool.durability;

        /**@type {string} 获取当前工具的状态*/
        var stack = tool.state;

        /**@type {string} 拼接工具显示的标题*/
        var toolTitle = '§l■§r' + name + '[ ' + durability + '/' + maxDurability + ' ]' + stack;

        // 根据不同的情况返回不同的颜色的标题
        return tool.player !== mc.thePlayer ?
            '§4' + toolTitle : tool.slot === mc.thePlayer.inventory.currentItem ?
                '§4' + toolTitle : '§f' + toolTitle;
    };

    /**
     * @function getPlayerRenderText 获取玩家的渲染文本
     * @param {EntityPlayer} player 
     * @returns {string} 渲染文本
     */
    function getPlayerRenderText(player) {

        /**@type {java.lang.String} 获取玩家的名称*/
        var name = player.getName();

        /**@type {string} 获取玩家的血量并保留一个小数点*/
        var health = player.getHealth().toFixed(1);

        /**@type {float} 获取玩家的最大血量*/
        var maxHealth = player.getMaxHealth();

        /**@type {string} 获取延迟*/
        var ping;
        try {
            // 尝试获取延迟
            ping = mc.getNetHandler().getPlayerInfo(player.getUniqueID()).getResponseTime().toString();
        } catch (error) {
            // 报错就设为0
            ping = 0;
        };

        /**@type {string} 拼接延迟的标题*/
        var pingTitle = !inGame() ? 'ping ' + ping : '';

        /**@type {string} 拼接血量的标题*/
        var healthTitle = '§f[§b ' + health + '§d/' + '§a' + maxHealth + ' §f]';

        /**@type {string} 拼接名称的标题*/
        var nameTitle = player.hurtTime !== 0 ?
            '§4' + name : player === mc.thePlayer ?
                '§9' + name : player.isInvisible() ?
                    '§7' + name : '§3' + name;

        // 返回一个拼接的标题
        return nameTitle + healthTitle + pingTitle;
    };

    /**
     * @function getToolsList 获取工具的集合
     * @param {EntityPlayer} player 实体玩家
     * @returns {Array<Tool>} 工具的列表
     */
    function getToolsList(player) {

        /**@type {Array<Tool>} 存储工具的集合*/
        var toolsList = [];

        // 如果玩家是自己
        if (player === mc.thePlayer) {

            // 循环获取快捷栏的集合
            for (var slot = 0; slot < 9; slot++) { // 此处不去重

                // 获取物品栈
                var itemStack = mc.thePlayer.inventory.getStackInSlot(slot);

                // 如果物品栈为空就跳过
                if (!itemStack) {
                    continue;
                };

                /**@type {int} 获取工具的最大的耐久*/
                var maxDurability = itemStack.getMaxDamage();

                // 如果最大耐久大于2
                if (maxDurability > 2) {

                    // 存储一个 创建一个工具类型
                    toolsList.push(new Tool(player, slot, maxDurability, itemStack));
                };
            };
        } else {
            // 尝试获取其他玩家的物品栈
            try {

                // 获取物品栈 其他玩家只能获取0
                var itemStack = player.inventory.getStackInSlot(0);

                // 如果物品栈不为空
                if (itemStack) {

                    // 获取最大耐久
                    var maxDurability = itemStack.getMaxDamage();

                    // 返回一个工具类型的数组
                    return [new Tool(player, 0, maxDurability, itemStack)];
                }
            } catch (error) {

                // 报错就返回 NO FOUND 状态的工具
                return [new Tool(player, 0, 0, "NO FOUND")];
            };
        };
        return toolsList;
    };

    /**
     * @class Tool 存储工具
     * @onlyRead 只读类型
     * @param {EntityPlayer} player 实体玩家
     * @param {integer} slot 快捷栏编号
     * @param {integer} maxDurability 物品的最大耐久值
     * @param {integer} itemStack 物品的栈
     */
    function Tool(player, slot, maxDurability, itemStack) {

        /**@type {EntityPlayer} 实体玩家*/
        this.player = player;

        /**@type {integer} 存储快捷栏的索引*/
        this.slot = slot;

        /**@type {net.minecraft.item.ItemStack} 物品栈*/
        this.tool = itemStack;

        /**@type {integer} 最大耐久度*/
        this.maxDurability = maxDurability;

        /**@type {java.lang.String} 物品的本地化名称*/
        this.name = this.tool.getDisplayName();

        /**@type {integer} 物品的剩余耐久*/
        this.durability = maxDurability - this.tool.getItemDamage();

        /**@type {integer} 物品的数量*/
        this.count = this.tool.stackSize;

        /**@type {string} 物品的状态*/
        this.state = getToolState(this.player, this.count, this.durability, this.maxDurability, this.slot);
    };

    /**
     * @function getToolState 获取工具的状态
     * @param {EntityPlayer} player 实体玩家
     * @param {integer} count 物品的数量
     * @param {integer} durability 物品的剩余耐久
     * @param {integer} maxDurability 物品的最大耐久
     * @param {integer} slot 物品的快捷栏位置
     * @returns {string} 工具的状态
     */
    function getToolState(player, count, durability, maxDurability, slot) {

        // 如果玩家不是自己 返回空字符串
        if (player !== mc.thePlayer) {
            return '';
        }

        /**@type {boolean} 判断是否在防砍*/
        var isBlock = false;

        // 尝试获取防砍的状态
        try {

            // 玩家在使用物品 并且 拿着剑
            isBlock = mc.thePlayer.getHeldItem().getItem() instanceof ItemSword &&
                mc.gameSettings.keyBindUseItem.isKeyDown();
        } catch (error) { };

        /**@type {string} 计算应该显示的文本*/
        var loadState = durability < maxDurability ? '§4§l正在换弹' : '§2§l正常';

        // 如果在防砍
        if (isBlock) {

            // 如果 在用防砍的物品 返回 正在防砍
            if (mc.thePlayer.inventory.currentItem === slot) {
                return '§e§l正在防砍';
            }

            // 如果物品数量小于 2 返回卡壳 否则 返回 计算好的文本
            return count < 2 ? '§c§l卡壳' : loadState;
        };

        // 如果当前的耐久为2<<2 返回假卡壳 否则 返回 计算好的文本
        return durability === 2 << 2 ? '§e§l假卡壳' : loadState;
    };

    /**
     * @function isNPC 用来根据玩家的名称判断这个玩家是不是NPC
     * @param {string} name 玩家的名称
     * @returns {boolean} 是否是NPC
     */
    function isNPC(name) {
        switch (settings.antiNPC.get()) {
            case 'On':
                // 如果正则匹配不到大写的A到Z和下划线 并且名称的长度为10
                return !/[A-Z_]/.test(name) && name.length === 10 && name !== 'dragonsocd';
            case 'Off':
                return false;
            default:
                // 判断 名称不包含大写A到Z和下划线 并且 名称长度为10 并且 不在游戏中
                return !/[A-Z_]/.test(name) && name.length === 10 && name !== 'dragonsocd' && !inGame();
        };
    };

    /**
     * @function getPlayerList 获取玩家的列表
     * @returns {Array<EntityPlayer>} 玩家的列表
     */
    function getPlayerList() {

        /**@type {Array<EntityPlayer>} 存储玩家的集合*/
        var playerList = [];

        // 获取世界上全部实体
        var worldEntity = mc.theWorld.loadedEntityList;

        // 遍历世界上全部实体
        for (var index in worldEntity) {

            // 获取单独的实体
            var theEntity = worldEntity[index];

            // 如果这个实体的实体玩家类型
            if (theEntity instanceof EntityPlayer) {

                /**@type {java.lang.String} 实体的名称*/
                var name = theEntity.getName();

                /**@type {float} 实体的血量*/
                var health = theEntity.getHealth();

                /**@type {boolean} 是否是机器人*/
                var isBot = name.contains('§c');

                /**@type {boolean} 是否是NPC*/
                var theIsNPC = isNPC(name);

                /**@type {boolean} 是否是隐身实体*/
                var isInvisible = theEntity.isInvisible();

                /**@type {boolean} 是否是死实体*/
                var isDied = health === 0;

                // 简单的条件判断
                if (isBot && settings.antiBot.get() ||
                    isDied > settings.died.get() || // 这种写法等效于 isDied === true && settings.died.get()
                    settings.invisible.get() < isInvisible ||
                    theIsNPC && settings.antiNPC.get()) {
                    continue;
                }

                // 添加实体的玩家集合中
                playerList.push(theEntity);
            }
        }
        // 返回玩家的集合
        return playerList;
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
    };
}

// 脚本启用时调用
function onLoad() {

    // 输出一句话表示已加载
    chat.print('§9' + 'PlayerRadar' + ' §2- §4Load');
}

// 创建模块的实例
var dragonPlayerRadar = new ThePlayerRadar();

// 定义 [ dragonPlayerRadarClient ] 用于存储注册信息
var dragonPlayerRadarClient;

// 脚本运行时调用
function onEnable() {

    // 注册
    dragonPlayerRadarClient = moduleManager.registerModule(dragonPlayerRadar);
}

// 脚本禁用时调用
function onDisable() {

    // 注销
    moduleManager.unregisterModule(dragonPlayerRadarClient);
}