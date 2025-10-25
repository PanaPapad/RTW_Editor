import UnitSchema from "./UnitSchema.json";

/**
 * @type {Record<string, {schema: object, uiSchema: object, initialData: object}>}
 */
const registry = {
  units: {
    schema: (() => {
      const s = structuredClone(UnitSchema);
      // remove $schema to avoid ajv remote fetch
      if (s && s.$schema) delete s.$schema;
      return s;
    })(),
    uiSchema: {},
    initialData: {},
  },
};
/**
 * Get the JSON schema for a given editor type
 * @param {string} type The editor type
 * @returns {object|null} The JSON schema or null if not found
 */
export function getSchemaFor(type) {
  return registry[type]?.schema ?? null;
}
/**
 * Get the UI schema for a given editor type
 * @param {string} type The editor type
 * @returns {object} The UI schema or empty object if not found
 */
export function getUiSchemaFor(type) {
  return registry[type]?.uiSchema ?? {};
}
/**
 * Get the initial form data for a given editor type
 * @param {string} type The editor type
 * @returns {object} The initial form data or empty object if not found
 */
export function getInitialFormDataFor(type) {
  return registry[type]?.initialData ?? {};
}
/**
 * Get the available editors
 * @returns {string[]} The list of available editor types
 */
export function availableEditors() {
  return Object.keys(registry);
}

export default {
  getSchemaFor,
  getUiSchemaFor,
  getInitialFormDataFor,
  availableEditors,
};
