import Phaser from "../lib/phaser.js";

import { SCENE_KEYS } from "../keys/scene.js";
import { Map } from "../map/map.js";
import { MAP_ASSET_KEYS, UI_ASSET_KEYS } from "../keys/asset.js";
import { Entity, ENTITY_TYPE } from "../entity/entity.js";
import { Unit } from "../entity/unit.js";
import { Data } from "../utils/data.js";

export class DungeonScene extends Phaser.Scene {
    /** @type {Map} */
    #map;

    constructor() {
        super({
            key: SCENE_KEYS.DUNGEON_SCENE,
        });
    }

    create() {
        this.#map = new Map(this, 7, 7);

        this.#map.container.x = (this.scale.width - this.#map.container.getBounds().width) / 2;
        this.#map.container.y = this.#map.container.x;

        let data = Data.getUnit(this, 'warrior');

        let player = new Unit(this, 2, 3, data);
        this.#map.addUnit(player);

        data = Data.getUnit(this, 'skeleton_warrior');
        let enemy = new Unit(this, 4, 3, data);
        enemy.face('Left');
        this.#map.addUnit(enemy);

        let entity = new Entity(this, 4, 2, ENTITY_TYPE.DECORATION);
        entity.create(MAP_ASSET_KEYS.WORLD, 178);
        this.#map.addEntity(entity);

        let button = this.add.image(this.game.canvas.width/2, this.#map.container.y + this.#map.container.getBounds().height + 40, UI_ASSET_KEYS.BLANK, 0).setOrigin(0.5).setScale(4);
        button.setInteractive();
        button.on('pointerdown', () => {
            player.attack();
            this.time.delayedCall(400, () => {
                enemy.takeDamage(10);
                player.idle();
            });
            
        });

    }

    update() {

    }

}
