import { Entity, ENTITY_TYPE } from "../entity/entity.js";
import { Unit, UNIT_AI } from "../entity/unit.js";
import { MAP_ASSET_KEYS, UI_ASSET_KEYS } from "../keys/asset.js";
import { Data } from "../utils/data.js";
import { Tile, TILE_TYPE } from "./tile.js";

const TILE_SCALE = 4;

export const MAP_FLOOR = Object.freeze({
    ENEMY: 'ENEMY',
    BOSS: 'BOSS',
    CHEST: 'CHEST',
    EMPTY: 'EMPTY',
    TAVERN: 'TAVERN',
});

export class Map {
    /** @type {Phaser.GameObjects.Container} */
    #container;
    /** @type {Phaser.Scene} */
    #scene;
    /** @type {number} */
    #width;
    /** @type {number} */
    #height;

    #overlay;

    /** @type {Entity[]} */
    #entities;
    /** @type {Unit[]} */
    #units;
    /** @type {Tile[]} */
    #tiles;
    /** @type {keyof typeof MAP_FLOOR} */
    #floor;

    #queue;

    #selections;

    /**
     * @param {Phaser.Scene} scene
     * @param {number} width
     * @param {number} height
     */
    constructor(scene, width, height) {
        this.#scene = scene;
        this.#width = width;
        this.#height = height;

        this.#container = this.#scene.add.container(0, 0);

        this.#entities = [];
        this.#units = [];
        this.#tiles = [];
        this.#selections = [];

        let tile_type;
        let tile_frame;
        for (let y=0; y<this.#height; y++) {
            for (let x=0; x<this.#width; x++) {
                if (y === 0 || y === this.#height-1 || x === 0 || x === this.#width-1) {
                    tile_type = TILE_TYPE.WALL;
                    tile_frame = 85;
                } else {
                    tile_frame = 93;
                    tile_type = TILE_TYPE.FLOOR;
                }

                let tile = new Tile(this.#scene, x, y, tile_type);
                tile.create(MAP_ASSET_KEYS.WORLD, tile_frame);

                tile.container.x = tile.x * tile.container.getBounds().width;
                tile.container.y = tile.y * tile.container.getBounds().height;

                tile.container.x += tile.container.getBounds().width/2;
                tile.container.y += tile.container.getBounds().height/2;

                this.#container.add(tile.container);
            }
        }

        this.#overlay = this.#scene.add.image(this.#container.getBounds().width/2, this.#container.getBounds().height/2, UI_ASSET_KEYS.BLANK).setOrigin(0.5).setTint(0x000000).setAlpha(0);
        this.#overlay.displayWidth = this.#container.getBounds().width - 96;
        this.#overlay.displayHeight = this.#container.getBounds().height - 96;
        this.#container.add(this.#overlay);
    }

    get container() { return this.#container; }
    get floor() { return this.#floor; }
    get units() { return this.#units; }

    addEntity(entity) {
        this.#entities.push(entity);
        this.#placeEntity(entity);
    }

    addUnit(unit) {
        this.#units.push(unit);
        this.#placeEntity(unit);
    }

    clearSelections() {
        this.#selections.forEach((singleSelection) => {
            singleSelection.destroy();
        });
        this.#selections = [];
    }

    createQueue() {
        this.#queue = [];

        this.#units.forEach((singleUnit) => {
            this.#queue.push(singleUnit);
        });
    }

    /**
     * Create a new floor on the current map
     * @param {keyof typeof MAP_FLOOR} type
     * @param {any} floorData
     */
    loadFloor(type, floorData) {
        this.#floor = type;

        // Empty the map
        this.#units.forEach((singleUnit) => {
            singleUnit.container.removeAll(true);
        });
        this.#units = [];
        this.#entities.forEach((singleEntity) => {
            singleEntity.container.removeAll(true);
        });
        this.#entities = [];

        floorData['party'].forEach((unitData) => {
            let player = new Unit(this.#scene, 2, 3, UNIT_AI.PLAYER, unitData);
            this.addUnit(player);
        });

        switch (type) {
            case MAP_FLOOR.ENEMY:        
                let unitData = Data.getUnit(this.#scene, 'skeleton_warrior');
                let enemy = new Unit(this.#scene, 4, 3, UNIT_AI.AI, unitData);
                enemy.face('Left');
                this.addUnit(enemy);
        
                let entity = new Entity(this.#scene, 3, 2, ENTITY_TYPE.DECORATION);
                entity.create(MAP_ASSET_KEYS.WORLD, 178);
                this.addEntity(entity);
                
                break;
            default:
                console.error("TYPE NOT CREATED YET: ", type);
        }
    }

    getNextQueuedUnit() {
        return this.#queue.shift();
    }

    /**
     * @param {Unit} unit
     */
    selectUnit(unit) {
        let color = (this.#selections.length === 0 ? 0xffffff : 0xff0000);

        const selection = this.#scene.add.image(unit.container.x, unit.container.y, MAP_ASSET_KEYS.SELECTION, (color === 0xffffff ? 0 : 1)).setOrigin(0.5).setScale(TILE_SCALE).setAlpha(1).setTint(color);
        this.#container.add(selection);

        this.#selections.push(selection);
    }

    verifyQueue() {
        this.#queue = this.#queue.filter((singleUnit) => singleUnit.isAlive);
    }

    /**
     * @param {() => void} [callback] 
     */
    show(callback) {
        this.#scene.add.tween({
            targets: this.#overlay,
            alpha: 0,
            duration: 600,
            onComplete: callback,
        });
    }

    /**
     * @param {() => void} [callback] 
     */
    hide(callback) {
        this.#overlay.alpha = 0;
        this.#container.bringToTop(this.#overlay);

        this.#scene.add.tween({
            targets: this.#overlay,
            alpha: 1,
            duration: 600,
            onComplete: callback,
        });
    }

    /**
     * @param {Entity} entity 
     */
    #placeEntity(entity) {
        this.#container.add(entity.container);
        this.#container.bringToTop(this.#overlay);

        entity.container.x = entity.x * entity.container.getBounds().width + entity.container.getBounds().width/2;
        entity.container.y = entity.y * entity.container.getBounds().height + entity.container.getBounds().height/2;
    }
}
