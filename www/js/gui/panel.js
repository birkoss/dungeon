function Panel(game, height) {
    Phaser.Group.call(this, game);

    this.createBackground(height);
};

Panel.prototype = Object.create(Phaser.Group.prototype);
Panel.prototype.constructor = Panel;

Panel.prototype.createBackground = function(height) {
    height = (height == null ? 60 : height);
    this.backgroundContainer = this.game.add.group();
    this.addChild(this.backgroundContainer);

    this.background = this.backgroundContainer.create(0, 0, "tile:blank");
    this.background.width = this.game.width;
    this.background.height = height;
    this.background.tint = 0xffffff;
    this.background.alpha = 0.3;
};

Panel.prototype.createTitle = function(label, size) {
    size = (size == null ? 20 : size);

    this.titleContainer = this.game.add.group();
    this.addChild(this.titleContainer);

    this.title = this.game.add.bitmapText(0, 0, "font:gui", label, size);
    this.title.x = (this.game.width - this.title.width) / 2;
    this.title.y = (this.background.height - size) / 2;
    this.titleContainer.addChild(this.title);
};

Panel.prototype.addButton = function(button) {
    if (this.buttonsContainer == null) {
        this.buttonsContainer = this.game.add.group();
        this.addChild(this.buttonsContainer);
    }

    if (this.buttonsContainer.children.length > 0) {
        button.x = this.game.width - button.width;
    }
    this.buttonsContainer.addChild(button);
};

Panel.prototype.setTitle = function(label) {
    this.title.text = label;
    this.title.x = (this.game.width - this.title.width) / 2;
};
