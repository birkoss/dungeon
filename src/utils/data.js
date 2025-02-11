import Phaser from '../lib/phaser.js';

import { DATA_ASSET_KEYS } from '../keys/asset.js';

export class Data {
    /**
     * @param {Phaser.Scene} scene 
     * @param {string} itemId  
     */
    static getItem(scene, itemId) {
        /** @type {UnitData[]} */
        const data = scene.cache.json.get(DATA_ASSET_KEYS.ITEM);

        return data.find((unit) => unit.id === itemId);
    }
    /**
     * @param {Phaser.Scene} scene 
     * @param {string} unitId  
     */
    static getUnit(scene, unitId) {
        /** @type {UnitData[]} */
        const data = scene.cache.json.get(DATA_ASSET_KEYS.UNIT);

        return data.find((unit) => unit.id === unitId);
    }
}
