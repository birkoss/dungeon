import Phaser from './lib/phaser.js';

import { DATA_ASSET_KEYS } from './keys/asset.js';

export class Data {
    /**
     * @param {Phaser.Scene} scene 
     * @param {string} themeId  
     */
    static getDungeonTheme(scene, themeId) {
        /** @type {DungeonTheme[]} */
        const data = scene.cache.json.get(DATA_ASSET_KEYS.DUNGEON_THEMES);

        return data.find((theme) => theme.id === themeId);
    }
    /**
     * @param {Phaser.Scene} scene 
     * @param {string} levelId  
     */
    static getLevel(scene, levelId) {
        /** @type {Level[]} */
        const data = scene.cache.json.get(DATA_ASSET_KEYS.LEVELS);

        return data.find((level) => level.id === levelId);
    }
}
