import Phaser from "../lib/phaser.js";
import * as WebFontLoader from '../lib/webfontloader.js';

import { SCENE_KEYS } from "../keys/scene.js";
import { DATA_ASSET_KEYS, DUNGEON_ASSET_KEYS, UI_ASSET_KEYS } from "../keys/asset.js";
import { TILE_SIZE } from "../config.js";
import { KENNEY_MINI_FONT_NAME } from "../keys/font.js";
import { WebFontFileLoader } from "../web-font-file-loader.js";

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
        this.load.spritesheet(UI_ASSET_KEYS.TILE_SELECTOR, 'assets/tilesets/tile-selector.png', {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.spritesheet(UI_ASSET_KEYS.BUTTON, 'assets/tilesets/button.png', {
            frameWidth: 50,
            frameHeight: 50,
        });
        this.load.spritesheet(UI_ASSET_KEYS.LARGE_BUTTON, 'assets/tilesets/large-button.png', {
            frameWidth: 150,
            frameHeight: 50,
        });

        this.load.json(
            DATA_ASSET_KEYS.DUNGEON_THEMES,
            'assets/data/dungeon-themes.json'
        );
        this.load.json(
            DATA_ASSET_KEYS.LEVELS,
            'assets/data/levels.json'
        );

        this.load.addFile(new WebFontFileLoader(this.load, [KENNEY_MINI_FONT_NAME]));
    }

    create() {
        this.scene.start(SCENE_KEYS.ABOUT_SCENE);
    }
}
