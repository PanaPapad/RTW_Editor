import UnitSchema from "./UnitSchema.json";
import UnitUiSchema from "./UnitUiSchema.json";

/**
 * @type {Record<string, {sampleFilePath: string, schema: object, uiSchema: object, initialData: object}>}
 */
const registry = {
  units: {
    sampleFilePath: "/Samples/export_descr_unit.txt",
    schema: (() => {
      const s = structuredClone(UnitSchema);
      // remove $schema to avoid ajv remote fetch
      if (s && s.$schema) delete s.$schema;
      return s;
    })(),
    uiSchema: (() => {
      const s = structuredClone(UnitUiSchema);
      // remove $schema to avoid ajv remote fetch
      if (s && s.$schema) delete s.$schema;
      return s;
    })(),
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
