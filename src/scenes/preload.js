import Phaser from "../lib/phaser.js";

import { SCENE_KEYS } from "../keys/scene.js";
import { DATA_ASSET_KEYS, DUNGEON_ASSET_KEYS, MAP_ASSET_KEYS, UI_ASSET_KEYS } from "../keys/asset.js";

export class PreloadScene extends Phaser.Scene {
    constructor() {
        super({
            key: SCENE_KEYS.PRELOAD_SCENE,
        });
    }

    preload() {
        this.load.image(UI_ASSET_KEYS.BLANK, 'assets/images/blank.png');
        this.load.spritesheet(UI_ASSET_KEYS.SKILL, 'assets/tilesets/skill.png', { frameWidth: 12, frameHeight: 12 });
        this.load.spritesheet(UI_ASSET_KEYS.BUBBLE, 'assets/tilesets/bubble.png', { frameWidth: 5, frameHeight: 5 });
        this.load.spritesheet(UI_ASSET_KEYS.BUTTON_FLOOR, 'assets/tilesets/button/floor.png', { frameWidth: 25, frameHeight: 25 });
        this.load.spritesheet(UI_ASSET_KEYS.BUTTON_ACTION, 'assets/tilesets/button/action.png', { frameWidth: 79, frameHeight: 15 });
        this.load.bitmapFont(UI_ASSET_KEYS.FONT10, 'assets/fonts/main-10/font.png', 'assets/fonts/main-10/font.xml');
        this.load.bitmapFont(UI_ASSET_KEYS.FONT6, 'assets/fonts/main-6/font.png', 'assets/fonts/main-6/font.xml');
        this.load.bitmapFont(UI_ASSET_KEYS.FONT8, 'assets/fonts/main-8/font.png', 'assets/fonts/main-8/font.xml');
        this.load.bitmapFont(UI_ASSET_KEYS.FONT16, 'assets/fonts/main-16/font.png', 'assets/fonts/main-16/font.xml');
        this.load.bitmapFont(UI_ASSET_KEYS.FONT14, 'assets/fonts/main-14/font.png', 'assets/fonts/main-14/font.xml');
        this.load.bitmapFont(UI_ASSET_KEYS.FONT8BOLD, 'assets/fonts/main-8-bold/font.png', 'assets/fonts/main-8-bold/font.xml');

        this.load.spritesheet(MAP_ASSET_KEYS.UNIT, 'assets/tilesets/unit.png', { frameWidth: 12, frameHeight: 12 });
        this.load.spritesheet(MAP_ASSET_KEYS.WORLD, 'assets/tilesets/world.png', { frameWidth: 12, frameHeight: 12 });
        this.load.spritesheet(MAP_ASSET_KEYS.SELECTION, 'assets/tilesets/selection.png', { frameWidth: 12, frameHeight: 12 });
        this.load.spritesheet(DUNGEON_ASSET_KEYS.CARD, 'assets/tilesets/card.png', { frameWidth: 30, frameHeight: 40 });
        this.load.spritesheet(DUNGEON_ASSET_KEYS.EFFECT, 'assets/tilesets/effect.png', { frameWidth: 8, frameHeight: 8 });

        this.load.bitmapFont(DUNGEON_ASSET_KEYS.FONT, 'assets/fonts/main/main.png', 'assets/fonts/main/main.xml');

        this.load.json(DATA_ASSET_KEYS.UNIT, 'assets/data/unit.json');
        this.load.json(DATA_ASSET_KEYS.ITEM, 'assets/data/item.json');
    }

    create() {
        this.scene.start(SCENE_KEYS.DUNGEON_SCENE);
    }
}
