gap = randomGap();

var obstaclesList = [];
var enemyList = ["obstacleFirst", "obstacleSecond", "flyingDino"];
var scoreDino = 0;

//inserting images
var standimage = new Image();
standimage.src = "dinosaur.png";

var obstacleFirst = new Image();
obstacleFirst.src = "cactus.png";

var obstacleSecond = new Image();
obstacleSecond.src = "cactus2.png";

var flyingDino = new Image();
flyingDino.src = "flyingdinosaur.png";

//default functions
function startGame() {
    gameFrame.start();
}
function everyinterval(n) {
    if (gameFrame.frame % n == 0) return true;
    return false;
}
const jump = () => {
    dino.speedY = -2;
    setTimeout(() => {
        jumpState = false
    }, 1400)

}
function randomGap() {
    return Math.floor(200 + Math.random() * (500 - 200 + 1));
}
var scoreText = {
    x: 220,
    y: 200,
    update: function (text) {
        gameFrame.context.fillStyle = "gray";
        gameFrame.context.font = "30px Consolas";
        gameFrame.context.fillText(text, 220, 200);
    }
}
//setting up dino 
var dino = {
    x: 20,
    y: 470,
    speedY: 0, //default dino jump speed
    update: function () {
        if (this.y < 470) {
            gameFrame.context.drawImage(standimage, this.x, this.y - 40, 60, 60);
        }
        else {
            gameFrame.context.drawImage(standimage, this.x, this.y - 40, 50, 60);
        }
    },
    newPos: function () {
        if (this.y < 280) {
            this.speedY = 2; //change speed while jump
        }
        this.y = this.y + this.speedY;
        if (this.speedY == 2 && this.y == 470) {
            this.speedY = 0;
        }

    },
    crashWith: function (obs) {
        //show crash when obstacles come :: comparing dino & obstacle position to detect obstacle :: hard coded detection
        if (this.x + 30 > obs.x && this.x < obs.x + obs.width && this.y + 30 > obs.y) { 
            return true;
        }
        return false;
    }
}
function obstacle() {
    //render random obstacle
    this.height = Math.floor(20 + Math.random() * (50 - 20 + 1));
    this.width = Math.floor(10 + Math.random() * (20 - 10 + 1));
    this.x = 1000;
    this.y = gameFrame.canvas.height - this.height;
    this.index = Math.floor(Math.random() * enemyList.length);
    this.obstacleType = enemyList[this.index];
    this.draw = function () {
        if (this.obstacleType == "obstacleFirst") {
            gameFrame.context.drawImage(obstacleFirst, this.x, this.y - 23, 40, this.height + 5);
        }
        else if (this.obstacleType == "obstacleSecond") {
            gameFrame.context.drawImage(obstacleSecond, this.x, this.y - 23, 40, this.height + 5);
        }
        else {
            gameFrame.context.drawImage(flyingDino, this.x, this.y - 55, 60, this.height + 10);
        }
    }
}

var gameFrame = {
    canvas: document.createElement("canvas"),
    start: function () {
        //game default dimentions :: hard coded frame
        this.canvas.height = 500;
        this.canvas.width = 600;
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.context = this.canvas.getContext("2d");
        this.frame = 0;
        this.score = 0;
        scoreText.update("Score: 0");
        this.interval = setInterval(this.updateGameFrame, 5);
    },
    updateGameFrame: function () {
        for (i = 0; i < obstaclesList.length; i++) {
            if (dino.crashWith(obstaclesList[i])) {
                gameFrame.stop();
                return;
            }
        }
        gameFrame.clear();
        if (everyinterval(gap)) {
            obstaclesList.push(new obstacle());
            gap = randomGap();
            gameFrame.frame = 0;
        }
        for (i = 0; i < obstaclesList.length; i++) {
            obstaclesList[i].x -= 2;
            obstaclesList[i].draw();
        }
        dino.newPos();
        dino.update();
        gameFrame.frame += 1;
        gameFrame.score += 0.01;
        scoreDino = Math.floor(gameFrame.score);
        scoreText.update("Score: " + scoreDino);

    },
    clear: function () {
        gameFrame.context.clearRect(0, 0, this.canvas.width, this.canvas.width);
    },
    stop: function () {
        clearInterval(this.interval);
        gameFrame.context.fillStyle = "gray";
        gameFrame.context.font = "25px Consolas";
        gameFrame.context.fillText("GAME OVER!!!", 200, 250);
    },
}
