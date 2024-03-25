/**
 * 小王子制造
 * 
 * 文本宏 用于缩写自动转换成全拼 当然也可以用来做一些有趣的事情 如用0和1拼凑一个完整的字
 * 支持随机前后缀
 * 此脚本默认的配置需要搭配ChangeChat才可以使用 不想装ChangeChat的自行修改配置
 */
// 定义脚本名称
var scriptName = 'KeyText';

// 定义脚本版本
var scriptVersion = '1.0.0';

// 定义脚本作者
var scriptAuthor = ['CheemsSheep'];

// 定义模块的构造函数
function TheKeyText() {

    // 定义 [ textDataList ] 用于存储文本数据 @Array<TextData>
    var textDataList = [];

    // 定义 [ tick ] 用于计时 @integer
    var tick = 20;

    // 定义 [ setting ] 对象 用于提供选项
    var setting = {

        // 布尔值选项 [ string名称 boolean默认值 ]
        boolean: function (name, def) {
            return value.createBoolean(name, def);
        },

        // 文本选项 [ string名称 string默认值 ]
        text: function (name, def) {
            return value.createText(name, def);
        },
    }

    // 定义 [ settings ] 对象 用于设置选项
    var settings = {

        // 点击方块触发文本宏
        ClickSend: setting.boolean('ClickSend', true),

        // 是否刷屏
        Spammer: setting.boolean('Spammer', true),

        // 是否启用发送爪7
        send爪7: setting.boolean('Send爪7', true),

        // 是否随机前后缀
        Random: setting.boolean('Random', true),

        // 格式 : 文本-快捷键 使用,分割
        text: setting.text('text', 'T-V,s1-K,do not use weapon 3-P'),
    };

    // 定义模块选项
    this.addValues = function (values) {
        for (var i in settings) {
            values.add(settings[i])
        }
    };

    // 定义模块名称
    this.getName = function () {
        return 'KeyText'
    };

    // 定义模块描述
    this.getDescription = function () {
        return 'CheemsSheep'
    };

    // 定义模块归类
    this.getCategory = function () {
        return 'Player'
    };

    // 定义模块初始化
    this.onEnable = function () {

        // 初始化 [ textDataList ]
        textDataList = getTextDataList();
    }

    // 存储爪7文本数据
    var 爪7TextList = [
        '███爪爪爪爪爪爪爪█777777777777',
        '██爪███爪█爪█████████7',
        '█爪████爪██爪████████7',
        '██爪███爪██爪████████7',
        '██爪███爪███爪███████7',
        '██爪███爪████爪██████7',
        '█爪████爪█████爪█████7',
        '爪█████爪█████爪爪████7'
    ]

    // 模块更新时调用
    this.onUpdate = function () {

        // 如果开了[ send爪7 ] 并且tick数小于 [ 爪7TextList ]
        if (settings.send爪7.get() && tick < 爪7TextList.length) {

            // 发送文本
            mc.thePlayer.sendChatMessage(爪7TextList[tick]);
        };

        // tick 限量自增
        tick = tick < 30 ? tick + 1 : tick;
    };

    // 按下键盘时调用
    this.onKey = function (event) {

        // 获取键值 @integer
        var key = event.getKey();

        // 如果是Z键就重置tick
        if (key === Key.getKeyValue('Z')) {
            tick = 0;
        } else {
            // 循环遍历文本数据列表
            for (var i = 0; i < textDataList.length; i++) {

                // 获取文本数据 @TextData
                var textData = textDataList[i];

                // 如果文本数据的键值等于获取到的键值
                if (textData.keyValue === key) {

                    // 执行发送文本的函数
                    doSendText(textData.text);
                }
            }
        }

    };

    // 常用的临时据点
    var CampData = {

        'CampName': [
            'Bumper Cars - Perk Corner',
            'Roller Coaster',
            'Roller Coaster - Chest Corner',
            'ParkEntrance - gate x > 0',
            'ParkEntrance - gate x < 0',
            'Ferris Wheel - alt',
            'Ferris Wheel - Ultimate Machine',
            'Ferris Wheel - Door'
        ],

        'CampPosition': [

            // Bumper Cars - Perk Corner
            [17, 70, -9],

            // Roller Coaster
            [-24, 70, 22],

            // Roller Coaster - Chest Corner
            [-24, 70, 31],

            // ParkEntrance - gate x > 0
            [5, 70, -14],

            // ParkEntrance - gate x < 0'
            [-5, 70, -14],

            // Ferris Wheel - alt
            [16, 70, 39],

            // Ferris Wheel - Ultimate Machine
            [22, 70, 32],

            // Ferris Wheel - Door
            [19, 70, 16],
        ]
    }

    // 当点击方块时触发
    this.onClickBlock = function (event) {

        // 获取方块坐标
        var blockPos = event.getClickedBlock();

        // 循环遍历据点坐标组
        for (var index = 0; index < CampData.CampPosition.length; index++) {

            // 获取据点坐标
            var theCampPosition = CampData.CampPosition[index];

            // 如果据点坐标和点击的方块坐标全等
            if (blockPos.getX() === theCampPosition[0] &&
                blockPos.getY() === theCampPosition[1] &&
                blockPos.getZ() === theCampPosition[2]) {

                // 发送坐标对应的地点名称
                mc.thePlayer.sendChatMessage(CampData.CampName[index]);
            }
        }
    }

    // 键值对映射表 无需过多注释 ↓

    var charKeyName = ['Tab', '[', ']', ';', '"', '<', '>', '/'];
    var charKeyValue = [15, 26, 27, 39, 40, 51, 52, 53];

    var line1KeyName = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
    var line1KeyValue = [16, 17, 18, 19, 20, 21, 22, 23, 24, 25];

    var line2KeyName = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
    var line2KeyValue = [30, 31, 32, 33, 34, 35, 36, 37, 38];

    var line3KeyName = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];
    var line3KeyValue = [44, 45, 46, 47, 48, 49, 50];

    var Key = {

        getKeyValue: function (keyName) { // @type {integer}
            keyName = keyName.toUpperCase();
            return line1KeyName.indexOf(keyName) !== -1 ?
                line1KeyValue[line1KeyName.indexOf(keyName)] : line2KeyName.indexOf(keyName) !== -1 ?
                line2KeyValue[line2KeyName.indexOf(keyName)] : line3KeyName.indexOf(keyName) !== -1 ?
                line3KeyValue[line3KeyName.indexOf(keyName)] : charKeyName.indexOf(keyName) !== -1 ?
                charKeyValue[charKeyName.indexOf(keyName)] : null;
        },


        getKeyName: function (keyValue) { // @type {string}
            return line1KeyValue.indexOf(keyValue) !== -1 ?
                line1KeyName[line1KeyValue.indexOf(keyValue)] : line2KeyValue.indexOf(keyValue) !== -1 ?
                line2KeyName[line2KeyValue.indexOf(keyValue)] : line3KeyValue.indexOf(keyValue) !== -1 ?
                line3KeyName[line3KeyValue.indexOf(keyValue)] : charKeyValue.indexOf(keyValue) !== -1 ?
                charKeyName[charKeyValue.indexOf(keyValue)] : null;
        },

    };

    // 键值对映射表 无需过多注释 ↑

    // 获取文本数据列表 @Array<TextData>
    function getTextDataList() {

        // 定义 [ textDataList ] 用于存储文本数据
        var textDataList = [];

        // 获取设置选项的文本规则
        var settingsText = settings.text.get();

        // 如果文本规则中有 [ ',' ]
        if (settingsText.indexOf(',') !== -1) {

            // 强制成数组 , 分割
            var textList = settingsText.split(',');

            // 循环遍历数组
            for (var i = 0; i < textList.length; i++) {

                // 获取单独的文本规则
                var text = textList[i];

                // 获取文本内容
                var theText = text.substring(0, text.length - 2);

                // 获取文本键名
                var theKeyName = text[text.length - 1];

                // 创建一个文本数据的对象实例存储到 [ textDataList ] 中
                textDataList.push(new TextData(theText, theKeyName));
            };

            // 否则如果文本规则能检测到 [ '-' ]
        } else if (settingsText.indexOf('-') !== -1) {

            // 获取文本内容
            var theText = settingsText.substring(0, settingsText.length - 2);

            // 获取文本键名
            var theKeyName = settingsText[settingsText.length - 1];

            // 创建一个文本数据的对象实例存储到 [ textDataList ] 中
            textDataList.push(new TextData(theText, theKeyName));
        };

        // 构造函数 TextData
        function TextData(text, keyName) {

            // 定义 [ text ] 用于存储文本内容
            this.text = text;

            // 定义 [ keyName ] 用于存储文本键名
            this.keyName = keyName;

            // 定义 [ keyValue ] 用于存储文本键值
            this.keyValue = Key.getKeyValue(this.keyName);
        };

        // 返回一个 [ textDataList ] 
        return textDataList;
    }

    // 定义函数 [ doSendText ] 用于发送聊天 @void
    function doSendText(text) {

        // 如果刷屏开启
        if (settings.Spammer.get()) {

            // 如果随机前后缀开启
            if (settings.Random.get()) {

                // 循环3次
                for (var count = 0; count < 3; count++) {

                    // 定义 [ randomLeft ] 用于获取随机前缀
                    var randomLeft = '『' + getRandomString() + '』  ';

                    // 定义 [ randomRight ] 用于获取随机后缀 
                    var randomRight = '  『' + getRandomString() + '』';

                    // 发送文本 添加前后缀
                    mc.thePlayer.sendChatMessage(randomLeft + text + randomRight);
                }
            } else {

                // 循环3次发送文本
                for (var count = 0; count < 3; count++) {
                    mc.thePlayer.sendChatMessage(text);
                }
            };

            // 如果随机开启
        } else if (settings.Random.get()) {

            // 定义 [ randomLeft ] 用于获取随机前缀
            var randomLeft = '『' + getRandomString() + '』  ';

            // 定义 [ randomRight ] 用于获取随机后缀 
            var randomRight = '  『' + getRandomString() + '』';

            // 发送文本 添加前后缀
            mc.thePlayer.sendChatMessage(randomLeft + text + randomRight);
        } else {

            // 发送文本
            mc.thePlayer.sendChatMessage(text);
        }
    };

    // 定义函数 [ getRandomString ] 用于获取随机字符串 @string
    function getRandomString() {

        var randomText = '';

        for (var i = 0; i < 4; i++) {
            randomText = randomText + getRandomChar();
        }
        return randomText;

        // 定义函数 [ getRandomChar ] 用于获取随机字符 @string
        function getRandomChar() {
            var randomString = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

            var randomIndex = Math.floor(Math.random() * randomString.length);

            return randomString[randomIndex];
        }
    }

}

// 脚本启用时调用
function onLoad() {

    // 输出一句话表示已加载
    chat.print('§9' + 'KeyText' + ' §2- §4Load');
}

// 创建模块的实例
var dragonKeyText = new TheKeyText();

// 定义 [ dragonKeyTextClient ] 用于存储注册信息
var dragonKeyTextClient;

// 脚本运行时调用
function onEnable() {

    // 注册
    dragonKeyTextClient = moduleManager.registerModule(dragonKeyText);
}

// 脚本禁用时调用
function onDisable() {

    // 注销
    moduleManager.unregisterModule(dragonKeyTextClient);
}