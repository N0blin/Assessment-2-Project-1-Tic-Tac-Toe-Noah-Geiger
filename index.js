// Setting readline
const { promises } = require('fs');
const readline = require('readline');

// Board setting up
class TicTacToe {
    constructor() {
        this.Grid = [
            [' ',' ',' '],
            [' ',' ',' '],
            [' ',' ',' ']
        ];
        this.currentPlayer = 'X';
        this.winner = null;
        this.moves = 0;
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

     }

       // Board display settings

        printBoard() {
            console.log(' 0 1 2');
            for (let i =0; i < 3; i++) {
                let row = i + ' ';
                for (let j = 0; j < 3; j++) {
                    row += this.Grid[i][j] + '';
                }
                console.log(row);
            }
        }

     // How players make their move

        playerTurn(row, col) {
            if (this.Grid[row][col] === ' ') {
                this.Grid[row][col] = this.currentPlayer;
                this.moves++;
                if (this.checkWin(row, col)){
                    this.winner = this.currentPlayer;
                }else if (this.moves === 9 ) {
                    this.winner = 'draw';
                
                }
                this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            }
        }

     // Checking if a player has won
     checkWin(row,col) {
        const player = this.Grid[row][col];

        // Check row
        if (this.Grid[row].every(cell => cell === player)) {
            return true;
        }

        // Check column
        if (this.Grid.every(row => row[col] === player)) {
            return true;
        }

        //Check diagonals
        if (row == col || row + col === 2) {
            if (this.Grid.every((row, i) => row[i] === player)) {
                return true;
            }
            if (this.Grid.every((row, i) => row[2 - i] === player)) {
                return true;
            }
        }
        
        return false;
     }


     // Play the game
     async play() {
        const self = this; // to acces 'this' inside readline callbacks
        function askQuestion(question) {
            return new Promise((resolve)=> {
                self.rl.question(question, (answer) => {
                    resolve(answer);
                });
            });
        }


        async function getInput(question) {
            let input = await askQuestion(question);
            while (isNaN(input) ||  input < 0 || input > 2) {
                console.log('Invalid input, try again');
                input = await askQuestion(question);
            }
            return parseInt(input);
        }


        async function gameLoop() {
            while (!self.winner) {
                self.printBoard();
                console.log(`Player ${self.currentPlayer}'s turn`);
                let row = await getInput('Enter row (0, 1, or 2):');
                let col = await getInput('Enter colum (0, 1, or 2):');
                self.playerTurn(row, col);
            }

            self.printBoard();
            if (self.winner === 'draw') {
                console.log('It\'s a draw!');
            } else {
                console.log(`Player ${self.winner} wins!`);
            }

            const restart = await askQuestion('Do you want to play again? (yes/no): ');
            if (restart.toLowerCase().trim() === 'yes') {
                self.reset();
                await gameLoop();        
            } else {
            self.rl.close();
            }
        }

        await gameLoop();
     }    

     reset() {
        this.Grid =[
            [' ', ' ', ' '],
            [' ', ' ', ' '],
            [' ', ' ', ' ']
        ];
        this.currentPlayer = 'X';
        this.winner = null;
        this.moves = 0;
     }
}

const game = new TicTacToe();
game.play();