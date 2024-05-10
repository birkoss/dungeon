import Phaser from "../lib/phaser.js";

import { SCENE_KEYS } from "../keys/scene.js";
import { UI_ASSET_KEYS } from "../keys/asset.js";
import { KENNEY_MINI_FONT_NAME } from "../keys/font.js";
import { Button } from "../ui/button.js";

export class LevelScene extends Phaser.Scene {
    /** @type {boolean} */
    #canMove;

    /** @type {number} */
    #currentPage;
    /** @type {number} */
    #totalPages;
    /** @type{Phaser.GameObjects.Sprite[]} */
    #pages;
    
    /** @type {Phaser.GameObjects.TileSprite} */
    #background;

    /** @type {Phaser.GameObjects.Container} */
    #container;

    constructor() {
        super({
            key: SCENE_KEYS.LEVEL_SCENE,
        });
    }

    create() {
        this.#totalPages = 6;
        this.#currentPage = 0;
        this.#canMove = true;

        // Draggable background
        this.#createBackground();

        // Title
        this.add.text(this.scale.width / 2, 60, "Select a Level", {
            fontFamily: KENNEY_MINI_FONT_NAME,
            fontSize: 30,
        }).setOrigin(0.5, 0);

        // Pages
        this.#createPages();

        // Back Button
        let button = new Button(this, UI_ASSET_KEYS.LARGE_BUTTON, 0, () => {
            this.cameras.main.fadeOut(500, 32, 18, 8, (camera, progress) => {
                if (progress === 1) {
                    this.scene.start(SCENE_KEYS.TITLE_SCENE);
                }
            });
        });
        button.add(new Phaser.GameObjects.Text(this, 0, 0, "Back", {
            fontFamily: KENNEY_MINI_FONT_NAME,
            fontSize: 30,
        }));
        button.container.x = (this.scale.width - button.container.getBounds().width) / 2;
        button.container.y = 700;

        // Fade In
        this.cameras.main.fadeIn(500, 32, 18, 8);
    }

    #changePage(page) {
        this.#currentPage += page;

        // Update pages navigation
        for (let p=0; p<this.#totalPages; p++) {
            if (p === this.#currentPage) {
                this.#pages[p].setScale(1);
            } else {
                this.#pages[p].setScale(0.7);
            }
        }

        var currentPosition = this.#background.x;
        this.tweens.add({
            targets: this.#background,
            x: this.#currentPage * -this.scale.width,
            duration: 300,
            ease: "Cubic.easeOut",
            callbackScope: this,
            onUpdate: (tween, target) => {
                var delta = target.x - currentPosition;
                currentPosition = target.x;

                this.#container.x += delta;
            },
            onComplete: () => {
                this.#canMove = true;
            }
        });
    }

    #createBackground() {
        this.#background = this.add.tileSprite(0, 0, this.#totalPages * this.scale.width, this.scale.height, UI_ASSET_KEYS.BUTTON).setOrigin(0).setAlpha(0.1);
        this.#background.setInteractive();
        this.input.setDraggable(this.#background);

        this.input.on(Phaser.Input.Events.DRAG_START, (pointer, gameObject) => {
            gameObject.startPosition = gameObject.x;
            gameObject.currentPosition = gameObject.x;
        });

        this.input.on(Phaser.Input.Events.DRAG, (pointer, gameObject, dragX, dragY) => {
            if(dragX <= 10 && dragX >= -gameObject.width + this.scale.width - 10){
                gameObject.x = dragX;
                var delta = gameObject.x - gameObject.currentPosition;
                gameObject.currentPosition = dragX;

                this.#container.x += delta;
            }
        });

        this.input.on(Phaser.Input.Events.DRAG_END, (pointer, gameObject) => {
            this.canMove = false;
            var delta = gameObject.startPosition - gameObject.x;
            if (delta > this.scale.width / 8) {
                this.#changePage(1) ;
            } else {
                if (delta < -this.scale.width / 8) {
                    this.#changePage(-1);
                } else {
                    this.#changePage(0);
                }
            }
        });
    }

    #createPages() {
        this.#container = this.add.container(0, 0);

        this.#pages = [];

        let nbrRows = 4
        let nbrCols = 3;

        let spacing = 40;

        let size = 50;

        let startX = ((this.scale.width - (size + spacing) * nbrCols) / 2) + spacing;
        let startY = 200;

        for (let p=0; p<this.#totalPages; p++) {
            // Create each level
            for (let y = 0; y < nbrRows; y++) {
                for (let x = 0; x < nbrCols; x++) {
                    let button = this.add.image(p * this.scale.width + startX + x * (50 + spacing), startY + y * (50 + spacing), UI_ASSET_KEYS.BUTTON);

                    button.setInteractive();
                    button.on(Phaser.Input.Events.POINTER_DOWN, () => {
                        this.scene.start(SCENE_KEYS.DUNGEON_SCENE);
                    });
                    this.#container.add(button);
                }
            }

            // Create Page Navigation
            let page = this.add.sprite(this.scale.width / 2 + (p - Math.floor(this.#totalPages / 2) + 0.5 * (1 - this.#totalPages % 2)) * 60, 600, UI_ASSET_KEYS.BUTTON);
            page.setInteractive();
            page.on(Phaser.Input.Events.POINTER_DOWN, () => {
                if (this.#canMove) {
                    var difference = p - this.#currentPage;
                    this.#changePage(difference);
                    this.#canMove = false;
                }
            });

            this.#pages.push(page);

            if (p === this.#currentPage) {
                this.#pages[p].setScale(1);
            } else {
                this.#pages[p].setScale(0.7);
            }
        }
    }
}
