import Phaser from "../lib/phaser.js";

import { SCENE_KEYS } from "../keys/scene.js";
import { DUNGEON_ASSET_KEYS, UI_ASSET_KEYS } from "../keys/asset.js";
import { KENNEY_MINI_FONT_NAME } from "../keys/font.js";
import { Button } from "../ui/button.js";
import { Data } from "../data.js";

export class LevelScene extends Phaser.Scene {
    /** @type {boolean} */
    #canMove;

    /** @type {number} */
    #currentDungeon;
    /** @type {number} */
    #totalDungeons;
    /** @type{Button[]} */
    #dungeons;
    
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
        this.#totalDungeons = 4;
        this.#currentDungeon = 0;
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
        let button = new Button(this, UI_ASSET_KEYS.TEXT_BUTTON, () => {
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

    #changeDungeon(page) {
        this.#currentDungeon += page;

        // Update pages navigation
        for (let p=0; p<this.#totalDungeons; p++) {
            if (p === this.#currentDungeon) {
                this.#dungeons[p].toggle(true);
            } else {
                this.#dungeons[p].toggle(false);
            }
        }

        var currentPosition = this.#background.x;
        this.tweens.add({
            targets: this.#background,
            x: this.#currentDungeon * -this.scale.width,
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
        this.#background = this.add.tileSprite(0, 0, this.#totalDungeons * this.scale.width, this.scale.height, UI_ASSET_KEYS.TRANSPARENT).setOrigin(0);
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
                this.#changeDungeon(1) ;
            } else {
                if (delta < -this.scale.width / 8) {
                    this.#changeDungeon(-1);
                } else {
                    this.#changeDungeon(0);
                }
            }
        });
    }

    #createPages() {
        this.#container = this.add.container(0, 0);

        this.#dungeons = [];

        let nbrRows = 4
        let nbrCols = 4;

        let spacing = 40;

        let size = 50;

        let startX = ((this.scale.width - (size + spacing) * nbrCols) / 2) + spacing;
        let startY = 200;

        for (let p=0; p<this.#totalDungeons; p++) {
            // Create each level
            for (let y = 0; y < nbrRows; y++) {
                for (let x = 0; x < nbrCols; x++) {
                    let button = new Button(this, UI_ASSET_KEYS.LEVEL_SELECTOR, () => {
                        this.scene.start(SCENE_KEYS.DUNGEON_SCENE);
                    });
                    button.gameObject.x = p * this.scale.width + startX + x * (50 + spacing);
                    button.gameObject.y = startY + y * (50 + spacing);

                    this.#container.add(button.gameObject);
                }
            }

            // Create Dungeon Navigation
            let dungeon = new Button(this, UI_ASSET_KEYS.DUNGEON_SELECTOR, () => {
                if (this.#canMove) {
                    var difference = p - this.#currentDungeon;
                    this.#changeDungeon(difference);
                    this.#canMove = false;
                }
            });
            let theme = Data.getDungeonTheme(this, "dungeon" + (p+1));
            let tile = new Phaser.GameObjects.Image(this, 0, 0, theme.border.assetKey, theme.border.assetFrame);
            dungeon.add(tile);
            dungeon.container.x = this.scale.width / 2 + (p - Math.floor(this.#totalDungeons / 2) + 0.5 * (1 - this.#totalDungeons % 2)) * 80;
            dungeon.container.y = 600;

            this.#dungeons.push(dungeon);

            if (p === this.#currentDungeon) {
                this.#dungeons[p].toggle(true);
            } else {
                this.#dungeons[p].toggle(false);
            }
        }
    }
}
