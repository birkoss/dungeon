import Phaser from "../lib/phaser.js";

import { SCENE_KEYS } from "../keys/scene.js";
import { DATA_ASSET_KEYS, DUNGEON_ASSET_KEYS } from "../keys/asset.js";
import { TILE_SIZE } from "../config.js";

export class PreloadScene extends Phaser.Scene {
    constructor() {
        super({
            key: SCENE_KEYS.PRELOAD_SCENE,
        });
    }

    preload() {
        this.load.spritesheet(DUNGEON_ASSET_KEYS.WORLD, 'assets/tilesets/world.png', {
            frameWidth: TILE_SIZE,
            frameHeight: TILE_SIZE,
        });
        this.load.spritesheet(DUNGEON_ASSET_KEYS.UNITS, 'assets/tilesets/units.png', {
            frameWidth: TILE_SIZE,
            frameHeight: TILE_SIZE,
        });
        this.load.spritesheet(DUNGEON_ASSET_KEYS.DUNGEON, 'assets/tilesets/dungeon.png', {
            frameWidth: 40,
            frameHeight: 40,
        });

        this.load.json(
            DATA_ASSET_KEYS.DUNGEON_THEMES,
            'assets/data/dungeon-themes.json'
        );
        this.load.json(
            DATA_ASSET_KEYS.LEVELS,
            'assets/data/levels.json'
        );
    }

    create() {
        this.scene.start(SCENE_KEYS.DUNGEON_SCENE);
    }
}
