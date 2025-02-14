import Phaser from "../lib/phaser.js";

import { UI_ASSET_KEYS } from "../keys/asset.js";

export class Box {
    /** @type {Phaser.Scene} */
    _scene;
    /** @type {Phaser.GameObjects.Container} */
    _container;

    /**
     * @param {Phaser.Scene} scene 
     */
    constructor(scene) {
        this._scene = scene;

        this._container = this._scene.add.container(0, 0);

        let background = this._scene.add.image(0, 0, UI_ASSET_KEYS.BLANK).setOrigin(0.5).setTint(0x854302);
        background.displayWidth = this._scene.game.canvas.width - 60;
        background.displayHeight = 250;
        this._container.add(background);
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