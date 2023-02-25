const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const isPortrait = window.innerWidth < window.innerHeight;

const bodyBackColor = "#fff";
const bodyTextColor = "#fff";
const bodyFont = "15px Segoe UI";
const canvasBackColor = "#fff";
const canvasPosition = "fixed";
const audioVisibility = "hidden";
const msgTextColor = "#000";
const msgFontSize = isMobile ? 20 : 15;
const msgFont = msgFontSize + "px Consolas";

const interval = 10;

const squareWidth = isMobile ? (window.innerWidth + window.innerHeight) / 25 : (window.innerWidth + window.innerHeight) / 40;
const squareHeight = squareWidth;
const squareColor = "#f4a460";
const remainColor = "#a4ff80";

const trialTime = 150;
const bound = 49;					// Must be sqrt-able, for example: 9, 16, 25, 36, 49, 64, 81, 100, 121, ...
const startSquares = 3;
const startPieces = 3;
const finalLevel = 5;