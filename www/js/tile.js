function Tile(game, up, right, down, left) {
    Phaser.Group.call(this, game);

    this.onClicked = new Phaser.Signal();

    this.ways = {
        'Up':up,
        'Right':right,
        'Down':down,
        'Left':left
    };

    this.backgroundContainer = this.game.add.group();
    this.addChild(this.backgroundContainer);

    let background = this.backgroundContainer.create(0, 0, "tile:dungeon"); 
    background.inputEnabled = true;
    background.events.onInputDown.add(this.selectTile, this);

    this.wallsContainer = this.game.add.group();
    this.addChild(this.wallsContainer);
};

Tile.prototype = Object.create(Phaser.Group.prototype);
Tile.prototype.constructor = Tile;

Tile.prototype.draw = function() {
    this.wallsContainer.removeAll(true);

    let image;

    /* Create side */
    let matches = [
    {way:'Up', 'frame':2},
    {way:'Right', 'frame':4},
    {way:'Down', 'frame':1},
    {way:'Left', 'frame':3}
    ];

    matches.forEach(function(single_match) {
        if (!this.ways[single_match.way]) {
            image = this.wallsContainer.create(0, 0, "tile:dungeon");
            image.frame = single_match.frame;
        }
    }, this);

    matches = [
    {way1:'Up', way2:'Right', frame:6},
    {way1:'Right', way2:'Down', frame:8},
    {way1:'Down', way2:'Left', frame:7},
    {way1:'Left', way2:'Up', frame: 5}
    ];

    matches.forEach(function(single_match) {
        if (!this.ways[single_match.way1] && !this.ways[single_match.way2]) {
            image = this.wallsContainer.create(0, 0, "tile:dungeon");
            image.frame = single_match.frame;
        }
    }, this);

    matches = [
    {way1:'Up', way2:'Right', frame:10},
    {way1:'Right', way2:'Down', frame:12},
    {way1:'Down', way2:'Left', frame:11},
    {way1:'Left', way2:'Up', frame: 9}
    ];

    matches.forEach(function(single_match) {
        if (this.ways[single_match.way1] && this.ways[single_match.way2]) {
            image = this.wallsContainer.create(0, 0, "tile:dungeon");
            image.frame = single_match.frame;
        }
    }, this);
};

Tile.prototype.selectTile = function(tile, pointer) {
    this.onClicked.dispatch(this, pointer);
};
