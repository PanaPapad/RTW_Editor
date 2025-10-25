import { useCallback, useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import * as SchemaRegistry from "../lib/schemas/registry.js";

export default function FormPage() {
  const { type } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);

  const schema = useMemo(() => {
    return SchemaRegistry.getSchemaFor(type);
  }, [type]);
  const uiSchema = useMemo(() => {
    return SchemaRegistry.getUiSchemaFor(type);
  }, [type]);

  useEffect(() => {
    if (!schema) {
      navigate("/");
      return;
    }
    const initialData = SchemaRegistry.getInitialFormDataFor(type);
    setFormData(initialData);
  }, [schema, navigate, type]);

  const onChange = useCallback((e) => setFormData(e.formData), []);
  const onSubmit = useCallback(({ formData }) => {}, []);

  if (!schema) {
    return null;
  }

  return (
    <div>
      <h2>RTW Unit Editor — rjsf + Vite prototype</h2>
      <div className="panel" style={{ display: "flex", gap: 16 }}>
        <div className="left" style={{ flex: 1 }}>
          <Form
            schema={schema}
            validator={validator}
            uiSchema={uiSchema}
            formData={formData}
            onChange={onChange}
            onSubmit={onSubmit}
          />
        </div>
        <div className="right" style={{ width: 360 }}>
          <h4>Live formData</h4>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
          <h4>Computed uiSchema</h4>
          <pre>{JSON.stringify(uiSchema, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
