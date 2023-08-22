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
/* */mc.thePlayer.sendChatMessage('文本')
// 切换快捷栏 = 索引
/* */mc.thePlayer.inventory.currentItem = 0

// 获取方块的BlockPos对象 里面存入了一个方块的三维坐标
var pos = event.getClickedBlock();
// 获取硬度
var d = mc.theWorld.getBlockState(event.getClickedBlock()).getBlock().getBlockHardness(mc.theWorld, event.getClickedBlock());
// 获取点击方块的BlockPos传给getBlockState获取方块消息.获取方块.获取方块注册名.强转字符串.分离:前后字符串.取:后的字符串
var d = mc.theWorld.getBlockState(event.getClickedBlock()).getBlock().getRegistryName().toString().split(":")[1];
// 获取方块颜色序号
var d = mc.theWorld.getBlockState(pos).getBlock().getMetaFromState(mc.theWorld.getBlockState(event.getClickedBlock()))

var a = [
    'brewing_stand',
    'cauldron',
    'activator_rail',
    'rail',
    'detector_rail',
    'golden_rail',
    'iron_door',
    'stone',
    'cobblestone',
    'gold_ore',
    'iron_ore',
    'coal_ore',
    'lapis_ore',
    'lapis_block',
    'sandstone',
    'gold_block',
    'iron_block',
    'stone_slab',
    'brick_block',
    'mossy_cobblestone',
    'obsidian',
    'diamond_ore',
    'diamond_block',
    'stone_stairs',
    'lit_redstone_ore',
    'ice',
    'netherrack',
    'brick_block',
    'stonebrick',
    'brick_stairs',
    'stone_brick_stairs',
    'nether_brick',
    'nether_brick_stairs',
    'end_stone',
    'sandstone_stairs',
    'emerald_ore',
    'emerald_block',
    'cobblestone_wall',
    'quartz_ore',
    'quartz_block',
    'quartz_stairs',
    'stained_hardened_clay',
    'prismarine',
    'sea_lantern',
    'hardened_clay',
    'coal_block',
    'packed_ice',
    'red_sandstone',
    'red_sandstone_stairs',
    'stone_slab2',
    'furnace',
    'iron_bars',
    'nether_brick_fence',
    'enchanting_table',
    'ender_chest',
    'anvil',
    'dispenser',
    'sticky_piston',
    'piston',
    'stone_pressure_plate',
    'redstone_block',
    'hopper',
    'dropper',
    'iron_trapdoor',
];

var b = [
    'planks',
    'log',
    'bookshelf',
    'oak_stairs',
    'pumpkin',
    'lit_pumpkin',
    'melon_block',
    'wooden_slab',
    'spruce_stairs',
    'birch_stairs',
    'jungle_stairs',
    'log2',
    'acacia_stairs',
    'dark_oak_stairs',
    'chest',
    'crafting_table',
    'ladder',
    'jukebox',
    'trapped_chest',
    'fence',
    'spruce_fence',
    'birch_fence',
    'jungle_fence',
    'dark_oak_fence',
    'acacia_fence',
    'standing_sign',
    'bed',
    'standing_banner',
    'noteblock',
    'trapdoor',
    'fence_gate',
    'spruce_fence_gate',
    'birch_fence_gate',
    'jungle_fence_gate',
    'dark_oak_fence_gate',
    'acacia_fence_gate',
    'wooden_door',
    'spruce_door',
    'birch_door',
    'jungle_door',
    'acacia_door',
    'dark_oak_door',
    'wooden_pressure_plate',
    'wooden_button',
];