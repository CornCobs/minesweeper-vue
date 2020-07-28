const HEIGHT = 20;
const WIDTH = 20;
const MINES = 70;

function getRandBetween(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function numToCoord(width, num) {
    return [Math.trunc(num / width), num % width]
}

function createMineField(height, width, numMines) {
    const mineField = createGrid(height, width);
    while (numMines > 0) {
        const position = getRandBetween(0, height * width);
        const [row, col] = numToCoord(width, position);
        if (!mineField[row][col].isMine) {
            mineField[row][col].isMine = true;
            numMines--;
        }
    }
    return mineField;
}

function createGrid(height, width) {
    return [...Array(height).keys()]
        .map(rowNum => [...Array(width).keys()]
        .map(colNum => ({ row: rowNum, col: colNum, isMine: false, shown: false, flag: false})));
}

function* getAdjacent(row, col) {
    for (let i=row-1; i<=row+1; i++) {
        for (let j=col-1; j<=col+1; j++) {
            if (!(i < 0 || j < 0 || i >= HEIGHT || j >= WIDTH || (i == row && j == col))) {
                yield [i, j]
            }
        }
    }
}

var app = new Vue({
    el: "#app",
    data: {
        mineField: createMineField(HEIGHT, WIDTH, MINES),
        tilesToOpen: HEIGHT * WIDTH - MINES,
        time: 0,
        timer: null,
        colors: [
            "rgba(0,0,0,0)",
            "blue",
            "green",
            "red",
            "darkblue",
            "brown",
            "darkcyan",
            "black",
            "grey"
        ]
    },
    methods: {
        reset: function() {
            this.mineField = createMineField(HEIGHT, WIDTH, MINES);
            this.tilesToOpen = HEIGHT * WIDTH - MINES;
            this.time = 0;
            clearInterval(this.timer);
            this.timer = null;
        },
        lose: function() {
            this.mineField.forEach(row => {
                row.forEach(tile => tile.shown = true)
            });
            alert("Game over!");
            clearInterval(this.timer);
        },
        openTile: function(tile) {
            if (this.timer === null) {
                this.timer = setInterval(() => this.time++, 1000);
            }
            if (tile.shown) {
                return;
            }
            if (tile.isMine) {
                this.lose();
            } else {
                const adjTiles = [...getAdjacent(tile.row, tile.col)];
                const number = adjTiles
                    .map(([row, col]) => this.mineField[row][col])
                    .filter(neighbour => neighbour.isMine)
                    .length;
                tile.shown = true;
                tile.number = number;
                this.tilesToOpen--;
                if (number === 0) {
                    adjTiles.forEach(([row, col]) => this.openTile(this.mineField[row][col]));
                }
            }
            
        },
        flagTile: function(tile) {
            tile.flag = true;
        }
    },
    watch: {
        tilesToOpen: function(newVal, oldVal) {
            if (newVal === 0) {
                clearInterval(this.timer);
                alert("Congratulations! You cleared the board in " + this.time + " seconds");
            }
        }
    }
})

