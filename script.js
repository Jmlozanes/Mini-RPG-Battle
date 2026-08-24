const canvas =
document.getElementById("gameCanvas");


const ctx =
canvas.getContext("2d");


// ==========================
// PIXEL SPRITES
// ==========================


const knightSprite = [

"000011110000",
"000111111000",
"001111111100",
"001110011100",
"111111111111",
"011111111110",
"001111111100",
"001100110011",
"011000110110",
"110000000011"

];


const goblinSprite = [

"000111111000",
"011111111110",
"111011101111",
"111111111111",
"111001001111",
"011111111110",
"001111111100",
"011001100110",
"110000000011"

];



// ==========================
// DRAW SPRITE ENGINE
// ==========================


function drawSprite(sprite,x,y,color){


let size = 12;


ctx.fillStyle=color;



sprite.forEach((row,rowIndex)=>{


row.split("").forEach((pixel,columnIndex)=>{


if(pixel==="1"){


ctx.fillRect(

x + columnIndex * size,

y + rowIndex * size,

size,

size

);


}



});


});


}





// ==========================
// CHARACTER OBJECT
// ==========================


class Character{


constructor(name,x,y,sprite,color,hp){


this.name=name;

this.x=x;

this.y=y;

this.sprite=sprite;

this.color=color;

this.hp=hp;

this.maxHP=hp;


this.float=0;


}



draw(){


let movement =
Math.sin(Date.now()/300)*5;



drawSprite(

this.sprite,

this.x,

this.y+movement,

this.color

);



this.drawHP();


}



drawHP(){


ctx.fillStyle="red";


ctx.fillRect(

this.x,

this.y+130,

150,

15

);



ctx.fillStyle="lime";


ctx.fillRect(

this.x,

this.y+130,

150*(this.hp/this.maxHP),

15

);



ctx.fillStyle="white";


ctx.font="18px monospace";


ctx.fillText(

this.name,

this.x,

this.y+170

);



}


}



// ==========================
// CREATE CHARACTERS
// ==========================


const knight = new Character(
"Knight",
150,
170,
knightSprite,
"#2196ff",
150
);



const goblin = new Character(
"Goblin",
650,
170,
goblinSprite,
"#4cff4c",
120
);





// ==========================
// GAME LOOP
// ==========================


function gameLoop(){



ctx.clearRect(

0,

0,

canvas.width,

canvas.height

);



knight.draw();


goblin.draw();



requestAnimationFrame(gameLoop);


}


gameLoop();





// ==========================
// ATTACK
// ==========================


function attack(){


let damage =
Math.floor(Math.random()*20)+10;



goblin.hp -= damage;



document.getElementById("log")
.innerHTML =

`
⚔ Knight attacks Goblin!
<br>
Damage: ${damage}
`;



if(goblin.hp<=0){

goblin.hp=0;


document.getElementById("log")
.innerHTML=

"🏆 Goblin defeated!";

}


}
