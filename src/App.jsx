import React, { useCallback, useState } from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import UnitSchema from "./lib/schemas/UnitSchema.json";

const baseSchema = UnitSchema;
delete baseSchema.$schema; // remove $schema so Ajv doesn't try to resolve the remote meta-schema

function computeUiSchema(formData) {
  const ui = {};
  return ui;
}

export default function App() {
  const [formData, setFormData] = useState({
    type: "legionary",
    category: "infantry",
    class: "heavy",
    stat_pri: {
      attack: 7,
      charge: 2,
      missile_type: "no",
      missile_range: 0,
      ammo: 0,
    },
    mount: "",
  });

  const onChange = useCallback((e) => setFormData(e.formData), []);
  const onSubmit = useCallback(({ formData }) => {
    // For prototype show JSON
    alert("Saved JSON:\n\n" + JSON.stringify(formData, null, 2));
  }, []);

  const uiSchema = computeUiSchema(formData);

  return (
    <div>
      <h2>RTW Unit Editor — rjsf + Vite prototype</h2>
      <div className="panel">
        <div className="left">
          <Form
            schema={baseSchema}
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
        </div>
      </div>
    </div>
  );
}
