import Phaser from "../lib/phaser.js";

import { SCENE_KEYS } from "../keys/scene.js";
import { Dungeon } from "../dungeons/dungeon.js";
import { Data } from "../data.js";
import { TILE_SIZE } from "../config.js";
import { TILE_ENTITY_TYPE, TileEntity } from "../dungeons/tiles/entities/entity.js";
import { DUNGEON_ASSET_KEYS } from "../keys/asset.js";
import { StateMachine } from "../state-machine.js";

const MAIN_STATES = Object.freeze({
    CREATE_DUNGEON: 'CREATE_DUNGEON',
    PLAYER_INPUT: 'PLAYER_INPUT',
    GAME_OVER: 'GAME_OVER',
});

export class DungeonScene extends Phaser.Scene {
    /** @type {Phaser.GameObjects.TileSprite} */
    #background;

    /** @type {Dungeon} */
    #dungeon;

    /** @type {TILE_ENTITY_TYPE} */
    #mode;
    /** @type {boolean} */
    #state;

    /** @type {boolean} */
    #isSelecting;

    /** @type {StateMachine} */
    #stateMachine;

    constructor() {
        super({
            key: SCENE_KEYS.DUNGEON_SCENE,
        });
    }

    create() {
        this.#createStateMachine();
    }

    update() {
        if (this.#stateMachine) {
            this.#stateMachine.update();
        }
    }

    #createDungeon() {
        let theme = Data.getDungeonTheme(this, "main");
        // let level = Data.getLevel(this, "1-1");
        let level = Data.getLevel(this, "debug");

        this.#dungeon = new Dungeon(this, 10, 10);

        // // Create the WALL and FLOOR
        this.#dungeon.create(theme, level);

        this.#dungeon.container.x = (this.scale.width - this.#dungeon.container.getBounds().width) / 2;
        this.#dungeon.container.y = 100;

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
        OK.create(this, DUNGEON_ASSET_KEYS.DUNGEON, 14);
        OK.gameObject.x = 60;
        OK.gameObject.y = 40;
        OK.gameObject.setInteractive();
        OK.gameObject.on('pointerdown', (target) => {
            this.#mode = TILE_ENTITY_TYPE.BACKGROUND;
        });


        let NOP = new TileEntity(TILE_ENTITY_TYPE.BACKGROUND);
        NOP.create(this, DUNGEON_ASSET_KEYS.DUNGEON, 0);
        NOP.gameObject.x = 200;
        NOP.gameObject.y = 40;
        NOP.gameObject.setInteractive();
        NOP.gameObject.on('pointerdown', (target) => {
            this.#mode = TILE_ENTITY_TYPE.WALL;
        });
    }

    #createStateMachine() {
        this.#stateMachine = new StateMachine('MAIN', this);

        this.#stateMachine.addState({
            name: MAIN_STATES.CREATE_DUNGEON,
            onEnter: () => {
                
                this.#createDungeon();
                this.#mode = TILE_ENTITY_TYPE.WALL;
                this.#isSelecting = false;

                this.time.delayedCall(500, () => {
                    this.#stateMachine.setState(MAIN_STATES.PLAYER_INPUT);
                });
            },
        });

        this.#stateMachine.addState({
            name: MAIN_STATES.PLAYER_INPUT,
            onEnter: () => {
                // ...
            },
        });

        this.#stateMachine.addState({
            name: MAIN_STATES.GAME_OVER,
            onEnter: () => {
                // ...
            },
        });

        this.#stateMachine.setState(MAIN_STATES.CREATE_DUNGEON);
    }

    /**
     * @param {number} x 
     * @param {number} y 
     */
    #selectTile(x, y) {
        if (this.#stateMachine.currentStateName === MAIN_STATES.PLAYER_INPUT) {
            this.#dungeon.toggleAt(x, y, this.#mode, this.#state, () => {
                if (this.#dungeon.isCompleted()) {
                    this.#stateMachine.setState(MAIN_STATES.GAME_OVER);
                }
            });
        }
    }
}
