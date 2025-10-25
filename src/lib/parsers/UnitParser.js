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
  constructor(name, lines) {
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

    for (let raw of lines) {
      const l = raw;
      const trimmed = l.trim();
      // detect unit start
      if (trimmed.startsWith("type ")) {
        // flush previous
        if (currentLines.length && currentName !== null) {
          units.push(new Unit(currentName, currentLines));
          currentLines = [];
        }
        // extract name after first space
        const name = trimmed.split(/\s+/, 2)[1] ?? "";
        currentName = name;
      }
      if (currentName !== null) {
        currentLines.push(l.replace(/\r$/, ""));
      }
    }
    // final flush
    if (currentLines.length && currentName !== null) {
      units.push(new Unit(currentName, currentLines));
    }
    return units;
  }

  /**
   * Serialize Array<Unit> -> text string
   * @param {Array<Unit>} units
   * @returns {string}
   */
  static serialize(units) {
    // join each unit's toString and separate by two blank lines (with a single space line like Python version)
    return (
      units.map((u) => u.toString()).join("\n \n \n") +
      (units.length ? "\n" : "")
    );
  }
}
