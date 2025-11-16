import "@lib/types.d";
/**
 * Resolve a local JSON Schema reference.
 * This supports only local refs like '#/definitions/...' within the same schema.
 * @param {JsonSchema7} rootSchema The root schema
 * @param {string} ref The reference string
 * @returns {JsonSchema7|null} The resolved schema property or null if not found
 */
export function resolveLocalRef(rootSchema, ref) {
  if (typeof ref !== "string") return null;
  if (!ref.startsWith("#/")) return null; // only local refs supported here
  const parts = ref.slice(2).split("/");
  let node = rootSchema;
  for (const p of parts) {
    // Traverse down the schema until the referenced node is found
    if (node && Object.prototype.hasOwnProperty.call(node, p)) {
      node = node[p];
    } else {
      node = null;
      break;
    }
  }
  // If the referenced node is not found, return null
  if (node == null) return null;
  // Deep clone to avoid accidental mutation of original schema
  try {
    return JSON.parse(JSON.stringify(node));
  } catch (e) {
    return node;
  }
}
