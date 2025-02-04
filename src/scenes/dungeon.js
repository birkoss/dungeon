import Phaser from "../lib/phaser.js";
import Mrpas from "../lib/mrpas.js";

import { SCENE_KEYS } from "../keys/scene.js";
import { Unit } from "../unit.js";
import { StateMachine } from "../state-machine.js";
import { Map } from "../map.js";
import { Item, ITEM_TYPE } from "../item.js";
import { Action } from "../action.js";
import { TILE_SCALE, TILE_TYPE } from "../tile.js";
import { Panel } from "../ui/panel.js";

const MAIN_STATES = Object.freeze({
    CREATE_LEVEL: 'CREATE_LEVEL',
    PLACE_UNITS: 'PLACE_UNITS',
    PLAYER_TURN: 'PLAYER_TURN',
    PLAYER_TURN_WAIT: 'PLAYER_TURN_WAIT',
    ENEMY_TURN: 'ENEMY_TURN',
    END_TURN: 'END_TURN',
});

export class DungeonScene extends Phaser.Scene {
    /** @type {Mrpas} */
    #fov;

    /** @type {Panel} */
    #panel;

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
        this.#panel = new Panel(this, 0, 0);

        this.#floor = 1;

        this.#map = new Map(this, 8, 10);
        this.#map.container.x = this.game.canvas.width / 2 - this.#map.width*10*TILE_SCALE / 2 + 20;
        this.#map.container.y = this.#panel.container.getBounds().height + this.#map.container.x;

        this.#createStateMachine();
        this.#stateMachine.setState(MAIN_STATES.CREATE_LEVEL);

        this.#fov = new Mrpas(
            this.#map.width,
            this.#map.height,
            (x, y) => {
			    const tile = this.#map.getTileAt(x, y);
			    return tile && tile.type === TILE_TYPE.FLOOR;
		    }
        );
    }

    update() {
        this.#updateFOV();

        if (this.#stateMachine) {
            this.#stateMachine.update();
        }
    }

    /**
     * Create the map
     */
    #createMap() {
        this.cameras.main.fadeOut(0, 0, 0, 0);
        this.cameras.main.fadeIn(500);

        this.#map.generate();

        this.#panel.updateFloorName(this.#floor);

        this.#stateMachine.setState(MAIN_STATES.PLACE_UNITS);
    }
    
    /**
     * Create the units and items
     */
    createUnits() {
        let emptyTiles = this.#map.getEmptyTiles();
        Phaser.Utils.Array.Shuffle(emptyTiles);

        // Add stair
        let tile = emptyTiles.pop();
        let item = new Item(this, tile.x, tile.y, ITEM_TYPE.EXIT);
        this.#map.addItem(item);

        tile = emptyTiles.pop();
        // let unit = new Unit(this, tile.x, tile.y, 0);
        let unit = new Unit(this, 1, 1, 0);
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

        unit = new Unit(this, 1, 4, 204);
        this.#map.addUnit(unit);

        this.#stateMachine.setState(MAIN_STATES.PLAYER_TURN);
    }

    /**
     * Create the state machine
     */
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
                                (newX * 10 * TILE_SCALE),
                                (newY * 10 * TILE_SCALE),
                                0,
                                () => {
                                    this.#stateMachine.setState(MAIN_STATES.PLAYER_TURN_WAIT);
        
                                    this.#map.clearActions();

                                    let action = {
                                        type: 'move',
                                        unit: this.#map.units[0],
                                        destination: { x: newX, y: newY },
                                    }

                                    this.#executeActions([action], () => {
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

                                            if (item.type === ITEM_TYPE.POTION) {
                                                this.#map.useItemAt(item.x, item.y);
                                                this.#map.units[0].hp += 1;
                                            }
                                        }
                                        this.#stateMachine.setState(MAIN_STATES.ENEMY_TURN);
                                    });
                                }
                            );
                            action.gameObject.setTint(0x008751);
                            this.#map.addAction(action);
                        } else if(this.#map.isAttackable(newX, newY)) {
                            const action = new Action(
                                this,
                                (newX * 10 * TILE_SCALE),
                                (newY * 10 * TILE_SCALE),
                                0,
                                () => {
                                    this.#stateMachine.setState(MAIN_STATES.PLAYER_TURN_WAIT);
        
                                    this.#map.clearActions();
            
                                    let action = {
                                        'type': 'attack',
                                        'attacker': this.#map.units[0],
                                        'defender': this.#map.units.find(singleUnit => singleUnit.isAlive && singleUnit.x === newX && singleUnit.y === newY),
                                    };
                                    this.#executeActions([action], () => {
                                        this.#stateMachine.setState(MAIN_STATES.ENEMY_TURN);
                                    });
                                }
                            );
                            action.gameObject.setTint(0xff004d);
                            this.#map.addAction(action);
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
                // No alive enemy on the map
                let everyEnemyIsDead = true;
                for (let i=1; i<this.#map.units.length; i++) {
                    if (this.#map.units[i].isAlive) {
                        everyEnemyIsDead = false;
                        break;
                    }
                }
                if (everyEnemyIsDead) {
                    this.#stateMachine.setState(MAIN_STATES.PLAYER_TURN);
                    return;
                }

                // Generate the best enemy actions
                let actions = this.#createEnemyActions();

                this.#executeActions(actions, () => {
                    this.#stateMachine.setState(MAIN_STATES.PLAYER_TURN);
                });
            },
        });

        this.#stateMachine.addState({
            name: MAIN_STATES.END_TURN,
            onEnter: () => {
                // ...
            },
        });
    }

    /**
     * Create the best actions for the enemies
     */
    #createEnemyActions() {
        const actions = [];

        const combinaisons = [];

        // Create each possible combinaisons where each enemy is the first to move
        for (let i=1; i<this.#map.units.length; i++) {
            if (!this.#map.units[i].isAlive) {
                continue;
            }
            const combinaison = {
                'units': [
                    this.#map.units[i],
                ],
                'destinations': [],
                'distance': 0,
            }
            // Add each other enemies
            for (let j=1; j<this.#map.units.length; j++) {
                if (i === j || !this.#map.units[j].isAlive) {
                    continue;
                }
                combinaison['units'].push(this.#map.units[j]);
            }
            combinaisons.push(combinaison);
        }

        // Resolve each combinaisons (find the path for each units and calculate the distance)
        combinaisons.forEach((singleCombinaison) => {
            for (let i=0; i<singleCombinaison['units'].length; i++) {
                // Copy already calculated destinations
                const enemyTilePosition = JSON.parse(JSON.stringify(singleCombinaison['destinations']));

                // Add remaining units at their CURRENT position
                for (let j=i+1; j<singleCombinaison['units'].length; j++) {
                    enemyTilePosition.push(
                        {x: singleCombinaison['units'][j].x, y: singleCombinaison['units'][j].y}
                    );
                }

                // Find the shortest path from this unit to the player
                const paths = this.#map.findPaths(
                    { x: singleCombinaison['units'][i].x, y: singleCombinaison['units'][i].y },
                    { x: this.#map.units[0].x, y: this.#map.units[0].y },
                    enemyTilePosition
                );
  
                if (paths.length === 1) {
                    // Adjacent to the player
                    singleCombinaison['destinations'].push({ x: singleCombinaison['units'][i].x, y: singleCombinaison['units'][i].y });
                    singleCombinaison['distance'] += 1;
                } else if (paths.length === 0) {
                    // No path (Blocked by another enemy)

                    // Lets get the unblocked paths from this unit to the player
                    const unblockedPaths = this.#map.findPaths(
                        { x: singleCombinaison['units'][i].x, y: singleCombinaison['units'][i].y },
                        { x: this.#map.units[0].x, y: this.#map.units[0].y },
                        []
                    );
                    
                    // Reverse the array to start from the end up to the unit
                    unblockedPaths.reverse();
                    // Remove the destination
                    unblockedPaths.shift();
                    // Remove the previous tile since we already know it's blocked by another enemy
                    unblockedPaths.shift();
        
                    // Default position is no movemement
                    let alternativePath = { x: singleCombinaison['units'][i].x, y: singleCombinaison['units'][i].y };

                    // First the first unblocked path (with enemy in the way)
                    for (let p=0; p<unblockedPaths.length; p++) {
                        const newPaths = this.#map.findPaths(
                            { x: singleCombinaison['units'][i].x, y: singleCombinaison['units'][i].y },
                            { x: unblockedPaths[p].x, y: unblockedPaths[p].y },
                            enemyTilePosition
                        );
        
                        // If we found a path, then we can use it
                        if (newPaths.length > 0) {
                            alternativePath = newPaths.shift();
                            break;
                        }
                    }

                    singleCombinaison['destinations'].push(alternativePath);
                    singleCombinaison['distance'] += unblockedPaths.length + 1;
                } else {
                    // Found a path, move to the next position
                    singleCombinaison['destinations'].push(paths.shift());
                    singleCombinaison['distance'] += paths.length - 1;
                }
            }
        });

        // Find the shortest distance
        let shortestIndex = combinaisons.length - 1;
        for (let d=0; d<combinaisons.length - 1; d++) {
            if (combinaisons[d]['distance'] < combinaisons[shortestIndex]['distance']) {
                shortestIndex = d;
            }
        }

        // Found a shortest distance
        if (shortestIndex !== -1) {
            combinaisons[shortestIndex]['units'].forEach((singleUnit, index) => {
                const destination = combinaisons[shortestIndex]['destinations'][index];

                if (singleUnit.x === destination.x && singleUnit.y === destination.y) {
                    // Can't move
                    
                    // Can we attack the player (are we adjacent) ?
                    if (Math.abs(singleUnit.x - this.#map.units[0].x) + Math.abs(singleUnit.y - this.#map.units[0].y) === 1) {
                        actions.push({
                            'type': 'attack',
                            'attacker': singleUnit,
                            'defender': this.#map.units[0],
                        });
                    }
                } else {
                    // Move to the destination
                    actions.push({
                        'type': 'move',
                        'unit': singleUnit,
                        'destination': destination,
                    });
                }
            });
        }

        return actions;
    }

    /**
     * Execute a list of actions at the same time
     * - Callback is called when all actions are completed
     * @param {Array} actions
     * @param {() => void} [callback]
     */
    #executeActions(actions, callback) {
        let totalActions = 0;

        actions.forEach((singleAction, singleIndex) => {
            totalActions++;
            if (singleAction.type === 'attack') {
                singleAction.attacker.attack(singleAction.defender, () => {
                    totalActions--;
                    if (totalActions === 0 && callback) {
                        callback();
                    }
                });
                return;
            }
            if (singleAction.type === 'move') {
                this.#map.fixDepth(singleAction.unit, singleAction.destination.x, singleAction.destination.y);

                singleAction.unit.move(singleAction.destination.x, singleAction.destination.y, () => {
                    totalActions--;
                    if (totalActions === 0 && callback) {
                        callback();
                    }
                });
                return;
            }
        });

        if (totalActions === 0 && callback) {
            callback();
        }
    }

    #updateFOV() {
        if (!this.#fov || !this.#map || this.#map.units.length === 0) {
            return;
        }
    
        // Get player's position and radius
        const player_x = this.#map.units[0].x;
        const player_y = this.#map.units[0].y;
        const player_radius = 2;

        // Compute fov from player's position
        this.#fov.compute(
            player_x,
            player_y,
            player_radius,
            (x, y) => {
                const tile = this.#map.getTileAt(x, y);
                if (!tile) {
                    return false;
                }
                return this.#map.isRevealedAt(x, y);
            },
            (x, y) => {
                const tile = this.#map.getTileAt(x, y);
                if (!tile) {
                    return;
                }
                this.#map.revealAt(x, y);
            }
        );
    }
}
