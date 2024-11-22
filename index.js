// Get the chessboard div
const chessboard = document.getElementById("chessboard");

// Function to create the chessboard
function createBoard() {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement("div");
            square.classList.add("square");

            // Add piece (just for illustration, you can add pieces later)
            if (row === 0 || row === 1 || row === 6 || row === 7) {
                square.textContent = (row === 0 || row === 7) ? "♖" : "♙"; // Add pieces
            }

            // Set a data attribute to track the position
            square.dataset.row = row;
            square.dataset.col = col;

            // Add event listener for clicking
            square.addEventListener("click", handleSquareClick);

            // Add the square to the chessboard
            chessboard.appendChild(square);
        }
    }
}

// Function to handle the square click
function handleSquareClick(event) {
    const square = event.target;
    const row = square.dataset.row;
    const col = square.dataset.col;

    alert(`You clicked on row ${row}, column ${col}`);
}

// Create the chessboard
createBoard();
