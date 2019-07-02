import { generateGameGrid, generateBoardObject } from './modules/generateTable';
import { createPiece, getRandomPieceStr } from './modules/generatePieces';
import { validateRows } from './modules/validateRows';
import { drawIncomingShape } from './modules/drawIncomingShape';
import { placePiece, removePreviousPieces } from './modules/placePiece';

// initialize grid and play grid object 
generateGameGrid();

// stats
var lines = 0;
var scoreBoard = document.getElementById('lines');
scoreBoard.textContent = `Lines: ${lines}`;

var menu = document.getElementById('menu');
var gameGrid = document.getElementById('gameGrid');
var columns = document.getElementsByClassName('column');

// board specs
var tableCells = document.getElementsByClassName('cell').length;
var height = document.getElementById('table').rows.length;
var rowLength = Math.ceil((tableCells / height)); // should be divisible by 10 

// captures user input 
var keyBoardCmd = '';
function logKey(e) { keyBoardCmd = e.code; }
document.addEventListener('keydown', logKey);

var currentActivePiece = createPiece(getRandomPieceStr());
var nextActivePiece = createPiece(getRandomPieceStr());

drawIncomingShape(nextActivePiece);

var moves = 0;
if (moves === 0) {
	placePiece(currentActivePiece);
}

function getLastSecondSlide(activePieceObj, keyBoardCmdStr) {
	switch (keyBoardCmdStr) {
		case 'ArrowUp':
		case 'KeyZ':
			activePieceObj.rotate();
			break;
		case 'ArrowLeft':
			activePieceObj.moveLeft();
			break;
		case 'ArrowRight':
			activePieceObj.moveRight();
			break;
		default:
	}
}

// movement function 
function pieceMovement(activePieceObj, keyBoardCmdStr) {

	switch (keyBoardCmdStr) {
		case 'ArrowDown':
			break;
		case 'ArrowUp':
		case 'KeyZ':
			activePieceObj.rotate();
			break;
		case 'ArrowLeft':
			activePieceObj.moveLeft();
			break;
		case 'ArrowRight':
			activePieceObj.moveRight();
			break;
		case 'Space':
			if (activePieceObj.disableSpaceFallMovemenet()) {
				activePieceObj.moveDown();
				placePiece(activePieceObj);
			}
			break;
		case 'Escape':
			timerBtn.click();
			break;
		default:
		// console.log('no cmd entered');
	}
	keyBoardCmd = '';

	removePreviousPieces(activePieceObj);
	getLastSecondSlide(activePieceObj, keyBoardCmd);

	// check if downward movement caused collision w/ 'fixed' piece
	if (activePieceObj.checkDownwardPieceCollision()) {
		placePiece(activePieceObj);
		let currentPieceClass = activePieceObj.model + 'Class';
		let elems = document.getElementsByClassName(currentPieceClass);
		for (var c = 0; c < elems.length; c++) {
			elems[c].classList.add('fixed');
			elems[c].style.backgroundColor = activePieceObj.color;
			elems[c].classList.remove(currentPieceClass);
			c--;
		}
		currentActivePiece = nextActivePiece;
		nextActivePiece = createPiece(getRandomPieceStr());
		drawIncomingShape(nextActivePiece);

		validateRows();
		return false;
	}

	// proceed as expected 
	activePieceObj.moveDown();
	placePiece(activePieceObj);



	// check bottom board boundary. if true, fix piece 
	if (activePieceObj.checkBottomRowBoundary()) {
		moves++;
		keyBoardCmd = '';
		validateRows();
	} else {
		currentActivePiece = nextActivePiece;
		nextActivePiece = createPiece(getRandomPieceStr());
		drawIncomingShape(nextActivePiece);
	}
}

var myVar = setInterval(function () {
	myTimer()
}, 1000);

var timeStamp;
var isPaused = false;
var btn;

function myTimer() {
	timeStamp = + new Date;
	pieceMovement(currentActivePiece, keyBoardCmd);
}

function toggleTimer() {
	if (isPaused) {
		myVar = setInterval(function () {
			myTimer()
		}, 1000);
		btn = document.getElementById('toggleGameTimer');
		isPaused = false;
		btn.value = 'Pause';
	} else {
		clearInterval(myVar);
		btn = document.getElementById('toggleGameTimer');
		isPaused = true;
		btn.value = 'Start';
	}
}

// UI buttons, rendered last 
var timerBtn = document.getElementById('toggleGameTimer');
timerBtn.addEventListener('click', function () {
	toggleTimer();
}); timerBtn.click(); // initial pause 

var startBtn = document.getElementById('start');
startBtn.addEventListener('click', function () {
	timerBtn.click();
	menu.style.display = 'none';
	gameGrid.style.display = 'block';
	columns[0].style.display = 'block';
	columns[1].style.display = 'block';
});

var quitBtn = document.getElementById('quit');
quitBtn.addEventListener('click', function () {
	menu.style.display = 'block';
	gameGrid.style.display = 'none';
	columns[0].style.display = 'none';
	columns[1].style.display = 'none';
	if (timerBtn.value === 'Pause') {
		timerBtn.click();
	} else {
		clearInterval(myVar);
	}
});
