// Player object constructor.
let Player = (sign, position) => {
    this.sign = sign;
    this.position = position;
    
    this.addWin = () => {
        wins[position]++;
        scoreElement[position].textContent = `${wins[position]}`;
    }
    
    return {
        addWin, 
        sign,
    };
}

// DOM variables.
let squareElement = document.querySelectorAll(".square");
let playerElement = document.querySelectorAll(".player");
let scoreElement = document.querySelectorAll(".score");

// Player control variables.
let players = [Player("X", 0), Player("O", 1)];
let wins = [0, 0];

// Board Module
let Board = (() => {
    let squares; 

    let checkWin = (sqr) => {
        let coord = makeCoord(sqr);
        let currentSign = squareElement[sqr].textContent;
        let hmatches = 0, vmatches = 0, dmatches1 = 0, dmatches2 = 0,
            x = coord[0], y = coord[1];

        for(let i = -2; i <= 2; i++)
        {
            if(i == 0)
            continue;

            // Vertical Case - Checking by increasing and decreasing x component
            if(validSquare(x+i, y) && squareElement[(3 * (x+i)) + y].textContent == currentSign)
            vmatches++;

            // Horizontal Case - Checking by increasing and decreasing y component
            if(validSquare(x, y+i) && squareElement[(3 * x) + y+i].textContent == currentSign)
            hmatches++;
            
            // If, in any case, 2 squares have the same sign as current won. Game is won.
            if(hmatches == 2 || vmatches == 2)
            return true;
        }

        // Diagonal Case - Checking by increasing and decreasing x and y components.
        dcases1 = [[-2, -2], [-1, -1], [1, 1], [2, 2]]; // 45deg diagonal
        dcases2 = [[-2, 2], [-1, 1], [1, -1], [2, -2]]; // -45deg diagonal
        let d;
        
        for(let i = 0; i < 4; i++)
        {
            d = dcases1[i];
            if(validSquare(x+d[0], y+d[1]) && squareElement[(3 * (x + d[0])) + y+d[1]].textContent == currentSign)
            dmatches1++;

            d = dcases2[i]
            if(validSquare(x+d[0], y+d[1]) && squareElement[(3 * (x + d[0])) + y+d[1]].textContent == currentSign)
            dmatches2++;

            // If, in any case, 2 squares have the same sign as current won. Game is won.
            if(dmatches1 == 2 || dmatches2 == 2)
            return true;
        }

        return false;
    }

    let validSquare = (x, y) => 
    {
        // Function to check if a coordinate is within bounds.
        if ((x >= 0 && x <= 2) && (y >= 0 && y <= 2))
        return true;

        return false;
    }

    let squareFree = (sqr) => {
        // Function to check if a coordinate is free and not to be written over.
        if(squareElement[sqr].textContent == "")
        return true;

        return false;
    };

    let chooseSquare = (sign, sqr) => {
        // Function to put the sign of the player on the selected square.
        if(squareFree(sqr))
        {
            let coord = makeCoord(sqr);
    
            squareElement[sqr].textContent = sign;

            return true;
        }

        return false;

    }

    return {
        checkWin,
        chooseSquare
    };

})(squareElement);

// Game Module
let Game = (() => {
    let turns; // To keep track of turns of the game.

    let newGame = () => {
        // Setting everything to default when starting.
        Game.turns = 0;
        playerElement[0].classList.remove("active");
        playerElement[1].classList.remove("active");

        // Cleaning up the board in program.
        Board.squares = new Array(3);
        for(let i = 0; i < 3; i++)
        {
            Board.squares.push(new Array(3));
        }
        
        // ...and on screen.
        for(let i = 0; i < 3; i++)
        {
            for(let j = 0; j < 3; j++)
            {
                squareElement[(i * 3) + j].textContent = "";
            }
        }

        // Activating player 1.
        playerElement[0].classList.add("active");
    };

    let play = (sqr) => {
        // Choosing the player and sending the chosen square to the square selection function.
        let currentplayer = players[Game.turns % 2];
        if(Board.chooseSquare(currentplayer.sign, sqr)) // If valid, proceeding.
        {
            // If all squares are filled without any win, it's a draw, hence starting new game.
            if(Game.turns == 8)
                Game.newGame();
            
            // Atleast 5 turns are needed to win, hence checking for win after that.
            // If won, increasing tally and setting up new game.
            if(Game.turns >= 4 && Board.checkWin(sqr))
            {
                currentplayer.addWin();
                Game.newGame();
            }
            else{
                // Otherwise changing turn, and the game goes on.
                playerElement[0].classList.toggle("active");
                playerElement[1].classList.toggle("active");
                Game.turns++;
            }
        }
    };

    return {
        newGame,
        play,
        turns
    };
})();

// Event Listener for squares.
squareElement.forEach(sqr => {
    sqr.addEventListener("click", function() {
        Game.play(parseInt(sqr.id));
    });
});

// Helper function to convert 2D coordinates into equivalent 1D array position.
function makeCoord(sqr) {
    let coord = [0, 0];

    if(sqr <= 2)
    {
        coord[0] = 0;
        coord[1] = sqr;
    }
    else if(sqr <= 5)
    {
        coord[0] = 1;
        coord[1] = sqr - 3;
    }
    else
    {
        coord[0] = 2;
        coord[1] = sqr - 6;
    }

    return coord;
}

// Let the games begin..
Game.newGame();