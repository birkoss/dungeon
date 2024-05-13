import { SOUND_ASSET_KEY } from "../keys/asset.js";
import Phaser from "../lib/phaser.js";

export class Button {
    /** @type {Phaser.GameObjects.Container} */
    #container;

    /** @type {Phaser.GameObjects.Image} */
    #gameObject;

    /** @type {Phaser.GameObjects.Container} */
    #gameObjectsContainer;

    /** @type {boolean} */
    #isPressed;

    /** @type {boolean} */
    #isToggled;

    /**
     * @param {Phaser.Scene} scene
     * @param {string} assetKey 
     * @param {() => void} [callback]
     */
    constructor(scene, assetKey, callback) {
        this.#container = scene.add.container(0, 0);
        this.#isPressed = false;
        this.#isToggled = false;

        this.#gameObject = scene.add.image(0, 0, assetKey, 0);
        this.#gameObject.setOrigin(0);
        this.#container.add(this.#gameObject);

        this.#gameObject.setInteractive();
        this.#gameObject.on(Phaser.Input.Events.POINTER_DOWN, () => {
            if (this.#isToggled) {
                return;
            }
            this.isPressed = true;
            this.#press();
        });
        this.#gameObject.on(Phaser.Input.Events.POINTER_OUT, () => {
            if (this.isPressed) {
                this.isPressed = false;
                this.#release();
            }
        })
        this.#gameObject.on(Phaser.Input.Events.POINTER_UP, () => {
            if (this.isPressed) {
                this.#gameObject.scene.sound.add(SOUND_ASSET_KEY.CLICK, { loop: false }).play();

                this.isPressed = false;
                this.#release();

                if (callback) {
                    callback();
                }
            }
        });

        this.#gameObjectsContainer = scene.add.container(0, 0);
        this.#container.add(this.#gameObjectsContainer);
    }

    /** @type {Phaser.GameObjects.Image} */
    get gameObject() {
        return this.#gameObject;
    }

    /** @type {Phaser.GameObjects.Container} */
    get container() {
        return this.#container;
    }

    /**
     * @param {Phaser.GameObjects.Text|Phaser.GameObjects.Sprite|Phaser.GameObjects.Image|Phaser.GameObjects.BitmapText} gameObject
     */
    add(gameObject) {
        this.#gameObjectsContainer.add(gameObject);
        gameObject.setOrigin(0);

        gameObject.x = Math.floor((this.#gameObject.width - gameObject.displayWidth) / 2);
        gameObject.y = Math.floor((this.#gameObject.height - gameObject.displayHeight) / 2) - 3;
    }

    /**
     * @param {boolean} toggled 
     */
    toggle(toggled) {
        this.#isToggled = toggled;

        if (toggled) {
            this.#press();
        } else {
            this.#release();
        }
    }

    /**
     * @param {number} [duration=10]
     */
    wiggle(duration) {
        let positions = [];

        // Add random position
        for (let i=0; i<(duration || 15); i++) {
            positions.push({
                x: this.#container.x + Phaser.Math.Between(-4, 4),
                y: this.#container.y + Phaser.Math.Between(-4, 4),
            });
        }

        // Get back to original position
        positions.push({
            x: this.#container.x,
            y: this.#container.y,
        });

        var fade = new Phaser.GameObjects.Rectangle(this.#container.scene, 0, 0, this.#container.getBounds().width, this.#container.getBounds().height, 0xff0000, 1).setOrigin(0);
        fade.setAlpha(0);
        this.#container.add(fade);

        fade.scene.tweens.add({
            targets: fade,
            alpha: 0.4,
            duration: 200,
            ease: Phaser.Math.Easing.Sine.Out,
            onComplete: () => {
                this.#container.scene.time.addEvent({
                    repeat: positions.length - 1,
                    delay: 40,
                    callback: () => {
                        let position = positions.shift();
                         this.#container.x = position.x;
                         this.#container.y = position.y; 
        
                         if (positions.length === 0) {
                            fade.scene.tweens.add({
                                targets: fade,
                                alpha: 0,
                                duration: 200,
                                ease: Phaser.Math.Easing.Sine.In,
                                onComplete: () => {
                                    fade.destroy();
                                }
                            });
                         }
                    },
                });
            }
        });
    }

    #press() {
        this.gameObject.setFrame(1);
        this.#gameObjectsContainer.y = 6;
    }

    #release() {
        this.gameObject.setFrame(0);
        this.#gameObjectsContainer.y = 0;
    }
}
