import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { UnitParser } from "../src/lib/parsers/UnitParser.js";

describe("UnitParser", () => {
  it("should parse sample export_descr_unit.txt", () => {
    const samplePath = path.resolve("Samples/export_descr_unit.txt");
    expect(fs.existsSync(samplePath), "Sample file should exist").toBe(true);

    const text = fs.readFileSync(samplePath, "utf8");
    const units = UnitParser.parse(text);

    expect(units.length).toBeGreaterThan(0);
    const first = units[0];
    expect(first.name).toBeTruthy();
    expect(first.lines.length).toBeGreaterThan(0);
    expect(first.attributes).toBeDefined();
  });

  it("should parse inline sample", () => {
    const sample = `type test_unit
dictionary test_unit
category infantry
class light
stat_pri 1, 0, no, 0, 0, melee, simple, piercing, knife, 25 ,1
`;
    const units = UnitParser.parse(sample);
    expect(units).toHaveLength(1);
    expect(units[0].name).toBe("test_unit");
    expect(units[0].attributes.category).toEqual(["infantry"]);
    expect(units[0].getUnitProperty("stat_pri", 2)).toBe("no");
    expect(units[0].getUnitProperty("stat_pri", 3)).toBe("0");
    expect(units[0].getUnitProperty("stat_pri", 4)).toBe("0");
  });
});
