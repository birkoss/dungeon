/** 
 * @typedef DungeonTheme
 * @type {Object}
 * @property {string} id
 * @property {string} name
 * @property {AssetMultipleFrames} floor
 * @property {AssetSingleFrame} wall
 * @property {AssetSingleFrame} shadow
 * @property {AssetMultipleFrames} border
 */

/** 
 * @typedef AssetSingleFrame
 * @type {Object}
 * @property {string} assetKey
 * @property {number} assetFrame
 */

/** 
 * @typedef AssetMultipleFrames
 * @type {Object}
 * @property {string} assetKey
 * @property {number[]} assetFrames

 */

/** 
 * @typedef Coordinate
 * @type {Object}
 * @property {number} x
 * @property {number} y
 */
