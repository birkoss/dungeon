import { UI_ASSET_KEYS } from "../keys/asset.js";
import Phaser from "../lib/phaser.js";
import { Button } from "./button.js";

export class Popup {
    /** @type {Phaser.GameObjects.Container} */
    #container;

    /** @type {Phaser.GameObjects.Image} */
    #gameObject;
    /** @type {Phaser.GameObjects.Rectangle} */
    #overlay;

    /** @type {Phaser.GameObjects.Rectangle} */
    #background;

    /**
     * @param {Phaser.Scene} scene
     */
    constructor(scene) {
        this.#overlay = scene.add.rectangle(0, 0, scene.scale.width, scene.scale.height, 0x333333, 1).setOrigin(0);
        this.#overlay.setInteractive();

        this.#container = scene.add.container(0, 0);

        this.#background = scene.add.rectangle(20, 20, scene.scale.width - 40, scene.scale.height - 40, 0xFFFFFF, 1);
        this.#background.x += this.#background.width / 2;
        this.#background.y += this.#background.height / 2;
        this.#container.add(this.#background);

        let button = new Button(scene, UI_ASSET_KEYS.BUTTON, () => {
            this.hide();
        });
        button.add(new Phaser.GameObjects.Image(scene, 0, 0, UI_ASSET_KEYS.ICONS, 4).setScale(0.75));
        button.container.x = this.#background.x + this.#background.width/2  - button.container.getBounds().width;
        button.container.y = this.#background.y - this.#background.height/2 - 6;
        this.#container.add(button.container);

        this.#container.setAlpha(0);
        this.#overlay.setAlpha(0);
    }

    /** @type {Phaser.GameObjects.Image} */
    get gameObject() {
        return this.#gameObject;
    }

    /** @type {Phaser.GameObjects.Container} */
    get container() {
        return this.#container;
    }

    show() {
        this.#container.scene.add.tween({
            targets: this.#overlay,
            alpha: 0.8,
            duration: 300,
            ease: Phaser.Math.Easing.Cubic.Out,
        });

        this.#container.scene.add.tween({
            targets: this.#container,
            alpha: 1,
            duration: 300,
            ease: Phaser.Math.Easing.Cubic.Out,
        });
    }

    hide() {
        this.#container.scene.add.tween({
            targets: this.#container,
            alpha: 0,
            duration: 300,
            ease: Phaser.Math.Easing.Cubic.Out,
        });

        this.#container.scene.add.tween({
            targets: this.#overlay,
            alpha: 0,
            duration: 300,
            ease: Phaser.Math.Easing.Cubic.Out,
        });
    }
}
