const cvs = document.getElementById('snake');       //canvas is snake element
const ctx = cvs.getContext('2d');                   //returns object that provides methods for drawing

//creat unit
const box = 32;                                     //each box is equal to 32 px

//create level

let level = 1;
//load images

const ground = new Image();                         //ground is equal to the ground image
ground.src = "ground.png";

const foodImg = new Image();                        //food is equal to the food image
foodImg.src = "food.png";

//seconds counter

var seconds = 0;
function countSeconds() {
    seconds++;
    console.log(seconds)
}
var cancel = setInterval(countSeconds, 1000);

//create the snake

let snake = [];                                      //snake is an empty array
snake[0] = {                                          //whose first element is at box (9,10)
    x: 9 * box,
    y: 10 * box
};

//create food

let food = {                                       //food has random coordinates which are multiplied by the number of boxes
    x: Math.floor(Math.random() * 17 + 1) * box,
    y: Math.floor(Math.random() * 15 + 3) * box
}

//create score

let score = 0;                                       //score starts out at 0

//control the snake

let d;                                             //empty variable for direction

document.addEventListener("keydown", direction);    //addEventListener is triggered when you press a key direction function triggered

function direction(event) {                          //needs an event
    if (event.keyCode == 37 && d != "RIGHT") {          //if you press left (and current direction isnt right) d=left
        d = "LEFT";
        console.log("clicked left")
    } else if (event.keyCode == 38 && d != "DOWN") { //if you press up (and current direction isnt down) d=up
        d = "UP";
        console.log("clicked up")
    } else if (event.keyCode == 39 && d != "LEFT") { //if you press right (and current direction isnt left) d=right
        d = "RIGHT";
        console.log("clicked right")
    } if (event.keyCode == 40 && d != "UP") { //if you press down (and current direction isnt up) d=down
        d = "DOWN";
        console.log("clicked down")
    }
}

//check collision function

function collision(head, array) {                 //collision function looks at the head and the array
    for (let i = 0; i < array.length; i++) {      //iterate ofver length of the array
        if (head.x == array[i].x && head.y == array[i].y) {  //if the x and y coordiantes of the head are in the array, there is a collision
            return true;
            console.log("There was a collision");
        }
    }
    return false;
}

//draw everything to canvas

function draw() {                                        //Draw
    ctx.drawImage(ground, 0, 0);                          //call internal function to draw the ground picture at the top left orner
    for (let i = 0; i < snake.length; i++) {              //go over the snake array, making alternate yellow and black snake parts
        ctx.fillStyle = (i % 2 == 0) ? "yellow" : "black";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);    //canvas method makes filled rectangle with with that color
        ctx.strokeStyle = "red";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);  //canvas method makes rectangle with border stroke of that color
    }

    ctx.drawImage(foodImg, food.x, food.y);  //draw the food at the random x and y position gaiven

    //old head position
    snakeX = snake[0].x; //sets snake head position
    snakeY = snake[0].y;

    //which direction --MAKES SNAKE RESPOND TO KEYS
    if (d == "LEFT") snakeX -= box;
    if (d == "UP") snakeY -= box;
    if (d == "RIGHT") snakeX += box;
    if (d == "DOWN") snakeY += box;

    //if the snake eats the food --MAKES DIFFERENT FOOD APPEAR (Why does it not append?)
    if (snakeX == food.x && snakeY == food.y) { //if snake eats food, add to score, and make new food and reset seconds counter
        score++;
        seconds = 0;
        food = {
            x: Math.floor(Math.random() * 17 + 1) * box,
            y: Math.floor(Math.random() * 15 + 3) * box
        }
        //otherwise, remove last piece
    } else {
        snake.pop();
    }

    //add new head

    let newHead = {
        x: snakeX,
        y: snakeY
    }

    //game over
    if (snakeX < box || snakeX > 17 * box || snakeY < 3 * box || snakeY > 17 * box || collision(newHead, snake)) { //if snake hits side or self
        alert("Game over");
        clearTimeout(makeSnakeGo);
        localStorage.highScore = score;
    }

    snake.unshift(newHead);

    ctx.fillStyle = "white";
    ctx.font = "25px Helvetica one";
    ctx.fillText("Score: " + score, 2 * box, 1.6 * box);  //fill in the score
    ctx.fillText("Level: " + level, 14 * box, 1.6 * box);  //fill in the score
    ctx.fillText("High Score: " + localStorage["highScore"], 7.5 * box, 1.6 * box);

}

if (seconds == 5) {
    food = {                                       //food has random coordinates which are multiplied by the number of boxes
        x: Math.floor(Math.random() * 17 + 1) * box,
        y: Math.floor(Math.random() * 15 + 3) * box
    }
    draw()

}

function getSpeedFromScore(gameScore) {      //gets speed from score
    if (gameScore < 3) {  //if the score is under 3
        return 250;     //it is 200ms
        level = 1;
    } else if (gameScore >= 3 && gameScore < 6) {
        level = 2;
        return 200;
    } else if (gameScore >= 6 && gameScore < 9) {
        level = 3
        return 150;
    } else if (gameScore >= 9 && gameScore < 12) {
        level = 4;
        return 100;
    } else if (gameScore >= 12 && gameScore < 15) {
        leve = 5;
        return 50;
    }
}

function makeSnakeGo() {
    draw()
    var speed = getSpeedFromScore(score);       //speed is 
    //let game = setInterval(draw, speed);          //do this every 100 milliseconds
    setTimeout(makeSnakeGo, speed);
}

makeSnakeGo();