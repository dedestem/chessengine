// Initialize the chess game and the chessboard
const boardElement = document.getElementById("chessboard");
const gameStatusElement = document.getElementById("game-status");

// Initialize the chess.js game object
const game = new Chess();

// Create the chessboard (same as before)
function createBoard() {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement("div");
            square.classList.add("square");
            square.dataset.row = row;
            square.dataset.col = col;
            square.addEventListener("click", handleSquareClick);
            boardElement.appendChild(square);
        }
    }
}

// Update the board based on the game state
function renderBoard() {
    const squares = boardElement.getElementsByClassName('square');
    const board = game.board();

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = squares[row * 8 + col];
            const piece = board[row][col];

            // Clear square content
            square.textContent = '';

            if (piece) {
                // Add piece symbol
                square.textContent = piece.type === 'p' ? '♙' : 
                                     piece.type === 'r' ? '♖' : 
                                     piece.type === 'n' ? '♘' : 
                                     piece.type === 'b' ? '♗' : 
                                     piece.type === 'q' ? '♕' : 
                                     piece.type === 'k' ? '♔' : '';
            }
        }
    }
}

// Handle square click
let selectedSquare = null;
function handleSquareClick(event) {
    const row = event.target.dataset.row;
    const col = event.target.dataset.col;

    if (selectedSquare) {
        const move = game.move({
            from: selectedSquare,
            to: `${String.fromCharCode(97 + col)}${8 - row}`,
            promotion: 'q'  // Always promote to queen for simplicity
        });

        renderBoard();
        if (move) {
            selectedSquare = null;
            updateGameStatus();
            setTimeout(aiMove, 500);  // Let AI make a move after the player
        } else {
            alert("Invalid Move!");
        }
    } else {
        selectedSquare = `${String.fromCharCode(97 + col)}${8 - row}`;
    }
}

// AI Move using Stockfish
function aiMove() {
    if (game.game_over()) {
        gameStatusElement.textContent = "Game Over!";
        return;
    }

    const stockfish = new Worker('https://cdnjs.cloudflare.com/ajax/libs/stockfish/11.1.0/stockfish.js');
    stockfish.postMessage("uci");

    stockfish.onmessage = function (event) {
        const message = event.data;
        if (message === "uciok") {
            stockfish.postMessage("position fen " + game.fen());
            stockfish.postMessage("go movetime 1000");
        }

        if (message.includes("bestmove")) {
            const bestMove = message.split(" ")[1];
            game.ugly_move({ from: bestMove.substring(0, 2), to: bestMove.substring(2, 4) });
            renderBoard();
            updateGameStatus();
        }
    };
}

// Update game status
function updateGameStatus() {
    if (game.game_over()) {
        gameStatusElement.textContent = "Game Over!";
    } else {
        gameStatusElement.textContent = game.turn() === 'w' ? "White's Turn" : "Black's Turn";
    }
}

// Initialize the game
createBoard();
renderBoard();
updateGameStatus();
