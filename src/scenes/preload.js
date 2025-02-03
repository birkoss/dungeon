import Phaser from "../lib/phaser.js";

import { SCENE_KEYS } from "../keys/scene.js";
import { DATA_ASSET_KEYS, DUNGEON_ASSET_KEYS, EFFECT_ASSET_KEYS, PANEL_ASSET_KEYS, UI_ASSET_KEYS } from "../keys/asset.js";

export class PreloadScene extends Phaser.Scene {
    constructor() {
        super({
            key: SCENE_KEYS.PRELOAD_SCENE,
        });
    }

    preload() {
        this.load.image(UI_ASSET_KEYS.BLANK, 'assets/images/blank.png');

        this.load.spritesheet(DUNGEON_ASSET_KEYS.WORLD, 'assets/tilesets/world.png', { frameWidth: 10, frameHeight: 10 });
        this.load.spritesheet(DUNGEON_ASSET_KEYS.ACTION, 'assets/tilesets/action.png', { frameWidth: 10, frameHeight: 10 });
        this.load.spritesheet(DUNGEON_ASSET_KEYS.UNIT, 'assets/tilesets/unit.png', { frameWidth: 20, frameHeight: 20 });
    }

    create() {
        this.scene.start(SCENE_KEYS.DUNGEON_SCENE);
    }
}
