import "../types.d.js";
/**
 * A class representing a Unit with its attributes
 */
export class Unit {
  /**
   * Create a Unit instance
   * @constructor
   * @param {string} name The unit name
   * @param {Array<string>} lines The raw lines of the unit
   */
  constructor(id, name, lines) {
    this.id = id;
    this.name = name;
    /**
     * Original raw lines (copy)
     * @type {Array<string>}
     */
    this._lines = Array.isArray(lines) ? lines.slice() : [];
    /**
     * Unit attributes
     * @type {Object<string, Array<string>>}
     */
    this.attributes = {}; // key -> Array<string>
    /**
     * Rebalanced attributes
     * @type {Object<string, Array<string>>}
     */
    this.attributesRebalanced = {};
    /**
     * Ethnicities
     * @type {Array<Array<string>>}
     */
    this.ethnicities = []; // array of arrays
    this._parseAttributes(this._lines);
  }

  /**
   * Lines of the unit
   * @returns {Array<string>}
   */
  get lines() {
    return this._lines.slice();
  }
  /**
   * Convert unit to string representation
   * @returns {string}
   */
  toString() {
    return this.toLines().join("\n");
  }
  /**
   * Convert unit to array of lines
   * @returns {Array<string>}
   */
  toLines() {
    const out = [];
    // normal attributes
    for (const [key, vals] of Object.entries(this.attributes)) {
      if (key === "ethnicity") {
        // ethnicity handled later
        continue;
      }
      if (!vals || vals.length === 0) {
        out.push(key);
      } else {
        out.push(`${key.padEnd(16, " ")} ${vals.join(", ")}`);
      }
    }
    // ethnicities (preserve multiple lines)
    for (const eth of this.ethnicities) {
      out.push(`ethnicity ${eth.join(", ")}`);
    }
    // rebalance marker + rebalanced attributes
    if (Object.keys(this.attributesRebalanced).length > 0) {
      out.push("rebalance_statblock");
      for (const [key, vals] of Object.entries(this.attributesRebalanced)) {
        if (!vals || vals.length === 0) {
          out.push(key);
        } else {
          out.push(`${key.padEnd(16, " ")} ${vals.join(", ")}`);
        }
      }
    }
    return out;
  }
  /**
   * Reset the unit to its original state
   */
  reset() {
    // reparse from original lines
    this.attributes = {};
    this.attributesRebalanced = {};
    this.ethnicities = [];
    this._parseAttributes(this._lines);
  }
  /**
   * Parse unit attributes from raw lines
   * @param {Array<string>} lines
   */
  _parseAttributes(lines) {
    const target = { current: this.attributes };
    let attributes = this.attributes;
    for (const raw of lines) {
      const line = (raw ?? "").trim();
      // Skip empty lines and comments
      if (!line || line.startsWith(";") || line.startsWith("//")) continue;
      // split key and value
      const parts = [];
      const firstSpaceIdx = line.search(/\s/);
      if (firstSpaceIdx === -1) {
        parts.push(line);
      } else {
        parts.push(line.substring(0, firstSpaceIdx));
        parts.push(line.substring(firstSpaceIdx + 1).trim());
      }
      const key = parts[0];
      // switch to rebalanced section
      if (key === "rebalance_statblock") {
        attributes = this.attributesRebalanced;
        continue;
      }
      // ethnicity special handling (can appear multiple times)
      if (key === "ethnicity") {
        const rest = parts[1] ?? "";
        const values = rest
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        this.ethnicities.push(values);
        continue;
      }
      // Officers special handling (can appear multiple times)
      if (key === "officer") {
        if (!this.attributes.officer) {
          this.attributes.officer = [];
        }
        const rest = parts[1] ?? "";
        this.attributes.officer.push(rest);
        continue;
      }
      // Stat attributes special handling (attributes are space-separated)
      if (key === "stat_pri_attr" || key === "stat_sec_attr") {
        const rest = parts[1] ?? "";
        const values = rest
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        attributes[key] = values;
        continue;
      }
      // boolean flag (no value)
      if (parts.length === 1) {
        attributes[key] = [];
        continue;
      }
      const rest = parts[1] ?? "";
      const values = rest.split(",").map((s) => s.trim());
      attributes[key] = values;
    }
  }
  /**
   * Get unit property value
   * @param {string} name The attribute name
   * @param {number} idx The index of the property (for multi-valued attributes)
   * @returns {string|number|null} The property value or null if not found
   */
  getUnitProperty(name, idx = 0) {
    const prop = this.attributes[name];
    if (!prop)
      throw new Error(`Property "${name}" not found in unit "${this.name}"`);
    if (idx < 0 || idx >= prop.length)
      throw new Error(
        `Index ${idx} out of bounds for property "${name}" in unit "${
          this.name
        }". Length is ${prop.length}. Attributes: ${JSON.stringify(prop)}`
      );
    return prop[idx];
  }
  /**
   * Set unit property value
   * @param {string} name The attribute name
   * @param {string|number} value The value to set
   * @param {number} idx The index of the property (for multi-valued attributes)
   * @returns {boolean} Whether the property was set successfully
   */
  setUnitProperty(name, value, idx = 0) {
    const prop = this.attributes[name];
    if (!prop) return false;
    if (idx < 0 || idx >= prop.length) return false;
    prop[idx] = String(value);
    return true;
  }
  /**
   * Resolve a local JSON Schema reference.
   * This supports only local refs like '#/definitions/...' within the same schema.
   * @param {UnitSchema} rootSchema The root schema
   * @param {string} ref The reference string
   * @returns {UnitSchemaProperty|null} The resolved schema property or null if not found
   */
  static resolveLocalRef(rootSchema, ref) {
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
  /**
   * Get form data for this unit based on provided schema
   * @param {UnitSchema} schema
   * @returns {Object} The form data object
   */
  getFormData(schema) {
    const data = {};
    for (const key of Object.keys(schema.properties)) {
      const attr = this.attributes[key];
      if (!attr) continue;
      // Resolve $ref if present (support local refs like '#/definitions/...')
      let propSchema = schema.properties[key];

      if (propSchema && propSchema.$ref) {
        const resolved = Unit.resolveLocalRef(schema, propSchema.$ref);
        if (resolved) propSchema = resolved;
      }
      // If the property schema is an object with properties (like stat_pri), map each named
      // sub-property using its x-index metadata into the corresponding index in attr (array)
      if (
        propSchema &&
        propSchema.properties &&
        typeof propSchema.properties === "object"
      ) {
        data[key] = {};
        for (const [subName, subSchema] of Object.entries(
          propSchema.properties
        )) {
          const idx =
            subSchema["x-index"] ?? subSchema.index ?? subSchema["x_index"];
          if (typeof idx === "number" && attr[idx]) {
            data[key][subName] = attr[idx];
          } else {
            // no index mapping; try a sensible fallback: use first element
            attr[0] && !idx && (data[key][subName] = attr[0]);
          }
        }
      } else if (
        propSchema &&
        propSchema.type === "array" &&
        propSchema.items
      ) {
        attr && (data[key] = attr);
      } else {
        // primitive or unstructured attribute: expose as single value (first element)
        attr[0] && (data[key] = attr[0]);
      }
    }
    return data;
  }
  /**
   * Set unit properties from form data based on provided schema
   * @param {Object} formData The form data object
   * @param {UnitSchema} schema The JSON Schema of the form
   */
  loadFormData(formData, schema) {
    for (const key of Object.keys(formData)) {
      const formAttr = formData[key];
      const attr = this.attributes[key];
      if (!attr) continue; // skip unknown attributes

      let attrSchema = schema.properties[key];
      // Resolve $ref if present
      if (attrSchema && attrSchema.$ref) {
        const resolved = Unit.resolveLocalRef(schema, attrSchema.$ref);
        if (resolved) attrSchema = resolved;
      }

      // If attribute schema is type object then map sub-properties
      if (
        attrSchema &&
        attrSchema.properties &&
        typeof attrSchema.properties === "object"
      ) {
        for (const [propName, propSchema] of Object.entries(
          attrSchema.properties
        )) {
          // Get the x-index for this sub-property and set the corresponding attr index
          const idx = propSchema["x-index"];
          if (typeof idx === "number" && formAttr && propName in formAttr) {
            attr[idx] = String(formAttr[propName]);
          }
        }
      }
      // If the property schema is an array, treat formAttr as array
      else if (
        attrSchema &&
        attrSchema.type === "array" &&
        Array.isArray(formAttr)
      ) {
        for (let i = 0; i < formAttr.length; i++) {
          attr[i] = String(formAttr[i]);
        }
      }
      // If the property schema is not an object, treat it as a primitive
      else {
        attr[0] = String(formAttr);
      }
    }
  }
}

export class UnitParser {
  /**
   * Parse input text (string) -> Array<Unit>
   * @param {string} text
   * @returns {Array<Unit>}
   */
  static parse(text) {
    /** @type {Array<Unit>} */
    const units = [];
    const lines = text.replace(/\r\n/g, "\n").split("\n");
    /** @type {Array<string>} */
    let currentLines = [];
    let currentName = null;
    let currentId = null;

    for (let raw of lines) {
      const l = raw;
      const trimmed = l.trim();
      // detect unit start
      if (trimmed.startsWith("type ")) {
        // flush previous
        if (currentLines.length && currentName !== null) {
          units.push(new Unit(currentId, currentName, currentLines));
          currentLines = [];
        }
      } else if (trimmed.startsWith("dictionary ")) {
        // extract name after first space
        currentId = trimmed.split(/\s+/, 2)[1].trim() ?? "";
        const name = trimmed.split(";", 2)[1].trim() ?? "";
        currentName = name;
      }
      if (currentName !== null) {
        currentLines.push(l.replace(/\r$/, ""));
      }
    }
    // final flush
    if (currentLines.length && currentName !== null) {
      units.push(new Unit(currentId, currentName, currentLines));
    }
    return units;
  }

  /**
   * Serialize Array<Unit> -> text string
   * @param {Array<Unit>} units
   * @returns {string}
   */
  static serialize(units) {
    // join each unit's toString and separate by two blank lines
    return (
      units.map((u) => u.toString()).join("\n \n \n") +
      (units.length ? "\n" : "")
    );
  }
}
