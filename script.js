const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


// =======================
// GAME VARIABLES
// =======================

let gameRunning = true;

let keys = {};

let mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2
};


let score = 0;

let maxHealth = 100;

let health = maxHealth;

let playerDamage = 25;

let fireRate = 300;

let canShoot = true;

let shooting = false;

let weaponLevel = 1;

let bulletCount = 1;

let wave = 1;


let zombiesToSpawn = 10;

let zombiesSpawned = 0;

let waveCleared = false;

let coins = 0;

let shopOpen = false;


// BOSS SYSTEM

let bossActive = false;

let bossSpawnedThisWave = false;

let bossWarning = false;

let bossWarningTimer = 0;


// SCREEN SHAKE

let shake = 0;

let playerDamageCooldown = false;


// =======================
// WEAPON SYSTEM
// =======================

let maxAmmo = 12;

let ammo = 12;

let reloading = false;

let reloadTime = 1500;

// =======================
// UPGRADE SHOP SYSTEM
// =======================


function buyUpgrade(choice){


if(choice === "1"){



if(coins >= 50){


coins -= 50;


playerDamage += 5;


console.log("Damage upgraded!");


}



}



if(choice === "2"){



if(coins >= 75){


coins -= 75;


maxHealth += 20;


health = maxHealth;


console.log("Health upgraded!");


}



}



if(choice === "3"){



if(coins >= 100){


coins -= 100;


player.speed += 1;


console.log("Speed upgraded!");


}



}



if(choice === "4"){



if(coins >= 150){


coins -= 150;


reloadTime -= 200;


console.log("Reload upgraded!");


}



}

if(choice === "5"){


if(coins >= 200){


coins -= 200;


weaponLevel++;


bulletCount++;


console.log("Weapon upgraded!");

}


}



updateHUD();


}

function reload(){


    if(reloading)
        return;


    if(ammo === maxAmmo)
        return;



    reloading = true;



    setTimeout(()=>{


        ammo = maxAmmo;

        reloading = false;


        updateHUD();


    }, reloadTime);



}

function shoot(){


if(!gameRunning)
return;


if(!shooting)
return;


if(!canShoot)
return;


if(reloading)
return;


if(ammo <=0)
return;



let speed = 10;



for(let i = 0; i < bulletCount; i++){


let spread = 0;


if(bulletCount > 1){

spread = (i - (bulletCount-1)/2) * 0.15;

}



bullets.push({


x:player.x,


y:player.y,


dx:Math.cos(player.angle + spread)*speed,


dy:Math.sin(player.angle + spread)*speed,


size:5


});


}



ammo--;


updateHUD();



canShoot = false;



setTimeout(()=>{


canShoot = true;


},fireRate);



}




// =======================
// DASH SYSTEM
// =======================

let canDash = true;

let dashPower = 80;

let dashCooldown = 3000;




// =======================
// PLAYER
// =======================


const player = {


    x: canvas.width / 2,


    y: canvas.height / 2,


    size:25,


    speed:5,


    color:"#00ff99",


    angle:0


};






// =======================
// OBJECTS
// =======================


let bullets = [];

let zombies = [];





// =======================
// INPUT SYSTEM
// =======================



window.addEventListener(
"keydown",
(e)=>{


let key = e.key.toLowerCase();



if(key === " "){

keys["space"] = true;


}else{


keys[key] = true;


}



if(key === "r"){


reload();


}

if(key=="r"){

reload();

}
    
if(key=="b"){

shopOpen = !shopOpen;

}

if(key=="1"){

buyUpgrade("1");

}


if(key=="2"){

buyUpgrade("2");

}


if(key=="3"){

buyUpgrade("3");

}


if(key=="4"){

buyUpgrade("4");

}

});





window.addEventListener(
"keyup",
(e)=>{


let key = e.key.toLowerCase();



if(key === " "){

keys["space"] = false;


}else{


keys[key] = false;


}



});






canvas.addEventListener(
"mousedown",
()=>{


shooting = true;


});


canvas.addEventListener(
"mouseup",
()=>{


shooting = false;


});



canvas.addEventListener(
"mousemove",
(e)=>{


let rect = canvas.getBoundingClientRect();


mouse.x = e.clientX - rect.left;


mouse.y = e.clientY - rect.top;



player.angle = Math.atan2(


mouse.y-player.y,


mouse.x-player.x


);


});


// =======================
// PLAYER MOVEMENT
// =======================



function movePlayer(){



let moving = false;



if(keys["w"]){


player.y -= player.speed;


moving = true;


}



if(keys["s"]){


player.y += player.speed;


moving = true;


}



if(keys["a"]){


player.x -= player.speed;


moving = true;


}



if(keys["d"]){


player.x += player.speed;


moving = true;


}





// DASH


if(keys["space"] && canDash && moving){



let dx = 0;

let dy = 0;




if(keys["w"])
dy = -1;


if(keys["s"])
dy = 1;


if(keys["a"])
dx = -1;


if(keys["d"])
dx = 1;




player.x += dx * dashPower;


player.y += dy * dashPower;




canDash = false;



setTimeout(()=>{


canDash = true;


}, dashCooldown);



}





// BOUNDARIES



player.x = Math.max(

0,

Math.min(canvas.width,player.x)

);



player.y = Math.max(

0,

Math.min(canvas.height,player.y)

);



}








// =======================
// BULLET UPDATE
// =======================



function updateBullets(){



bullets.forEach((bullet,index)=>{



bullet.x += bullet.dx;


bullet.y += bullet.dy;




if(

bullet.x < 0 ||

bullet.x > canvas.width ||

bullet.y < 0 ||

bullet.y > canvas.height


){


bullets.splice(index,1);


}



});



}
// =======================
// SPAWN ZOMBIE SYSTEM
// =======================


function spawnZombie(){

console.log("SPAWNING ZOMBIE");

let side = Math.floor(Math.random()*4);


let x,y;



if(side===0){

x=0;

y=Math.random()*canvas.height;

}


if(side===1){

x=canvas.width;

y=Math.random()*canvas.height;

}


if(side===2){

x=Math.random()*canvas.width;

y=0;

}


if(side===3){

x=Math.random()*canvas.width;

y=canvas.height;

}




// =======================
// BOSS CHECK
// =======================


if(
wave % 5 === 0 &&
bossActive === false &&
bossSpawnedThisWave === false
){


bossActive = true;

bossSpawnedThisWave = true;

bossWarning = true;


bossWarningTimer = 180;



let boss = {


type:"boss",


x:x,


y:y,


size:70,


speed:1,


hp:1000,


maxHp:1000,


color:"purple"


};



zombies.push(boss);



return;


}





// =======================
// RANDOM ZOMBIE TYPE
// =======================


let typeRoll = Math.random();


let zombie;




// WALKER

if(typeRoll < 0.7){


zombie = {


type:"walker",


x:x,


y:y,


size:25,


speed:1.5,


hp:50,


color:"green"


};



}



// RUNNER

else if(typeRoll < 0.9){


zombie = {


type:"runner",


x:x,


y:y,


size:20,


speed:3,


hp:30,


color:"orange"


};



}



// TANK

else{


zombie = {


type:"tank",


x:x,


y:y,


size:40,


speed:0.8,


hp:200,


color:"#555"


};



}



zombies.push(zombie);



}







// =======================
// ZOMBIE AI
// =======================


function updateZombies(){



zombies.forEach((zombie,index)=>{



let angle = Math.atan2(

player.y-zombie.y,

player.x-zombie.x

);




zombie.x += Math.cos(angle)*zombie.speed;


zombie.y += Math.sin(angle)*zombie.speed;






// =======================
// PLAYER DAMAGE
// =======================


let distance = Math.hypot(

player.x-zombie.x,

player.y-zombie.y

);




if(distance < player.size + zombie.size){



if(!playerDamageCooldown){



if(zombie.type === "boss"){


health -= 10;


}else{


health -= 5;


}



updateHUD();



playerDamageCooldown = true;



setTimeout(()=>{


playerDamageCooldown = false;


},800);



if(health <= 0){


endGame();


}



}


}







// =======================
// BULLET DAMAGE
// =======================



bullets.forEach((bullet,bIndex)=>{



let hit = Math.hypot(

bullet.x-zombie.x,

bullet.y-zombie.y

);




if(hit < zombie.size){



zombie.hp -= playerDamage;


bullets.splice(bIndex,1);




if(zombie.type === "boss"){


shake = 10;


}





if(zombie.hp <= 0){



if(zombie.type === "boss"){


bossActive = false;


score += 10;


coins += 100;



}else{


score++;


coins += 10;


}



zombies.splice(index,1);



updateHUD();



}



}



});



});







// =======================
// WAVE CHECK
// =======================


if(

zombies.length === 0 &&

zombiesSpawned >= zombiesToSpawn &&

waveCleared === false

){


waveCleared = true;


nextWave();


}



}








// =======================
// NEXT WAVE
// =======================


function nextWave(){



wave++;



zombiesSpawned = 0;



zombiesToSpawn += 5;



waveCleared = false;



updateHUD();



}








// =======================
// DRAW
// =======================


function draw(){



ctx.clearRect(

0,

0,

canvas.width,

canvas.height

);





// SCREEN SHAKE


if(shake > 0){



ctx.translate(

Math.random()*shake-shake/2,

Math.random()*shake-shake/2

);



shake--;



}







// PLAYER


ctx.fillStyle = player.color;


ctx.beginPath();


ctx.arc(

player.x,

player.y,

player.size,

0,

Math.PI*2

);


ctx.fill();







// AIM LINE


ctx.strokeStyle="white";


ctx.beginPath();


ctx.moveTo(

player.x,

player.y

);


ctx.lineTo(

mouse.x,

mouse.y

);


ctx.stroke();








// BULLETS


ctx.fillStyle="yellow";


bullets.forEach(b=>{



ctx.beginPath();


ctx.arc(

b.x,

b.y,

b.size,

0,

Math.PI*2

);


ctx.fill();



});







// ZOMBIES


zombies.forEach(z=>{



ctx.fillStyle = z.color;



ctx.beginPath();


ctx.arc(

z.x,

z.y,

z.size,

0,

Math.PI*2

);



ctx.fill();



});








// =======================
// BOSS HP BAR
// =======================


zombies.forEach(z=>{



if(z.type === "boss"){



let barWidth = 400;


let hpPercent = z.hp / z.maxHp;



ctx.fillStyle="gray";


ctx.fillRect(

canvas.width/2-barWidth/2,

20,

barWidth,

25

);




ctx.fillStyle="red";


ctx.fillRect(

canvas.width/2-barWidth/2,

20,

barWidth*hpPercent,

25

);




ctx.fillStyle="white";


ctx.font="20px Arial";


ctx.fillText(

"BOSS",

canvas.width/2-30,

65

);



}



});






// BOSS WARNING


if(bossWarning){



ctx.fillStyle="red";


ctx.font="40px Arial";


ctx.fillText(

"⚠️ BOSS INCOMING ⚠️",

canvas.width/2-220,

canvas.height/2

);



bossWarningTimer--;



if(bossWarningTimer <= 0){


bossWarning=false;


}



}


// =======================
// SHOP UI
// =======================


if(shopOpen){


ctx.fillStyle="rgba(0,0,0,0.8)";


ctx.fillRect(

100,

50,

canvas.width-200,

canvas.height-100

);



ctx.fillStyle="white";


ctx.font="30px Arial";


ctx.fillText(

"UPGRADE SHOP",

canvas.width/2-120,

120

);



ctx.font="20px Arial";


ctx.fillText(

"Coins: "+coins,

150,

170

);



ctx.fillText(

"1. Damage +5  (50 Coins)",

150,

220

);



ctx.fillText(

"2. Health +20 (75 Coins)",

150,

260

);



ctx.fillText(

"3. Speed +1 (100 Coins)",

150,

300

);



ctx.fillText(

"4. Reload Faster (150 Coins)",

150,

340

);



ctx.fillText(

"Press B to Close",

150,

400

);



}


// RESET SHAKE


ctx.setTransform(

1,

0,

0,

1,

0,

0

);



}









// =======================
// HUD
// =======================


function updateHUD(){



document.getElementById("health").innerHTML =
Math.floor(health);



document.getElementById("kills").innerHTML =
score;



document.getElementById("coins").innerHTML =
coins;



document.getElementById("ammo").innerHTML =
ammo+" / "+maxAmmo;



document.getElementById("wave").innerHTML =
wave;



}









// =======================
// GAME OVER
// =======================


function endGame(){



gameRunning = false;



document

.getElementById("gameOver")

.classList.remove("hidden");



}




document

.getElementById("restartBtn")

.addEventListener(

"click",

()=>{


location.reload();



});









// =======================
// GAME LOOP
// =======================


function gameLoop(){



if(gameRunning){



if(!shopOpen){


movePlayer();

shoot();

updateBullets();


updateZombies();


}



draw();



}



requestAnimationFrame(gameLoop);



}







// =======================
// BOSS MINION SPAWN
// =======================


function spawnNormalMinion(){


let side = Math.floor(Math.random()*4);


let x,y;



if(side===0){

x=0;

y=Math.random()*canvas.height;

}


if(side===1){

x=canvas.width;

y=Math.random()*canvas.height;

}


if(side===2){

x=Math.random()*canvas.width;

y=0;

}


if(side===3){

x=Math.random()*canvas.width;

y=canvas.height;

}



let minion = {


type:"walker",


x:x,


y:y,


size:25,


speed:1.5,


hp:50,


color:"green"


};



zombies.push(minion);


}

// =======================
// SPAWN TIMER
// =======================


setInterval(()=>{


if(gameRunning){



if(
zombiesSpawned < zombiesToSpawn
){


spawnZombie();


zombiesSpawned++;


}




// BOSS MINIONS


if(
bossActive &&
Math.random() < 0.02
){


spawnNormalMinion();


}



}



},1200);





// =======================
// START GAME
// =======================


updateHUD();


gameLoop();
