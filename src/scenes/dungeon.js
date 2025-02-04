import Phaser from "../lib/phaser.js";

import { SCENE_KEYS } from "../keys/scene.js";
import { Unit } from "../unit.js";
import { StateMachine } from "../state-machine.js";
import { Map } from "../map.js";
import { Item, ITEM_TYPE } from "../item.js";
import { Action } from "../action.js";
import { TILE_SCALE } from "../tile.js";

const MAIN_STATES = Object.freeze({
    CREATE_LEVEL: 'CREATE_LEVEL',
    PLACE_UNITS: 'PLACE_UNITS',
    PLAYER_TURN: 'PLAYER_TURN',
    PLAYER_TURN_WAIT: 'PLAYER_TURN_WAIT',
    ENEMY_TURN: 'ENEMY_TURN',
    END_TURN: 'END_TURN',
});

export class DungeonScene extends Phaser.Scene {
    /** @type {Map} */
    #map;

    /** @type {number} */
    #floor;

    /** @type {StateMachine} */
    #stateMachine;

    constructor() {
        super({
            key: SCENE_KEYS.DUNGEON_SCENE,
        });
    }

    create() {
        this.#floor = 10;

        this.#map = new Map(this, 8, 10);
        this.#map.container.x = this.game.canvas.width / 2 - this.#map.width*10*TILE_SCALE / 2 + 20;
        this.#map.container.y = 20;

        this.#createStateMachine();
        this.#stateMachine.setState(MAIN_STATES.CREATE_LEVEL);
    }
    update() {
        if (this.#stateMachine) {
            this.#stateMachine.update();
        }
    }

    #createMap() {
        this.cameras.main.fadeOut(0, 0, 0, 0);
        this.cameras.main.fadeIn(500);

        this.#map.generate();

        this.#stateMachine.setState(MAIN_STATES.PLACE_UNITS);
    }

    createUnits() {
        let emptyTiles = this.#map.getEmptyTiles();
        
        Phaser.Utils.Array.Shuffle(emptyTiles);

        for (let i=1; i<100; i++) {
            // console.log(this.#map.fill(i, emptyTiles.length));
        }

        // Add stair
        let tile = emptyTiles.pop();
        let item = new Item(this, tile.x, tile.y, ITEM_TYPE.EXIT);
        this.#map.addItem(item);

        tile = emptyTiles.pop();
        let unit = new Unit(this, tile.x, tile.y, 0);
        unit.hp = 10;
        this.#map.addUnit(unit);

        let tiles = this.#map.fill(this.#floor, emptyTiles.length);
        console.log(tiles);

        tiles.forEach((singleTile) => {
            tile = emptyTiles.pop();

            if (singleTile === 'coin') {
                let item = new Item(this, tile.x, tile.y, ITEM_TYPE.COIN);
                this.#map.addItem(item);
            } else if (singleTile === 'potion') {
                let item = new Item(this, tile.x, tile.y, ITEM_TYPE.POTION);
                this.#map.addItem(item);
            } else {
                unit = new Unit(this, tile.x, tile.y, 204);
                this.#map.addUnit(unit);
            }
        });

        this.#stateMachine.setState(MAIN_STATES.PLAYER_TURN);
    }

    #createStateMachine() {
        this.#stateMachine = new StateMachine('MAIN', this);

        this.#stateMachine.addState({
            name: MAIN_STATES.CREATE_LEVEL,
            onEnter: () => {
                this.#createMap();
            },
        });

        this.#stateMachine.addState({
            name: MAIN_STATES.PLACE_UNITS,
            onEnter: () => {
                this.createUnits();
            },
        });

        this.#stateMachine.addState({
            name: MAIN_STATES.PLAYER_TURN,
            onEnter: () => {
                let actions = [];

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

                        if (this.#map.isWalkable(newX, newY)) {
                            const action = new Action(
                                this,
                                (newX * 10 * TILE_SCALE) + this.#map.container.x,
                                (newY * 10 * TILE_SCALE) + this.#map.container.y,
                                0,
                                () => {
                                    this.#stateMachine.setState(MAIN_STATES.PLAYER_TURN_WAIT);
        
                                    actions.forEach((singleActionSprite) => {
                                        singleActionSprite.hide();
                                    });
            
                                    this.#map.fixDepth(this.#map.units[0], newX, newY);
                                    this.#map.units[0].move(newX, newY, () => {
                                        let item = this.#map.items.find(singleItem => singleItem.x === this.#map.units[0].x && singleItem.y === this.#map.units[0].y);
                                        if (item) {
                                            if (item.type === ITEM_TYPE.EXIT) {
                                                this.cameras.main.fadeOut(500, 0, 0, 0, (camera, progress) => {
                                                    if (progress === 1) {
                                                        this.#floor++;
                                                        this.#stateMachine.setState(MAIN_STATES.CREATE_LEVEL);
                                                    }
                                                });
                                                return;
                                            }
                                            
                                            if (item.type === ITEM_TYPE.COIN) {
                                                this.#map.useItemAt(item.x, item.y);
                                                this.#map.units[0].coins++;
                                            }

                                            // TODO: Potion
                                        }
                                        this.#stateMachine.setState(MAIN_STATES.ENEMY_TURN);
                                    });
                                }
                            );
                            action.gameObject.setTint(0x008751);
                            actions.push(action);
                        } else if(this.#map.isAttackable(newX, newY)) {
                            const action = new Action(
                                this,
                                (newX * 10 * TILE_SCALE) + this.#map.container.x,
                                (newY * 10 * TILE_SCALE) + this.#map.container.y,
                                0,
                                () => {
                                    this.#stateMachine.setState(MAIN_STATES.PLAYER_TURN_WAIT);
        
                                    actions.forEach((singleActionSprite) => {
                                        singleActionSprite.hide();
                                    });
            
                                    console.log("PLAYER ATTACKING...");
                                    const defender = this.#map.units.find(singleUnit => singleUnit.isAlive && singleUnit.x === newX && singleUnit.y === newY);
                                    this.#map.units[0].attack(defender, () => {
                                        this.#stateMachine.setState(MAIN_STATES.ENEMY_TURN);
                                    });
                                }
                            );
                            action.gameObject.setTint(0xff004d);
                            actions.push(action);
                        }
                    }
                }
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
                // No more enemy on the map
                // TODO: No more alive enemy on the map
                if (this.#map.units.length === 1) {
                    this.#stateMachine.setState(MAIN_STATES.PLAYER_TURN);
                }

                let differentPaths = [];

                console.log(this.#map.units);
                // 
                for (let i=1; i<this.#map.units.length; i++) {
                    if (!this.#map.units[i].isAlive) {
                        continue;
                    }
                    let path = {
                        'units': [
                            this.#map.units[i],
                        ],
                        'paths': [],
                        'total': 0,
                    }
                    for (let j=1; j<this.#map.units.length; j++) {
                        if (i === j || !this.#map.units[j].isAlive) {
                            continue;
                        }
                        path['units'].push(this.#map.units[j]);
                    }
                    differentPaths.push(path);
                }

                for (let d=0; d<differentPaths.length; d++) {
                    let path = differentPaths[d];
                    for (let i=0; i<path['units'].length; i++) {
                        let enemyTilePosition = JSON.parse(JSON.stringify(path['paths']));

                        // Add remaining units at their current position
                        for (let j=i+1; j<path['units'].length; j++) {
                            enemyTilePosition.push({x: path['units'][j].x, y: path['units'][j].y});
                        }

                        let paths = this.#map.findPaths(
                            { x: path['units'][i].x, y: path['units'][i].y },
                            { x: this.#map.units[0].x, y: this.#map.units[0].y },
                            enemyTilePosition
                        );

                        console.log("PATHS", paths);    
    
                        if (paths.length > 1) {
                            differentPaths[d]['paths'].push(paths[0]);
                            path['total'] += paths.length - 1;
                        } else {
                            differentPaths[d]['paths'].push({ x: path['units'][i].x, y: path['units'][i].y });
                        }
                    }
                }

                console.log(differentPaths);

                let shortestPathIndex = differentPaths.length - 1;
                for (let d=0; d<differentPaths.length - 1; d++) {
                    if (differentPaths[d]['total'] < differentPaths[shortestPathIndex]['total']) {
                        shortestPathIndex = d;
                    }
                }

                if (shortestPathIndex !== -1) {
                    differentPaths[shortestPathIndex]['units'].forEach((singleUnit, index) => {
                        const path = differentPaths[shortestPathIndex]['paths'][index];

                        if (singleUnit.x === path.x && singleUnit.y === path.y) {
                            console.log("UNIT ATTACKUING...;"); 
                            singleUnit.attack(this.#map.units[0], () => {
                                if (index === differentPaths[shortestPathIndex]['units'].length - 1) {
                                    this.#stateMachine.setState(MAIN_STATES.PLAYER_TURN);
                                }
                            });
                        } else {
                            this.#map.fixDepth(singleUnit, path.x, path.y);

                            singleUnit.move(path.x, path.y, () => {
                                if (index === differentPaths[shortestPathIndex]['units'].length - 1) {
                                    this.#stateMachine.setState(MAIN_STATES.PLAYER_TURN);
                                }
                            });
                        }
                    });
                }

                if (differentPaths.length === 0) {
                    this.#stateMachine.setState(MAIN_STATES.PLAYER_TURN);
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
