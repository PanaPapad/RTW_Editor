/**
 * @typedef {Object} UnitSchemaProperty
 * @property {string} [type]
 * @property {string} [$ref]
 * @property {Object<string, UnitSchemaProperty>} [properties]
 * @property {number} [x-index]
 */
/**
 * @typedef {Object} UnitSchema
 * @property {Object<string, UnitSchemaProperty>} properties
 * @property {Array<string>} required
 * @property {Array<string>} [additionalProperties]
 */
/**
 * @typedef {Object} Faction
 * @property {string} name
 * @property {string} id
 * @property {string} culture
 */
