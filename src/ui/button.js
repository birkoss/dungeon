import Phaser from "../lib/phaser.js";

import { UI_ASSET_KEYS } from "../keys/asset.js";

export class Button {
    /** @type {Phaser.Scene} */
    _scene;

    /** @type {Phaser.GameObjects.Container} */
    _container;
    /** @type {Boolean} */
    #selected;

    /**
     * @param {Phaser.Scene} scene 
     */
    constructor(scene) {
        this._scene = scene;

        this._container = this._scene.add.container(0, 0);

        this.#selected = false;
    }

    /** @type {Phaser.GameObjects.Container} */
    get container() { return this._container; }

    /**
     * @param {() => void} [onPressCallback]
     * @param {() => void} [onReleaseCallback]
     * @param {() => void} [onClickedCallback]
     */
    enableInteraction(onPressCallback, onReleaseCallback, onClickedCallback) {
        this._container.setInteractive(
            new Phaser.Geom.Rectangle(
                -this._container.getBounds().width/2, -this._container.getBounds().height/2, this._container.getBounds().width, this._container.getBounds().height
            ),
            Phaser.Geom.Rectangle.Contains
        );

        this._container.on('pointerdown', () => {
            this.#selected = true;
            if (onPressCallback) {
                onPressCallback();
            }
        });

        this._container.on('pointerup', () => {
            if (!this.#selected) {
                return;
            }
            this.#selected = false;
            if (onReleaseCallback) {
                onReleaseCallback();
            }
            if (onClickedCallback) {
                onClickedCallback();
            }
        });

        this._scene.input.on('pointerup', (target) => {
            this.#selected = false;
            if (onReleaseCallback) {
                onReleaseCallback();
            }
        });
    }

    /**
     * @param {() => void} [callback] 
     */
    hide(callback) {
        this._scene.add.tween({
            targets: this._container,
            alpha: 0,
            duration: 200,
            onComplete: callback,
        });
    }

    /**
     * @param {() => void} [callback] 
     */
    show(callback) {
        this._scene.add.tween({
            targets: this._container,
            alpha: 1,
            duration: 200,
            onComplete: callback,
        });
    }
}
