const canvas = document.getElementById('memoryCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const restartButton = document.getElementById('restart-button');

const BASE_EMOJIS = ['❤️', '✨', '✅', '😂', '⭐', '🌼'];
const NUM_PAIRS = BASE_EMOJIS.length; 

const COLS = 4;
const ROWS = 3;
const TILE_WIDTH = canvas.width / COLS;
const TILE_HEIGHT = canvas.height / ROWS;

let tiles = []; 
let flippedTiles = []; 
let score = 0;
let lockBoard = false;

function initializeTiles() {
    let allEmojis = [...BASE_EMOJIS, ...BASE_EMOJIS];
    
    for (let i = allEmojis.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allEmojis[i], allEmojis[j]] = [allEmojis[j], allEmojis[i]];
    }

    tiles = [];
    for (let i = 0; i < allEmojis.length; i++) {
        const col = i % COLS;
        const row = Math.floor(i / COLS);

        tiles.push({
            emoji: allEmojis[i],
            isFlipped: false,
            isMatched: false,
            x: col * TILE_WIDTH,
            y: row * TILE_HEIGHT,
            width: TILE_WIDTH,
            height: TILE_HEIGHT
        });
    }
}

function drawTile(tile) {
    const { x, y, width, height, isFlipped, emoji, isMatched } = tile;

    ctx.fillStyle = isMatched ? '#28a745' : '#007bff';
    ctx.fillRect(x, y, width - 2, height - 2);

    if (isFlipped || isMatched) {
        ctx.fillStyle = 'white';
        ctx.font = `${Math.min(width, height) * 0.5}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(emoji, x + width / 2, y + height / 2);
    } else {
        ctx.fillStyle = '#0056b3';
        ctx.fillRect(x, y, width - 2, height - 2);

        ctx.fillStyle = 'white';
        ctx.font = `${Math.min(width, height) * 0.4}px Arial`;
        ctx.fillText('?', x + width / 2, y + height / 2);
    }
    ctx.strokeStyle = '#003366';
    ctx.strokeRect(x, y, width - 2, height - 2);
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    tiles.forEach(drawTile);

    scoreElement.textContent = score;
}

function getTileByCoords(mouseX, mouseY) {
    const col = Math.floor(mouseX / TILE_WIDTH);
    const row = Math.floor(mouseY / TILE_HEIGHT);
    const index = row * COLS + col;

    if (index >= 0 && index < tiles.length) {
        return tiles[index];
    }
    return null;
}

function handleCanvasClick(event) {
    if (lockBoard) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const tile = getTileByCoords(mouseX, mouseY);

    if (tile && !tile.isFlipped && !tile.isMatched) {
        tile.isFlipped = true;
        flippedTiles.push(tile);
        drawGame(); 
        if (flippedTiles.length === 1) {
            return;
        }

        if (flippedTiles.length === 2) {
            lockBoard = true; 
            checkForMatch();
        }
    }
}

function checkForMatch() {
    const [tile1, tile2] = flippedTiles;

    if (tile1.emoji === tile2.emoji) {
        tile1.isMatched = true;
        tile2.isMatched = true;
        score++;
        
        resetFlippedTiles();
        
        if (score === NUM_PAIRS) {
            setTimeout(showGameOver, 500);
        }

    } else {
        setTimeout(() => {
            tile1.isFlipped = false;
            tile2.isFlipped = false;
            resetFlippedTiles();
            drawGame(); 
        }, 1000); 
    }
}

function resetFlippedTiles() {
    flippedTiles = [];
    lockBoard = false;
}


function showGameOver() {
    alert(`Parabéns! Você encontrou todos os ${NUM_PAIRS} pares!`);
}


function startGame() {
    score = 0;
    flippedTiles = [];
    lockBoard = false;
    initializeTiles();
    drawGame();
}


canvas.addEventListener('click', handleCanvasClick);
restartButton.addEventListener('click', startGame);

startGame();