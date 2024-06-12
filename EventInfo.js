/**
 * 龙界板块制造 冰龙开发 待重构
 * 
 * EventInfo事件器 也可以叫做第二聊天栏
 * 用途是将重复的聊天内容隐射到第二聊天栏上 防止你的聊天栏被重复的内容塞爆
 */
// 定义脚本名称
var scriptName = 'EventInfo';

// 定义脚本版本
var scriptVersion = '1.1.0';

// 定义脚本作者
var scriptAuthor = ['ColdDragon'];

// 引入网络聊天数据包 [ S02PacketChat ]
var S02PacketChat = Java.type('net.minecraft.network.play.server.S02PacketChat');

// 引入动画数据包 [ S0BPacketAnimation ]
var S0BPacketAnimation = Java.type('net.minecraft.network.play.server.S0BPacketAnimation');

// 引入玩家类 [ EntityPlayer ]
var EntityPlayer = Java.type('net.minecraft.entity.player.EntityPlayer');

// 定义模块的构造函数
function TheEventInfo() {

    // 定义 [ setting ] 对象 用于提供选项 Object
    var setting = {

        // 整数选项 [ string名称 number默认值 number最小值 number最大值 ]
        integer: function (name, def, min, max) {
            return value.createInteger(name, def, min, max);
        },

        // 布尔值选项 [ string名称 boolean默认值 ]
        boolean: function (name, def) {
            return value.createBoolean(name, def);
        }
    }

    // 定义 [ settings ] 对象 用于设置选项 Object
    var settings = {

        // 是否渲染游戏事件
        renderGame: setting.boolean('Game', true),

        // 是否渲染大厅事件
        renderLobby: setting.boolean('Lobby', true),

        // 是否渲染玩家聊天事件
        renderPlayer: setting.boolean('Player', true),

        // 是否渲染切换器械事件
        renderChange: setting.boolean('Change', false),

        // 是否渲染刀械暴击事件
        criticalEvent: setting.boolean('Critical', true),

        // 设定渲染列表的阈值
        listLength: setting.integer('ListLength', 16, 1, 64),

        // 设定渲染文本停留的时间
        renderTime: setting.integer('RenderTime', 120, 1, 72000),

        // 设定渲染位置 
        theDrawStringX: setting.integer('Render2DX', 500, 0, 900),
        theDrawStringY: setting.integer('Render2DY', 230, 0, 900),
    };

    /**
     * @Map 这是一个武器的映射
     * @onlyRead 只读映射
     */
    var WeaponMap = {

        // 未本地化的名称
        theUnlocalizedName: ['item.hoeWood', 'item.hoeIron', 'item.shovelIron',
            'item.hoeGold', 'item.pickaxeGold', 'item.pickaxeDiamond',
            'item.shovelGold', 'item.hoeStone', 'item.hoeDiamond',
            'item.shovelWood', 'item.shears', 'item.flintAndSteel'
        ],

        // 武器的名称
        theWeaponName: ['Pistol', 'Shotgun', 'Blow Dart',
            'Flamethrower', 'Gold Digger', 'Zombie Zapper',
            'Rainbow Rifle', 'Rifle', 'Zombie Soaker',
            'Sniper', 'Elder Gun', 'Double Barrel Shotgun'
        ],

        // 是否是远程武器
        isRemote: [true, false, true, true, true, true, true, true, true, true, true, false],

        // 是否是缺子弹的武器
        isLowAmmo: [false, false, false, false, false, false, true, false, false, true, false, false],

        /**
         * @function isEconomy 判断武器是否能经济战术
         * @param {integer} index 映射索引
         * @param {boolean} isUltimate 是否已经升级
         * @returns {boolean}
         */
        isEconomy: function (index, isUltimate) {
            var isUltimateGoldDigger = this.theWeaponName[index] === 'Gold Digger' && isUltimate;
            var canEconomy = [true, true, true, true, true, false, false, false, false, false, false, false];
            return isUltimateGoldDigger ? false : canEconomy[index];
        }
    };

    // 定义模块选项
    this.addValues = function (values) {
        for (var i in settings) {
            values.add(settings[i])
        }
    };

    // 定义模块名称
    this.getName = function () {
        return 'EventInfo'
    };

    // 定义模块描述
    this.getDescription = function () {
        return 'ColdDragon'
    };

    // 定义模块归类
    this.getCategory = function () {
        return 'Render'
    };

    // 定义 [ renderDataList ] 用于存储渲染数据的列表 Array<RenderData>
    var renderDataList = [];

    /**@type {Array<ChangeData>} 用于存储切换数据的列表*/
    var changeDataList = [];

    this.onEnable = function () {
        changeDataList = [];
    };

    // 模块更新时调用
    this.onUpdate = function () {

        // 如果渲染列表的长度大于设定的阈值
        if (renderDataList.length > settings.listLength.get()) {

            // 删除索引0的元素
            renderDataList.splice(0, 1)
        }

        // 如果启用了 渲染切换器械事件
        if (settings.renderChange.get()) {

            // 获取玩家的列表
            var playerList = getPlayerList();

            // 循环列表
            for (var index = 0; index < playerList.length; index++) {

                /**@type {EntityPlayer} 获取玩家*/
                var thePlayer = playerList[index];

                try {

                    /**@type {net.minecraft.item.ItemStack} 获取物品栈*/
                    var itemStack = thePlayer.getHeldItem();

                    /**@type {java.lang.String} 获取物品的名称*/
                    var itemName = itemStack.getItem().getUnlocalizedName();

                    /**@type {integer} 获取物品未本地化名称对应的字典索引*/
                    var mapIndex = WeaponMap.theUnlocalizedName.indexOf(itemName);

                    // 没拿武器就跳过
                    if (mapIndex === -1) {
                        continue;
                    }

                    /**@type {boolean} 获取物品的是否附魔了*/
                    var isUltimate = itemStack.isItemEnchanted();

                    /**@type {java.lang.String} 获取实体的名称*/
                    var name = thePlayer.getName();

                    /**@type {integer} 切换数据的索引*/
                    var changeDataIndex = -1;

                    /**@type {boolean} 是否再次循环*/
                    var reFor = false;

                    // 循环获取索引
                    for (var slot = 0; slot < changeDataList.length; slot++) {
                        if (changeDataList[slot].playerName === name) {
                            changeDataIndex = slot;
                        }
                    };

                    // 如果没获取到索引 就设置为再次循环
                    reFor = changeDataIndex < 0;

                    // 如果没获取到索引 就添加一个切换数据到切换数据集合中
                    changeDataIndex < 0 ? changeDataList.push(new ChangeData(name, itemName, 0)) : null;

                    // 如果需要再次循环
                    if (reFor) {

                        // 循环获取索引
                        for (var index = 0; index < changeDataList.length; index++) {
                            if (changeDataList[index].playerName === name) {
                                changeDataIndex = index;
                            }
                        };
                    }

                    /**@type {java.lang.String} 获取物品本地化名称*/
                    var weaponName = itemStack.getDisplayName();

                    /**@type {java.lang.String} 获取上一次切换的物品名称*/
                    var lastItem = changeDataList[changeDataIndex].lastItemName;

                    // 如果物品不支持经济战术
                    if (!WeaponMap.isEconomy(mapIndex, isUltimate) && itemName !== lastItem) {

                        // 切换次数自增
                        changeDataList[changeDataIndex].count = changeDataList[changeDataIndex].count + 1;

                        // 获取切换的次数
                        var count = changeDataList[changeDataIndex].count;

                        // 添加渲染事件
                        renderDataList.push(new RenderData(name + '切换了' + weaponName + ' 纪录次数' + count, settings.renderTime.get() + 200));
                    }

                    // 更新上一次切换的物品名称
                    changeDataList[changeDataIndex].lastItemName = itemName;

                } catch (error) { };
            }
        }
    };

    // 定义全局变量 [lastChatText] 用于存储上一个文本 @java.lang.string
    var lastChatText;

    // 模块检测到数据包时调用
    this.onPacket = function (event) {

        // 获取包 any
        var thePacket = event.getPacket();

        // 如果包的类型是 [ S02PacketChat ]
        if (thePacket instanceof S02PacketChat) {

            if (thePacket.getChatComponent().getUnformattedText().contains('EI-NO 3rd')) {
                settings.renderChange.set(true);
                return;
            }

            if (thePacket.getChatComponent().getUnformattedText().contains('EI-3rd')) {
                settings.renderChange.set(false);
                return;
            }

            // 定义 [chatText] 用于存储文本 @java.lang.String
            var chatText;

            // 如果聊天类型不是 2
            if (thePacket.getType() !== 2) {

                // 获取聊天文本 @java.lang.String
                chatText = thePacket.getChatComponent().getUnformattedText();
            };

            // 检测文本包含关键词 或者与上一个重复 因为函数只有return 所以不能在函数中判断
            if (isRenderChat(chatText) || chatText === lastChatText && settings.renderPlayer.get()) {

                // 将文本添加至渲染队列
                renderDataList.push(new RenderData(chatText, settings.renderTime.get()));

                // 拦截聊天
                event.cancelEvent();
            } else {
                // 纪录聊天
                lastChatText = chatText;
            };

            // 否则 如果检测到 [ S0BPacketAnimation ] 并且动画类型为 [ 4 ]
        } else if (thePacket instanceof S0BPacketAnimation && thePacket.getAnimationType() == 4 && settings.criticalEvent.get()) {

            // 将 [ '§d检测到一次近战暴击' ] 条件至渲染队列
            renderDataList.push(new RenderData('§d检测到一次近战暴击', settings.renderTime.get()));
        }
    };

    // 定义模块渲染2D
    this.onRender2D = function () {

        // 遍历 [ renderDataList ] 中的每个 数据对象
        for (var index = 0; index < renderDataList.length; index++) {

            // 渲染数据的 [ string ] 
            mc.fontRendererObj.drawString(renderDataList[index].string, settings.theDrawStringX.get(), settings.theDrawStringY.get() + 10 * index, 0xffffff, true);

            // 数据中的 [ tick ] 自减
            renderDataList[index].tick--;

            // 如果数据中的 [ tick ] 小于等于 [ 0 ]
            if (renderDataList[index].tick <= 0) {

                // 删除数据
                renderDataList.splice(index, 1);
            }
        }
    };


    /**
     * @function isRenderChat 判断是否是需要渲染的聊天
     * @param {java.lang.String} string 聊天字符串
     * @returns {boolean} 是否是需要渲染的聊天
     */
    function isRenderChat(string) {

        return string.contains('Gold') && settings.renderGame.get() && isGoldChat(string) ||
            string.contains('金钱') && settings.renderGame.get() && isGoldChat(string) ||
            string.contains(' Creepers remaining...') && settings.renderGame.get() ||

            string.contains('joined the lobby!') && settings.renderLobby.get() ||
            string.contains('CLICK HERE to join!') && settings.renderLobby.get() ||
            string.contains('进入了大厅！') && settings.renderLobby.get() ||
            string.contains('即将于30秒后开始！ 点击这里加入！') && settings.renderLobby.get() ||
            string.contains('找到了一个✰✰✰✰✰Mystery Box！') && settings.renderLobby.get() ||
            string.contains('Mystery Box!') && settings.renderLobby.get() ||
            string.contains('You must wait another') && settings.renderLobby.get() ||
            string.contains('在使用这个之前，你需要等待') && settings.renderLobby.get() ||
            string.contains('slid into the lobby!') && settings.renderLobby.get() ||
            string.contains('spooked into the lobby!') && settings.renderLobby.get() ||

            string.contains('嘻哈') && settings.renderPlayer.get() ||
            string.contains('喜哈') && settings.renderPlayer.get();
    };

    /**
     * @function isGoldChat 判断是不是金钱的聊天
     * @param {java.lang.String} theString 
     * @returns {boolean} 是否金钱的聊天
     */
    function isGoldChat(theString) {

        // 获取存在 '+' 的索引 integer
        var index = theString.indexOf('+');

        // 如果索引大于 0 并且索引 小于 字符串的长度
        if (index >= 0 && theString.length > index + 1) {

            // 获取 '+' 后的字符串数字 String
            var numberPart = theString.slice(index + 1);

            // 把字符串数字 强制为 数字类型整数的数字 integer
            var parsedNumber = parseInt(numberPart, 10);

            // 返回判断数字是不是 NaN
            return !isNaN(parsedNumber);
        }

        // 返回false
        return false;
    };


    /**
     * @function getPlayerList 用于获取玩家的列表
     * @returns @type {Array<EntityPlayer>}
     */
    function getPlayerList() {

        /**@type {Array<EntityPlayer>} 玩家的列表*/
        var playerList = [];

        // 获取世界上全部的实体
        var worldEntity = mc.theWorld.loadedEntityList;

        // 循环
        for (var i in worldEntity) {

            /**@type {Entity} 获取实体*/
            var theEntity = worldEntity[i];

            // 如果实体是实体玩家并且没有隐身
            if (theEntity instanceof EntityPlayer && !theEntity.isInvisible()) {

                // 添加到玩家列表中
                playerList.push(theEntity);
            }
        }

        // 返回玩家的列表
        return playerList;
    }

    /**
     * @class 切换数据类
     * @param {java.lang.String} playerName 纪录该玩家的名称
     * @param {java.lang.String} lastItemName 纪录该玩家上一次切换的物品名称
     * @param {java.lang.String} count 纪录该玩家切换了多少次
     */
    function ChangeData(playerName, lastItemName, count) {
        this.playerName = playerName;
        this.lastItemName = lastItemName;
        this.count = count;
    }

    /**
     * @class 渲染数据类
     * @param {string|java.lang.String} text 文本
     * @param {integer} time 持续时间
     */
    function RenderData(text, time) {
        this.string = text;
        this.tick = time;
    }
}

// 脚本启用时调用
function onLoad() {

    // 输出一句话表示已加载
    chat.print('§9' + 'EventInfo' + ' §2- §4Load');
}

// 创建模块的实例
var dragonEventInfo = new TheEventInfo();

// 定义 [ dragonEventInfoClient ] 用于存储注册信息
var dragonEventInfoClient;

// 脚本运行时调用
function onEnable() {

    // 注册
    dragonEventInfoClient = moduleManager.registerModule(dragonEventInfo);
}

// 脚本禁用时调用
function onDisable() {

    // 注销
    moduleManager.unregisterModule(dragonEventInfoClient);
}