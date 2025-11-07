import { ItemList, LoadModal, TabbedPane } from "../components/index.jsx";
import * as Consts from "@lib/consts.js";
import * as Common from "../lib/index.js";
import { UnitParser } from "../lib/parsers/UnitParser.js";
import * as SchemaRegistry from "../lib/schemas/registry.js";
import "../styles/form-grid.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import JsonSchemaForm from "../components/JsonSchemaForm.jsx";
const TYPE = "units";
const factionOptions = Consts.FACTIONS.map((faction) => {
  return { id: faction.id, label: faction.name };
});

export default function UnitFormPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadedUnits, setLoadedUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [unitSearchValue, setUnitSearchValue] = useState("");
  const [unitFactionValue, setUnitFactionValue] = useState("");

  const formRef = useRef(null);

  const schema = useMemo(() => {
    return SchemaRegistry.getSchemaFor(TYPE);
  }, []);
  const uiSchema = useMemo(() => {
    return SchemaRegistry.getUiSchemaFor(TYPE);
  }, []);

  const computeUiSchema = () => {
    // For future dynamic uiSchema computation based on formData
    const baseSchema = structuredClone(uiSchema);
    for (const prop in schema.properties) {
      if (!baseSchema.hasOwnProperty(prop)) {
        baseSchema[prop] = {};
      }
      if (
        schema.properties[prop].hasOwnProperty("x-hide") &&
        schema.properties[prop]["x-hide"] === true
      ) {
        baseSchema[prop]["ui:widget"] = "hidden";
      }
    }
    return baseSchema;
  };

  const computedUiSchema = useMemo(() => computeUiSchema(), [formData]);

  useEffect(() => {
    if (!schema) {
      navigate("/");
      return;
    }
    const initialData = SchemaRegistry.getInitialFormDataFor(TYPE);
    setFormData(initialData);
  }, [schema, navigate]);

  const downloadEditedFile = useCallback(() => {
    const text = UnitParser.serialize(loadedUnits);
    Common.downloadFile("edited_units.txt", text);
  }, [loadedUnits]);

  const onFormChange = useCallback(
    (e) => {
      setFormData(e.formData);
      if (selectedUnit) {
        selectedUnit.loadFormData(e.formData, schema);
      }
    },
    [selectedUnit, schema]
  );
  const onFormSubmit = useCallback(({ formData }) => {}, []);
  const filterUnitsBy = useCallback(
    (unit) => {
      if (unitSearchValue && unitSearchValue.trim() !== "") {
        if (!String(unit.id).includes(unitSearchValue)) return false;
      }
      if (unitFactionValue && unitFactionValue !== "") {
        // Check if the selected faction or its culture matches the unit's ownership
        if (
          !unit.attributes.ownership.includes(unitFactionValue) &&
          !unit.attributes.ownership.includes(
            Consts.FACTIONS.find((faction) => faction.id === unitFactionValue)
              ?.culture
          )
        )
          return false;
      }
      return true;
    },
    [unitSearchValue, unitFactionValue]
  );

  // No render if schema is not found
  if (!schema) {
    return null;
  }

  return (
    <div>
      <h2>RTW Unit Editor</h2>
      <div style={{ display: "flex", marginBottom: 10 }}>
        <Button variant="contained" onClick={() => setModalOpen(true)}>
          Load File
        </Button>{" "}
        <Button
          variant="contained"
          onClick={() => {
            // reset to registry initial
            setFormData(SchemaRegistry.getInitialFormDataFor(TYPE));
          }}
        >
          Reset
        </Button>
        <Button variant="contained" onClick={downloadEditedFile}>
          Download
        </Button>
      </div>
      <div
        style={{
          display: "flex",
          gap: 16,
          alignItems: "flex-start",
          justifyContent: "space-evenly",
        }}
      >
        <div
          id="unitList"
          style={{
            flex: "0 0 auto",
            minWidth: "0",
          }}
        >
          <TextField
            id="unitSearchField"
            label="Search"
            variant="outlined"
            fullWidth
            sx={{ mb: 1 }}
            onChange={(event) => {
              setUnitSearchValue(event.target.value);
            }}
          />
          {/* Searchable, scrollable faction selector using MUI Autocomplete */}
          <Autocomplete
            id="factionSelectAutocomplete"
            options={factionOptions}
            getOptionLabel={(opt) => opt.label}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(_, newValue) => setUnitFactionValue(newValue?.id ?? "")}
            renderInput={(params) => (
              <TextField {...params} label="Faction" variant="outlined" />
            )}
            fullWidth
            sx={{ mb: 1 }}
            slotProps={{
              listbox: {
                style: { maxHeight: 240 },
              },
            }}
            clearOnEscape
            freeSolo={false}
          />
          <ItemList
            filter={filterUnitsBy}
            items={loadedUnits}
            onSelect={(unit) => {
              setSelectedUnit(unit);
              setFormData(unit.getFormData(schema));
            }}
          />
        </div>
        <div
          id="formBox"
          style={{
            width: "60%",
            minWidth: 0,
          }}
        >
          <JsonSchemaForm
            ref={formRef}
            schema={schema}
            uiSchema={computedUiSchema}
            formData={formData}
            onChange={onFormChange}
            onSubmit={onFormSubmit}
          />
        </div>
        <div
          id="tabPane"
          style={{
            flex: "0 0 20%",
            width: "20%",
            boxSizing: "border-box",
            background: "#f7f7f7",
            padding: "12px",
            borderRadius: "6px",
            height: "70vh",
            overflow: "hidden",
          }}
        >
          <TabbedPane>
            <TabbedPane.Pane title="Live data">
              <h4>Live formData</h4>
              <pre>{JSON.stringify(formData, null, 2)}</pre>
            </TabbedPane.Pane>
            <TabbedPane.Pane title="uiSchema">
              <h4>Computed uiSchema</h4>
              <pre>{JSON.stringify(computedUiSchema, null, 2)}</pre>
            </TabbedPane.Pane>
            <TabbedPane.Pane title="Lines">
              <h4>Computed Lines</h4>
              <pre>{selectedUnit ? selectedUnit.toString() : ""}</pre>
            </TabbedPane.Pane>
          </TabbedPane>
        </div>
      </div>
      <LoadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onLoad={(units) => {
          setLoadedUnits(units);
          setSelectedUnit(units[0] || null);
        }}
      />
    </div>
  );
}
