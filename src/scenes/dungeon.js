import Phaser from "../lib/phaser.js";

import { SCENE_KEYS } from "../keys/scene.js";
import { Dungeon } from "../dungeons/dungeon.js";
import { Data } from "../data.js";
import { TILE_SIZE } from "../config.js";
import { TILE_ENTITY_TYPE, TileEntity } from "../dungeons/tiles/entities/entity.js";
import { DUNGEON_ASSET_KEYS } from "../keys/asset.js";

export class DungeonScene extends Phaser.Scene {
    /** @type {Dungeon} */
    #dungeon;

    /** @type {TILE_ENTITY_TYPE} */
    #mode;
    /** @type {boolean} */
    #state;

    /** @type {boolean} */
    #isSelecting;

    constructor() {
        super({
            key: SCENE_KEYS.DUNGEON_SCENE,
        });
    }

    create() {
        this.#createDungeon();
        this.#mode = TILE_ENTITY_TYPE.WALL;
        this.#isSelecting = false;
    }

    update() {
        // ...
    }

    #createDungeon() {
        let theme = Data.getDungeonTheme(this, "main");
        let level = Data.getLevel(this, "1-1");

        this.#dungeon = new Dungeon(this, 10, 10);

        // // Create the WALL and FLOOR
        this.#dungeon.create(theme, level);

        // Enable Tile selection
        this.#dungeon.container.setInteractive(
            new Phaser.Geom.Rectangle(
                0, 0, this.#dungeon.container.getBounds().width, this.#dungeon.container.getBounds().height
            ),
            Phaser.Geom.Rectangle.Contains
        );
        this.#dungeon.container.on(Phaser.Input.Events.POINTER_DOWN, (target) => {
            this.#isSelecting = true;

            let x = Math.floor((target.worldX - this.#dungeon.container.x) / TILE_SIZE);
            let y = Math.floor((target.worldY - this.#dungeon.container.y) / TILE_SIZE);

            let tile = this.#dungeon.tiles.find(SingleTile => SingleTile.x === x && SingleTile.y === y);

            if (tile.entity && tile.entity.type === this.#mode) {
                this.#state = false;
            } else {
                this.#state = true;
            }

            this.#selectTile(x, y);
        });

        this.#dungeon.container.on(Phaser.Input.Events.POINTER_MOVE, (target) => {
            if (this.#isSelecting) {
                let x = Math.floor((target.worldX - this.#dungeon.container.x) / TILE_SIZE);
                let y = Math.floor((target.worldY - this.#dungeon.container.y) / TILE_SIZE);
    
                this.#selectTile(x, y);
            }
        });
        this.input.on(Phaser.Input.Events.POINTER_UP_OUTSIDE, () => this.#isSelecting = false);
        this.input.on(Phaser.Input.Events.POINTER_UP, () => this.#isSelecting = false);

        

        let OK = new TileEntity(TILE_ENTITY_TYPE.BACKGROUND);
        OK.create(this, DUNGEON_ASSET_KEYS.WORLD, 3);
        OK.gameObject.x = 520;
        OK.gameObject.setInteractive();
        OK.gameObject.on('pointerdown', (target) => {
            this.#mode = TILE_ENTITY_TYPE.BACKGROUND;
        });


        let NOP = new TileEntity(TILE_ENTITY_TYPE.BACKGROUND);
        NOP.create(this, DUNGEON_ASSET_KEYS.WORLD, 0);
        NOP.gameObject.x = 640;
        NOP.gameObject.setInteractive();
        NOP.gameObject.on('pointerdown', (target) => {
            this.#mode = TILE_ENTITY_TYPE.WALL;
        });
    }

    /**
     * @param {number} x 
     * @param {number} y 
     */
    #selectTile(x, y) {
        this.#dungeon.toggleAt(x, y, this.#mode, this.#state, () => {
            if (this.#dungeon.isCompleted()) {
                console.log("YES");
            }
        });
    }
}
