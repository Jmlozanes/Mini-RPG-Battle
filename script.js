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

let health = 100;

let wave = 1;

let coins = 0;



// =======================
// WEAPON SYSTEM
// =======================

let maxAmmo = 12;

let ammo = 12;

let reloading = false;

let reloadTime = 1500;



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
// INPUT
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



if(key=="r"){

reload();

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
// SHOOT
// =======================


canvas.addEventListener(
"click",
()=>{


if(!gameRunning)
return;


if(reloading)
return;


if(ammo <=0)
return;



let speed = 10;


bullets.push({

x:player.x,

y:player.y,

dx:Math.cos(player.angle)*speed,

dy:Math.sin(player.angle)*speed,

size:5


});


ammo--;


updateHUD();



});





// =======================
// PLAYER MOVEMENT
// =======================


function movePlayer(){



let moving = false;



if(keys["w"]){

player.y -= player.speed;

moving=true;

}



if(keys["s"]){

player.y += player.speed;

moving=true;

}



if(keys["a"]){

player.x -= player.speed;

moving=true;

}



if(keys["d"]){

player.x += player.speed;

moving=true;

}



// DASH

if(keys["space"] && canDash && moving){


let dx=0;

let dy=0;



if(keys["w"])
dy=-1;


if(keys["s"])
dy=1;


if(keys["a"])
dx=-1;


if(keys["d"])
dx=1;



player.x += dx * dashPower;

player.y += dy * dashPower;



canDash=false;



setTimeout(()=>{


canDash=true;


},dashCooldown);



}




// boundaries


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
// BULLETS
// =======================


function updateBullets(){


bullets.forEach((bullet,index)=>{


bullet.x += bullet.dx;

bullet.y += bullet.dy;



if(

bullet.x <0 ||

bullet.x > canvas.width ||

bullet.y <0 ||

bullet.y >canvas.height

){


bullets.splice(index,1);


}



});



}




// =======================
// SPAWN ZOMBIE
// =======================


function spawnZombie(){


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




zombies.push({


x:x,

y:y,

size:25,

speed:1.5,

hp:50


});



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





// PLAYER DAMAGE


let distance = Math.hypot(

player.x-zombie.x,

player.y-zombie.y

);



if(distance < player.size + zombie.size){


health -= 1;


updateHUD();


}




// BULLET DAMAGE


bullets.forEach((bullet,bIndex)=>{


let hit = Math.hypot(

bullet.x-zombie.x,

bullet.y-zombie.y

);



if(hit < zombie.size){



zombie.hp -= 25;


bullets.splice(bIndex,1);



if(zombie.hp <=0){



zombies.splice(index,1);


score++;

coins +=10;


updateHUD();


}



}



});



});



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


ctx.fillStyle="red";


zombies.forEach(z=>{


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



}






// =======================
// GAME LOOP
// =======================


function gameLoop(){



if(gameRunning){


movePlayer();


updateBullets();


updateZombies();


draw();


}



requestAnimationFrame(gameLoop);



}






// SPAWN TIMER


setInterval(()=>{


if(gameRunning)

spawnZombie();


},1500);





// START


updateHUD();

gameLoop();
