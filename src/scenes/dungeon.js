import Phaser from "../lib/phaser.js";

import { SCENE_KEYS } from "../keys/scene.js";
import { Dungeon } from "../dungeons/dungeon.js";
import { Data } from "../data.js";
import { TILE_SIZE } from "../config.js";
import { TILE_ENTITY_TYPE } from "../dungeons/tiles/entities/entity.js";
import { DUNGEON_ASSET_KEYS, UI_ASSET_KEYS } from "../keys/asset.js";
import { StateMachine } from "../state-machine.js";
import { ToggleButton } from "../ui/toggle-button.js";
import { Toggle } from "../ui/toggle.js";
import { KENNEY_MINI_FONT_NAME } from "../keys/font.js";

const MAIN_STATES = Object.freeze({
    CREATE_DUNGEON: 'CREATE_DUNGEON',
    PLAYER_INPUT: 'PLAYER_INPUT',
    GAME_OVER: 'GAME_OVER',
});

export class DungeonScene extends Phaser.Scene {
    /** @type {Dungeon} */
    #dungeon;

    /** @type {boolean} */
    #firstTileStatus;

    /** @type {Toggle} */
    #toggle;

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

        let padding = 20;

        this.#toggle = new Toggle();

        this.add.text(padding, 30, level.id, {
            fontFamily: KENNEY_MINI_FONT_NAME,
            fontSize: 30,
            color: "#ffffff",
        }).setOrigin(0, 0.5);

        this.#dungeon = new Dungeon(this, 10, 10);
        this.#dungeon.create(theme, level);
        this.#dungeon.container.x = (this.scale.width - this.#dungeon.container.getBounds().width) / 2;
        this.#dungeon.container.y = 50 + padding;

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

            this.#firstTileStatus = !(tile.entity && tile.entity.type === this.#toggle.value);

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

        let toggleBotton = new ToggleButton(this, 0, (this.#dungeon.container.y + this.#dungeon.container.getBounds().height + padding), UI_ASSET_KEYS.TILE_SELECTOR, TILE_ENTITY_TYPE.BACKGROUND);
        toggleBotton.container.x = this.#dungeon.container.x + this.#dungeon.container.getBounds().width / 2 - toggleBotton.background.width - padding;
        toggleBotton.add(theme.floor.assetKey, theme.floor.assetFrame);
        this.#toggle.add(toggleBotton);
        
        toggleBotton = new ToggleButton(this, 0, (this.#dungeon.container.y + this.#dungeon.container.getBounds().height + padding), UI_ASSET_KEYS.TILE_SELECTOR, TILE_ENTITY_TYPE.WALL);
        toggleBotton.container.x = this.#dungeon.container.x + this.#dungeon.container.getBounds().width / 2 + padding;
        toggleBotton.add(theme.wall.assetKey, theme.wall.assetFrame);
        this.#toggle.add(toggleBotton);

        this.#toggle.select(this.#toggle.buttons[0]);
    }

    #createStateMachine() {
        this.#stateMachine = new StateMachine('MAIN', this);

        this.#stateMachine.addState({
            name: MAIN_STATES.CREATE_DUNGEON,
            onEnter: () => {
                
                this.#createDungeon();
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
            this.#dungeon.toggleAt(x, y, this.#toggle.value, this.#firstTileStatus, () => {
                if (this.#dungeon.isCompleted()) {
                    this.#stateMachine.setState(MAIN_STATES.GAME_OVER);
                }
            });
        }
    }
}
