function getRandBetween(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function numToCoord(width, num) {
    return [Math.trunc(num / width), num % width]
}

function createMineField(height, width, numMines) {
    const mineField = new Array(height)
        .fill(null)
        .map(() => new Array(width).fill(false));
    while (numMines > 0) {
        const position = getRandBetween(0, height * width);
        const [row, col] = numToCoord(width, position);
        if (!mineField[row][col]) {
            mineField[row][col] = true;
            numMines--;
        }
    }
    return mineField.map(row => row.map(x => ({ shown: false, isMine: x })));
}

var app = new Vue({
    el: "#app",
    data: {
        mineField: createMineField(20, 20, 70),
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
    }
})

