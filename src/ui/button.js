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
     * @param {Phaser.GameObjects.Text|Phaser.GameObjects.Sprite|Phaser.GameObjects.Image} gameObject
     */
    add(gameObject) {
        this.#gameObjectsContainer.add(gameObject);

        gameObject.setOrigin(0.5);
        gameObject.x = (this.#gameObject.width / 2);
        gameObject.y = (this.#gameObject.height / 2) - 3;

        if (gameObject instanceof Phaser.GameObjects.Text) {
            gameObject.x += 2;
            gameObject.y -= 3;
        }
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

    #press() {
        this.gameObject.setFrame(1);
        this.#gameObjectsContainer.y = 6;
    }

    #release() {
        this.gameObject.setFrame(0);
        this.#gameObjectsContainer.y = 0;
    }
}
