// 停更

// 定义脚本名称
var scriptName = 'Title';

// 定义脚本版本
var scriptVersion = '1.0.0';

// 定义脚本作者
var scriptAuthor = ['ColdDragon'];

// 引入标题设置
var Display = Java.type('org.lwjgl.opengl.Display');

// 定义模块构造函数
function theTitle() {

    // 定义 [ setting ] 对象 用于提供选项
    var setting = {

        // 文本选项 [ string名称 string默认值 ]
        text: function (name, def) {
            return value.createText(name, def);
        },
    }

    // 定义 [ settings ] 对象 用于定义选项
    var settings = {

        // 定义选项 设置标题文本
        setTitle: setting.text('title', '龙之心~~龙之心~~龙之心~~[3dragons]')
    };

    // 定义模块选项
    this.addValues = function (values) {

        // 遍历 [ settings ] 
        for (var i in settings) {

            // 添加 [ settings ] 中的每一个选项
            values.add(settings[i])
        }
    };

    // 定义模块名称
    this.getName = function () {
        return 'Title'
    };

    // 定义模块描述
    this.getDescription = function () {
        return 'ColdDragon'
    };

    // 定义模块分类
    this.getCategory = function () {
        return 'Fun'
    };

    // 模块更新时调用
    this.onUpdate = function () {

        // 设置标题
        Display.setTitle(settings.setTitle.get());
    }
}

// 脚本加载时调用
function onLoad() {

    // 输出一句话表示已加载
    chat.print('§9Title §2- §4Load');
};

// 定义模块实例
var dragonTitle = new theTitle();

// 定义 [ dragonTitleClient ] 用于存储注册信息
var dragonTitleClient;

// 脚本启用时调用
function onEnable() {

    // 注册
    dragonTitleClient = moduleManager.registerModule(dragonTitle);
};

// 脚本禁用时调用
function onDisable() {

    // 注销
    moduleManager.unregisterModule(dragonTitleClient);
};