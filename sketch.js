//Variables:

var forest, forestImg;
var baby1, baby2, baby3, babyGroup;
var batGroup, batImg;
var torchImg, torchGroup;
var ghost, ghostImg;
var nightSound;
var gameState = "start";
var score = 0;
var gameOver, gameImg;
var deadImg;
var startImg, restartImg;
var start, restart;
var wall1, wall2;

function preload(){

    //Loading Images:
    forestImg = loadImage("Forest.png");
    baby1 =  loadImage("baby1.png");
    baby3 = loadImage("baby3.png");
    batImg = loadImage("bat1.png");
    torchImg = loadImage("torchguy.png");
    ghostImg = loadImage("ghost.png");
    nightSound = loadSound("creepyNight.mp3");
    gameImg = loadImage("game_over.png");
    deadImg = loadImage("dead.png");
    startImg = loadImage("start.png");
    restartImg = loadImage("reset.png");

    //Creating Groups:
    babyGroup = new Group();
    batGroup = new Group();
    torchGroup = new Group();
}

function setup() {

    createCanvas(600,300);

    //Sprites:
    forest = createSprite(625,-60);
    forest.addImage("Forest", forestImg);
    forest.scale = 2;

    ghost = createSprite(50,150,10,10);
    ghost.addImage(ghostImg);

    ghost.setCollider("rectangle",0,0,350,550);
    /////ghost.debug = true;

    gameOver = createSprite(300,130);
    gameOver.addImage(gameImg);
    gameOver.scale = 0.8;
    gameOver.visible = false;

    start = createSprite(310,225,10,10);
    start.addImage(startImg);
    start.scale = 0.6;
    start.visible = false;

    restart = createSprite(300,225,10,10);
    restart.addImage(restartImg);
    restart.scale = 0.3;
    restart.visible = false;

    wall1 = createSprite(300,10,600,10);
    wall1.visible = false;

    wall2 = createSprite(300,290,600,10);
    wall2.visible = false;

}

function draw() {

    background(0);

    //Start Gamestate:
    if (gameState === "start"){
        forest.visible = false;
        ghost.scale = 0.1;
        start.visible = true;

        textSize(20);
        text("Use W,S or Up and Down arrow to move the ghost",100,70);
        text("Collect the Baby Ghosts",200,100);
        text("Avoid Lights and Bats",220,130);
        text("Check Console for score after Game is Over", 115,160);
        
        if (keyDown("up") || keyDown("w")){
            ghost.y = ghost.y - 3;
        }
    
        if (keyDown("down") || keyDown("s")){
            ghost.y = ghost.y + 3;
        }

        ghost.collide(wall1);
        ghost.collide(wall2);

        if (mousePressedOver(start)){
            gameState = "wait";
        }

    }

    //Wait Gamestate (to reset the sprites):
    if (gameState === "wait"){
        ghost.y = 150;
        ghost.scale = 0.1;
        gameState = "play";
        start.visible = false;
    }

    //Play Gamestate:
    if(gameState === "play"){

        forest.visible = true;
        forest.velocityX = -2;
        ghost.scale = 0.1;

        if (forest.x < -50){
            forest.x = 625;
        }
    
        if (keyDown("up") || keyDown("w")){
            ghost.y = ghost.y - 3;
        }
    
        if (keyDown("down") || keyDown("s")){
            ghost.y = ghost.y + 3;
        }
    
        if (babyGroup.isTouching(ghost)){
            babyGroup.destroyEach();
            score = score + 5;
        }
    
        spawnBaby();
        spawnBat();
        spawnTorch();

        ghost.collide(wall1);
        ghost.collide(wall2);

        if (batGroup.isTouching(ghost) || torchGroup.isTouching(ghost)){

            gameState = "end";

        }
    }

    //End Gamestate:
    if (gameState === "end"){

        background("dark blue");
        gameOver.visible = true;
        restart.visible = true;
        console.log(score);

        ghost.addImage(deadImg);
        ghost.scale = 0.13;
        forest.velocityX = 0;

        babyGroup.destroyEach();
        batGroup.destroyEach();
        torchGroup.destroyEach();

        if (mousePressedOver(restart)){

            gameState = "wait";
            gameOver.visible = false;
            restart.visible = false;
            score = 0;
            ghost.addImage(ghostImg);
        }
    }

    drawSprites();
}

//Spawning the Baby Ghosts:

function spawnBaby(){

    if (frameCount % 200 === 0 && gameState === "play"){

        var baby = createSprite(650,150);
        baby.y = Math.round(random(30,270));
        //baby.debug = true;

        var rand = Math.round(random(1,2))
        
        if (rand == 1){

            baby.addImage(baby1);
            baby.scale = 0.1;
            baby.velocityX = -4
            baby.setCollider("rectangle",0,0,400,400);

        } else {

            baby.addImage(baby3);
            baby.scale = 0.2;
            baby.velocityX = -3;
            baby.setCollider("rectangle",0,0,256,400);
        }

        babyGroup.add(baby);
        baby.lifetime = 800;
        
    }
}

//Spawning the Bats:

function spawnBat(){

    if (frameCount % 80 === 0 && gameState === "play"){

        var bat = createSprite(650,150);
        bat.addImage(batImg);
        bat.y = Math.round(random(20,280));
        bat.velocityX = -4;
        bat.scale = 0.1;

        batGroup.add(bat);
        bat.lifetime = 800;
        bat.setCollider("circle",0,0,100);

        //bat.debug = true;
    }
}

//Spawning the Torches:

function spawnTorch(){

    if (frameCount % 450 === 0 && gameState === "play"){

        var torch = createSprite(675,250);
        torch.addImage(torchImg);
        torch.velocityX = -4;
        torch.scale = 0.5;

        //torch.debug = true;

        torchGroup.add(torch);
        torch.lifetime = 800;
        torch.setCollider("rectangle",0,0,10,160);
    }
}