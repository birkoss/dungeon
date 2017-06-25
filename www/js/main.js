var GAME = GAME || {};

/* Default values */
GAME.config = {
    speed:800,
    padding: {
        button: 16
    },
    lang:"fr",
    music:false,
    sound:false,
    puzzles: []
};

GAME.scale = {sprite:3, normal:1};
GAME.scale.normal = Math.max(1, Math.min(6, Math.floor(window.innerWidth / 320) * 2));

GAME.save = function() {
    let fields = ["puzzles", "lang", "music", "sound"];

    let data = {};
    fields.forEach(function(field) {
        data[field] = GAME.config[field];
    }, this);

    localStorage.setItem('retroxel_config', JSON.stringify(data));
};

GAME.load = function() {
    let data = localStorage.getItem('retroxel_config');
    if (data != null) {
        data = JSON.parse(data);

        GAME.config = Object.assign(GAME.config, data);
    }
};

GAME.load();

function __(key) {
    /* @TODO Need a better check bellow to prevent Phaser to query the cache when no language file exists */
    if (GAME.game.cache.getJSON("text:" + GAME.config.lang)) {
        let text = GAME.game.cache.getJSON("text:" + GAME.config.lang)[key];
        if (text != null) {
            key = text;
        }
    }

    return key;
}

function P(puzzleName) {
    let item = null;
    GAME.puzzles.forEach(function(single_puzzle) {
        if (puzzleName == single_puzzle.id) {
            item = single_puzzle;
        }
    }, this);
    return item;
}

function D(puzzleName, puzzleDifficulty) {
    let item = null;
    P(puzzleName).difficulties.forEach(function(single_difficulty) {
        if (puzzleDifficulty == single_difficulty.name) {
            item = single_difficulty;
        }
    }, this);
    return item;
}

function G(puzzleName, puzzleDifficulty, gridUid, nextUid) {
    if (nextUid == null) {
        nextUid = 0;
    }
    let item = null;
    let puzzles = D(puzzleName, puzzleDifficulty).puzzles;

    puzzles.forEach(function(single_grid, index) {
        if (single_grid.uid == gridUid) {
            if (nextUid == 0) {
                item = single_grid;
            } else {
                if (index + nextUid < puzzles.length) {
                    item = puzzles[index + nextUid];
                }
            }
        }
    }, this);

    return item;
}

/* Phaser */

GAME.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, '');

GAME.game.state.add('Boot', GAME.Boot);
GAME.game.state.add('Preload', GAME.Preload);
GAME.game.state.add('Main', GAME.Main);
GAME.game.state.add('Options', GAME.Options);
GAME.game.state.add('ChoosePuzzle', GAME.ChoosePuzzle);
GAME.game.state.add('ChooseDifficulty', GAME.ChooseDifficulty);
GAME.game.state.add('ChooseLevel', GAME.ChooseLevel);
GAME.game.state.add('PlayPuzzle', GAME.PlayPuzzle);

GAME.game.state.start('Boot');
