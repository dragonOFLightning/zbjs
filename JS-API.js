const text = '文本';
// 在聊天栏输出
chat.print(text);
// 发送聊天
mc.thePlayer.sendChatMessage(text);
// 切换快捷栏 = 索引
mc.thePlayer.inventory.currentItem = 0
// 获取射线 (距离 , 精确度)
mc.thePlayer.rayTrace(5, 1)
// 获取瞄准位置的实体
mc.pointedEntity;
// 获取玩家精确的坐标
mc.thePlayer.posX
mc.thePlayer.posY
mc.thePlayer.posZ

// mc类
mc

// mc.thePlayer类 直接调用会返回自身的数据
mc.thePlayer
// 发送聊天
/* */
mc.thePlayer.sendChatMessage('文本')
// 切换快捷栏 = 索引
/* */
mc.thePlayer.inventory.currentItem = 0
// 判断有没有附魔
/* */
mc.thePlayer.getHeldItem().isItemEnchanted()

// 获取方块的BlockPos对象 里面存入了一个方块的三维坐标
var pos = event.getClickedBlock();
// 获取硬度
var d = mc.theWorld.getBlockState(event.getClickedBlock()).getBlock().getBlockHardness(mc.theWorld, event.getClickedBlock());
// 获取点击方块的BlockPos传给getBlockState获取方块消息.获取方块.获取方块注册名.强转字符串.分离:前后字符串.取:后的字符串
var d = mc.theWorld.getBlockState(event.getClickedBlock()).getBlock().getRegistryName().toString().split(":")[1];
// 获取方块颜色序号
var d = mc.theWorld.getBlockState(pos).getBlock().getMetaFromState(mc.theWorld.getBlockState(event.getClickedBlock()))