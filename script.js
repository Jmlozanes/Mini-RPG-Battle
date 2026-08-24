const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let shake = 0;
let frame = 0;


// =======================
// PIXEL SPRITES
// =======================


const knightSprite = [

"00011000",
"00111100",
"01111110",
"00111100",
"00111100",
"01111110",
"11011011",
"00100100"

];


const goblinSprite = [

"01111110",
"11111111",
"11011011",
"11111111",
"01111110",
"00111100",
"01100110",
"11000011"

];



// =======================
// CHARACTER CLASS
// =======================


class Character {


constructor(name,hp,damage,x,y,sprite,color){

this.name=name;
this.hp=hp;
this.maxHP=hp;

this.damage=damage;

this.x=x;
this.y=y;

this.sprite=sprite;
this.color=color;


this.offset=0;

this.hit=0;

this.text="";

}



attack(target){

let dmg=
Math.floor(Math.random()*this.damage)+5;


target.takeDamage(dmg);


return dmg;

}



takeDamage(value){

this.hp-=value;


if(this.hp<0)
this.hp=0;


this.hit=10;

this.text="-"+value;

shake=10;

}



draw(){



let jump =
Math.sin(frame*0.1)*5;



drawPixel(
this.sprite,
this.x,
this.y+jump,
this.color
);



drawBar(this);



if(this.hit>0){

ctx.fillStyle="white";

ctx.globalAlpha=.5;

ctx.fillRect(
this.x-20,
this.y-20,
120,
120
);

ctx.globalAlpha=1;


this.hit--;

}


if(this.text){

ctx.fillStyle="yellow";

ctx.font="25px monospace";

ctx.fillText(
this.text,
this.x,
this.y-40
);

}


}



}



// =======================
// DRAW PIXEL
// =======================


function drawPixel(sprite,x,y,color){


let size=12;


ctx.fillStyle=color;


sprite.forEach((row,Y)=>{


row.split("").forEach((pixel,X)=>{


if(pixel==="1"){


ctx.fillRect(
x+(X*size),
y+(Y*size),
size,
size
);


}


});


});


}




function drawBar(char){


let width=150;


ctx.fillStyle="red";

ctx.fillRect(
char.x,
char.y+120,
width,
15
);



ctx.fillStyle="lime";


ctx.fillRect(

char.x,

char.y+120,

width*(char.hp/char.maxHP),

15

);


ctx.fillStyle="white";

ctx.font="18px monospace";


ctx.fillText(
char.name,
char.x,
char.y+160
);



}


// =======================
// CREATE HERO + ENEMY
// =======================


const hero =
new Character(
"Knight",
150,
30,
150,
250,
knightSprite,
"#00aaff"
);



const goblin =
new Character(
"Goblin",
120,
25,
650,
250,
goblinSprite,
"#00ff55"
);



// =======================
// GAME LOOP
// =======================


function update(){


frame++;


ctx.save();



if(shake){

ctx.translate(
Math.random()*10-5,
Math.random()*10-5
);

shake--;

}



ctx.clearRect(
0,
0,
canvas.width,
canvas.height
);



hero.draw();

goblin.draw();



ctx.restore();



requestAnimationFrame(update);


}


update();



// =======================
// ATTACK SYSTEM
// =======================


function playerAttack(){


if(goblin.hp<=0)
return;



let dmg =
hero.attack(goblin);



document.getElementById("log").innerHTML =
`
Knight attacks Goblin! <br>
Damage: ${dmg}
`;



if(goblin.hp<=0){

document.getElementById("log").innerHTML =
"🏆 Goblin defeated!";

return;

}



setTimeout(()=>{


let enemyDamage =
goblin.attack(hero);



document.getElementById("log").innerHTML +=
`
<br>
Goblin attacks! 
<br>
Damage: ${enemyDamage}
`;



},600);



}
