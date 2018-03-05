// 敌人类
var Enemy = function () {
    this.reset();
};

// 初始化敌人的类型、坐标和速度
// type:敌人类型 0表示正向移动的敌人 1表示反向移动的敌人
Enemy.prototype.reset = function () {
    this.type = Math.floor(Math.random() * 2);
    if (this.type === 0) {
        this.x = -99;
        this.y = -20 + Math.floor(Math.random() * 4 + 1) * 83;
        this.speed = 50 * Math.floor(Math.random() * 3 + 3);
        this.sprite = 'images/enemy-bug.png';
    } else {
        this.x = 505;
        this.y = -20 + Math.floor(Math.random() * 4 + 1) * 83;
        this.speed = -50 * Math.floor(Math.random() * 3 + 3);
        this.sprite = 'images/enemy-bug-reverse.png';
    }
}

// 更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function (dt) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
    this.x += this.speed * dt;
    if ((this.type === 0 && this.x > 505) || (this.type === 1 && this.x < -99)) {
        this.reset();
    }
};

// 在屏幕上画出敌人
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// 玩家类
var Player = function () {
    this.reset();
}

// 初始化玩家对象的位置和图片。
Player.prototype.reset = function () {
    this.x = 2 * 101;
    this.y = -20 + 5 * 83;
    this.sprite = 'images/char-boy.png';
    this.score = 0;
}

// 在屏幕上画出玩家
Player.prototype.render = function () {
    Enemy.prototype.render.call(this);
}

// 接收键盘事件的结果，根据接收的参数更新玩家对象的位置。
Player.prototype.handleInput = function (key) {
    switch (key) {
        case 'left':
            this.x = this.x - 101 < 0 ? this.x : this.x - 101;
            break;
        case 'up':
            this.y = this.y - 83 < -20 ? this.y : this.y - 83;
            break;
        case 'right':
            this.x = this.x + 101 > 404 ? this.x : this.x + 101;
            break;
        case 'down':
            this.y = this.y + 83 > 405 ? this.y : this.y + 83;
            break;
        default:
            break;
    }
}

// 宝石类
var Gem = function (type) {
    this.init(type);
}

// 初始化宝石的类型，以及刷新位置。
// 参数: type ，数组sprites的下标,通过参数type手动控制生成宝石的类型。
Gem.prototype.init = function (type) {
    var sprites = ['images/Gem Blue.png', 'images/Gem Green.png', 'images/Gem Orange.png'];
    var blurSprites = ['images/Gem Blue-blur.png', 'images/Gem Green-blur.png', 'images/Gem Orange-blur.png'];
    this.sprite = sprites[type];
    this.blurSprite = blurSprites[type];
    this.isCollected = false;
}

// 在屏幕上画出宝石
Gem.prototype.render = function () {
    var img = Resources.get(this.sprite);
    if (!this.isCollected) {
        ctx.drawImage(img, this.x, this.y, img.width * 0.7, img.height * 0.7);
    }
};

// 敌人实例化函数。
function createEnemies(count) {
    var enemies = [];
    for (var i = 0; i < count; i++) {
        enemies.push(new Enemy());
    }
    return enemies;
}

// 宝石实例化函数，产生位置不重叠的宝石
function createGems() {

    // 存储宝石实例的集合
    var gems = [];

    // x轴上可取的随机整数的集合
    var seq_x = [0, 1, 2, 3, 4];
    // y轴上可取的随机整数的集合
    var seq_y = [1, 2, 3, 4];

    // randNext函数是具有取值范围的随机数生成器
    // 取值范围为[base,range-1]
    function randNext(base, range) {
        return base + Math.floor(Math.random() * (range - base));
    }

    // swap函数用于产生随机数后，将产生的随机数作为下标的元素与随机次数i的下标的元素进行交换
    // 即 arr[i] <==> arr[rand]
    function swap(arr, i, rand) {
        var temp = arr[i];
        arr[i] = arr[rand];
        arr[rand] = temp;
    }

    for (var i = 0; i < 3; i++) {
        var gem = new Gem(i);
        var rand_x = randNext(i, 5);
        var rand_y = randNext(i, 4);
        swap(seq_x, i, rand_x);
        swap(seq_y, i, rand_y);
        gem.x = 15 + seq_x[i] * 101;
        gem.y = 12 + seq_y[i] * 83;
        gems.push(gem);
    }
    return gems;
}

// 存储敌人对象
var allEnemies = createEnemies(3);

// 存储玩家对象
var player = new Player();

// 存储宝石对象
var gems = createGems();

// 记录当局宝石收集数量
var gemCount = 0;

// 点击开始后，为键盘添加监听事件
function start() {
    // 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
    // 方法里面。你不需要再更改这段代码了。
    document.addEventListener('keyup', function (e) {
        var allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };
        player.handleInput(allowedKeys[e.keyCode]);
    });
    var startModal = document.getElementById("startModal");
    startModal.setAttribute("style", "visibility:hidden");
}

// 点击“再来一局”按钮重新开始游戏
function restart() {
    reset();
    var endModal = document.getElementById("endModal");
    endModal.setAttribute("style", "visibility:hidden");
}