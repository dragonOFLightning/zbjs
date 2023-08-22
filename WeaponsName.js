/*
    此脚本可以在聊天栏输出你有什么武器
    简单的教学参考 实际用处还真不多
*/

// 定义脚本名称
var scriptName = 'WeaponsName';

// 定义脚本版本
var scriptVersion = '1.1.0';

// 定义脚本作者
var scriptAuthor = ['ColdDragon'];

// 定义模块的构造函数
function theWeaponsName() {

    // 模块名称
    this.getName = function () {
        return 'WeaponsName';
    }

    // 模块说明
    this.getDescription = function () {
        return 'ColdDragon';
    }

    // 模块分类
    this.getCategory = function () {
        return 'Fun';
    }

    // 定义 [ theWeaponsNameList ] 用于存储武器的名称
    var theWeaponsNameList;

    // 模块启用时调用
    this.onEnable = function () {

        // 初始化 [ theWeaponsNameList ]
        theWeaponsNameList = [];

        // 调用 [ getKnifeName ] 传入item的名称 
        getKnifeName(mc.thePlayer.inventory.getStackInSlot(0).getItem().getUnlocalizedName());

        // 循环调用 [ getWeaponName ] 传入item的名称
        for (var i = 1; i <= 3; i++) {
            getWeaponName(mc.thePlayer.inventory.getStackInSlot(i).getItem().getUnlocalizedName());
        }

        // 定义 [ theChatText ] 并初始化为空字符串 用于存储聊天的文本
        var theChatText = '';

        // 循环调用 [ theWeaponsNameList ] 获取前面的每个文本 添加到 [ theChatText ]
        for (var i = 0; i < theWeaponsNameList.length - 1; i++) {
            theChatText = theChatText + theWeaponsNameList[i] + '+';
        }

        // 调用 [ theWeaponsNameList ] 传入最后一个元素
        theChatText = theChatText + theWeaponsNameList[theWeaponsNameList.length - 1];

        // 调用 [ theChatText ] 发送聊天
        mc.thePlayer.sendChatMessage(theChatText);
    }

    // 定义 [ getWeaponName ] 用于获取枪的名称 
    function getWeaponName(item) {
        // 根据传入不同的 item 类型 来填入不同的枪名称
        switch (item) {
            // 金镐
            case 'item.pickaxeGold':
                theWeaponsNameList.push('GoldDigger');              // 黄金矿工
                break;
            // 木锄
            case 'item.hoeWood':
                theWeaponsNameList.push('Pistol');                  // 手枪
                break;
            // 石锄
            case 'item.hoeStone':
                theWeaponsNameList.push('Rifle');                   // 步枪
                break;
            // 铁锄
            case 'item.hoeIron':
                theWeaponsNameList.push('ShotGun');                 // 霰弹枪
                break;
            // 金锄
            case 'item.hoeGold':
                theWeaponsNameList.push('Flamethrower');            // 火焰发射器
                break;
            // 钻锄
            case 'item.hoeDiamond':
                theWeaponsNameList.push('ZombieSoaker');            // 水枪
                break;
            // 木铲
            case 'item.shovelWood':
                theWeaponsNameList.push('Sniper');                  // 狙击枪
                break;
            // 铁铲
            case 'item.shovelIron':
                theWeaponsNameList.push('BlowDart');                // 飞镖
                break;
            // 金铲
            case 'item.shovelGold':
                theWeaponsNameList.push('RainbowRifle');            // 彩虹步枪
                break;
            // 钻镐
            case 'item.pickaxeDiamond':
                theWeaponsNameList.push('ZombieZapper');            // 电击枪
                break;
            // 剪刀
            case 'item.shears':
                theWeaponsNameList.push('ElderGun');                // 接骨木枪
                break;
            // 打火石
            case 'item.flintAndSteel':
                theWeaponsNameList.push('DoubleBarrelShotgun');     // 双管霰弹枪
                break;
            default:
                theWeaponsNameList.push('none');                    // 无
        }
    }

    // 定义 [ getKnifeName ] 用于获取刀具
    function getKnifeName(item) {
        // 根据传入的 [ item ] 参数 获取
        switch (item) {
            // 铁剑
            case 'item.swordIron':
                theWeaponsNameList.push('Knife');       // 小刀
                break;
            // 钻斧
            case 'item.hatchetDiamond':
                theWeaponsNameList.push('Puncher');     // 击退斧
                break;
            default:
                theWeaponsNameList.push('none');        // 无
        }
    }
}

// 脚本加载时调用
function onLoad() {
    // 输出一句话表示已加载
    chat.print('§9getWeaponName §2- §4Load');
}

// 创建 [ theWeaponsName ] 的实例 [ dragonWeaponsName ]
var dragonWeaponsName = new theWeaponsName();

// 定义 [ dragonWeaponsNameClient ] 用于存储注册信息
var dragonWeaponsNameClient;

// 脚本启用时调用
function onEnable() {
    // 注册
    dragonWeaponsNameClient = moduleManager.registerModule(dragonWeaponsName);
}

// 脚本禁用时调用
function onDisable() {
    // 注销
    moduleManager.unregisterModule(dragonWeaponsNameClient);
}