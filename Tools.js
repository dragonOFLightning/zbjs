// 定义脚本名称
var scriptName = 'Tools';

// 定义脚本版本
var scriptVersion = '2.1.0';

// 定义脚本作者
var scriptAuthor = ['ColdDragon'];

// 定义 [ ItemSword ] 并引入mc的物品的剑类型 Class
var ItemSword = Java.type('net.minecraft.item.ItemSword');

// 引入实体玩家 Class
var EntityPlayer = Java.type('net.minecraft.entity.player.EntityPlayer');

// 定义 [ getToolsList2D ] 用于获取工具渲染的列表 Array
function getToolsList2D(player) {

    // 定义 [ toolList2D ] 用于存储工具渲染的列表 Array
    var toolList2D = [];

    // 定义 [ toolsList ] 获取并存储 Array
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
            return '§4§l' + '■' + '§r' + itemName + '-' + '总耐久度:' + itemMaxDamage + '/' + '剩余耐久:' + lastDamage + toolStack;
        };

        // 返回一串拼接的文本
        return '§f§l' + '■' + '§r' + itemName + '-' + '总耐久度:' + itemMaxDamage + '/' + '剩余耐久:' + lastDamage + toolStack;
    };

    // 返回一串拼接的文本
    return '§4§l' + '■' + '§r' + itemName + '-' + '总耐久度:' + itemMaxDamage + '/' + '剩余耐久:' + lastDamage + toolStack;
};

// 定义 [ getToolsList ] 用于获取工具列表 Array
function getToolsList(player) {

    // 定义 [ toolList ] 用于存储可用的工具对象 Array
    var toolList = [];

    // 如果玩家是自身 EntityPlayerSP == EntityPlayer
    if (mc.thePlayer == player) {

        // 返回一个获取自身的工具列表 Array
        return getSelfToolsList(); /* 这函数返回的本来就是个数组 */
    }

    // 尝试
    try {

        // 获取其他玩家抓中的物品   注意 : 获取EntityOtherPlayerMP快捷栏0号将会获取到抓中的物品 /* ItemStack */
        var tool = player.inventory.getStackInSlot(0);

        // 如果物品非空
        if (tool) {

            // 创建一个工具对象并存入 toolList
            toolList.push(new Tool(tool));

            // 返回 toolList Array
            return toolList;
        }

        // 如果上述操作报错了
    } catch (error) {

        // 返回一个空数组 Array
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

    // 此处未完工 默认 无状态 String
    this.getStack = function () {
        return '§e§l无状态';
    }
}

// 定义 [ getSelfToolsList ] 函数用于获取自己的工具列表 Array
function getSelfToolsList() {

    // 定义 [ selfToolsList ] 用于存储合法的工具对象 Array
    var selfToolsList = [];

    // 循环4次 获取快捷栏的前4个物品
    for (var index = 0; index < 4; index++) {

        // 获取物品 ItemStack
        var item = mc.thePlayer.inventory.getStackInSlot(index);

        // 如果物品为空
        if (!item) {
            /* JS特性 非空即真 */

            // 跳过循环
            continue;
        };

        // 获取物品最大耐久 integer
        var maxDamage = item.getMaxDamage();

        // 如果最大耐久大于0 integer
        if (maxDamage > 0) {

            // 创建一个自己的工具对象并存储进 [ selfToolsList ] 中 push SelfTool Array
            selfToolsList.push(new SelfTool(index, maxDamage, item));
        }
    }

    // 返回 [ selfToolsList ] Array
    return selfToolsList;
}

// 定义 自己的工具 对象的构造函数 传入3个参数 integer物品索引 integer物品最大耐久 ItemStack物品对象 构造函数
function SelfTool(index, maxDamage, item) {

    // 存储索引 integer
    this.index = index;

    // 存储最大耐久 integer
    this.maxDamage = maxDamage;

    // 存储工具 ItemStack
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
        if (mc.thePlayer.inventory.currentItem == this.index && this.index == 0) {

            // 根据是否在防砍返回不同的字符串 Boolean ? String : String
            return this.isBlock() ? '§e§l正在防砍' : '§2§l正常'
        };

        // 判断是否处于换弹状态 即 剩余耐久小于总耐久 integer < integer ? String : String
        var isLoad = this.lastDamage < this.maxDamage ? '§4§l正在换弹' : '§2§l正常';

        // 如果在防砍
        if (this.isBlock()) {

            // 如果物品数量=>integer 小于 2
            if (this.count < 2) {

                // 返回假卡壳 String
                return '§c§l卡壳'
            };

            // 返回判断是否在换弹 String
            return isLoad;
        };

        // 如果剩余耐久=>integer 小于 4
        if (this.lastDamage < 4) {

            // 返回文本 String
            return '§e§l假卡壳';
        };

        // 返回判断是否在换弹 String
        return isLoad
    }
}

// 定义 [ getPlayerList ] 用于获取全部玩家对象 Array
function getPlayerList(isAntiNPC) {

    // 创建 [ playerList ] 的数组用于存储符合条件的实体对象 Array
    var playerList = [];

    // 循环遍历世界上每一个实体对象 Object
    for (var index in mc.theWorld.loadedEntityList) {

        // 创建 [ theEntity ] 用于存储每一个实体对象 Entity
        var theEntity = mc.theWorld.loadedEntityList[index];

        // 如果实体对象是实体玩家 
        if (theEntity instanceof EntityPlayer) {

            // 如果实体对象不是隐身
            if (!theEntity.isInvisible()) {

                // 如果防获取NPC开启
                if (isAntiNPC) {

                    // 获取当前实体 X integer
                    var x = theEntity.getPosition().getX();

                    // 如果实体的 x 大于 - 2538
                    if (x > -2538) {

                        // 获取 y integer
                        var y = theEntity.getPosition().getY();

                        // 如果 y 是 54 或者 y 是 55
                        if (y === 54 || y === 55) {

                            // 跳过循环
                            continue;
                        }
                    }
                }

                // 添加到 [ playerList ] EntityPlayer
                playerList.push(theEntity);
            }
        }
    }
    // 返回 [ playerList ] Array
    return playerList;
}