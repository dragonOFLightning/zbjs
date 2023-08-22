// 定义 [ ItemSword ] 并引入mc的物品的剑类型
var ItemSword = Java.type('net.minecraft.item.ItemSword');

// 引入实体玩家
var EntityPlayer = Java.type('net.minecraft.entity.player.EntityPlayer');

// 定义 [ getToolsList2D ] 用于获取工具渲染的列表
function getToolsList2D(player) {

    // 定义 [ toolList2D ] 用于存储工具渲染的列表
    var toolList2D = [];

    // 定义 [ toolsList ] 获取并存储
    var toolsList = getToolsList(player);
    for (var i = 0; i < toolsList.length; i++) {
        var tool = toolsList[i]
        toolList2D.push(getRenderText(tool.index, tool.name, tool.maxDamage, tool.lastDamage, tool.getStack(), player));
    }
    return toolList2D;
}

function getRenderText(index, itemName, itemMaxDamage, lastDamage, toolStack, player) {
    if (mc.thePlayer == player) {
        if (mc.thePlayer.inventory.currentItem == index) {

            return '§4§l' + '■' + '§r' + itemName + '-' + '总耐久度:' + itemMaxDamage + '/' + '剩余耐久:' + lastDamage + toolStack;
        }
        return '§f§l' + '■' + '§r' + itemName + '-' + '总耐久度:' + itemMaxDamage + '/' + '剩余耐久:' + lastDamage + toolStack;
    }
    return '§4§l' + '■' + '§r' + itemName + '-' + '总耐久度:' + itemMaxDamage + '/' + '剩余耐久:' + lastDamage + toolStack;
};

// 定义 [ getToolsList ] 用于获取工具列表
function getToolsList(player) {

    // 定义 [ toolList ] 用于存储可用的工具对象
    var toolList = [];
    if (mc.thePlayer == player) {
        return getSelfToolsList(); /* 这函数返回的本来就是个数组 */
    }
    try {
        var tool = player.inventory.getStackInSlot(0);
        if (tool) {
            toolList.push(new Tool(tool));
            return toolList;
        }
    } catch (error) {
        return toolList;
    }
}

function Tool(tool) {
    this.index = 0;
    this.tool = tool;
    this.name = this.tool.getDisplayName();
    this.maxDamage = tool.getMaxDamage();
    this.lastDamage = this.maxDamage - this.tool.getItemDamage();
    this.count = this.tool.stackSize;
    this.getStack = function () {
        return '§e§l无状态';
    }
}

function getSelfToolsList() {
    var selfToolsList = []
    for (var index = 0; index < 4; index++) {
        var item = mc.thePlayer.inventory.getStackInSlot(index);
        if (!item) {
            continue;
        }
        var maxDamage = item.getMaxDamage();
        if (maxDamage > 0) {
            selfToolsList.push(new SelfTools(index, maxDamage, item));
        }
    }
    return selfToolsList;
}

function SelfTools(index, maxDamage, item) {
    this.index = index;
    this.maxDamage = maxDamage;
    this.tool = item;
    this.name = this.tool.getDisplayName();
    this.lastDamage = maxDamage - this.tool.getItemDamage();
    this.count = this.tool.stackSize
    this.isBlock = function () {
        try {
            var isTakeSword = mc.thePlayer.getHeldItem().getItem() instanceof ItemSword && mc.gameSettings.keyBindUseItem.isKeyDown();
            return isTakeSword;
        } catch (error) {
            return false;
        }
    }
    this.getStack = function () {
        if (mc.thePlayer.inventory.currentItem == this.index && this.index == 0) {
            return this.isBlock() ? '§e§l正在防砍' : '§2§l正常'
        }
        var isLoad = this.lastDamage < this.maxDamage ? '§4§l正在换弹' : '§2§l正常'
        if (this.isBlock()) {
            if (this.count < 2) {
                return '§c§l卡壳'
            }
            return isLoad;
        }
        if (this.lastDamage < 4) {
            return '§e§l假卡壳';
        }
        return isLoad;
    }
}

// 定义 [ getPlayerList ] 用于获取全部玩家对象
function getPlayerList() {

    // 创建 [ playerList ] 的数组用于存储符合条件的实体对象
    var playerList = [];

    // 循环遍历世界上每一个实体对象
    for (var index in mc.theWorld.loadedEntityList) {

        // 创建 [ theEntity ] 用于存储每一个实体对象
        var theEntity = mc.theWorld.loadedEntityList[index];

        // 如果实体对象是实体玩家
        if (theEntity instanceof EntityPlayer) {

            // 如果实体对象不是隐身
            if (!theEntity.isInvisible()) {

                // 添加到 [ playerList ]
                playerList.push(theEntity);
            }
        }
    }
    // 返回 [ playerList ]
    return playerList;
}