import Phaser from "../lib/phaser.js";

import { SCENE_KEYS } from "../keys/scene.js";
import { DATA_ASSET_KEYS, DUNGEON_ASSET_KEYS, HELP_ASSET_KEYS, SOUND_ASSET_KEY, UI_ASSET_KEYS } from "../keys/asset.js";

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
        this.load.spritesheet(UI_ASSET_KEYS.BUTTON_GRAY, 'assets/tilesets/button-gray.png', {
            frameWidth: 54,
            frameHeight: 60,
        });
        this.load.spritesheet(UI_ASSET_KEYS.BUTTON_RED, 'assets/tilesets/button-red.png', {
            frameWidth: 54,
            frameHeight: 60,
        });
        this.load.spritesheet(UI_ASSET_KEYS.BUTTON_GREEN, 'assets/tilesets/button-green.png', {
            frameWidth: 54,
            frameHeight: 60,
        });
        this.load.spritesheet(UI_ASSET_KEYS.BUTTON_BLUE, 'assets/tilesets/button-blue.png', {
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
        this.load.spritesheet(UI_ASSET_KEYS.LARGE_TEXT_BUTTON, 'assets/tilesets/large-text-button.png', {
            frameWidth: 150,
            frameHeight: 60,
        });
        this.load.spritesheet(UI_ASSET_KEYS.PAGE_BUTTON, 'assets/tilesets/page-button.png', {
            frameWidth: 34,
            frameHeight: 40,
        });
        this.load.spritesheet(UI_ASSET_KEYS.ICONS, 'assets/tilesets/icons.png', {
            frameWidth: 40,
            frameHeight: 40,
        });

        this.load.image(UI_ASSET_KEYS.TRANSPARENT, 'assets/images/transparent.png');
        this.load.image(HELP_ASSET_KEYS.HELP_PAGE2, 'assets/images/helpPage2.png');
        this.load.image(HELP_ASSET_KEYS.HELP_PAGE3, 'assets/images/helpPage3.png');
        this.load.image(HELP_ASSET_KEYS.HELP_PAGE5, 'assets/images/helpPage5.png');

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

        this.load.audio(SOUND_ASSET_KEY.CLICK, ["assets/sounds/click.wav"]);
        this.load.audio(SOUND_ASSET_KEY.TOGGLE, ["assets/sounds/toggle.wav"]);
        this.load.audio(SOUND_ASSET_KEY.PAINT, ["assets/sounds/paint.wav"]);
    }

    create() {
        this.scene.start(SCENE_KEYS.TITLE_SCENE);
    }
}
