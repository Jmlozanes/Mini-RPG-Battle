let playerHP = 150;
let enemyHP = 120;


function attack(){


let damage =
Math.floor(Math.random()*20)+10;


enemyHP -= damage;



document.getElementById("enemyHP")
.style.width =
(enemyHP/120)*100+"%";



document.getElementById("enemyText")
.innerHTML =
"HP "+enemyHP+" / 120";



document.getElementById("log")
.innerHTML =
"⚔ Knight attacks Goblin! Damage: "
+damage;




if(enemyHP <=0){

document.getElementById("log")
.innerHTML =
"🏆 Goblin defeated!";

return;

}





setTimeout(()=>{


let enemyDamage =
Math.floor(Math.random()*15)+5;


playerHP -= enemyDamage;



document.getElementById("playerHP")
.style.width =
(playerHP/150)*100+"%";



document.getElementById("playerText")
.innerHTML =
"HP "+playerHP+" / 150";



document.getElementById("log")
.innerHTML +=
"<br>👹 Goblin attacks! Damage: "
+enemyDamage;



},800);



}
