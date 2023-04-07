const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const isPortrait = window.innerWidth < window.innerHeight;

const interval = 10;
const squareWidth = isMobile ? (window.innerWidth + window.innerHeight) / 25 : (window.innerWidth + window.innerHeight) / 40;
const squareHeight = squareWidth;
const squareColor = "#f4a460";
const remainColor = "#a4ff80";
const rememberTime = 150;
const bound = 49;		// Must be sqrt-able, for example: 9, 16, 25, 36, 49, 64, 81, 100, 121, ...
const startSquares = 3;
const startPieces = 3;
const finalLevel = 18;

// Body
const bodyMargin = "0";
const bodyBackColor = "#fff";
const bodyTextColor = "#fff";
const bodyFont = "15px Segoe UI";

// Canvas
const canvasBackColor = "#fff";
const canvasPosition = "fixed";

// Sound
const audioVisibility = "hidden";

// Message
const msgTextColor = "#000";
const msgFontSize = isMobile ? 20 : 15;
const msgFont = msgFontSize + "px Consolas";
