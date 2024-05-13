import { UI_ASSET_KEYS } from "../keys/asset.js";
import Phaser from "../lib/phaser.js";
import { Button } from "./button.js";

export class Popup {
    /** @type {Phaser.GameObjects.Container} */
    #container;
    /** @type {Phaser.GameObjects.Container} */
    #pagesContainer;
    /** @type {number} */
    #currentPage;
    /** @type {Phaser.GameObjects.TileSprite} */
    #draggableGameObject;
    /** @type {boolean} */
    #canMove;
    /** @type {Button[]} */
    #pages;

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
        this.#pagesContainer = scene.add.container(0, 0);

        this.#background = scene.add.rectangle(0, 100, scene.scale.width, scene.scale.height - 200, 0xFFFFFF, 1).setOrigin(0);
        this.#container.add(this.#background);

        this.#createBackground();
        this.#container.add(this.#pagesContainer);
        this.#container.add(this.#draggableGameObject);

        let button = new Button(scene, UI_ASSET_KEYS.BUTTON_RED, () => {
            this.hide();
        });
        button.add(new Phaser.GameObjects.Image(scene, 0, 0, UI_ASSET_KEYS.ICONS, 4).setScale(0.75));
        button.container.x = this.#background.x + this.#background.width  - button.container.getBounds().width;
        button.container.y = this.#background.y - 6;
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

    /**
     * @param {Phaser.GameObjects.Container} page 
     */
    addPage(page) {
        page.y = this.#background.y + 60;
        page.x = (this.#pagesContainer.length * this.#container.scene.scale.width) + 30;

        this.#pagesContainer.add(page);
        this.#draggableGameObject.width = this.#pagesContainer.length * this.#container.scene.scale.width;
    }

    show() {
        this.#container.scene.add.tween({
            targets: this.#overlay,
            alpha: 0.8,
            duration: 450,
            ease: Phaser.Math.Easing.Cubic.Out,
        });

        this.#container.scene.add.tween({
            targets: this.#container,
            alpha: 1,
            duration: 450,
            ease: Phaser.Math.Easing.Cubic.Out,
        });

        this.#createNavigation();

        this.#draggableGameObject.setInteractive();
        this.#container.scene.input.setDraggable(this.#draggableGameObject);
    }

    hide() {
        this.#container.scene.add.tween({
            targets: this.#container,
            alpha: 0,
            duration: 450,
            ease: Phaser.Math.Easing.Cubic.Out,
        });

        this.#container.scene.add.tween({
            targets: this.#overlay,
            alpha: 0,
            duration: 450,
            ease: Phaser.Math.Easing.Cubic.Out,
        });
    }

    #createBackground() {
        this.#currentPage = 0;

        this.#draggableGameObject = this.#container.scene.add.tileSprite(0, 0, this.#container.scene.scale.height, this.#container.scene.scale.height, UI_ASSET_KEYS.TRANSPARENT).setOrigin(0);

        this.#container.scene.input.on(Phaser.Input.Events.DRAG_START, (pointer, gameObject) => {
            gameObject.startPosition = gameObject.x;
            gameObject.currentPosition = gameObject.x;
        });

        this.#container.scene.input.on(Phaser.Input.Events.DRAG, (pointer, gameObject, dragX, dragY) => {
            if (dragX <= 10 && dragX >= -gameObject.width + this.#container.scene.scale.width - 10) {
                gameObject.x = dragX;
                var delta = gameObject.x - gameObject.currentPosition;
                gameObject.currentPosition = dragX;

                this.#pagesContainer.x += delta;
            }
        });

        this.#container.scene.input.on(Phaser.Input.Events.DRAG_END, (pointer, gameObject) => {
            this.canMove = false;
            var delta = gameObject.startPosition - gameObject.x;
            if (delta > this.#container.scene.scale.width / 8) {
                this.#changePage(1) ;
            } else {
                if (delta < -this.#container.scene.scale.width / 8) {
                    this.#changePage(-1);
                } else {
                    this.#changePage(0);
                }
            }
        });
    }

    #createNavigation() {
        this.#pages = [];
        this.#canMove = true;
        
        let spacing = 24;
        let size = 40;
        let startX = (this.#container.scene.scale.width/2 - (this.#pagesContainer.length * (size + spacing))/2) + spacing;

        for (let d=0; d<this.#pagesContainer.length; d++) {
            let page = new Button(this.#container.scene, UI_ASSET_KEYS.PAGE_BUTTON, () => {
                if (this.#canMove) {
                    this.#changePage(d - this.#currentPage);
                    this.#canMove = false;
                }
            });
            let text = new Phaser.GameObjects.BitmapText(this.#container.scene, 0, 0, UI_ASSET_KEYS.SMALL_FONT, (d+1).toString(), 30);
            page.add(text);
            text.x += 2;
            text.y -= 2;
            page.container.x = startX + (d * (page.container.getBounds().width + spacing));
            page.container.y = 680;

            this.#pages.push(page);
            this.#container.add(page.container);
        }

        this.#pages[0].toggle(true);
    }

    #changePage(page) {
        this.#currentPage += page;

        // Update pages navigation
        for (let p=0; p<this.#pagesContainer.length; p++) {
            if (p === this.#currentPage) {
                this.#pages[p].toggle(true);
            } else {
                this.#pages[p].toggle(false);
            }
        }

        var currentPosition = this.#draggableGameObject.x;
        this.#container.scene.tweens.add({
            targets: this.#draggableGameObject,
            x: this.#currentPage * -this.#container.scene.scale.width,
            duration: 300,
            ease: "Cubic.easeOut",
            callbackScope: this,
            onUpdate: (tween, target) => {
                var delta = target.x - currentPosition;
                currentPosition = target.x;

                this.#pagesContainer.x += delta;
            },
            onComplete: () => {
                this.#canMove = true;
            }
        });
    }
}
