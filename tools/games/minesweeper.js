const fs = require('fs');

const game = {
    game: {},
    isAlive: true
}

class minesweep {
    constructor(width, height, diff) {
        this.width = width;
        this.height = height;
        this.grid = [];

        for (let y = 0; y < height; y++) {
            let row = [];
            for (let x = 0; x < width; x++) {
                row.push(new case_(false, Math.floor(Math.random()*100)%diff == 0));
            }
            this.grid.push(row);
        }
    }
}

class case_ {
    constructor(isShowed = false, valeur = false) {
        this.valeur = valeur; // true = bomb
        this.isShowed = isShowed; // true = cliqued
        this.state = false; // true = flag
        this.string = '';
    }

    dig() {
        this.isShowed = true;
        this.string = this.valeur?'💣':' ';
        console.log(this.string)
    }

    flag() {
        this.state = !this.state;
        this.string = this.state?'🚩':'';
    }
}


function generateground(size) {
    game.game = new minesweep(size.w, size.h, 2)
    return game;
}

function setflagordig(x, y, action) {
    switch (action) {
        case 'flag':
            game.game.grid[y][x].flag()
            break;

        case 'dig':
            game.game.grid[y][x].dig()
            break;
    }
    return game;
}

module.exports = { generateground, setflagordig };