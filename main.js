var c;
var ctx;
var bgm;
var flip;

var message;
var gameState;
var remTime;		// time to remember played pieces
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
	switch (gameState) {
		case 0:		// Game not started
		case 3:		// Lost
		case 4:		// Completed the game
			prepareStartLevel();
			init();
			break;
		case 2:	// Won
			level++;
			pieces++;
			if (pieces > Math.floor(squarePower / 2)) {		// Add more squares when more than half squares are played
				if (squareCount == Math.sqrt(bound)) prepareStartLevel();
				else {
					pieces = startPieces;		// reset the number of played squares, make the game easier
					setCount(squareCount + 1);
				}
			}
			init();
			break;
		case 1:		// Playing
			if (remTime == 0) {
				for (i = 0; i < squarePower; i++) {
					if (e.layerX >= squares[i].X && e.layerX < squares[i].X + squareWidth && e.layerY >= squares[i].Y && e.layerY < squares[i].Y + squareHeight) {
						if (squares[i].Played) {
							if (!squares[i].Clicked) playSound(flip);
							squares[i].Clicked = true;
							if (numberOfClicked() == pieces) {
								if (level == finalLevel) {
									gameState = 4
									message = "CONGRATULATION YOU COMPLETED THE GAME! Click to play again";
								}
								else {
									gameState = 2;
									message = "YOU WIN. Click to continue";
								}
							}
						}
						else {
							gameState = 3;
							message = "YOU LOSE! Click to play again";
						}
					}
				}
			}

			break;
		default:
			break;
	}
}

function playSound (sound) {
	sound.currenremTime = 0;
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

function drawMessage (msg, x, y, align) {
	ctx.textAlign = (align == null) ? "start" : align; 
	ctx.font = msgFont;
	ctx.fillStyle = msgTextColor;
	ctx.fillText(msg, x, y + msgFontSize);
	ctx.textAlign = "start";
}

function timerTick () {
	// Invalidate
	c.width = c.width;
	
	var centerX = c.width / 2;
	
	if (gameState == 0) {
		drawMessage(message, centerX, (c.height - msgFontSize) / 2, "center");
	}
	else if (gameState >= 1) {
		if (remTime > 0) remTime--;
		
		// Prepare paddings
		pX = (c.width - (squareWidth * squareCount)) / 2;
		pY = (c.height - (squareHeight * squareCount)) / 2;
		msgPad = c.width / (msgFontSize * 6);
		
		// Draw gameplay messages
		drawMessage("Level " + level, centerX, pY - (msgFontSize * 5 + msgPad), "center");
		if (remTime > 0) drawMessage("REMEMBER!", centerX, pY - (msgFontSize + msgPad), "center");
		else drawMessage("PLAY!", centerX, pY - (msgFontSize + msgPad), "center");
		
		// Draw squares
		for (i = 0; i < squarePower; i++) {
			squares[i].X = pX + squareWidth * Math.floor(i / squareCount);
			squares[i].Y = pY + squareHeight * (i % squareCount);
			
			if (remTime > 0) fillRect(squares[i].X, squares[i].Y, squareWidth, squareHeight, squares[i].Played ? squareColor : "#fff");
			else fillRect(squares[i].X, squares[i].Y, squareWidth, squareHeight, squares[i].Clicked ? squareColor : "#fff");
			drawRect(squares[i].X, squares[i].Y, squareWidth, squareHeight);
		}
		
		if (gameState >= 2) {
			// Draw result messages
			drawMessage(message, centerX, pY - (msgFontSize * 3 + msgPad), "center");
			
			if (gameState == 3) {
				// Draw unclicked squares
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

function prepareStartLevel () {
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
	
	gameState = 1;
	message = "";
	
	remTime = rememberTime;
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
		this.currenremTime = 0;
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
