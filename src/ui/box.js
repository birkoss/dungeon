import Phaser from "../lib/phaser.js";

import { UI_ASSET_KEYS } from "../keys/asset.js";

export class Box {
    /** @type {Phaser.Scene} */
    _scene;

    /** @type {Phaser.GameObjects.Container} */
    _container;
    /** @type {Phaser.GameObjects.Image} */
    _background;

    /** @type {Phaser.GameObjects.Container} */
    _titleContainer;
    /** @type {Phaser.GameObjects.Image} */
    _titleBackground;
    /** @type {Phaser.GameObjects.BitmapText} */
    _title;

    /**
     * @param {Phaser.Scene} scene 
     * @param {number} [height=250]
     * @param {string} [title=""]
     */
    constructor(scene, height = 250, title = "") {
        this._scene = scene;

        this._container = this._scene.add.container(0, 0);
        this._titleContainer = this._scene.add.container(0, 0);

        this._background = this._scene.add.image(0, 0, UI_ASSET_KEYS.BLANK).setOrigin(0.5).setTint(0x854302);
        this._background.displayWidth = this._scene.game.canvas.width - 60;
        this._background.displayHeight = height;
        this._container.add(this._background);

        if (title) {
            this._titleBackground = this._scene.add.image(-this._background.displayWidth/2, -this._background.displayHeight/2, UI_ASSET_KEYS.BLANK).setOrigin(0).setTint(0x4e1906);  
            this._titleBackground.displayWidth = this._scene.game.canvas.width - 60;
            this._titleBackground.displayHeight = 40;
            this._titleContainer.add(this._titleBackground);

            this._title = this._scene.add.bitmapText(0, -this._background.displayHeight/2 + 7, UI_ASSET_KEYS.FONT6, title, 12).setTint(0xfff2e8).setOrigin(0.5, 0);
            this._titleContainer.add(this._title);
        }
        this._container.add(this._titleContainer);
    }

    show() {
        let originalY = this._container.y;
        this._container.y = this._scene.game.canvas.height + this._container.getBounds().height;

        this._scene.add.tween({
            targets: this._container,
            y: originalY,
            duration: 200,
        });
    }

    /**
     * @param {() => void} [callback] 
     */
    hide(callback) {
        this._scene.add.tween({
            targets: this._container,
            y: this._scene.game.canvas.height + this._container.getBounds().height,
            duration: 200,
            onComplete: callback,
        });
    }

    /** @type {Phaser.GameObjects.Container} */
    get container() { return this._container; }
}