/* Name:	utils.js
 * Purpose:	game code for ../ShadowOfTheSamurai/index.html
 * Author:	Michael Root
 * Date:	2023.11.23
*/

alert("Use arrows to move, press d to swing sword");
var counter = 0;
var xMove = 0.0;
var yMove = 0.0;
var xMoveEnemy = 4;
var yMoveEnemy = -4;
var directionFacing = 1;
var bullet_timer = 0;
var bullet_timer_enemy = 0;
var jump_timer = 0;
var duck_timer = 0;
var myGamePiece;
var enemyGamePiece;
var yPlayer = 200;
var yEnemy = 200;
var xBlood = 0;
var enemyMoveDelay = 4;
var musicPlaying = 0;
var bloodTimer = 0;
var descentTimer = 0;
// CLASS UNDER CONSTRUCTION ////////////////////////////////////////////////////////////
class Samurai
{
	constructor(xPos) {
		this.xPos = xPos;
		this.xSpeed = 2;
		this.timer = 0;
	}

	update() {
		this.xPos += this.xSpeed;
	}
}
var yow = new Samurai(100);
yow.update();
///////////////////////////////////////////////////////////////////

var backgroundMuzak3 = new Audio('Audio/swoosh.mp3');
backgroundMuzak3.volume = 0.25;
backgroundMuzak3.load();

var backgroundMuzak33 = new Audio('Audio/swoosh.mp3');
backgroundMuzak33.volume = 0.25;
backgroundMuzak33.load();

var backgroundMuzak4 = new Audio('Audio/jump.mp3');
backgroundMuzak4.volume = 0.2;
backgroundMuzak4.load();

var clashMuzak = new Audio('Audio/clash.mp3');
clashMuzak.volume = 0.3;
clashMuzak.load();

var explosion = new Audio('Audio/explosion.mp3');
explosion.volume = 0.4;
explosion.load();



let touchStartX, touchStartY, touchEndX, touchEndY;
const touchArea = document.getElementById('touchArea');
document.addEventListener('touchmove', (e) => {
    e.preventDefault();
});

touchArea.addEventListener('touchstart', (e) => {
	touchStartX = e.touches[0].clientX;
	touchStartY = e.touches[0].clientY;
});

touchArea.addEventListener('touchmove', (e) => {
	e.preventDefault(); // prevent scrolling
});

touchArea.addEventListener('touchend', (e) => {
	touchEndX = e.changedTouches[0].clientX;
	touchEndY = e.changedTouches[0].clientY;

	const distanceX = touchEndX - touchStartX;
	const distanceY = touchEndY - touchStartY;

	const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

	console.log(`Distance: ${distance}px`);
});


function swingSword() {
	if (bullet_timer < 0) {
		bullet_timer = 240;
		backgroundMuzak3.play();
	}
}

window.addEventListener("keydown", function (event) {
	musicPlaying += 1;
	if (event.defaultPrevented) {
		return;
	}
	if (musicPlaying <= 2) {
		if (musicPlaying == 1) {
			var backgroundMuzak2 = new Audio('Audio/muzak.mp3');
			backgroundMuzak2.volume = 0.5;
			backgroundMuzak2.load();
			backgroundMuzak2.play();
		}
	}
	switch (event.key) {
		case "ArrowLeft":
			xMove += -4;
			break;
		case "ArrowRight":
			xMove += 4;
			break;
		case "d":
			bullet_timer = 300;
			break;
		case "ArrowUp":
			if (jump_timer <= 0) {
				jump_timer = 80;
			}
			break;
		case "ArrowDown":
			if (duck_timer < 0)
				duck_timer = 60;
			break;
		default:
			return;
	}
	if (xMove > 12) {xMove = 12;} else if (xMove < -12) {xMove = -12;}
	event.preventDefault();
}, true); // end add event listener

function startGame() {
	document.getElementById("loading").style.visibility = "hidden";
	document.getElementById("instructions").style.visibility = "hidden";
	myGamePiece = new component(15,9, "yellow", 500, yPlayer, "playa", 0);
	enemyGamePiece = new component(10,10, "yellow", 900, yEnemy, "enemy", -1);
	myGameArea.start();
}

var myGameArea = {
	canvas : document.getElementById("myCanvas"),
	start : function() {
		this.canvas.width = 1200;
		this.canvas.height = 400;
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.frameNo = 0;
		this.interval = setInterval(updateGameArea, 50);
	},
	clear : function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}

var image0  = new Image();
var image1  = new Image();
var image2  = new Image();
var image3  = new Image();
var image0a = new Image();
var image1a = new Image();
var image2a = new Image();
var image3a = new Image();
var image4  = new Image();
var image4a = new Image();
var image5  = new Image();
var image5a = new Image();
var imageBody  = new Image();
var imageBodya = new Image();

var bloodImage = new Image();
var bloodImagea = new Image();

image0.src  = 'Images/fighter0.png';
image1.src  = 'Images/fighter3.png';
image2.src  = 'Images/fighter1.png';
image3.src  = 'Images/fighter2.png';
image0a.src = 'Images/fighter0a.png';
image1a.src = 'Images/fighter3a.png';
image2a.src = 'Images/fighter1a.png';
image3a.src = 'Images/fighter2a.png';
image4.src  = 'Images/fighter4.png';
image4a.src = 'Images/fighter4a.png';
image5.src  = 'Images/fighter5.png';
image5a.src = 'Images/fighter5a.png';
imageBody.src  = 'Images/deathBlow.png';
imageBodya.src = 'Images/deathBlowa.png';
bloodImage.src = 'Images/death.png';
bloodImagea.src = 'Images/deatha.png';
var backgroundMuzak4 = new Audio('Audio/swoosh.mp3');


function component(width, height, color, x, y, type, speedo) {
	this.type = type;
	this.width = width;
	this.height = height;
	this.speedX = 0;
	this.speedY = 0;
	this.x = x;
	this.y = 200;
	this.speedo = speedo;
	this.lastDirection = 1;
	this.update = function() {
		ctx = myGameArea.context;

		counter += 1;
		if (this.type == "playa") {
			if (bloodTimer <= 40)
				directionFacing = enemyGamePiece.x < myGamePiece.x ? -1 : 1;
			// DO JUMP STUFF HERE...
			var q = 0;
			yPlayer = 200;
			if (jump_timer > 0) {
				jumpX = jump_timer / 40 - 1;
				var theta = Math.acos(jumpX);
				var h = Math.sin(theta);
				yPlayer -= h * 80;
			}

			// CHECK IF IS SWINGING SWORD...
			if (bullet_timer > 0) {
				if (bullet_timer > 250) {
					if (bullet_timer_enemy > 0) {
						//clashMuzak.load();
						clashMuzak.play();
					}
					ctx.drawImage(directionFacing >= 0 ? image5 : image5a, this.x-30, yPlayer-8);
				}
				else if (bullet_timer > 200) {
					ctx.drawImage(directionFacing >= 0 ? image2 : image2a, this.x-30, yPlayer);
				}
				else if (bullet_timer > 150) {
					ctx.drawImage(directionFacing >= 0 ? image4 : image4a, this.x-30, yPlayer);
					backgroundMuzak3.load();
					backgroundMuzak3.play();
					// EXPERIMENTAL
					xMove = 0;
				}
				else if (bullet_timer > 100) {
					ctx.drawImage(directionFacing >= 0 ? image3 : image3a, this.x-30, yPlayer);
				}
				else if (bullet_timer > 50) {
					ctx.drawImage(directionFacing >= 0 ? image1 : image1a, this.x-30, yPlayer);
				}
				else {
					ctx.drawImage(directionFacing >= 0 ? image2 : image2a, this.x-30, yPlayer);
				}
			}
			else if (duck_timer > 0) {
				ctx.drawImage(directionFacing >= 0 ? image5 : image5a, this.x-30, yPlayer-10);
			}
			else {
				ctx.drawImage(directionFacing >= 0 ? image0 : image0a, this.x-30, yPlayer);
			}

			// splatter blood if attack in range
			if (bloodTimer > 0) {
				ctx.drawImage((xMoveEnemy > 0) ? imageBody : imageBodya, xBlood - 30, 200);
				ctx.drawImage((xMoveEnemy < 0) ? bloodImage : bloodImagea, xBlood - 30, 200);
			}
		}
		else if (this.type == "enemy")
		{
			if (descentTimer >= 0) {
				yEnemy = 200 - descentTimer;
			}
			if (bullet_timer_enemy > -60) {
				if (bullet_timer_enemy > 180) {
					ctx.drawImage(xMoveEnemy >= 0 ? image2a : image2, this.x-30, yEnemy);
				}
				else if (bullet_timer_enemy > 145) {
					ctx.drawImage(xMoveEnemy >= 0 ? image4a : image4, this.x-30, yEnemy);
				}
				else if (bullet_timer_enemy > 110) {
					ctx.drawImage(xMoveEnemy >= 0 ? image3a : image3, this.x-30, yEnemy);
					backgroundMuzak33.load();
					backgroundMuzak33.play();
				}
				else if (bullet_timer_enemy > 40) {
					ctx.drawImage(xMoveEnemy >= 0 ? image1a : image1, this.x-30, yEnemy);
				}
				else {
					ctx.drawImage(xMoveEnemy >= 0 ? image2a : image2, this.x-30, yEnemy);
				}
			}
			// enemy swings sword if in range
			else if (Math.abs(myGamePiece.x - enemyGamePiece.x) < 60 ) {
				ctx.drawImage(myGamePiece.x < enemyGamePiece.x ? image2a : image2, this.x-30, yEnemy);
				bullet_timer_enemy = 220;
			}
			// enemy readies sword if getting close
			else if (Math.abs(myGamePiece.x - enemyGamePiece.x) < 200 ) {
				// Enemy raises sword when within range
				ctx.drawImage(myGamePiece.x < enemyGamePiece.x ? image2a : image2, this.x-30, yEnemy);
			}
			else {
				ctx.drawImage(myGamePiece.x < enemyGamePiece.x ? image0a : image0, this.x-30, yEnemy);
			}
		}

		this.lastDirection = xMove;
	}

	this.newPos = function() {
		if (this.type == "playa") {
			this.x += xMove;

			// ensure that player cannot "walk through" opponent, but can jump over
			if (xMove <= 0 && enemyGamePiece.x < this.x && enemyGamePiece.x - this.x > -8 && jump_timer <= 0)
				xMove = 0;
			else if (xMove > 0 && enemyGamePiece.x > this.x && enemyGamePiece.x - this.x < 8 && jump_timer <= 0)
				xMove = 0;


			if (this.x > (myGameArea.canvas.width - 20) || this.x < 20){xMove = -xMove;}

			if (this.x > (myGameArea.canvas.width - 20)) this.x = myGameArea.canvas.width - 20;
			if (this.x < 20) this.x = 20;


		}
		else if (this.type == "enemy") {
			this.x += (descentTimer <= 0) ? xMoveEnemy : 0;
			if (this.x > (myGameArea.canvas.width - 20) || this.x < 30){xMoveEnemy = -xMoveEnemy;}
			if (this.x > (myGameArea.canvas.width - 20)) this.x = myGameArea.canvas.width-20;
			else if (this.x < 20) this.x = 20;
		}
	}
} // end function component()


function updateGameArea() {
	// future improve: do we really need to update entire canvas?
	myGameArea.clear();

	const canvas = document.getElementById("myCanvas");
	const ctx = canvas.getContext("2d");

	const grd1 = ctx.createRadialGradient(100, 75, 5, 90, 60, 100);
	grd1.addColorStop(0, "red");
	grd1.addColorStop(1, "orange");
	ctx.beginPath();
	ctx.arc(100, 75, 50, 0, 2 * Math.PI);
	ctx.fillStyle = grd1;
	ctx.fill();


	const grd = ctx.createLinearGradient(0, 0, 0, 57);
	grd.addColorStop(0, "rgb(30,30,30)");
	grd.addColorStop(1, "rgba(150,150,150,0)");
	ctx.fillStyle = grd;
	ctx.fillRect(0, 0, 1200, 75);


	const grd3 = ctx.createLinearGradient(0, 260, 0, 400);
	grd3.addColorStop(0, "rgb(140, 130, 120)");
	grd3.addColorStop(1, "rgb(30, 30, 30)");
	ctx.fillStyle = grd3;
	ctx.fillRect(0, 260, 1200, 140);


	everyinterval();
	myGamePiece.newPos();
	myGamePiece.update();
	enemyGamePiece.newPos();
	enemyGamePiece.update();


	// Enemy ~always moves towards player
	var dist = Math.abs(myGamePiece.x - enemyGamePiece.x);
	// Enemy runs if far away, walks as gets closer, and stands still if in range
	if (myGamePiece.x > enemyGamePiece.x) {
		xMoveEnemy = dist / 25 - 7;
	} else {
		xMoveEnemy = -dist / 25 + 7;
	}

	// Sprinkle blood if enemy in range and sword is swinging
	if (checkIfKill()) {
		bloodTimer = 100;
		xBlood = enemyGamePiece.x;
		//REM: var random_boolean = Math.random() < 0.5;
		// Respawn enemy at opposite side of screen
		enemyGamePiece.x = (myGamePiece.x < 600) ? 1150 : 50;
		bulletTimerEnemy = 0;
	}
} // end function updateGameArea()


function checkIfKill() {
//	if (Math.abs(myGamePiece.x - enemyGamePiece.x) < 47 && bullet_timer > 100 && bullet_timer_enemy < -20) {
	if (Math.abs(myGamePiece.x - enemyGamePiece.x) < 35 && bullet_timer > 120 && bullet_timer < 170 && bullet_timer_enemy < 90 && yPlayer > 170) {
		descentTimer = 230;
		explosion.play();
		return true;
	}
}


function everyinterval(n) {
//	if (descentTimer <= 0) {
		bullet_timer -= 19;
		bullet_timer_enemy -= 19;
		jump_timer -= 7;
		duck_timer -= 4;
		bloodTimer -= 2;
//	}
	descentTimer -= 10;
	return false;
}

