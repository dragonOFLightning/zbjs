// 即将删除 因为Tools.js的出现导致模块耦合性增加 主玩的就是一个模块之间独立运行 但Tool.js导致了一些模块必须依赖Tools.js

// 定义脚本名称
var scriptName = 'Tools';

// 定义脚本版本
var scriptVersion = '2.1.3';

// 定义脚本作者
var scriptAuthor = ['ColdDragon'];

// 定义 [ ItemSword ] 并引入mc的物品的剑类型 Class
var ItemSword = Java.type('net.minecraft.item.ItemSword');

// 定义 [ getToolsList2D ] 用于获取工具渲染的列表 Array<String>
function getToolsList2D(player) {

    // 定义 [ toolList2D ] 用于存储工具渲染的列表 Array<String>
    var toolList2D = [];

    // 定义 [ toolsList ] 获取并存储 Array<any>
    var toolsList = getToolsList(player);

    // 循环 获取到的工具列表
    for (var index = 0; index < toolsList.length; index++) {

        // 获取并存储单独的工具 Tool || SelfTool
        var tool = toolsList[index];

        // 获取渲染的文本并存储进 toolList2D 中 String
        toolList2D.push(getRenderText(tool.index, tool.name, tool.maxDamage, tool.lastDamage, tool.getStack(), player));
    };

    // 返回 toolList2D Array
    return toolList2D;
}

// 定义 [ getRenderText ] 用于获取渲染的文本 String
function getRenderText(index, itemName, itemMaxDamage, lastDamage, toolStack, player) {

    // 判断玩家是否是自身 EntityPlayerSP == EntityPlayer
    if (mc.thePlayer == player) {

        // 如果玩家抓中了这个物品
        if (mc.thePlayer.inventory.currentItem == index) {

            // 返回一串拼接的文本
            return '§4§l' + '■' + '§r' + itemName + '[ ' + lastDamage + '/' + itemMaxDamage + ' ]' + toolStack;
        };

        // 返回一串拼接的文本
        return '§f§l' + '■' + '§r' + itemName + '[ ' + lastDamage + '/' + itemMaxDamage + ' ]' + toolStack;
    };

    // 返回一串拼接的文本
    return '§4§l' + '■' + '§r' + itemName + '[ ' + lastDamage + '/' + itemMaxDamage + ' ]' + toolStack;
};

// 定义 [ getToolsList ] 用于获取工具列表 Array<any>
function getToolsList(player) {

    // 定义 [ toolList ] 用于存储可用的工具对象 Array<any>
    var toolList = [];

    // 如果玩家是自身
    if (mc.thePlayer == player) {

        // 返回一个获取自身的工具列表 Array<SelfTool>
        return getSelfToolsList(); /* 这函数返回的本来就是个数组 */
    }

    // 尝试
    try {

        // 获取其他玩家抓中的物品   注意 : 获取EntityOtherPlayerMP快捷栏0号将会获取到抓中的物品 /* net.minecraft.item.ItemStack */
        var tool = player.inventory.getStackInSlot(0);

        // 如果物品非空
        if (tool) {

            // 创建一个工具对象并存入 toolList 中
            toolList.push(new Tool(tool));

            // 返回 toolList Array<Tool>
            return toolList;
        }

        // 如果上述操作报错了
    } catch (error) {

        // 返回一个空数组 Array<any>
        return toolList;
    }
}

// 定义对象 Tool 构造函数
function Tool(tool) {

    // 默认索引为0 integer
    this.index = 0;

    // 存储工具 ItemStack
    this.tool = tool;

    // 获取并存储工具名称 String
    this.name = this.tool.getDisplayName();

    // 获取并存储工具最大耐久 integer
    this.maxDamage = tool.getMaxDamage();

    // 计算并存储工具剩余耐久 integer
    this.lastDamage = this.maxDamage - this.tool.getItemDamage();

    // 获取并存储工具数量 integer
    this.count = this.tool.stackSize;

    // 用于其他玩家的武器获取状态 但无法获取防砍状态
    this.getStack = function () {

        // 判断一下是不是拿剑 或者 没有拿工具
        if (tool instanceof ItemSword || this.maxDamage === 0) {

            // 拿剑就无状态 
            return '§e§l无状态';
        }

        // 定义表达式 判断一下 如果剩余耐久 小于 总耐久度 就 正在换弹 否则 正常 @string
        var getLoadStack = this.lastDamage < this.maxDamage ? '§4§l正在换弹' : '§2§l正常';

        // 返回 判断一下 如果剩余耐久小于 4 就 假卡壳 否则 用getLoadStack 判断 @string
        return this.lastDamage < 4 ? '§e§l假卡壳' : getLoadStack;
    }
}

// 定义 [ getSelfToolsList ] 函数用于获取自己的工具列表 Array<SelfTool>
function getSelfToolsList() {

    // 定义 [ selfToolsList ] 用于存储合法的工具对象 Array<SelfTool>
    var selfToolsList = [];

    // 循环4次 获取快捷栏的前4个物品
    for (var index = 0; index < 4; index++) {

        // 获取物品 net.minecraft.item.ItemStack
        var item = mc.thePlayer.inventory.getStackInSlot(index);

        // 如果物品为空
        if (!item) {
            /* JS特性 非空即真 */

            // 跳过循环
            continue;
        };

        // 获取物品最大耐久 integer
        var maxDamage = item.getMaxDamage();

        // 如果最大耐久大于0
        if (maxDamage > 0) {

            // 创建一个自己的工具对象并存储进 [ selfToolsList ] 中
            selfToolsList.push(new SelfTool(index, maxDamage, item));
        }
    }

    // 返回 [ selfToolsList ] Array<SelfTool>
    return selfToolsList;
}

// 定义 自己的工具 对象的构造函数 传入3个参数 (integer物品索引 integer物品最大耐久 net.minecraft.item.ItemStack物品对象) 构造函数
function SelfTool(index, maxDamage, item) {

    // 存储索引 integer
    this.index = index;

    // 存储最大耐久 integer
    this.maxDamage = maxDamage;

    // 存储工具 net.minecraft.item.ItemStack
    this.tool = item;

    // 获取并存储名称 String
    this.name = this.tool.getDisplayName();

    // 计算并存储剩余耐久 integer
    this.lastDamage = maxDamage - this.tool.getItemDamage();

    // 获取并存储物品数量 integer
    this.count = this.tool.stackSize;

    // 定义 [ isBlock ] 判断玩家有没有在防砍 Boolean
    this.isBlock = function () {

        // 尝试
        try {
            // 判断玩家是否抓中剑 并且 正在使用物品
            var isTakeSword = mc.thePlayer.getHeldItem().getItem() instanceof ItemSword && mc.gameSettings.keyBindUseItem.isKeyDown();

            // 返回布尔值
            return isTakeSword

            // 如果报错了
        } catch (error) {

            // 默认没有在防砍
            return false
        }
    };

    // 获取工具状态 String
    this.getStack = function () {

        // 如果拿着索引0物品
        if (this.index == 0) {

            // 根据是否在防砍返回不同的字符串 Boolean ? String : String
            return this.isBlock() ? '§e§l正在防砍' : '§2§l正常'
        };

        // 判断是否处于换弹状态 即 剩余耐久小于总耐久 integer < integer ? String : String
        var getLoadStack = this.lastDamage < this.maxDamage ? '§4§l正在换弹' : '§2§l正常';

        // 如果在防砍
        if (this.isBlock()) {

            // 判断一下数量是不是小于2 是就卡壳 不是就 getLoadStack @string
            return this.count < 2 ? '§c§l卡壳' : getLoadStack;

        };

        // 判断一下剩余耐久是不是小于4 是就 假卡壳 不是就 getLoadStack @string
        return this.lastDamage < 4 ? '§e§l假卡壳' : getLoadStack;
    }
}

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