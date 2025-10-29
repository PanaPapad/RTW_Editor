import {
  ItemList,
  LoadModal,
  CustomFieldTemplate,
  TextWidget,
  ObjectFieldTemplate,
  SelectWidget,
  TabbedPane,
} from "../components/index.jsx";
import * as Common from "../lib/index.js";
import { UnitParser } from "../lib/parsers/UnitParser.js";
import * as SchemaRegistry from "../lib/schemas/registry.js";
import "../styles/form-grid.css";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
const TYPE = "units";

export default function UnitFormPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadedUnits, setLoadedUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);

  const formRef = useRef(null);

  const widgets = useMemo(() => ({ TextWidget, SelectWidget }), []);
  const fieldTemplates = useMemo(
    () => ({
      FieldTemplate: CustomFieldTemplate,
      ObjectFieldTemplate: ObjectFieldTemplate,
    }),
    []
  );

  const schema = useMemo(() => {
    return SchemaRegistry.getSchemaFor(TYPE);
  }, []);
  const uiSchema = useMemo(() => {
    return SchemaRegistry.getUiSchemaFor(TYPE);
  }, []);

  const computeUiSchema = useCallback(() => {
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
  }, [uiSchema]);

  const computedUiSchema = useMemo(() => computeUiSchema(), [computeUiSchema]);

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
          <ItemList
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
          <Form
            ref={formRef}
            schema={schema}
            validator={validator}
            uiSchema={computedUiSchema}
            formData={formData}
            widgets={widgets}
            templates={fieldTemplates}
            onChange={onFormChange}
            onSubmit={onFormSubmit}
          />
        </div>
        <div
          id="tabPane"
          style={{
            flex: "0 0 auto",
            background: "#f7f7f7",
            padding: "12px",
            borderRadius: "6px",
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
