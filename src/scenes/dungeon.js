import Phaser from "../lib/phaser.js";

import { SCENE_KEYS } from "../keys/scene.js";
import { DUNGEON_ASSET_KEYS } from "../keys/asset.js";
import { Unit } from "../unit.js";
import { StateMachine } from "../state-machine.js";
import { Map } from "../map.js";
import { Action } from "../action.js";
import { Item } from "../item.js";

const MAIN_STATES = Object.freeze({
    CREATE_LEVEL: 'CREATE_LEVEL',
    PLACE_UNITS: 'PLACE_UNITS',
    PLAYER_TURN: 'PLAYER_TURN',
    PLAYER_TURN_WAIT: 'PLAYER_TURN_WAIT',
    ENEMY_TURN: 'ENEMY_TURN',
    END_TURN: 'END_TURN',
});

const scale = 4;

export class DungeonScene extends Phaser.Scene {
    /** @type {Map} */
    #map;

    /** @type {StateMachine} */
    #stateMachine;

    constructor() {
        super({
            key: SCENE_KEYS.DUNGEON_SCENE,
        });
    }

    create() {
        this.#createStateMachine();
        this.#stateMachine.setState(MAIN_STATES.CREATE_LEVEL);
    }
    update() {
        if (this.#stateMachine) {
            this.#stateMachine.update();
        }
    }

    #createStateMachine() {
        this.#stateMachine = new StateMachine('MAIN', this);

        this.#stateMachine.addState({
            name: MAIN_STATES.CREATE_LEVEL,
            onEnter: () => {
                this.cameras.main.fadeOut(0, 0, 0, 0);
                this.cameras.main.fadeIn(500);
                this.#map = new Map(this, 8, 10);

                this.#map.container.x = this.game.canvas.width / 2 - this.#map.container.getBounds().width / 2 + 20;
                this.#map.container.y = 20;

                this.#stateMachine.setState(MAIN_STATES.PLACE_UNITS);
            },
        });

        this.#stateMachine.addState({
            name: MAIN_STATES.PLACE_UNITS,
            onEnter: () => {
                let item = new Item(this, 1, 1, 3);
                this.#map.addItem(item);

                let unit = new Unit(this, 1, 2, 0);
                this.#map.addUnit(unit);

                unit = new Unit(this, 6, 5, 204);
                this.#map.addUnit(unit);

                unit = new Unit(this, 6, 1, 204);
                this.#map.addUnit(unit);

                this.#stateMachine.setState(MAIN_STATES.PLAYER_TURN);
            },
        });

        this.#stateMachine.addState({
            name: MAIN_STATES.PLAYER_TURN,
            onEnter: () => {
                let action_sprites = [];

                for (let y=-1; y<=1; y++) {
                    for (let x=-1; x<=1; x++) {
                        if (Math.abs(x) === Math.abs(y)) {
                            continue;
                        }

                        let newX = this.#map.units[0].x + x;
                        let newY = this.#map.units[0].y + y;

                        if (!this.#map.isInBound(newX, newY)) {
                            continue;
                        }

                        if (!this.#map.isWalkable(newX, newY)) {
                            continue
                        }

                        let action = new Action(
                            this,
                            (newX * 10 * scale) + this.#map.container.x,
                            (newY * 10 * scale) + this.#map.container.y,
                            0,
                            () => {
                                this.#stateMachine.setState(MAIN_STATES.PLAYER_TURN_WAIT);

                                action_sprites.forEach((singleActionSprite) => {
                                    singleActionSprite.hide();
                                });
        
                                this.#map.units[0].move(newX, newY, () => {
                                    this.#map.items.forEach((singleItem) => {
                                        if (singleItem.x === this.#map.units[0].x && singleItem.y === this.#map.units[0].y) {
                                            this.cameras.main.fadeOut(500, 0, 0, 0, (camera, progress) => {
                                                if (progress === 1) {
                                                    this.scene.restart();
                                                }
                                            });
                                            return;
                                        }
                                    });
                                    this.#stateMachine.setState(MAIN_STATES.ENEMY_TURN);
                                });
                            }
                        );
                        action_sprites.push(action);
                    }
                }
                // ...
            },
        });

        this.#stateMachine.addState({
            name: MAIN_STATES.PLAYER_TURN_WAIT,
            onEnter: () => {
                // ...
            },
        });

        this.#stateMachine.addState({
            name: MAIN_STATES.ENEMY_TURN,
            onEnter: () => {
                if (this.#map.units.length > 1) {
                    for (let i=1; i<this.#map.units.length; i++) {

                        let paths = this.#map.findPaths(
                            { x: this.#map.units[i].x, y: this.#map.units[i].y },
                            { x: this.#map.units[0].x, y: this.#map.units[0].y }
                        );

                        console.log(paths);

                        if (paths.length > 1) {
                            let path = paths[0];
                            this.#map.units[i].move(path.x, path.y, () => {
                                this.#stateMachine.setState(MAIN_STATES.PLAYER_TURN);
                            });
                        }
                    }
                }
            },
        });

        this.#stateMachine.addState({
            name: MAIN_STATES.END_TURN,
            onEnter: () => {
                // ...
            },
        });
    }

}
