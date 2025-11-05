/**
 * @typedef {Object} Faction
 * @property {string} name
 * @property {string} id
 * @property {string} culture
 */
/**
 * @typedef {Object} JsonSchema7
 * @property {string} [$id] Identifier for the schema
 * @property {"string" | "number" | "boolean" | "array" | "object"} [type] Data type of the schema
 * @property {Object<string, JsonSchema7>} [properties] Properties of the schema
 * @property {Array<string>} [required] List of required properties
 * @property {Array<string>} [enum] A list of possible values
 * @property {string} [format] Data format (e.g., "date-time", "email")
 * @property {string} [title] Title of the schema
 * @property {string} [description] Description of the schema
 * @property {any} [default] Default value for the schema
 * @property {JsonSchema7} [items] Schema for items in an array
 * @property {boolean | JsonSchema7} [additionalProperties] Whether additional properties are allowed or their schema
 * @property {Array<JsonSchema7>} [allOf] Array of schemas that must all be valid
 * @property {Array<JsonSchema7>} [anyOf] Array of schemas that at least one must be valid
 * @property {Array<JsonSchema7>} [oneOf] Array of schemas where exactly one must be valid
 * @property {JsonSchema7} [not] Schema that must not be valid
 * @property {Object<string, JsonSchema7>} [definitions] Definitions of subschemas that can be referenced using $ref
 * @property {string} [$ref] Reference to another schema
 * @property {string} [$comment] Additional comments about the schema
 * @property {RegExp} [pattern] Regular expression that the string value must match
 * @property {number} [minimum] Minimum value for numeric types
 * @property {number} [maximum] Maximum value for numeric types
 * @property {number} [minLength] Minimum length for string types
 * @property {number} [maxLength] Maximum length for string types
 * @property {number} [minItems] Minimum number of items for array types
 * @property {number} [maxItems] Maximum number of items for array types
 * @property {boolean} [uniqueItems] Whether all items in the array must be unique
 * @property {any} [examples] Examples of valid instances for the schema
 * @property {boolean} [readOnly] Whether the property is read-only
 * @property {any} [const] A constant value that the instance must be equal to
 * @property {JsonSchema7} [contains] Schema that defines the content of an array
 * @property {number} [minProperties] Minimum number of properties for object types
 * @property {number} [maxProperties] Maximum number of properties for object types
 */
