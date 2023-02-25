var c;
var ctx;
var bgm;
var flip;

var message;
var gameState;	// 0. not started, 1. playing, 2. win, 3. lose, 4. completed
var tTime;		// trial time, time to remember the pieces
var level;
var pieces;
var squares;
var squareCount;
var squarePower;

var pX;
var pY;
var msgPad;

function resizeCanvas () {
	c.width = window.innerWidth;
	c.height = window.innerHeight;
}

function onMouseDown (e) {
	if (gameState == 0) {
		prepareStartLevel();
		init();
	}
	else if (gameState == 1) {
		// Read clicks only when trial time ended
		if (tTime == 0) {
			for (i = 0; i < squarePower; i++) {
				if (e.layerX >= squares[i].X && e.layerX < squares[i].X + squareWidth && e.layerY >= squares[i].Y && e.layerY < squares[i].Y + squareHeight) {
					if (squares[i].Played) {
						if (!squares[i].Clicked) playSound(flip);
						squares[i].Clicked = true;
						if (numberOfClicked() == pieces) {
							if (level == finalLevel) {
								gameState = 4
								message = "CONGRATULATION YOU COMPLETED THE GAME! Click to play again.";
							}
							else {
								gameState = 2;
								message = "YOU WIN. Click to continue.";
							}
						}
					}
					else {
						gameState = 3;
						message = "YOU LOSE! Click to play again.";
					}
				}
			}
		}
	}
	else if (gameState == 2) {
		level++;
		pieces++;
		// Add more squares when more than half squares are played
		if (pieces > Math.floor(squarePower / 2)) {
			if (squareCount == Math.sqrt(bound)) prepareStartLevel();
			else {
				pieces = startPieces;	// reset the number of played squares, make the game easier
				setCount(squareCount + 1);
			}
		}
		
		init();
	}
	else if (gameState == 3) {
		prepareStartLevel();
		init();
	}
	else if (gameState == 4) {
		prepareStartLevel();
		init();
	}
}

function playSound (sound) {
	sound.currentTime = 0;
	sound.play();
}

function fillRect (x, y, w, h, s) {
	ctx.fillStyle = s == null ? "#fff" : s;
	ctx.fillRect(x, y, w, h);
}

function drawRect (x, y, w, h, s) {
	ctx.strokeStyle = (s == null) ? "#000" : s;
	ctx.strokeRect(x, y, w, h);
	ctx.stroke();
}

function drawMessage (msg, x, y) {
	ctx.font = msgFont;
	ctx.fillStyle = msgTextColor;
	ctx.fillText(msg, x, y + msgFontSize);
}

function timerTick () {
	// Invalidate
	c.width = c.width;
	
	if (gameState == 0) {
		drawMessage(message, (c.width - (message.length * 8)) / 2, (c.height - msgFontSize) / 2);
	}
	else if (gameState >= 1) {
		if (tTime > 0) tTime--;
		
		// Prepare paddings
		pX = (c.width - (squareWidth * squareCount)) / 2;
		pY = (c.height - (squareHeight * squareCount)) / 2;
		msgPad = c.width / (msgFontSize * 6);
		
		// Draw gameplay messages
		drawMessage("Level " + level, pX, pY - (msgFontSize * 5 + msgPad));
		if (tTime > 0) drawMessage("REMEMBER!", pX, pY - (msgFontSize + msgPad));
		else drawMessage("PLAY!", pX, pY - (msgFontSize + msgPad));
		
		// Draw squares
		for (i = 0; i < squarePower; i++) {
			squares[i].X = pX + squareWidth * Math.floor(i / squareCount);
			squares[i].Y = pY + squareHeight * (i % squareCount);
			
			if (tTime > 0) fillRect(squares[i].X, squares[i].Y, squareWidth, squareHeight, squares[i].Played ? squareColor : "#fff");
			else fillRect(squares[i].X, squares[i].Y, squareWidth, squareHeight, squares[i].Clicked ? squareColor : "#fff");
			drawRect(squares[i].X, squares[i].Y, squareWidth, squareHeight);
		}
		
		if (gameState >= 2) {
			drawMessage(message, pX, pY - (msgFontSize * 3 + msgPad));
			
			if (gameState == 3) {
				for (j = 0; j < squarePower; j++) {
					if (squares[j].Played && !squares[j].Clicked) {
						squares[j].X = pX + squareWidth * Math.floor(j / squareCount);
						squares[j].Y = pY + squareHeight * (j % squareCount);
						
						fillRect(squares[j].X, squares[j].Y, squareWidth, squareHeight, remainColor);
						drawRect(squares[j].X, squares[j].Y, squareWidth, squareHeight);
					}
				}
			}
		}
	}
}

function setCount (x) {
	squareCount = x;
	squarePower = x * x;
}

function numberOfPlayed () {
	var n = 0;
	for (i = 0; i < squarePower; i++) if (squares[i].Played) n++;
	return n;
}

function numberOfClicked () {
	var n = 0;
	for (i = 0; i < squarePower; i++) if (squares[i].Clicked) n++;
	return n;
}

function prepareStartLevel() {
	level = 1;
	pieces = startPieces;
	setCount(startSquares);
	playSound(bgm);
}

function init () {
	// Initialize squares
	for (i = 0; i < squarePower; i++) squares[i].Played = squares[i].Clicked = false;
	
	// Randomly pick played squares
	while (numberOfPlayed() < pieces) {
		indx = Math.floor(Math.random() * squarePower);
		if (!squares[indx].Played) squares[indx].Played = true;
	}
	
	message = "";
	
	gameState = 1;
	tTime = trialTime;
	playSound(flip);
}

window.onload = function () {
	window.onresize = resizeCanvas;
	
	// Prepare body
	document.body.style.background = bodyBackColor;
	document.body.style.color = bodyTextColor;
	document.body.style.font = bodyFont;
	
	// Prepare canvas
	c = document.getElementById("myCanvas");
	c.style.background = canvasBackColor;
	c.style.position = canvasPosition;
	resizeCanvas();
	c.style.left = (window.innerWidth - c.width) / 2;
	c.style.top = (window.innerHeight - c.height) / 2;
	c.onmousedown = onMouseDown;
	ctx = c.getContext("2d");
	
	// Prepare soundtrack
	bgm = document.getElementById("myAudio");
	bgm.style.visibility = audioVisibility;
	bgm.addEventListener('ended', function() {
		this.currentTime = 0;
		this.play();
	}, false);
	
	// Prepare flip sound effect
	flip = document.getElementById("mySound");
	flip.style.visibility = audioVisibility;
	
	// Prepare squares
	squares = new Array(bound);
	for (i = 0; i < bound; i++) squares[i] = new Object;
	
	gameState = 0;
	message = "CLICK TO START PLAYING";
	
	setInterval(timerTick, interval);
}
