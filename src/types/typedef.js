/** 
 * @typedef DungeonTheme
 * @type {Object}
 * @property {string} id
 * @property {string} name
 * @property {AssetSingleFrame} floor
 * @property {AssetSingleFrame} unknown
 * @property {AssetSingleFrame} wall
 * @property {AssetSingleFrame} shadow
 * @property {AssetMultipleFrames} border
 */

/** 
 * @typedef Level
 * @type {Object}
 * @property {string} id
 * @property {string[]} data
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
