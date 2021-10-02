//variables pour créer les sprites
var nebula, vaisseau,start;
//variables pour les images
var nebulaImg, vaisseauImg,thrustImg,rockImg,laserImg,explosionImg,startImg;
// créer l'angle du vaisseau
var angle=90;

//dimension zone de jeu
var LARGEUR = 600;
var HAUTEUR = 600;

// variables états de jeu
var vie, score, bestscore,statut;
vie = 3;
score = 0;
bestscore = 0;
statut="start";
var grouprock,grouplaser;
  
function preload(){
  //télécharger les images ici
  nebulaImg = loadImage("nebula.png");
  vaisseauImg = loadImage("spaceship.png");
  thrustImg = loadImage("thrust.png");
  rockImg = loadImage("rock.png");
  laserImg = loadImage("laser.png");
  explosionImg = loadAnimation("explosion300.png","explosion301.png","explosion302.png","explosion303.png","explosion304.png","explosion305.png","explosion306.png","explosion307.png","explosion308.png","explosion309.png","explosion310.png","explosion311.png","explosion312.png","explosion313.png","explosion314.png","explosion315.png");
  startImg = loadImage("play.png");
}

function setup(){
  createCanvas(LARGEUR,HAUTEUR)
  
  nebula = createSprite(LARGEUR/2,HAUTEUR/2,LARGEUR/2,HAUTEUR/2);
  nebula.addImage(nebulaImg);
  nebula.scale = 1.2;
  
  vaisseau = createSprite(LARGEUR/2,HAUTEUR/2,20,20);
  vaisseau.addAnimation("spaceship",vaisseauImg);
  vaisseau.addAnimation("thrust",thrustImg);
  vaisseau.scale = 0.15;
  vaisseau.debug = false;
  vaisseau.setCollider("rectangle",0,0,450,350);
  grouprock = createGroup();
  grouplaser = createGroup();
  start = createSprite(LARGEUR/2,HAUTEUR/2+100,20,20);
  start.addImage(startImg);
  start.scale=0.1;
}

function draw(){
  
   drawSprites();
  
  // écrire le nombre de vies
  textFont("Futura");
  textSize(25);
  fill("white");
  text("Vies:"+vie,20,50);
  text ("Score:"+score,20,80);
  fill ("red");
  text ("Best score:"+bestscore,LARGEUR-200,50);
  
  //faire démarrer le jeu avec le bouton play
  if (statut==="start") {
    start.visible=true;
    if (mousePressedOver(start)){
      start.visible=false;
      statut="play";
    }
  }
  
  // faire bouger le vaisseau à droite et à gauche
  if (keyDown ("right")) {
    angle+=10;
  }
  if (keyDown ("left")) {
    angle-=10;
  }
  //faire avancer le vaisseau
  if (keyDown ("up")) {
 vaisseau.velocityX+=Math.cos(radians(angle));
 vaisseau.velocityY+=Math.sin (radians(angle));
 vaisseau.changeAnimation("thrust");
  }
  if (keyWentUp("up")) {
    vaisseau.changeAnimation("spaceship");
  }
  
  // dérfinir la vitesse du vaisseau
  vaisseau.velocityX*=0.9;
  vaisseau.velocityY*=0.9;
  //définir l'angle du vaisseau
  vaisseau.rotation=angle;
  
   // activer la fonction traverser pour le vaisseau
  traverser(vaisseau);
  //activer la fonction traverser pour chaque rocher
  for (var i = 0; i < grouprock.length; i++) {
    traverser(grouprock.get(i));
  }
  if (statut==="play") {
  rocher();
  laser_activation();
  
  //activer la collision entre les rochers et le vaisseau
  for (var i = 0; i < grouprock.length; i++) {
    if (grouprock.get(i).isTouching(vaisseau)) {
      var explosion =    createSprite(grouprock.get(i).x,grouprock.get(i).y);
       explosion.addAnimation("explosion",explosionImg);
       explosion.scale=3;
       explosion.lifetime=10;
       grouprock.get(i).destroy();
       vie-=1;
      score-=50;
    }
  }
 
  for (var i = 0; i<grouplaser.length; i++){
   for (var j = 0; j < grouprock.length; j++){
     if (grouplaser.get(i).isTouching(grouprock.get(j))){
       var explosion = createSprite(grouprock.get(j).x,grouprock.get(j).y);
       explosion.addAnimation("explosion",explosionImg);
       explosion.scale=3;
       explosion.lifetime=10;
       grouplaser.get(i).destroy();
       grouprock.get(j).destroy();
       score+=100;
     }
   } 
}
    // arrêter le jeu si il n'y a plus de vies
  if (vie===0) {
    statut="GameOver";
    if (score>bestscore) {
      bestscore=score;
    }
  }
}
  if (statut==="GameOver") {
    grouprock.destroyEach();
    grouplaser.destroyEach();
    textFont("Georgia");
    textSize(60);
    fill("red");
    text("GAME OVER",LARGEUR/5,HAUTEUR/2);
    vaisseau.visible=false;
    start.visible=true;
    if (mousePressedOver(start)) {
      start.visible=false;
      statut="play";
      vie=3;
      vaisseau.visible=true;
      vaisseau.x=LARGEUR/2;
      vaisseau.y=HAUTEUR/2;
    }
    
  }
}

function traverser(sprite) {
if (sprite.y<0) {
    sprite.y=HAUTEUR;
  }
  if (sprite.x<0) {
    sprite.x=LARGEUR;
  }
  if (sprite.y>HAUTEUR) {
    sprite.y =0;
  }
  if (sprite.x>LARGEUR) {
    sprite.x=0;
  }
}

function rocher () {
  if (World.frameCount%90===0) {
   var rockX=LARGEUR*Math.random();
   var rockY=HAUTEUR*Math.random();
   while (Math.abs(rockX-vaisseau.x)<100 && Math.abs(rockY-vaisseau.y)<100) {
     rockX=LARGEUR*Math.random();
     rockY=HAUTEUR*Math.random();
   }
   var rock=createSprite(rockX,rockY,30,30);
   rock.addImage(rockImg);
   rock.rotationSpeed=3*Math.random();
   rock.velocityX=10*Math.random()-5;
   rock.velocityY=10*Math.random()-5;
   rock.scale=0.2;
   rock.lifetime=400;
   rock.setCollider("circle",0,0,220);
   grouprock.add(rock);
  }
}

function laser_activation () {
  if (keyDown("space")&& (grouplaser.length<15)) {
    var laser = createSprite (vaisseau.x, vaisseau.y);
    laser.addImage(laserImg);
    laser.scale=0.3;
    laser.rotation=angle;
    laser.x=vaisseau.x+45*Math.cos(radians(angle));
    laser.y=vaisseau.y+45*Math.sin(radians(angle));
    laser.velocityX=8*Math.cos(radians(angle));
    laser.velocityY=8*Math.sin (radians(angle));
    laser.lifetime=50;
    laser.setCollider("rectangle",-10,0,120,60);
    grouplaser.add(laser);
  }
}
