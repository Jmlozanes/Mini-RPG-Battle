const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


// =========================
// CHARACTER SYSTEM
// =========================


class Character {


    constructor(name, hp, attack, x, y, color){

        this.name = name;
        this.hp = hp;
        this.maxHP = hp;
        this.attackPower = attack;

        this.x = x;
        this.y = y;

        this.color = color;

        this.damageText = "";
        this.damageTimer = 0;

    }



    attack(target){

        let damage = 
        Math.floor(Math.random() * this.attackPower) + 5;


        target.takeDamage(damage);


        return damage;

    }



    takeDamage(amount){

        this.hp -= amount;


        if(this.hp < 0){
            this.hp = 0;
        }


        this.damageText = "-" + amount;
        this.damageTimer = 40;

    }



    draw(){


        // BODY PIXEL CHARACTER

        ctx.fillStyle = this.color;


        ctx.fillRect(
            this.x,
            this.y,
            50,
            50
        );


        // HEAD

        ctx.fillStyle = "#FFD28A";

        ctx.fillRect(
            this.x + 10,
            this.y - 25,
            30,
            25
        );



        // HP BAR

        ctx.fillStyle = "red";

        ctx.fillRect(
            this.x,
            this.y + 70,
            120,
            15
        );


        ctx.fillStyle = "lime";

        ctx.fillRect(
            this.x,
            this.y + 70,
            120 * (this.hp / this.maxHP),
            15
        );



        ctx.fillStyle="white";

        ctx.fillText(
            this.name,
            this.x,
            this.y + 110
        );



        // DAMAGE POPUP

        if(this.damageTimer > 0){

            ctx.fillStyle="yellow";

            ctx.font="25px Arial";

            ctx.fillText(
                this.damageText,
                this.x + 30,
                this.y - 40
            );


            this.damageTimer--;

        }


    }


}



// =========================
// CREATE CHARACTERS
// =========================


const hero = new Character(
    "Knight",
    150,
    30,
    120,
    220,
    "blue"
);



const enemy = new Character(
    "Goblin",
    100,
    20,
    600,
    220,
    "green"
);



// =========================
// GAME LOOP
// =========================


function gameLoop(){


    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );



    hero.draw();

    enemy.draw();



    requestAnimationFrame(gameLoop);

}


gameLoop();



// =========================
// BATTLE SYSTEM
// =========================


function playerAttack(){


    if(enemy.hp <= 0){
        return;
    }


    let damage = hero.attack(enemy);


    document.getElementById("battleLog").innerHTML =
    `${hero.name} attacked ${enemy.name}! Damage: ${damage}`;



    if(enemy.hp <= 0){

        document.getElementById("battleLog").innerHTML =
        "🎉 Goblin defeated!";

        return;

    }



    setTimeout(()=>{


        let enemyDamage = enemy.attack(hero);



        document.getElementById("battleLog").innerHTML +=
        `<br>${enemy.name} attacked you! Damage: ${enemyDamage}`;



        if(hero.hp <= 0){

            document.getElementById("battleLog").innerHTML =
            "💀 You have been defeated!";

        }



    },700);



}
