/** 
 * @typedef DungeonTheme
 * @type {Object}
 * @property {string} id
 * @property {string} name
 * @property {AssetMultipleFrames} floor
 * @property {AssetSingleFrame} exit
 * @property {AssetSingleFrame} hidden
 * @property {AssetSingleFrame} shadow
 * @property {AssetMultipleFrames} walls
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
 * @property {number[]} [alternateAssetFrames]
 */

/** 
 * @typedef Coordinate
 * @type {Object}
 * @property {number} x
 * @property {number} y
 */
