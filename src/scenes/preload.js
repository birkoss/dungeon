import Phaser from "../lib/phaser.js";

import { SCENE_KEYS } from "../keys/scene.js";
import { DATA_ASSET_KEYS, DUNGEON_ASSET_KEYS, UI_ASSET_KEYS } from "../keys/asset.js";

export class PreloadScene extends Phaser.Scene {
    constructor() {
        super({
            key: SCENE_KEYS.PRELOAD_SCENE,
        });
    }

    preload() {
        this.load.spritesheet(DUNGEON_ASSET_KEYS.DUNGEON, 'assets/tilesets/dungeon.png', {
            frameWidth: 40,
            frameHeight: 40,
        });
        this.load.spritesheet(UI_ASSET_KEYS.BUTTON, 'assets/tilesets/button.png', {
            frameWidth: 54,
            frameHeight: 60,
        });
        this.load.spritesheet(UI_ASSET_KEYS.BUTTON_RED, 'assets/tilesets/button-red.png', {
            frameWidth: 54,
            frameHeight: 60,
        });
        this.load.spritesheet(UI_ASSET_KEYS.DUNGEON_SELECTOR, 'assets/tilesets/dungeon-selector.png', {
            frameWidth: 54,
            frameHeight: 60,
        });
        this.load.spritesheet(UI_ASSET_KEYS.LEVEL_SELECTOR, 'assets/tilesets/level-selector.png', {
            frameWidth: 70,
            frameHeight: 70,
        });
        this.load.spritesheet(UI_ASSET_KEYS.TEXT_BUTTON, 'assets/tilesets/text-button.png', {
            frameWidth: 100,
            frameHeight: 60,
        });
        this.load.spritesheet(UI_ASSET_KEYS.ICONS, 'assets/tilesets/icons.png', {
            frameWidth: 40,
            frameHeight: 40,
        });

        this.load.image(UI_ASSET_KEYS.TRANSPARENT, 'assets/images/transparent.png');

        this.load.json(
            DATA_ASSET_KEYS.DUNGEON_THEMES,
            'assets/data/dungeon-themes.json'
        );
        this.load.json(
            DATA_ASSET_KEYS.LEVELS,
            'assets/data/levels.json'
        );

        this.load.bitmapFont(UI_ASSET_KEYS.SMALL_FONT, 'assets/fonts/small-font.png', 'assets/fonts/small-font.xml');
        this.load.bitmapFont(UI_ASSET_KEYS.LARGE_FONT, 'assets/fonts/large-font.png', 'assets/fonts/large-font.xml');
    }

    create() {
        this.scene.start(SCENE_KEYS.DUNGEON_SCENE);
    }
}
