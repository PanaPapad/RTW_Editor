/**
 * @typedef {Object} SchemaProperty
 * @property {string} [type]
 * @property {string} [$ref]
 * @property {Object<string, SchemaProperty>} [properties]
 * @property {number} [x-index]
 */
/**
 * @typedef {Object} Schema
 * @property {Object<string, SchemaProperty>} properties
 * @property {Array<string>} required
 * @property {Array<string>} [additionalProperties]
 */
