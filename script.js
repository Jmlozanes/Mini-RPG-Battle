let heroHP = 100;
let enemyHP = 100;


function attack(){

    // Hero attack
    let damage = Math.floor(Math.random() * 20) + 1;

    enemyHP -= damage;


    document.getElementById("log").innerHTML =
    "Hero attacked Goblin! Damage: " + damage;


    updateHealth();


    // Check kung patay ang enemy
    if(enemyHP <= 0){

        enemyHP = 0;

        document.getElementById("log").innerHTML =
        "🎉 You defeated the Goblin!";

        return;
    }



    // Enemy counter attack

    let enemyDamage = Math.floor(Math.random() * 15) + 1;

    heroHP -= enemyDamage;


    document.getElementById("log").innerHTML +=
    "<br>Goblin attacked you! Damage: " + enemyDamage;



    updateHealth();



    if(heroHP <= 0){

        heroHP = 0;

        document.getElementById("log").innerHTML =
        "💀 You were defeated!";

    }


}



function updateHealth(){


    document.getElementById("enemyHP").style.width =
    enemyHP + "%";


    document.getElementById("heroHP").style.width =
    heroHP + "%";


    document.getElementById("enemyHealthText").innerHTML =
    "HP: " + enemyHP;


    document.getElementById("heroHealthText").innerHTML =
    "HP: " + heroHP;


}
