var GAME = GAME || {};

GAME.Preload = function() {};

GAME.Preload.prototype = {
    preload: function() {
        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'gui:preloader');
        this.preloadBar.anchor.set(0.5);
        this.load.setPreloadSprite(this.preloadBar);

        this.load.spritesheet('tile:dungeon', 'images/tiles/dungeon.png', 32, 32);
        this.load.image('tile:arrow', 'images/tiles/arrow.png');
        this.load.spritesheet('tile:selector', 'images/tiles/selector.png', 40, 40);

        this.load.bitmapFont('font:guiOutline', 'fonts/guiOutline.png', 'fonts/guiOutline.xml');
        this.load.bitmapFont('font:gui', 'fonts/gui.png', 'fonts/gui.xml');

    },
    create: function() {
        this.state.start("Main");
    }
};
