import Phaser from "../lib/phaser.js";

import { SCENE_KEYS } from "../keys/scene.js";
import { Dungeon } from "../dungeons/dungeon.js";


export class DungeonScene extends Phaser.Scene {
    /** @type {Dungeon} */
    #dungeon;

    constructor() {
        super({
            key: SCENE_KEYS.DUNGEON_SCENE,
        });
    }

    create() {
        this.#createDungeon();
    }

    update() {
        // ...
    }

    #createDungeon() {
        this.#dungeon = new Dungeon(this, 10, 8);

        // // Create the WALL and FLOOR
        // this.#dungeon.create(this.#dungeonTheme);

        // this.#dungeon.container.setPosition(this.scale.width - this.#dungeon.container.getBounds().width, 0);

        // // Enable Tile selection
        // this.#dungeon.container.setInteractive(
        //     new Phaser.Geom.Rectangle(
        //         0, 0, this.#dungeon.container.getBounds().width, this.#dungeon.container.getBounds().height
        //     ),
        //     Phaser.Geom.Rectangle.Contains
        // );
        // this.#dungeon.container.on('pointerdown', (target) => {
        //     let x = Math.floor((target.worldX - this.#dungeon.container.x) / TILE_SIZE);
        //     let y = Math.floor((target.worldY - this.#dungeon.container.y) / TILE_SIZE);

        //     this.#selectTile(x, y);
        // });
    }
}
