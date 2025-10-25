import { useCallback, useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import * as SchemaRegistry from "../lib/schemas/registry.js";
import LoadModal from "../components/LoadFileModal.jsx";
import ItemList from "../components/ItemList.jsx";

const TYPE = "units";

export default function UnitFormPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadedUnits, setLoadedUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);

  const schema = useMemo(() => {
    return SchemaRegistry.getSchemaFor(TYPE);
  }, []);
  const uiSchema = useMemo(() => {
    return SchemaRegistry.getUiSchemaFor(TYPE);
  }, []);

  useEffect(() => {
    if (!schema) {
      navigate("/");
      return;
    }
    const initialData = SchemaRegistry.getInitialFormDataFor(TYPE);
    setFormData(initialData);
  }, [schema, navigate]);

  const onChange = useCallback(
    (e) => {
      setFormData(e.formData);
      if (selectedUnit) {
        selectedUnit.loadFormData(e.formData, schema);
      }
    },
    [selectedUnit, schema]
  );
  const onSubmit = useCallback(({ formData }) => {}, []);

  // No render if schema is not found
  if (!schema) {
    return null;
  }

  return (
    <div>
      <h2>RTW Unit Editor</h2>
      <div style={{ marginBottom: 10 }}>
        <button onClick={() => setModalOpen(true)}>Load File</button>{" "}
        <button
          onClick={() => {
            // reset to registry initial
            setFormData(SchemaRegistry.getInitialFormDataFor(TYPE));
          }}
        >
          Reset
        </button>
      </div>
      <div className="panel" style={{ display: "flex", gap: 16 }}>
        <div id="unitList" className="left">
          <ItemList
            items={loadedUnits}
            onSelect={(unit) => {
              setSelectedUnit(unit);
              setFormData(unit.getFormData(schema));
            }}
          />
        </div>
        <div className="centre">
          <Form
            schema={schema}
            validator={validator}
            uiSchema={uiSchema}
            formData={formData}
            onChange={onChange}
            onSubmit={onSubmit}
          />
        </div>
        <div className="right">
          <h4>Live formData</h4>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
          <h4>Computed uiSchema</h4>
          <pre>{JSON.stringify(uiSchema, null, 2)}</pre>
          <h4>Computed Lines</h4>
          <pre>{selectedUnit ? selectedUnit.toString() : ""}</pre>
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
